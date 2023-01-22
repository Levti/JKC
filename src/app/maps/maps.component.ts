import { TutorialsComponent } from './../tutorials/tutorials.component';
import { SearchByLocationComponent } from './../search/search-by-location/search-by-location.component';
import { ClickOutsideModule } from 'ng-click-outside';
declare const govmap: any;
declare var $: any;
declare const proj4: any;

import { SitesService } from '../Services/sites.service';
import { ArchSiteModel, HazalaRecordModel, Sites } from './arch-site-model';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort, MatPaginatorIntl } from '@angular/material';
import { InformationComponent } from './information/information.component';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, Renderer2, Input, Inject, PLATFORM_ID, OnDestroy, Output, ComponentFactoryResolver } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { SearchSService } from '../Services/search-s.service';
import { AllSites, csv, Locations, Site } from './classes';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { distinct, last } from 'rxjs/operators';
import { ListsSearch } from '../search/search.model';
import { InformationHistoryComponent } from './information-history/information-history.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders , HttpErrorResponse } from '@angular/common/http';
import { ChartType, ChartOptions, ChartXAxe, ChartYAxe, Tooltip } from 'chart.js';
import { Chart } from 'angular-highcharts';
import { ScrollToBottomDirective } from './scroolToBottom.directive';
import { SiteConstructionComponent } from '../site-construction/site-construction.component';
import { ComputeService } from './compute.service';
import { RegionsComponent } from './regions/regions.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console, debug } from 'console';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { ViewshedComponent} from './viewshed/viewshed.component';


import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Dexie, { liveQuery, Table } from 'dexie';
import { Key } from 'protractor';
import { CombineLatestOperator } from 'rxjs/internal/observable/combineLatest';


//Translate range label
const dutchRangeLabelEn = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 of ${length}`; }
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} of ${length}`;
};
const dutchRangeLabelHe = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 מתוך ${length}`; }
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} מתוך ${length}`;
};

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'מתוך';

  return customPaginatorIntl;
}
class xy {
  x: number;
  y: number;
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent implements OnInit, AfterViewInit, OnDestroy {
  //subscription: Subscription;
  public DBexist: boolean;
  isSearch: boolean;
  public pageSize: number = 3;
  AllSites$: Site[] = [];
  SiteDefaultDesign: Site[] = [];
  SiteDefaultHeb: Site[] = [];
  SiteDefaultDesignHeb: Site[] = [];
  SiteDefaultEng: Site[] = [];
  SiteDefaultDesignEng: Site[] = [];
  public HazalaSites$: HazalaRecordModel[];
  @ViewChild(MatPaginator, { static: false }) public paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // @ViewChild('mapDiv', { static: false }) divView: ElementRef;
  @ViewChild('canvas', { static: false }) divCanvas: ElementRef;
  pointArr: Array<ArchSiteModel>;
  pointArrH: Array<HazalaRecordModel>;
  pointSitesIds: Array<number> = [];
  SitesIds: Array<number> = [];
  polygonArr: Array<ArchSiteModel>;
  polygonArrH: Array<HazalaRecordModel>;
  polygonSitesIds: Array<number>;
  archobs: Observable<Site[]>;
  dataSource: MatTableDataSource<Site>;
  dataHistory: MatTableDataSource<Locations>;
  arch: Site;
  browserLang: any;
  he: boolean;
  en: boolean;
  filter: ListsSearch[];
  filterNull: boolean = true;
  sites: Site[] = [];
  public subscription: Subscription;
  numScreen: number = 2;
  public siteHistoryHeb: Locations[] = [];
  public siteHistoryEng: Locations[] = [];
  listOfSites: boolean = false;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  sumOfSitesZoom: number = 0;
  @ViewChild(MatPaginator, { read: ElementRef, static: false }) paginators: ElementRef;
  data: AllSites;
  isViewshed: boolean = false;
  isLoadingViewShed: boolean;
  isLoadingWalkindPath: boolean;
  distanceAndWalking: boolean = false;
  urlMap = 'https://www.google.co.il/maps/@';
  center = '31.233476,35.776694,13z';
  zoom = ',14z';
  fileContent: any;
  isChart: boolean;
  selection: any;
  chartLabels: any[] = [];
  num: any = 56;
  size = 6;
  durationWay: any;
  Obj: any;
  w: any;
  wkt: any;
  wktAPI: any;
  calcWalkingPath: boolean = false;
  newWay: boolean;
  chart: Chart;
  xyScreenICS: any;
  xyScreenITM: any;
  isAzimuth: boolean = false;
  scaleWidth: number;
  scaleMeter: any;
  meterS: boolean;
  kiloMeterS: boolean;
  ten: number = 0;
  isMeasure: boolean = false;
  centerX: number;
  centerY: number;
  centerZoom: number;
  Regions: boolean = true;
  changeSiteLocation: boolean = false;
  theSite: string;
  theLocation: string;
  logSites: string;
  finalLog: string;
  moveSite: number = 0;
  moveBack: number = 0;
  disableUndo: boolean = true;
  relocations: number = 1;
  logX: string;
  logY: string;
  isSearchSubscription: Subscription;
  isCalcSubscription: Subscription;
  private db: any;
  //isCalculated: boolean;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json; charset=utf-8'
    })
  };


  @ViewChild(ScrollToBottomDirective, { static: false }) scroll: ScrollToBottomDirective;
  isLoadingData: boolean;
  heightAzimut: number = 400;
  constructor(private viewshed: ViewshedComponent, private renderer: Renderer2, private ngZone: NgZone,
    public searchService: SearchSService, private translate: TranslateService, public computes: ComputeService,
    private siteservice: SitesService, public dialog: MatDialog, public reg: RegionsComponent, private _snackBar: MatSnackBar, private http: HttpClient, private readonly SearchByLocationComponent: SearchByLocationComponent) {


      
    this.browserLang = this.translate.getDefaultLang();
    if (this.browserLang === 'he') {
      this.he = true;
    }
    else {
      this.he = false;
    }

    /*this.db = new Dexie('MyDatabase');
    this.db.version(1).stores({
      friends: 'name, age'
    });*/

    /*Dexie.exists('Sites').then(function(exists) {
      if (exists) {
          this.DBexist = true;
          console.log('myDatabase exists!');
          /*Dexie.delete('Sites').then(function() {
            console.log('myDatabase has been deleted.');
        });*/
      /*} else {
        this.DBexist = false;
          console.log('myDatabase does not exist.');
      }
  });*/

    

  }


  ngOnInit() {
  
    /*this.sharedDataService.isCalculated.subscribe(value => {
      console.log(value);
  });*/


    this.isSearchSubscription = this.searchService.isSearch$.subscribe(isSearch => {
      this.isSearch = isSearch;

    });

    this.numScreen = Math.floor(window.innerHeight / 230);

    //Get a current language:
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.browserLang = event.lang;
      console.log(this.browserLang);
      if (this.browserLang === 'he') {
        this.he = true;
        this.en = false;
        this.paginator._intl.getRangeLabel = dutchRangeLabelHe;
      }
      else {
        this.he = false;
        this.en = true;
        this.paginator._intl.getRangeLabel = dutchRangeLabelEn;
      }
    });
    this.dialog.open(SiteConstructionComponent, {});
    this.filter = this.searchService.getSearch();
    if (this.filter == null || this.filter.length == 0) { this.filterNull = true; } else this.filterNull = false;
    //create a map:
    govmap.createMap('mapDiv',
      {

        onLoad: (e) => {

          if(sessionStorage.length > 0){
            govmap.zoomToXY({ x: parseInt(sessionStorage.getItem('locationX')), y: parseInt(sessionStorage.getItem('locationY')), level: parseInt(sessionStorage.getItem('Zoom'))});
          }
          else{
            govmap.zoomToXY({ x: 222200, y: 631550});
          }

          $(this).delay(5000).queue(function () {
            //console.log(this.sumOfSitesZoom);
            $(this).dequeue();
          });

        },
        onClick: (e) => {
          this.action();
        },
        background: '0',
        lang: 'en',
        layersMode: 1,
        token: '86f829e9-cddb-4656-93f1-4116bef9f269',//'5a4b8472-b95b-4687-8179-0ccb621c7990',//5a4b8472-b95b-4687-8179-0ccb621c7990
        // layers: ['atikot_sites_itm', 'Gush'],
        level: 6,
        visibleLayers: [],
        identifyOnClick: true,
        bgButton: true,
        zoomButtons: true,
        isEmbeddedToggle: false,
        showXY: true, //true
        //center: { x: 222200, y: 631550 }
      });



    // govmap.setMapCursor(govmap.cursorType.DEFAULT)
    this.urlMap += this.center + this.zoom;
    //Get an updated list of sites according to the search:
    this.ngZone.run(() => {
      this.subscription = this.searchService.resultList.subscribe(data => { console.log('subscription'); this.data = data; this.siteList(data); });
    })
    //Gets a change language:
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      if (event.lang == 'he') {
        this.he = true;
        this.en = false;
      }
      else if (event.lang == 'en') {
        this.en = true;
        this.he = false;
      }
      console.log('hi');
      console.log(this.data);
      this.siteList(this.data);
    });

    this.siteservice.getAllHazalaRecords().subscribe(data => {
      this.HazalaSites$ = data;
      this.pointArrH = this.HazalaSites$.filter(x => x.itmLocX2 === null && x.itmLocY2 === null);
      const symbolArr = new Array(this.pointArrH.length);//pointArr.length);
      symbolArr.fill({
        outlineColor: [157, 134, 176, 1],
        outlineWidth: 1,
        fillColor: [157, 134, 176, 1]
      });
      this.polygonArrH = this.HazalaSites$.filter(x => x.itmLocX2 !== null && x.itmLocY2 !== null);
    });
    ///several sites are marked on the map show:
    ///calculation scale:
    govmap.onEvent(govmap.events.EXTENT_CHANGE).progress((e) => {
      

      if(this.xmax < 125000 || this.xmin > 285000 || this.ymax < 375000 || this.ymin > 805000){
        //console.log("ZOOM BACK!" + " xmax: " + this.xmax + " xmin: " + this.xmin + " ymax: " + this.ymax + " ymin: " + this.ymin + " " );
        govmap.zoomToXY({ x: 222200, y: 631550});
      }

      //console.log(window.screen.width);
      var widthMapUp = parseInt(((e.extent.xmax - e.extent.xmin)).toFixed(0));
      //console.log("mater: " + widthMapUp);
      //console.log("kilometer: " + widthMapUp / 1000);
      //console.log(this.centerX + " " + this.centerY);

      //sessionStorage.setItem('locationX', JSON.stringify(this.centerX));
      //sessionStorage.setItem('locationY', JSON.stringify(this.centerY));
      this.mapLocation(this.centerX, this.centerY);
      //console.log(parseInt(sessionStorage.getItem('Zoom')));
      //console.log(widthMapUp + " x min: " + e.extent.xmin.toFixed(2) + " y min: " + e.extent.ymin.toFixed(2));

      this.centerX = (e.extent.xmin + e.extent.xmax) / 2;
      this.centerY = (e.extent.ymin + e.extent.ymax) / 2;
      //this.urlMap = "https://www.google.co.il/maps/@" + this.computes.computeITMToLatLng(this.centerX,this.centerY)[0] + "," + this.computes.computeITMToLatLng(this.centerX,this.centerY)[1] + ",13z";
      this.urlMap = 'https://www.google.co.il/maps/@' + this.computes.computeITMToLatLng(this.centerX, this.centerY)[0] + ',' + this.computes.computeITMToLatLng(this.centerX, this.centerY)[1] + ',' + this.centerZoom + 'z';

      if (widthMapUp <= 1000) {
        //this.levelZoom = 10;
      }

      if (widthMapUp <= 2000) {
        this.meterS = true;
        this.kiloMeterS = false;
        var a = widthMapUp / 10;
        this.ten = window.innerWidth / a;
        this.scaleMeter = 10;
        this.centerZoom = 17;
        //sessionStorage.setItem('Zoom', JSON.stringify(9));
        this.mapZoom(9);
      }

      if (widthMapUp > 2000 && widthMapUp <= 10000) {
        this.meterS = true;
        this.kiloMeterS = false;
        var a = widthMapUp / 100;
        this.ten = window.innerWidth / a;
        this.scaleMeter = 100;
        this.centerZoom = 16;
        //sessionStorage.setItem('Zoom', JSON.stringify(8));
        this.mapZoom(8);
      }

      if (widthMapUp > 10000 && widthMapUp <= 20000) {
        this.centerZoom = 15;
        //sessionStorage.setItem('Zoom', JSON.stringify(7));
        this.mapZoom(7);
      }

      if (widthMapUp > 20000 && widthMapUp <= 50000) {
        this.centerZoom = 12;
        //sessionStorage.setItem('Zoom', JSON.stringify(5));
        this.mapZoom(5);
      }

      if (widthMapUp > 10000 && widthMapUp <= 100000) {
        this.meterS = false;
        this.kiloMeterS = true;
        var a = widthMapUp / 1000;
        this.ten = window.innerWidth / a;
        this.scaleMeter = 1
        //sessionStorage.setItem('Zoom', JSON.stringify(4));
        this.mapZoom(4);
      }

      if (widthMapUp > 100000) {
        this.meterS = false;
        this.kiloMeterS = true;
        var a = widthMapUp / 10000;
        this.ten = window.innerWidth / a;
        this.scaleMeter = 10;
        this.centerZoom = 11;
        //sessionStorage.setItem('Zoom', JSON.stringify(3));
        this.mapZoom(3);
      }

      this.xmin = e.extent.xmin;
      this.xmax = e.extent.xmax;
      this.ymin = e.extent.ymin;
      this.ymax = e.extent.ymax;
      this.ngZone.run(() => {
        this.sumOfSitesZoom = 0;

        for (let index = 0; index < this.SiteDefaultDesign.length; index++) {
          const element = this.SiteDefaultDesign[index];
          if (element.pointX >= this.xmin && element.pointX <= this.xmax && element.pointY >= this.ymin && element.pointY <= this.ymax) {
            this.sumOfSitesZoom++;
          }

        }
      });
      return this.sumOfSitesZoom;
    });
    //BackG map:
    this.showBGMap();
    proj4.defs('ITM', '+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +towgs84=-48,55,52,0,0,0,0 +units=m +no_defs');
    govmap.onEvent(govmap.events.MOUSE_MOVE).progress((res) => {
      this.ngZone.run(() => {
        let x = this.computes.computeITMToLatLng(res.mapPoint.x, res.mapPoint.y)[0];
        let y = this.computes.computeITMToLatLng(res.mapPoint.x, res.mapPoint.y)[1];
        this.computes.computeLatLngToITM(x, y);
        x = this.computes.old_grid_east;
        y = this.computes.old_grid_north;
        this.xyScreenICS = 'X: ' + x + ' Y: ' + y;
        this.xyScreenITM = 'X: ' + res.mapPoint.x.toFixed(0) + ' Y: ' + res.mapPoint.y.toFixed(0);
      })

    })

  }
  ngAfterViewInit() {
    //Change pagination rangeLabel:
    if (this.browserLang === 'he') {
      this.he = true;
      this.paginator._intl.getRangeLabel = dutchRangeLabelHe;
    }
    else {
      this.he = false;
      this.paginator._intl.getRangeLabel = dutchRangeLabelEn;
    }
    //Arranging the location of elements in the browsing:
    this.renderer.insertBefore(
      this.paginators.nativeElement.querySelector('.mat-paginator-navigation-next').parentNode,
      this.paginators.nativeElement.querySelector('.mat-paginator-range-label'),
      this.paginators.nativeElement.querySelector('.mat-paginator-navigation-next'));
  }
  //Open/close window yo send height and radius to calculation viewshed:
  sendToViewshed() {
    // this.computes.locationToViewshed = !this.computes.locationToViewshed;
    this.computes.locationToAz = false; this.computes.locationToDisWalk = false;
    this.computes.clearGeom();
    this.distanceAndWalking = false;
    this.isViewshed = !this.isViewshed;
    this.isAzimuth = false;
    this.isMeasure = false;
    if (this.isViewshed) this.computes.locationToViewshed = true;
    else this.computes.locationToViewshed = false;
    // if (!this.isViewshed) {
    govmap.unbindEvent(govmap.events.CLICK);
    govmap.setMapCursor(govmap.cursorType.DEFAULT);
    // }
  }
  arrayPolyline: any[] = [];

  //Open/close window to calculation distance and walking time:
  calcDistanceAndTime() {
    this.computes.locationToDisWalk = !this.computes.locationToDisWalk;
    this.newWay = false;
    this.isLoadingWalkindPath = false;
    this.calcWalkingPath = false;
    govmap.clearMapMarker();
    this.computes.clearGeom();
    govmap.unbindEvent(govmap.events.CLICK);
    govmap.setMapCursor(govmap.cursorType.DEFAULT);
    this.isViewshed = false;
    this.isAzimuth = false;
    this.distanceAndWalking = !this.distanceAndWalking;
  }

  //Open/close window to Calculate azimuth between two coordinates:
  openAzimuth() {
    this.isAzimuth = !this.isAzimuth;
    if (this.isAzimuth) { this.computes.locationToAz = true }
    else { this.computes.locationToAz = false; }
    this.isViewshed = false;
    this.distanceAndWalking = false;
    govmap.unbindEvent(govmap.events.CLICK);
    govmap.setMapCursor(govmap.cursorType.DEFAULT);
    this.computes.clearGeom();
  }
  //Get site list:
  siteList(data: any) {
    console.log('siteList');
    //reset siteList:
    this.SiteDefaultDesignEng = [];
    this.SiteDefaultDesignHeb = [];
    this.SiteDefaultDesign = [];
    if (data != null) {
      this.SiteDefaultDesign = [];
      this.AllSites$ = [];



      from<any>(data.sitesArchiology).pipe(distinct((p: Site) => p['resourceID']),).subscribe(x => {
        if (x.pointX != 0 || x.pointY != 0) {
          this.SiteDefaultDesign.push(x);

        }
      });

      $('.loader').delay(10000).fadeOut('slow');
      $('.loader-delay').delay(25000).fadeOut('slow');


      /*setTimeout(() => {
        $('.loader-delay').fadeOut('slow');
      }, 20000);*/ // try


      ///receives sites in hebrew:
      this.SiteDefaultHeb = data.sitesArchiology.filter(x => x.languageID === 1);
      ///distinct by resourceID:
      from<any>(this.SiteDefaultDesign).pipe(distinct((p: Site) => p['resourceID']),).subscribe(x => {
        if (x.pointX != 0 || x.pointY != 0) {
          this.SiteDefaultDesignHeb.push(x);
          //console.log('------------------this is HE' + ' ' + x.languageID + ' ');
        }

      });
      //receives sites in english:
      this.SiteDefaultEng = data.sitesArchiology.filter(x => x.languageID === 2);
      ///distinct by resourceID:
      from<any>(this.SiteDefaultDesign).pipe(distinct((p: Site) => p['resourceID']),).subscribe(x => {
        if (x.pointX != 0 || x.pointY != 0) {
          this.SiteDefaultDesignEng.push(x);
        }
      });
      


      console.log("EN:" + JSON.stringify(this.SiteDefaultEng));
      console.log("HE:" + JSON.stringify(this.SiteDefaultHeb));
      //console.log("EN SiteDefaultDesignEng:" + JSON.stringify(this.SiteDefaultDesignEng));
      //console.log("HE SiteDefaultDesignHE:" + JSON.stringify(this.SiteDefaultDesignHeb));
      /// INDEXEDDB
      /*var db = new Dexie("Sites");
      db.version(1).stores({Sites: '++id'});
      db.table("Sites").put({AllSitesEN: this.SiteDefaultEng, AllSitesHE: this.SiteDefaultHeb});


      //var theList = db.table("Sites").get({id: 1});
      //console.log(theList);


      let site;
      db.table("Sites").get(1).then(function(siteData) {
        site = siteData;
        //console.log("999909099 " + JSON.stringify(site)); // This will log the site data object to the console
      });*/





      ///inserting sites in hebrew if there is no English (by resourceID):
      for (let index = 0; index < this.SiteDefaultDesign.length; index++) {
        let exists = false;
        const element = this.SiteDefaultDesign[index];
        for (let ind = 0; ind < this.SiteDefaultDesignEng.length; ind++) {
          const e = this.SiteDefaultDesignEng[ind];
          if (element.resourceID != e.resourceID) exists == false;
          else { exists = true; break; }
        }
        if (!exists) {
          this.SiteDefaultDesignEng.push(element);
        }
      }
      ///sort by resourceID
      this.SiteDefaultDesignEng = this.SiteDefaultDesignEng.sort((a, b) => { return <any>new Number(a.resourceID) - <any>Number(b.resourceID); });
      if (this.he) this.dataSource = new MatTableDataSource<Site>(this.SiteDefaultDesignHeb);
      else if (this.en) this.dataSource = new MatTableDataSource<Site>(this.SiteDefaultDesignEng);
      this.archobs = this.dataSource.connect();
      this.dataSource.paginator = this.paginator;

      for (let index = 0; index < data.sitesHistory.length; index++) {
        if (data.sitesHistory[index].languageCode == 2) {
          this.siteHistoryEng.push(data.sitesHistory[index]);
        }
        else if (data.sitesHistory[index].languageCode == 1) {
          this.siteHistoryHeb.push(data.sitesHistory[index]);
        }
      }
      //pointArr.length;
      const symbolArr = new Array(this.SiteDefaultDesign.length);
      //checkes for sites:
      if (this.SiteDefaultDesign.length == 0) {
        //alert('לא נמצאו אתרים התואמים לחיפוש');
        this._snackBar.open(" הכנס נתונים תקינים","OK", {duration:5000, verticalPosition:'top' , panelClass:'snackLength'});
        this.displayLayer(this.getDataObj(
          null,
          null,
          null,
          govmap.drawType.Point,
          {
            outlineColor: [40, 41, 82, 1],
            outlineWidth: 1,
            fillColor: [40, 41, 82, 1]
          },
          null
        ));
      }
      else {
        for (let index = 0; index < this.SiteDefaultDesign.length; index++) {
          if (this.SiteDefaultDesign[index].color.trim() == 'Red') {
            symbolArr[index] = ({
              outlineColor: [255, 0, 0],
              outlineWidth: 0.1,
              fillColor: [255, 0, 0]
            });
          }
          else if (this.SiteDefaultDesign[index].color.trim() == 'Yellow') {
            symbolArr[index] = ({
              outlineColor: [255, 255, 1],
              outlineWidth: 0.1,
              fillColor: [255, 255, 0]
            });
          }
          else if (this.SiteDefaultDesign[index].color.trim() == 'Orange') {
            symbolArr[index] = ({
              outlineColor: [255, 165, 1],
              outlineWidth: 0.1,
              fillColor: [255, 165, 0]
            });
          }
          else {
            symbolArr[index] = ({
              outlineColor: [40, 41, 82, 1],
              outlineWidth: 0.1, //3
              fillColor: [40, 41, 82, 1],
              /*url: 'http://maps.google.com/mapfiles/ms/micons/horsebackriding.png',
              width: 15,
              height: 15*/
              //bubbleHTML: "<div style='border: 1px solid red; margin: 10px;padding: 10px;'><div style='background-color: yellow;'>{0}</div><div               style='background-color: blue;'>{1}</div></div>"

              /*
                          symbolArr[index] = ({
              outlineColor: [40, 41, 82, 1],
              outlineWidth: 0.1, //3
              fillColor: [40, 41, 82, 1]
              /*url: 'http://maps.google.com/mapfiles/ms/micons/horsebackriding.png',
              width: 15,
              height: 15*/



            });
          }
        }
        //try:
        if (this.he) {
          this.displayLayer(this.getDataObj(
            this.SiteDefaultDesignHeb,
            this.SiteDefaultDesignHeb.map(x => x.markerLoc),
            // this.SiteDefaultDesignHeb.map(x => x.name),
            this.SiteDefaultDesignHeb.map(x => x.resourceID + ', ' + x.name),
            govmap.drawType.Point,
            {
              outlineColor: [40, 41, 82, 1],
              outlineWidth: 0.1,
              fillColor: [40, 41, 82, 1]
            },
            symbolArr
          ));
        }
        else if (!this.he) {
          this.displayLayer(this.getDataObj(
            this.SiteDefaultDesignEng,
            this.SiteDefaultDesignEng.map(x => x.markerLoc),
            // this.SiteDefaultDesignEng.map(x => x.name),
            this.SiteDefaultDesignEng.map(x => x.resourceID + ', ' + x.name),
            govmap.drawType.Point,
            {
              outlineColor: [40, 41, 82, 1],
              outlineWidth: 0.1,
              fillColor: [40, 41, 82, 1]
            },
            symbolArr
          ));
        }


        if (this.he) {
          const symbolArrHistory = new Array(this.siteHistoryHeb.length);
          symbolArrHistory.fill({
            //http://jkc.biu.ac.il/
            //http://localhost:4500/
            url: 'https://jkc.biu.ac.il/assets/picture/Rectangle 100.png',
            width: 5,
            height: 5,
          });
          this.displayLayerHistory(this.getDataObjHistory(
            this.siteHistoryHeb,
            this.siteHistoryHeb.map(x => x.markerLoc),
            this.siteHistoryHeb.map(x => x.resourceID + ', ' + x.description),
            govmap.drawType.Point,
            {
              //http://jkc.biu.ac.il/
              url: 'https://jkc.biu.ac.il/assets/picture/Rectangle 100.png',
              width: 5,
              height: 5,
            },
            symbolArrHistory
          ));
        }
        else if (this.en) {
          const symbolArrHistory = new Array(this.siteHistoryEng.length);
          symbolArrHistory.fill({
            //http://jkc.biu.ac.il/
            url: 'https://jkc.biu.ac.il/assets/picture/Rectangle 100.png',
            width: 5,
            height: 5,
          });
          this.displayLayerHistory(this.getDataObjHistory(
            this.siteHistoryEng,
            this.siteHistoryEng.map(x => x.markerLoc),
            this.siteHistoryEng.map(x => x.resourceID + ', ' + x.description),
            govmap.drawType.Point,
            {
              //http://jkc.biu.ac.il/
              url: 'https://jkc.biu.ac.il/assets/picture/Rectangle 100.png',
              width: 5,
              height: 5,
            },
            symbolArrHistory
          ));
        }

      }

    }
    else {

      this.archobs = null;
      this.AllSites$.length = 0;
      this.SiteDefaultDesign.length = 0;
      this.sumOfSitesZoom = 0;
      if (this.he) this.dataSource = new MatTableDataSource<Site>(this.SiteDefaultDesignHeb);
      else if (this.en) this.dataSource = new MatTableDataSource<Site>(this.SiteDefaultDesignEng);
      this.archobs = this.dataSource.connect();
      setTimeout(() => this.dataSource.paginator = this.paginator);

      this.displayLayer(this.getDataObj(
        null,
        null,
        null,
        govmap.drawType.Point,
        {
          outlineColor: [40, 41, 82, 1],
          outlineWidth: 0.2,
          fillColor: [40, 41, 82, 1]
        },
        null
      ));
    }
  }
  //Expand or collaps the map:
  expandMap() {
    this.listOfSites = !this.listOfSites;
    govmap.selectFeaturesOnMap();
  }
  //When click on the list of Sites, hide the search window:
  action() {
    this.searchService.hide();
  }
  //?
  showWichSites() {
    var params = {
      LayerName: 'atikot_sites_itm',
      Point: { x: 178622, y: 663148 },
      Radius: 30
    };
    govmap.getLayerData(params).then(function (response) {
      console.log(response);
    });
  }
  //?
  openPolygon(e) {
    for (let i = 0; i < this.polygonArrH.length; i++) {
      if (e.data.mapPoint.x <= this.polygonArrH[i].itmLocX2 && e.data.mapPoint.x >= this.polygonArrH[i].itmLocX1) {
        if (e.data.mapPoint.y <= this.polygonArrH[i].itmLocY2 && e.data.mapPoint.y >= this.polygonArrH[i].itmLocY1) {
          let x = this.polygonArrH[i];
          let p = `POLYGON(${x.itmLocX1} ${x.itmLocY1},${x.itmLocX2} ${x.itmLocY1},${x.itmLocX2} ${x.itmLocY2},${x.itmLocX1} ${x.itmLocY2},${x.itmLocX1} ${x.itmLocY1})`;
          this.displayLayer(this.showPolygon(
            //POLYGON((219451 632324,219970 632324,219970 632757,219451 632757,219451 632324))
            // tslint:disable-next-line: max-line-length
            this.polygonArrH.map(x => `POLYGON(${x.itmLocX1} ${x.itmLocY1},${x.itmLocX2} ${x.itmLocY1},${x.itmLocX2} ${x.itmLocY2},${x.itmLocX1} ${x.itmLocY2},${x.itmLocX1} ${x.itmLocY1})`),
            this.polygonArrH.map(x => x.siteName),
            // p,x.siteName,
            //  null,null,
            govmap.drawType.Polygon,
            {
              outlineColor: [0, 80, 255, 1],
              outlineWidth: 1,
              fillColor: [157, 134, 176, 0.5]
            },
            null));

          //  this.showPolygon(p,x.siteName,govmap.drawType.Polygon, {outlineColor:[0,80,255,1], outlineWidth: 1, fillColor:[157,134,176,0.5]}, null)
        }
      }

    }
  }
  //?
  showPolygon(wkts, name, geoType, defaultSmb, symbolArr) {
    const data = {
      wkts: wkts,
      names: name,
      geometryType: geoType,
      defaultSymbol: defaultSmb,
      data: {
        tooltips: name,
        headers: name,
        bubbletType: 0,
        bubbleHTML: '<div style="border: 1px solid #525252; margin: 10px;padding: 10px;"><div>{0}</div></div>',
        bubbleHTMLParameters: ['pp']
      }
    };
    return data;
  }

  //Open an information window on a specific site:
  openInformation(e: any, x: any, y: any) {
    if(this.changeSiteLocation){
      if(e == null || e == undefined){
        this.theSite = sessionStorage.getItem('e.resourceID') + ", " + sessionStorage.getItem('e.name');
        this.theLocation = sessionStorage.getItem('e.pointX') + " " + sessionStorage.getItem('e.pointY');
        var data = {
          'wkts': ['POINT(' + parseInt(sessionStorage.getItem('LocX')) + " " + parseInt(sessionStorage.getItem('LocY')) + ')'],
          'geomData': { a: false },
          'showBubble': false,
          'names': ['selected'],
          'geometryType': govmap.drawType.Point,
          'defaultSymbol':
          {
            outlineColor: [11, 181, 0, 1],
            outlineWidth: 1,
            fillColor: [11, 181, 0, 1]
          },
          'symbols': [],
          'clearExisting': false,
          'data': {
            'headers': [''],
            'bubbles': [''],
          }
        }

        var res_list = [];
        govmap.displayGeometries(data).progress((res) => {
          console.log(res);
          res_list.push(res);
          this.searchService.hide();
          setTimeout(() => {
            if (res_list[0]) {
              this.ngZone.run(() => {
                this.openInformation(res.data.geomData, res.data.x, res.data.y);
              });
              res_list = [];
            }
          }, 10);
        })

          govmap.onEvent(govmap.events.CLICK).progress((n) =>{ 
            govmap.unbindEvent(govmap.events.CLICK);
            sessionStorage.setItem('LocX', n.mapPoint.x.toFixed(0));
            sessionStorage.setItem('LocY', n.mapPoint.y.toFixed(0));
            this.moveSite++;
            var data = {
              'wkts': ['POINT(' + n.mapPoint.x.toFixed(0) + " " + n.mapPoint.y.toFixed(0) + ')'],
              'geomData': { a: false },
              'showBubble': false,
              'names': ["e.moved" + this.moveSite],
              'geometryType': govmap.drawType.Point,
              'defaultSymbol':
              {
                outlineColor: [40, 41, 82, 1],
                outlineWidth: 1,
                fillColor: [40, 41, 82, 1]
              },
              'symbols': [],
              'clearExisting': false,
              'data': {
                'headers': [sessionStorage.getItem('e.resourceID') + ", " + sessionStorage.getItem('e.name')],
                'bubbles': [sessionStorage.getItem('e.resourceID') + ", " + sessionStorage.getItem('e.name')],
                'tooltips': [this.theSite]
              }
            }
        
            var res_list = [];
            govmap.displayGeometries(data).progress((res) => {
              console.log(res);
              res_list.push(res);
              this.searchService.hide();
              setTimeout(() => {
                if (res_list[0]) {
                  this.ngZone.run(() => {
                    this.openInformation(res.data.geomData, res.data.x, res.data.y);
                  });
                  res_list = [];
                }
              }, 10);
            })

          this.disableUndo = false;
          govmap.clearGeometriesByName(["selected" + this.moveBack]);
          this.moveSite--; this.moveBack++; this.relocations++;
          govmap.clearGeometriesByName(['selected']);
          govmap.clearGeometriesByName(["e.moved" + this.moveSite]);
          govmap.clearGeometriesByName(["selected" + this.moveBack]); 
          govmap.clearGeometriesByName(["moved" + this.moveSite]);
          this.moveSite++;
          //localStorage.setItem('logSites', Date().toString().split(' ')[1] + " " + Date().toString().split(' ')[2] + " " + Date().toString().split(' ')[4] + ": The site " + "\"" + this.theSite + "\"" + " was moved from (" + this.theLocation + ") to " + "(" + n.mapPoint.x.toFixed(0).toString() + " " + n.mapPoint.y.toFixed(0).toString() + ")\n" + localStorage.getItem('logSites'));
          //this.finalLog = Date().toString().split(' ')[1] + " " + Date().toString().split(' ')[2] + " " + Date().toString().split(' ')[4] + ": The site " + "\"" + this.theSite + "\"" + " was moved from (" + this.theLocation + ") to " + "(" + n.mapPoint.x.toFixed(0).toString() + " " + n.mapPoint.y.toFixed(0).toString() + ")";
          //this.finalLog = "The site " + "\"" + this.theSite + "\"" + " was moved from (" + this.theLocation + ") to " + "(" + n.mapPoint.x.toFixed(0).toString() + " " + n.mapPoint.y.toFixed(0).toString() + ")";
          this.logX = n.mapPoint.x.toFixed(0).toString();
          this.logY = n.mapPoint.y.toFixed(0).toString();
          //console.log("The site " + "\"" + this.theSite + "\"" + " was moved from " + this.theLocation + " to " + n.mapPoint.x.toFixed(0) + " " + n.mapPoint.y.toFixed(0));
          this.updateLocation(sessionStorage.getItem('e.resourceID'), n.mapPoint.x.toFixed(0), n.mapPoint.y.toFixed(0));
          this.createLog();
      });
      }

      else{
        sessionStorage.setItem('e.resourceID', e.resourceID);
        sessionStorage.setItem('e.name', e.name);
        sessionStorage.setItem('e.pointX', e.pointX);
        sessionStorage.setItem('e.pointY', e.pointY);
        this.theSite = e.resourceID + ", " + e.name;
        this.theLocation = e.pointX + " " + e.pointY;
        this.relocations = 1;
        //this.moveBack++;
        var data = {
          'wkts': ['POINT(' + e.pointX + ' ' + e.pointY + ')'],
          'geomData': { a: false },
          'showBubble': false,
          'names': ['selected'],
          'geometryType': govmap.drawType.Point,
          'defaultSymbol':
          {
            outlineColor: [11, 181, 0, 1],
            outlineWidth: 1,
            fillColor: [11, 181, 0, 1]
          },
          'symbols': [],
          'clearExisting': false,
          'data': {
            'headers': [''],
            'bubbles': [''],
          }
        }

        var res_list = [];
        govmap.displayGeometries(data).progress((res) => {
          console.log(res);
          res_list.push(res);
          this.searchService.hide();
          setTimeout(() => {
            if (res_list[0]) {
              this.ngZone.run(() => {
                this.openInformation(res.data.geomData, res.data.x, res.data.y);
              });
              res_list = [];
            }
          }, 10);
        })

          govmap.onEvent(govmap.events.CLICK).progress((n) =>{ 
            govmap.unbindEvent(govmap.events.CLICK);
            govmap.clearGeometriesByName([e.resourceID + ", " + e.name]); 
            sessionStorage.setItem('LocX', n.mapPoint.x.toFixed(0));
            sessionStorage.setItem('LocY', n.mapPoint.y.toFixed(0));
            this.moveSite++;
            var data = {
              'wkts': ['POINT(' + n.mapPoint.x.toFixed(0) + " " + n.mapPoint.y.toFixed(0) + ')'],
              'geomData': { a: false },
              'showBubble': false,
              'names': ["moved" + this.moveSite],
              'geometryType': govmap.drawType.Point,
              'defaultSymbol':
              {
                outlineColor: [40, 41, 82, 1],
                outlineWidth: 1,
                fillColor: [40, 41, 82, 1]
              },
              'symbols': [],
              'clearExisting': false,
              'data': {
                'headers': [n.resourceID + ", " + n.name],
                'bubbles': [n.resourceID + ", " + n.name],
                'tooltips': [this.theSite]
              }
            }
        
            var res_list = [];
            govmap.displayGeometries(data).progress((res) => {
              console.log(res);
              res_list.push(res);
              this.searchService.hide();
              setTimeout(() => {
                if (res_list[0]) {
                  this.ngZone.run(() => {
                    this.openInformation(res.data.geomData, res.data.x, res.data.y);
                  });
                  res_list = [];
                }
              }, 10);

            })

          this.disableUndo = false;
          this.moveBack++;
          govmap.clearGeometriesByName(["selected"]);
          govmap.clearGeometriesByName(["selected" + this.moveBack]); 
          //localStorage.setItem('logSites', Date().toString().split(' ')[1] + " " + Date().toString().split(' ')[2] + " " + Date().toString().split(' ')[4] + ": The site " + "\"" + this.theSite + "\"" + " was moved from (" + this.theLocation + ") to " + "(" + n.mapPoint.x.toFixed(0).toString() + " " + n.mapPoint.y.toFixed(0).toString() + ")\n" + localStorage.getItem('logSites'));
          //this.finalLog = Date().toString().split(' ')[1] + " " + Date().toString().split(' ')[2] + " " + Date().toString().split(' ')[4] + ": The site " + "\"" + this.theSite + "\"" + " was moved from (" + this.theLocation + ") to " + "(" + n.mapPoint.x.toFixed(0).toString() + " " + n.mapPoint.y.toFixed(0).toString() + ")";
          //this.finalLog = "The site " + "\"" + this.theSite + "\"" + " was moved from (" + this.theLocation + ") to " + "(" + n.mapPoint.x.toFixed(0).toString() + " " + n.mapPoint.y.toFixed(0).toString() + ")";
          this.logX = n.mapPoint.x.toFixed(0).toString();
          this.logY = n.mapPoint.y.toFixed(0).toString();
          //console.log("The site " + "\"" + this.theSite + "\"" + " was moved from " + this.theLocation + " to " + n.mapPoint.x.toFixed(0) + " " + n.mapPoint.y.toFixed(0));
          this.updateLocation(e.resourceID, n.mapPoint.x.toFixed(0), n.mapPoint.y.toFixed(0));
          this.createLog();
      });
      }
    }
    else if(!this.changeSiteLocation){
      //console.log("46456456 " + e.resourceID);
      this.computes.openInformation(e, x, y);
    }

  }
  wkts = [];
  //opening a measure tool:
  openMeasure() {
    govmap.showMeasure();
    this.computes.clearGeom();
    govmap.setMapCursor(govmap.cursorType.DEFAULT);
    govmap.unbindEvent(govmap.events.CLICK);
    this.isMeasure = !this.isMeasure;
    this.isAzimuth = false; this.isViewshed = false; this.distanceAndWalking = false;
    this.computes.locationToDisWalk = false;
    this.computes.locationToViewshed = false;
    this.computes.locationToAz = false;
  }
  // Get data of archiology sites:
  i = 0;
  arrayOfName: string[] = [];
  getDataObj(sitesArray, wktsArr, namesArr, geoType, defaultSmb, symbolArr) {
    if (sitesArray != null && this.i != 0 && this.isSearch) {
      govmap.zoomToXY({ x: sitesArray[0].pointX, y: sitesArray[0].pointY, level: 5, marker: false }); // zoom to site
      this.searchService.allowZoom();
    }
    /*else {
    govmap.zoomToXY({ x: 222200, y: 631400, level: 5 });
    }*/
    this.i++;
    const data = {
      wkts: wktsArr,
      geomData: sitesArray,
      showBubble: false,
      names: namesArr,
      geometryType: geoType,
      clearExisting: true, // deletes
      // defaultSymbol: defaultSmb,
      symbols:
        symbolArr
      ,
      data: {
        tooltips: namesArr,
        // headers: namesArr,
      }
    };
    if (namesArr != null) {
      this.arrayOfName = namesArr;
    }

    for (let index = 0; index < this.SiteDefaultDesign.length; index++) {
      const element = this.SiteDefaultDesign[index];
      if (element.pointX >= this.xmin && element.pointX <= this.xmax && element.pointY >= this.ymin && element.pointY <= this.ymax) {
        this.sumOfSitesZoom++;
      }
    }

    //
    console.log(data);
    console.log(this.sumOfSitesZoom + ' Sites');
    
    this.viewshed.calculationViewshed();
    //this.computes.keyupViewShed();
    
    //console.log("123131231231 " + this.isCalculated);
    //debugger;
    /*if(this.viewshedStatus.isCalculated$){
      console.log("the status: " + this.viewshedStatus.isCalculated$);
      //this.viewshedStatus.calculationViewshed();
  }
    if(isCalclated){
      run the function
    }*/

    //$('.loader').delay(500).fadeOut('slow');
    return data;
  }
  //Get data of history sites:
  getDataObjHistory(sitesArray, wktsArr, namesArr, geoType, defaultSmb, symbolArr) {
    const data = {
      wkts: wktsArr,
      geomData: sitesArray,
      showBubble: false,
      names: namesArr,
      geometryType: geoType,
      clearExisting: false,
      defaultSymbol: defaultSmb,
      symbols:
        symbolArr
      ,
      data: {
        tooltips: namesArr,
        headers: namesArr,
      }
    };
    return data;
  }
  //Placing archiology sites on a map:
  displayLayer(/*wktsArr,namesArr ,geoType,defaultSmb,symbolArr*/data) {
    if (data.symbols != null) {
      var res_list = [];
      govmap.displayGeometries(data).progress((res: any) => {
        console.log(res);
        res_list.push(res);
        this.searchService.hide();
        setTimeout(() => {
          if (res_list[0]) {
            this.ngZone.run(() => {
              this.openInformation(res.data.geomData, res.data.x, res.data.y);
            })
            res_list = [];
          }
        }, 10);
      });
      this.searchService.isLoadingData = false;
    }
    else {
      govmap.clearGeometriesByName(this.arrayOfName);
    }
  }
  //Placing history sites on a map:
  displayLayerHistory(/*wktsArr,namesArr ,geoType,defaultSmb,symbolArr*/data) {
    {
    }
    if (data.symbols != 0) {
      var res_list = [];
      govmap.displayGeometries(data).progress((res: any) => {
        res_list.push(res);
        this.searchService.hide();
        res_list.push(res);
        setTimeout(() => {
          if (res_list[0]) {
            this.ngZone.run(() => {// open information (!)
              this.openInformation(res.data.geomData, res.data.x, res.data.y);
            });
            res_list = [];
          }
        }, 400); // 10
      });
    }

  }
  //?
  displaySite(archS: ArchSiteModel) {
    const geoType = archS.type === 'POINT' ? govmap.drawType.Point : archS.type === 'POLYGON' ? govmap.drawType.Polygon : govmap.drawType.polyline;
    const defaultSmb = this.getSuiteSymbol(geoType);
    const Smb = this.getSymbol(geoType);
    const data = {
      wkts: [archS.niG_Data],
      names: [archS.name],
      geometryType: geoType,
      clearExisting: true,
      defaultSymbol: defaultSmb
      ,
      symbols:
        Smb
      ,
      data: {}
    };
    govmap.displayGeometries(data).then((response: any) => {
      console.log(response.data);
    });
  }
  //?
  getSymbol(aType: number): any {
    if (aType === 0) //point
    {
      return [{
        url: '/Content/images/kad.svg',
        width: 15,
        height: 15
      }];
    }
    else {
      return null;
    }

  }
  //?
  getSuiteSymbol(aType: number): any {
    if (aType === 1)//polyline
    {
      return {
        color: [255, 0, 80, 1],
        width: 1,
      };
    }
    else if (aType === 2)//polygon
    {
      return {
        outlineColor: [0, 80, 255, 1],
        outlineWidth: 1,
        fillColor: [138, 43, 226, 0.5]
      };
    }
    else {
      return {
        url: '/Content/images/kad.svg',
        width: 15,
        height: 15
      };
    }


  }
  //?
  displayGeoPoint() {
    //Create data object
    const data = {
      geometryType: govmap.drawType.Circle,
      clearExisting: true,
      defaultSymbol:
      {
        outlineColor: [0, 0, 255, 1146, 206, 219, 1],
        outlineWidth: 1,
        fillColor: [0.572, 0.808, 0.858, 1]
      },
      symbols: [
      ],

      data: {
        tooltips: ['point1'],
        headers: ['p1header'],
        bubbletType: 0,
        bubbleHTML: '<div style="border: 1px solid #525252; margin: 10px;padding: 10px;"><div>{0}</div></div>',
        bubbleHTMLParameters: ['g']
      }
    };
    govmap.displayGeometries(data).then((response: any) => {
      console.log(response.data);
    });
  }
  //?
  displayGeoPoly() {
    /*   const bubbleContent = '<div style=\'border: 1px solid #525252; margin: 10px;padding: 10px;\'>'+
      '<div style=\'background-color: yellow;\'>{0}</div>'+
      '<div style=\'background-color: blue;\'>{1}</div></div>';
      const data = {  
          // tslint:disable-next-line: max-line-length
          wkts: ['POLYGON((151612.40 534674.88, 215112.52 538643.64, 98431.04 445774.70, 74618.49 521974.85, 80968.50 552931.17, 151612.40 533881.13,151612.40 534674.88))',  
                  // tslint:disable-next-line: max-line-length
                  'POLYGON((196062.48 621458.39, 196591.65 622516.72, 197649.99 659293.88, 229929.22 665379.31, 243423.00 632306.33, 196062.48 621458.39))'],  
          names: ['p1', 'p2'],  
          geometryType: govmap.drawType.Polygon,  
          clearExistings:false, 
          defaultSymbol:  
              {  
              outlineColor: [0, 80, 255, 1],  
              outlineWidth: 1,  
              fillColor: [138, 43, 226, 0.5]
              },  
          symbols: [
            { url: 'https://govmap.gov.il/sites/O1.png',  width:15, height:15},
            { url: 'https://govmap.gov.il/sites/O1.png',  width:15, height:15}
          ],  
          
          data: {  
                  tooltips: ['פוליגון 1 tooltip', 'פוליגון 2 tooltip'],  
                  headers: ['פוליגון 1 כותרת','פוליגון 2 כותרת'],
      /*             bubbles: ['L-6,00.html',
                  'L-2,00.html'],  
        bubbleUrl: 'https://www.ynet.co.il/home/0,7340,'  
                  bubbleHTML: bubbleContent,
                  bubbleHTMLParameters: [['פוליגון 1','מידע נוסף...'], ['פוליגון 2', 'מידע נוסף...']]
          }  
          };  
      govmap.displayGeometries(data).then( (response:any) => 
      {  
        console.log(response.data);
      });   
       */
    const bubbleContent = '<div style=\'border: 1px solid #525252; margin: 10px;padding: 10px;\'><div style=\'background-color: yellow;\'>{0}</div><div               style=\'background-color: blue;\'>{1}</div></div>';
    const data = {
      wkts: ['POLYGON((151612.40 534674.88, 215112.52 538643.64, 98431.04 445774.70, 74618.49 521974.85, 80968.50 552931.17, 151612.40 533881.13,151612.40 534674.88))',
        'POLYGON((196062.48 621458.39, 196591.65 622516.72, 197649.99 659293.88, 229929.22 665379.31, 243423.00 632306.33, 196062.48 621458.39))'],
      names: ['p1', 'p2'],
      geometryType: govmap.drawType.Polygon,
      defaultSymbol:
      {
        outlineColor: [0, 80, 255, 1],
        outlineWidth: 1,
        fillColor: [138, 43, 226, 0.5]
      },
      symbols: [],
      clearExisting: true,
      data: {
        tooltips: ['פוליגון 1 tooltip', 'פוליגון 2 tooltip'],
        headers: ['פוליגון 1 כותרת', 'פוליגון 2 כותרת'],
        bubbleHTML: bubbleContent,
        bubbleHTMLParameters: [['פוליגון 1', 'מידע נוסף...'], ['פוליגון 2', 'מידע נוסף...']]
      }
    };
    govmap.displayGeometries(data).then((response) => {
      console.log(response.data);
    });

  }
  //Show BG map:
  showBGMap() {
    const params = {
      bgName: 'Topograph Map',
      bgCaption: 'מפה טופוגרפית',
      // url: 'map.govmap.gov.il/201015L1O2A3',
      // url: 'jkc.biu.ac.il/MapsAllIsrael/Layers/_alllayers',
      url: 'jkcmaps.biu.ac.il/_alllayers',
      // url:'http://jkcmaps.ad.biu.ac.il/maps/_alllayers',
      // url: 'jkc.biu.ac.il/Data/Maps/Jerusalem_19_05_2021/Layers/_alllayers',
      //https://mapcdn.govmap.gov.il/N23A09GARY4',
      //'mapcdn.govmap.gov.il/N23A09GARY4',
      //'https://jkc.biu.ac.il/Data/Maps/Jerusalem_19_05_2021',
      imageFormat: 'PNG',
      dpi: 96,
      tileWidth: 256,
      tileHeight: 256,
      lods: [{ level: 0, resolution: 793.751587503175, scale: 3000000 },
      { level: 1, resolution: 264.583862501058, scale: 1000000 },
      { level: 2, resolution: 132.291931250529, scale: 500000 },
      { level: 3, resolution: 66.1459656252646, scale: 250000 },
      { level: 4, resolution: 26.4583862501058, scale: 100000 },
      { level: 5, resolution: 13.2291931250529, scale: 50000 },
      { level: 6, resolution: 6.61459656252646, scale: 25000 },
      { level: 7, resolution: 2.64583862501058, scale: 10000 },
      { level: 8, resolution: 1.32291931250529, scale: 5000 },
      { level: 9, resolution: 0.661459656252646, scale: 2500 },
      { level: 10, resolution: 0.330729828126323, scale: 1250 }],
      smallButtonImage: 'https://jkc.biu.ac.il/Dev/assets/picture/TopographyMap.png',
      largeButtonImage: 'https://jkc.biu.ac.il/Dev/assets/picture/TopographyMap.png'
    };
    govmap.addCustomBackground(params).progress(() => console.log('hi'));
    /*.progress((response: any) => {
      console.log("BG added");
      console.log(response);
    }
    )*/
  }
  //?
  addToLayer() {
    const data = {
      action: govmap.saveAction.New,
      layerName: 'DynamicViewshed',
      entities: [{
        fields: {
          Field2Value: '12',
          Field3Value: '1697',
          Field4Value: '1699',
          Field5Value: 'link',
          Field6Value: 'linklink',
          Field8Value: 'abcd',
          Field1Value: '25/06/2017',
          SHAPE: 'POINT(196062.48 621458.39)'
        }
      },
      {
        fields: {
          Field2Value: '1',
          Field3Value: '1696',
          Field4Value: '1699',
          Field5Value: 'link',
          Field6Value: 'linklink',
          Field8Value: 'abcd',
          Field1Value: '25/06/2017',
          SHAPE: 'POINT(196062.48 600000.39)'
        }
      }]
    };
    govmap.saveLayerEntities(data).then(
      (result) => {
        console.log(result);
      });
  }
  //?
  OpenSourceLayer() {
    const values = {
      1860: 1, 40: 2, 38: 3, 224: 4, 1194: 5, 1467: 6,
      306: 7, 307: 8, 369: 9, 562: 10, 579: 11, 2957: 12, 581: 13,
      2842: 14, 596: 15, 2958: 16, 2964: 17, 2965: 18, 1566: 19, 608: 20,
      640: 21, 648: 22, 2975: 23, 2955: 24, 1253: 25, 1221: 26, 809: 27,
      1684: 28, 2591: 29, 845: 30, 847: 31, 848: 32, 1603: 33, 2981: 34,
      283: 35, 899: 36, 979: 37, 993: 38, 1104: 39, 3002: 40, 3000: 41,
      1256: 42, 1780: 43, 3057: 44, 1275: 45, 1327: 46, 1858: 47,
      780: 48, 435: 49, 1949: 50, 1492: 51, 1971: 52, 1812: 53, 138: 54,
      1896: 55, 2012: 56, 2025: 57, 2093: 58, 2120: 59, 2137: 60, 2170: 61,
      2215: 62, 2232: 63, 2235: 64, 2668: 65, 2693: 66, 500: 67, 2289: 68,
      2305: 69, 2312: 70, 2314: 71, 2759: 72, 2250: 73, 2321: 74, 2352: 75,
      2354: 76, 2401: 77, 2421: 78, 2441: 79, 2489: 80, 2840: 81, 2501: 82,
      2537: 83, 2553: 84, 2585: 85, 790: 86, 2609: 87, 2663: 88, 2739: 89,
      2791: 90, 2813: 91, 731: 92, 846: 93, 3055: 94, 2913: 95, 2928: 96,
      2942: 97, 680: 98, 2185: 99, 3031: 100, 3034: 101, 3035: 102,
      3036: 103, 3052: 104, 1770: 105, 3082: 106, 3083: 107, 3114: 108,
      3152: 109, 3159: 110, 1824: 111, 3182: 112, 3186: 113, 3187: 114,
      3195: 115, 1136: 116, 1181: 117, 2847: 118, 2444: 119, 1334: 120,
      1635: 121, 2935: 3037, 2936: 3038, 2938: 3039, 2940: 3040, 2984: 3041,
      2941: 3042, 2945: 3043, 2943: 3044, 2944: 3045, 2946: 3046, 2947: 3047,
      2949: 3048, 2950: 3049, 2952: 3050, 2954: 3051, 2960: 3052, 2962: 3053,
      2967: 3054, 2969: 3055, 2971: 3056, 2972: 3057, 2983: 3058, 2973: 3059,
      2974: 3060, 2976: 3061, 2977: 3062, 2978: 3063, 2979: 3064,
      2985: 3065, 2986: 3066, 2989: 3067, 2992: 3068, 2993: 3069,
      2994: 3070, 2995: 3071, 2996: 3072, 2997: 3073, 2998: 3074,
      2999: 3075, 3001: 3076, 3003: 3077, 3004: 3078, 3007: 3079,
      3008: 3080, 3009: 3081, 3011: 3082, 3012: 3083, 3013: 3084,
      3014: 3085, 3015: 3086, 3020: 3087, 3022: 3088, 3023: 3089,
      3056: 3090, 3024: 3091, 3028: 3092, 3029: 3093, 3030: 3094,
      3038: 3095, 3039: 3096, 3040: 3097, 3041: 3098, 3044: 3099,
      3045: 3100, 3047: 3101, 3048: 3102, 3049: 3103, 3050: 3104,
      2838: 3196, 929: 3197, 1598: 3198, 1043: 3199, 2919: 3200,
      1596: 3201, 1188: 3202, 2159: 3203, 2990: 3204, 583: 3205,
      941: 3206, 2660: 3207, 1705: 3208, 1805: 3209, 2340: 3210,
      1062: 3211, 2841: 3212
    };
    const params = {
      layerName: 'tot_pop_area_pol', rendererType: govmap.rendererType.JenksNaturalBreaks,
      rendererValues: values, colorPreset: 'GREEN', range: 10
    };

    govmap.addOpenSourceLayer(params);
  }
  //?

  FeaturesOnMap() {
    const params = {
      interfaceName: 'Gush',
      continous: false,
      drawType: govmap.drawType.Polygon
    };
    govmap.selectFeaturesOnMap(params.interfaceName, params.drawType, params.continous).then((response: any) => {
      console.log(response);
    }
    );
  }
  //Do unsubscribe:
  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.subscription.unsubscribe();
    this.isSearchSubscription.unsubscribe();
  }
  
  /*ShowRegions() {
    if (this.Regions) {
      this.Regions = false;
      $("#Reg").css("color", "#8a2be2");
      // tslint:disable-next-line: max-line-length
      var bubbleContent = '<div style=\'border: 1px solid #525252; margin: 10px;padding: 10px;\'><div style=\'background-color: yellow;\'>{0}</div><div               style=\'background-color: blue;\'>{1}</div></div>';
      var data = {
        wkts: ['POLYGON (((247354.49774116594926454 752271.95870364003349096, 247269.81559144720085897 751208.20453893684316427, 246600.72206278936937451 749334.74265869497321546, 245764.35515196708729491 748364.55704214109573513, 245931.62853413156699389 747427.82610202021896839, 246801.45012138673337176 746323.821779734804295, 248039.27314940368523821 743981.99442943243775517, 248875.64006022596731782 741113.25592531205620617, 249912.73502964558429085 739808.52354442921932787, 250347.64582327316747978 739005.61131003987975419, 251284.37676339413155802 732590.67710403306409717, 251418.19546912569785491 731486.67278174764942378, 251351.28611625990015455 728517.57024832849856466, 251317.83143982701585628 726309.56160375766921788, 250916.37532263231696561 725205.55728147237095982, 250414.55517613896518014 723031.00331333442591131, 250983.28467549811466597 718548.07667132699862123, 250816.01129333366407081 716540.79608535359147936, 248156.36451691880938597 714801.15291084314230829, 246951.99616533474181779 715771.33852739701978862, 245747.62781375064514577 717510.98170190735254437, 243907.62060994165949523 717678.25508407177403569, 242602.8882290588808246 718113.16587769938632846, 241900.34002396819414571 718648.44070062565151602, 241465.42923034058185294 719451.3529350149910897, 239190.51123290401301347 720354.6291987030999735, 237818.8694991554657463 721726.27093245158903301, 235610.86085458466550335 721793.18028531735762954, 235092.31336987484246492 722085.90870410518255085, 234034.30922768471646123 722396.40991974889766425, 232917.75940173692652024 722487.36482129991054535, 231813.75507945151184686 723056.09432065906003118, 231441.57180413565947674 724754.96460826764814556, 230609.38672786744427867 725899.74181745480746031, 230404.47683471604250371 727111.42837950948160142, 229940.29319920961279422 728810.29866711632348597, 229471.92772914914530702 729312.11881360970437527, 228907.38006434415001422 730553.07821754307951778, 228083.55865718412678689 731545.21846550505142659, 226645.00757056981092319 731645.58249480370432138, 225708.27663044887594879 731009.94364257878623903, 223332.99460371362511069 731043.39831901167053729, 222663.90107505579362623 731344.490406907745637, 221760.6248113677429501 732481.94940562604460865, 221158.44063557568006217 733786.68178650876507163, 220589.71113621653057635 735024.50481452571693808, 219452.25213749826070853 735827.41704891517292708, 218494.61202460678759962 735727.05301961652003229, 218335.70231155055807903 735609.9616521013667807, 217490.97173162005492486 735618.3253212096169591, 216763.33251920464681461 735986.32676197146065533, 215910.23827016595168971 737140.51309890614356846, 214789.50660966406576335 738294.6994358409428969, 212062.95048038347158581 739423.79476545099169016, 209796.39615205509471707 739390.34008901810739189, 209144.02996161370538175 739641.25016226479783654, 208491.66377117234515026 739775.0688679963350296, 207872.75225716384011321 740042.70627945952583104, 207136.74937564024003223 740603.07210971042513847, 210314.94363676488865167 742944.89946001279167831, 211184.76522402005502954 743881.63040013366844505, 212389.13357560415170155 744751.45198738889303058, 213225.50048642643378116 745830.36530234955716878, 213744.04797113622771576 746583.09552208962850273, 214212.41344119669520296 747733.10002447024453431, 214764.41560233940253966 750208.74608050414826721, 214747.68826412298949435 752199.29932826128788292, 214530.2328673092124518 753299.12181599251925945, 214346.23214692829060368 754470.03549114370252937, 214362.95948514473275281 756368.58837871020659804, 214781.14294055587379262 756970.77255450224038213, 215634.23718959459802136 757974.41284748900216073, 216483.1496040791971609 758693.68839079618919641, 217181.51597461578785442 758693.68839079618919641, 217181.51597461578785442 758630.96087248448748142, 217490.97173162002582103 758626.77903793042059988, 217490.97173162002582103 758547.32418140221852809, 218114.06508018262684345 758538.96051229408476502, 218118.24691473672282882 758472.05115942831616849, 218816.61328527334262617 758467.86932487413287163, 218816.61328527334262617 758388.41446834604721516, 219126.06904227758059278 758384.2326337918639183, 219121.88720772345550358 758313.14144637202844024, 219514.97965580990421586 758321.50511548027861863, 219510.79782125580823049 758233.68658984394278377, 219816.0717437059211079 758233.68658984394278377, 219820.2535782600461971 758162.59540242399089038, 219887.16293112581479363 758162.59540242399089038, 219891.34476567993988283 758237.86842439800966531, 220142.25483892660122365 758233.68658984394278377, 220154.80034258894738741 758158.41356786992400885, 220823.89387124677887186 758154.23173331574071199, 220832.25754035499994643 758237.86842439800966531, 221066.44027538521913812 758472.05115942831616849, 221369.62328055829857476 758777.32508187834173441, 221996.89846367499558255 758773.14324732427485287, 221992.71662912089959718 758702.0520599044393748, 222297.9905515710124746 758702.0520599044393748, 222302.17238612513756379 758626.77903793042059988, 222753.81051796916290186 758622.59720337623730302, 223075.81177863574703224 758467.86932487413287163, 223458.44964033691212535 758229.50475528975948691, 224629.36331548809539527 758229.50475528975948691, 225175.09272479961509816 758313.14144637202844024, 225714.54938227997627109 758618.41536882217042148, 226178.73301778634777293 758927.87112582637928426, 226325.09722718026023358 758994.78047869214788079, 226400.37024915424990468 759153.69019174843560904, 226492.37060934471082874 759237.32688283058814704, 226555.0981276563834399 759320.96357391285710037, 226858.28113282943377271 759704.64689425262622535, 226950.28149301989469677 759788.28358533477876335, 227100.82753696790314279 759934.64779472874943167, 227180.28239349601790309 760018.28448581090196967, 227351.73761021456448361 760093.55750778503715992, 227870.28509492438752204 760101.92117689317092299, 227878.64876403260859661 760026.64815491915214807, 230663.75057707077939995 760076.83016956853680313, 230981.57000318326754496 760252.46722084120847285, 231383.0261203779373318 760403.0132647892460227, 232236.12036941666156054 760871.37873484974261373, 232611.44002064823871478 760947.69721546221990138, 232841.4409211243619211 760950.83359137771185488, 232841.4409211243619211 761101.37963532574940473, 232922.98669492951012217 761182.92540913086850196, 233155.07851268266676925 761258.19843110488727689, 233311.89730846183374524 761333.47145307890605181, 233541.89820893792784773 761417.10814416105858982, 233698.71700471706571989 761412.92630960699170828, 233853.44488321917015128 761333.47145307890605181, 234008.17276172127458267 761258.19843110488727689, 234010.26367899833712727 760892.28790762019343674, 234083.4457836952933576 760869.28781757270917296, 234236.08274492033524439 760635.10508254251908511, 234315.53760144845000468 760559.83206056850031018, 234392.90154069950222038 760478.28628676338121295, 234397.08337525362730958 760407.19509934342931956, 234627.08427572972141206 760403.01326478936243802, 234704.44821498074452393 760323.55840826127678156, 234785.99398878592182882 760248.28538628725800663, 234935.49457409538445063 760169.35325907834339887, 234952.22191231182659976 760098.2620716585079208, 235086.04061804336379282 760091.98931982729118317, 235161.31364001735346392 760014.62538057623896748, 235558.58792265786905773 759782.53356282308232039, 235563.81521585053997114 759705.16962357191368937, 236099.09003877671784721 759711.442375403130427, 236099.09003877671784721 759784.62448009999934584, 236180.63581258189515211 759933.07960677100345492, 236337.45460836100392044 760096.17115438135806471, 236559.09183972887694836 760096.17115438135806471, 236705.45604912276030518 760016.71629785327240825, 236797.45640931319212541 759945.62511043332051486, 237040.00281345163239166 759782.53356282308232039, 237037.91189617456984706 759707.26054084906354547, 237581.5503882089687977 759774.169893714832142, 238033.18852005293592811 760016.71629785327240825, 238112.6433765810506884 760091.98931982717476785, 238367.73528438180801459 760259.2627019917126745, 238798.46424345523701049 760246.71719832927919924, 239015.91964026898494922 760129.62583081412594765, 239300.2843899485305883 759694.71503718663007021, 239701.74050714317127131 759309.9862582084024325, 241031.56389535040943883 759343.44093464128673077, 241784.29411509033525363 760012.53446329908911139, 242051.93152655343874358 760179.80784546351060271, 242319.56893801654223353 760213.26252189639490098, 243005.38980489069945179 759895.4430957839358598, 243373.39124565245583653 759460.53230215643998235, 243590.84664246620377526 757239.97815392364282161, 244042.48477431017090566 755249.42490616685245186, 244544.30492080346448347 754663.96806859131902456, 245748.6732723873865325 753191.96230554429348558, 246551.58550677666789852 752506.14143867010716349, 247354.49774116594926454 752271.95870364003349096)))',
          'POLYGON (((244212.89453239185968414 651993.13428400782868266, 244348.80415540057583712 650017.21745719038881361, 243796.80199425789760426 648394.66565019520930946, 243646.25595030988915823 645956.65610514825675637, 242609.16098089024308138 643368.10051615326665342, 241638.97536433642380871 640495.18017747881822288, 241655.70270255286595784 638638.44563545333221555, 241973.52212866532499902 637166.43987240607384592, 243044.07177451782627031 635447.70587066630832851, 244164.80343501968309283 634226.61018086585681885, 244616.4415668637084309 633524.06197577517013997, 245335.71711017089546658 632909.33229632070288062, 245781.08249018370406702 632037.41979178856126964, 247516.54383013996994123 630849.77877842087764293, 247989.0911347545334138 630703.41456902702338994, 245889.81018859057803638 625187.57479215413331985, 244083.25766121447668411 623966.47910235356539488, 242527.61520708503667265 622578.11003038857597858, 243029.43535357838845812 621244.10480762703809887, 241942.15836950944503769 619236.82422165363095701, 241155.97347333648940548 616731.90532374090980738, 238245.41662367497337982 611906.06824829638935626, 239048.32885806437116116 610534.42651454778388143, 239784.33173958797124214 609150.23927713697776198, 237810.50583004739019088 606394.41030597756616771, 237894.14252112963004038 602250.21226285316515714, 237860.68784469674574211 598591.10702800576109439, 237542.8684185842575971 594676.90988535748329014, 238295.59863832429982722 591854.17156133230309933, 239566.87634277416509576 590566.16651866596657783, 240152.33318034975673072 590064.34637217258568853, 239951.6051217524218373 585907.60282538586761802, 240185.78785678267013282 585037.78123813075944781, 240135.60584213331458159 583816.68554833019152284, 240219.24253321555443108 583114.13734323950484395, 240202.51519499911228195 581759.22294770739972591, 238973.05583609035238624 578290.39118507201783359, 237802.14216093916911632 575047.37848835857585073, 236162.8630157275183592 574169.19323199521750212, 234582.12955427341512404 573500.0997033374151215, 234063.58206956359208561 573249.18963009072467685, 233900.49052195326657966 572973.18854951940011233, 232721.21317769383313134 573650.64574728545267135, 231433.2081350275548175 573976.82884250616189092, 227849.37592215408221819 574570.64934918994549662, 225181.3654766310355626 574955.37812816817313433, 222442.26384368803701364 575137.28793127206154168, 218967.15932922149659134 575036.92390197329223156, 216056.60247955998056568 575421.65268095163628459, 213606.04743085071095265 575706.0174306312110275, 211021.67367640987504274 576140.92822425870690495, 208784.39218996028648689 577100.65925442730076611, 205597.83425972741679288 577635.93407735356595367, 200780.36085339111741632 578430.48264263477176428, 199107.62703174655325711 578974.12113466917071491, 198346.53314289828995243 579325.39523721451405436, 197740.16713255213107914 579800.03345910622738302, 196192.88834753091214225 580477.49065687227994204, 194503.4271876699058339 580845.49209763400722295, 191433.96062495216028765 580862.21943585050757974, 189338.86151334235910326 580912.4014504998922348, 186984.48865937764639966 580837.12842852587345988, 184885.20771321374922991 580820.40109030937310308, 183212.47389156918507069 580786.94641387648880482, 180009.18862311987322755 581104.765839988947846, 178403.3641543411067687 581196.76620017935056239, 176128.44615690450882539 581213.49353839585091919, 174932.44147442866233177 581389.13058966852258891, 172757.88750629071728326 581430.94893520965706557, 170014.60403879365185276 581355.67591323563829064, 169002.60007669869810343 581046.22015623142942786, 167814.95906333107268438 580912.4014504998922348, 166828.04610856078215875 580444.03598043939564377, 165816.04214646582840942 580310.21727470774203539, 166777.86409391145571135 581656.76800113148055971, 167237.86589486370212398 582426.22555908793583512, 167702.04953037007362582 583400.59301019588019699, 168864.59953641303582117 585046.14490723877679557, 169274.41932271595578641 586426.15031009551603347, 169851.5124911833263468 587603.33673707791604102, 172021.88462476711720228 590359.16570823732763529, 172975.34290310452342965 592015.17219166539143771, 174648.07672474908758886 594120.7258896604180336, 175300.44291519044782035 595124.36618264717981219, 175559.71665754535933957 596483.46241273335181177, 175860.80874544137623161 598097.65055062039755285, 176295.71953906895942055 599253.92780483211390674, 176278.99220085251727141 601010.29831755894701928, 175844.08140722493408248 602415.39472774032037705, 175057.8965110520075541 604054.673872952000238, 174004.07420341591932811 605196.31470622436609119, 173385.16268940738518722 606103.77280446665827185, 173853.52815946785267442 606605.59295095992274582, 175007.71449640259379521 609399.05843310640193522, 175576.44399576174328104 613007.98165330453775823, 175810.62673079196247272 616432.90415312175173312, 175844.08140722487587482 618657.64013590896502137, 176111.7188186880084686 620493.46550516388379037, 176546.6296123155625537 622433.83673827152233571, 177366.26918492140248418 624704.57290115405339748, 178052.09005179567611776 625507.48513554339297116, 178537.1828600725857541 626494.39809031365439296, 178972.09365370016894303 627230.40097183734178543, 179465.55013108532875776 627978.94935702322982252, 180117.91632152668898925 628949.13497357710730284, 180703.37315910228062421 630550.77760780171956867, 181272.10265846143011004 632035.32887451129499823, 181489.55805527523625642 633306.60657896113116294, 182125.19690750015433878 634389.701728475978598, 183212.47389156912686303 635715.34328212926629931, 184400.11490493675228208 636748.25641699484549463, 185253.20915397547651082 638404.26290042290929705, 186223.39477052932488732 639458.08520805893931538, 187026.30700491869356483 640127.17873671685811132, 188063.40197433831053786 641532.27514689823146909, 188908.13255426881369203 643363.91868159896694124, 189811.408817956893472 645287.5625764902215451, 190413.59299374892725609 646408.29423699213657528, 190865.23112559295259416 647729.75395609124097973, 191216.5052281382959336 649711.94353474013041705, 191417.23328673565993086 652333.95380016788840294, 191584.50666890011052601 653688.86819569999352098, 191902.32609501256956719 654408.14373900718055665, 192437.60091793883475475 655160.8739587472518906, 194093.607401366927661 656712.33457832259591669, 194076.88006315048551187 657866.52091525727882981, 193959.78869563536136411 658414.34124184586107731, 193859.42466633670846932 659702.34628451219759881, 194327.79013639717595652 660714.35024660686030984, 194239.97161076081101783 662351.53847454150673002, 194089.4255668128025718 663187.90538536373060197, 194189.78959611148457043 664325.36438408202957362, 195277.06658018042799085 664425.72841338068246841, 196565.07162284673540853 664275.18236943264491856, 199943.99394256874802522 664024.27229618595447391, 201282.1809998843818903 663806.81689937226474285, 204410.19324635970406234 662602.44854778819717467, 205480.74289221220533364 662334.81113632500637323, 207120.02203742385609075 661699.17228410008829087, 209955.30586511138244532 660616.07713458524085581, 214237.50444852144573815 658244.97694240405689925, 215910.23827016598079354 657191.15463476802688092, 216763.33251920470502228 656923.51722330483607948, 217599.69943002698710188 656873.33520865556783974, 221739.71563859726302326 655484.96613669057842344, 225202.27464940148638561 654916.23663733142893761, 229041.19877007574541494 654602.59904577303677797, 231700.84554649057099596 654301.50695787707809359, 235531.40599805660895072 653481.86738527123816311, 237204.1398197011440061 653448.41270883835386485, 239027.41968529371661134 653197.5026355916634202, 241051.42760948362411 652862.95587126270402223, 244212.89453239185968414 651993.13428400782868266)))',
          'POLYGON (((260685.14084103654022329 770494.82550249877385795, 260752.05019390233792365 767483.90462353860493749, 259547.68184231827035546 763134.79668726271484047, 260216.77537097607273608 755256.22038731689099222, 262759.33077987580327317 750706.38439244369510561, 263093.87754420470446348 747829.28221921506337821, 261956.41854548640549183 739816.88721353770233691, 259949.1379595129401423 735534.68863012758083642, 258544.04154933150857687 734932.50445433554705232, 257138.94513915010611527 732323.03969257010612637, 256804.39837482117582113 729780.48428367031738162, 254395.66167165304068476 725899.74181745504029095, 254730.20843598194187507 723440.82309963752049953, 256001.48614043180714361 720362.99286781158298254, 256670.57966908963862807 718154.98422324075363576, 255332.39261177397565916 714692.42521243647206575, 254663.29908311617327854 708336.03669018717482686, 254864.02714171350817196 706730.2122214084956795, 254194.93361305567668751 704522.20357683766633272, 254061.11490732411039062 701461.10068322811275721, 254529.48037738457787782 699989.09492018085438758, 254462.57102451880928129 698517.08915713371243328, 253325.11202580051030964 695773.80568963661789894, 253124.38396720317541622 694402.16395588812883943, 252789.83720287424512208 692662.52078137779608369, 253726.56814299520920031 688079.23011007171589881, 253826.93217229389119893 682475.57180756248999387, 254730.20843598194187507 677131.18724740808829665, 253793.47749586100690067 675659.18148436094634235, 253191.29332006897311658 673919.53830985049717128, 253592.74943726364290342 668248.97065447550266981, 252388.38108567960443906 665104.23106978379655629, 251384.7407926928717643 661558.03536789724603295, 251518.55949842443806119 658028.56700422731228173, 251986.92496848490554839 655686.73965392494574189, 253325.1120258005685173 651605.26912911224644631, 253124.38396720320452005 649731.80724887037649751, 251853.10626275336835533 646520.15831131278537214, 251786.19690988757065497 644379.05901960772462189, 252589.10914427693933249 643709.96549094992224127, 252923.65590860586962663 642639.41584509739186615, 253325.1120258005685173 641501.95684637909289449, 253258.20267293477081694 640029.95108333195094019, 252656.01849714273703285 639026.3107903451891616, 253458.93073153210571036 631147.73449039936531335, 247637.81703220907365903 630880.09707893617451191, 244760.71485898044193164 633757.19925216480623931, 242485.79686154384398833 636634.3014253934379667, 241883.61268575181020424 638440.85395276953931898, 241950.52203861754969694 641083.77339096798095852, 243221.79974306741496548 644094.69426992814987898, 244058.16665388969704509 646127.06586322630755603, 244125.07600675546564162 648669.62127212597988546, 244660.35082968173082918 649873.98962371004745364, 244125.07600675546564162 655879.10404341400135309, 245195.62565260799601674 659810.02852427866309881, 244994.89759401063201949 662954.76810897048562765, 245965.08321056445129216 665196.23142997419927269, 247570.90767934321775101 667630.05914046696852893, 247738.18106150766834617 672146.44045890728011727, 249678.55229461533599533 673777.35593501070979983, 250983.28467549808556214 675684.27249168558046222, 251752.74223345459904522 679531.56028146797325462, 250816.01129333363496698 682601.02684418577700853, 250013.09905894426628947 686147.22254607221111655, 249210.18682455486850813 688949.05169732682406902, 249410.91488315226160921 693699.6157507972093299, 250213.82711754165939055 698650.90786286501679569, 247269.8155914472299628 701042.91722781676799059, 246316.35731310976552777 702732.37838767911307514, 246065.44723986316239461 703719.2913424480939284, 246466.90335705777397379 705274.93379657878540456, 246399.99400419206358492 706663.30286854249425232, 241582.52059785576420836 709941.86115896585397422, 240578.8803048690315336 711480.77627487876452506, 239441.42130615073256195 714491.69715383893344551, 239090.14720360530191101 716699.70579840999562293, 239039.96518895603367127 718640.07703151751775295, 239056.69252717238850892 719560.08063342224340886, 239328.51177318961708806 720088.03724587929900736, 240712.699010600510519 719459.71660412359051406, 241431.97455390766845085 718857.53242833155672997, 242820.34362587265786715 717720.07342961325775832, 243991.25730102384113707 717301.88997420202940702, 245513.44507872036774643 717268.43529776914510876, 246182.53860737819923088 716682.97846019361168146, 246834.90479781955946237 715512.06478504242841154, 247520.72566469383309595 714993.51730033254716545, 248056.00048762009828351 714525.15183027216698974, 249093.09545703971525654 714876.42593281751032919, 250682.1925876019813586 715997.15759331930894405, 251301.10410161051549949 717452.4360181501833722, 250857.82963887468213215 721178.45060586335603148, 250757.46560957602923736 722980.82129868539050221, 251593.83252039828221314 726790.47257748083211482, 251610.5598586147534661 729383.2100010298890993, 251644.01453504763776436 732268.67584336677100509, 251242.55841785293887369 733987.40984510653652251, 251008.37568282269057818 735430.1427662749774754, 250774.19294779247138649 738683.61004937358666211, 249051.27711149858077988 741276.3474729226436466, 248030.90948029540595599 744617.63328165758866817, 246642.54040833041653968 746988.73347383877262473, 246207.62961470283335075 747574.19031141442246735, 246057.08357075482490472 748159.64714898995589465, 246709.44976119621424004 748878.92269229714293033, 247587.63501755963079631 752090.5716298547340557, 248039.27314940365613438 752726.21048207965213805, 249461.09689780152984895 753428.75868717033881694, 252070.56165956702898256 755314.766071074642241, 253358.56670223333640024 758488.77849764516577125, 253509.11274618134484626 764322.4377006305148825, 253927.29620159248588607 765656.44292339205276221, 254663.29908311608596705 766810.62926032685209066, 256520.03362514154287055 768851.36452273314353079, 257205.85449201578740031 768834.63718451675958931, 258125.85809392030932941 769821.55013928702101111, 259045.86169582480215468 770239.73359469813294709, 260685.14084103654022329 770494.82550249877385795)))',
          'POLYGON (((239909.78677621117094532 712229.32466006488539279, 238897.78281411618809216 712367.32520035177003592, 237467.59539661009330302 712731.14480655826628208, 236321.77272878357325681 712099.68778888857923448, 235326.49610490509076044 711125.3203377794707194, 233218.85148963294341229 709854.04263332963455468, 231077.75219792791176587 708883.85701677575707436, 230149.38492691516876221 709105.49424814491067082, 227029.73634954815497622 711827.86854287015739828, 223082.0845304669928737 713299.87430591741576791, 221296.44117586137144826 715925.02094726148061454, 219657.16203064972069114 718906.66898434283211827, 217595.51759547286201268 721462.81535554281435907, 216106.78449420916149393 722674.50191759725566953, 212456.04292846992029808 724685.96433812472969294, 210632.76306287734769285 727471.06615116295870394, 209298.7578401158680208 728622.11611218145117164, 208094.38948853180045262 733506.49887138360645622, 205886.38084396100020967 736651.23845607531256974, 205142.01429332909174263 739642.29562090430408716, 206664.20207102564745583 740435.79872754693496972, 208240.75369792562560178 739461.43127643899060786, 209620.75910078239394352 739118.52084300178103149, 212008.58663117999094538 739101.79350478539709002, 214718.41542224423028529 738056.33486625680234283, 216993.33341968082822859 735647.59816308866720647, 217449.15338607894955203 735309.91502284444868565, 218051.33756187098333612 735226.27833176217973232, 219155.34188415639800951 735577.55243430752307177, 220108.80016249380423687 734941.91358208260498941, 220660.80232363651157357 734289.54739164118655026, 221296.44117586142965592 732884.45098145981319249, 223136.44837967044441029 730739.1698552006855607, 225553.54875194682972506 730730.80618609243538231, 226724.46242709801299497 731307.89935455983504653, 228100.28599540062714368 731231.58087394700851291, 229593.20093121842364781 728698.43459279427770525, 229957.02053742611315101 727983.34088404127396643, 230425.38600748658063821 725682.28642064146697521, 231056.8430251574027352 724711.05534544913098216, 231592.11784808366792277 722993.36680234770756215, 232650.12199027382303029 722265.72758993215393275, 234067.76390411760075949 722085.90870410553179681, 235247.04124837700510398 721600.81589582865126431, 237434.14072017723810859 721529.7247084085829556, 238329.05331475709681399 721107.35941844352055341, 238973.05583609023597091 720390.1747924133669585, 238847.60079946689074859 717916.61965365649666637, 238906.14648322443827055 716110.06712628016248345, 239232.32957844514749013 714445.69697374408133328, 239909.78677621117094532 712229.32466006488539279)))',
          'POLYGON (((260711.27730699590756558 770810.03128201386425644, 259473.45427897918852977 770793.30394379759673029, 258369.44995669391937554 770425.30250303575303406, 257533.08304587178281508 769956.93703297537285835, 257098.17225224425783381 769287.84350431768689305, 255291.61972486838931218 770157.66509157267864794, 254689.43554907641373575 770592.57588520017452538, 254555.61684334487654269 771094.39603169355541468, 254354.8887847475707531 771428.94279602239839733, 253485.06719749252079055 774105.31691065325867385, 253652.34057965694228187 777350.42052464326843619, 254187.61540258306195028 780294.43205073720309883, 254187.61540258306195028 781565.70975518692284822, 253117.06575673067709431 784601.72164147137664258, 253384.70316819378058426 786341.36481598147656769, 253819.61396182130556554 786876.63963890762533993, 254154.16072615017765202 788942.46590863831806928, 254120.70604971726424992 790180.28893665515352041, 254287.97943188171484508 792221.02419906121212989, 255626.16648919717408717 794495.94219649746082723, 256027.62260639181477018 794161.39543216861784458, 256429.07872358645545319 794429.0328436316922307, 256629.80678218376124278 797506.86307545728050172, 257298.90031084150541574 797741.04581048747058958, 258335.99528026097686961 798042.13789838342927396, 258770.90607388850185089 798008.6832219505449757, 260878.5506891603290569 797741.04581048747058958, 261547.64421781807322986 798477.04869201092515141, 261949.10033501271391287 798477.04869201092515141, 263655.28883308992953971 796503.22278247063513845, 264257.47300888184690848 795767.21990094718057662, 262718.55789296911098063 793693.02996210823766887, 262718.55789296911098063 792622.48031625582370907, 263655.28883308992953971 789477.74073156458325684, 261915.64565857980051078 784526.44861949735786766, 260644.36795413010986522 781649.34644626907538623, 260443.63989553280407563 779106.79103736975230277, 260577.45860126434126869 773887.86151383945252746, 260711.27730699590756558 770810.03128201386425644)))',
          'POLYGON (((263125.24130336090456694 793688.32539824082050472, 263426.33339125692145899 794257.05489759996999055, 263861.24418488453375176 794675.23835301108192652, 264580.51972819166257977 795662.15130778134334832, 269152.90300553163979203 792768.83197884261608124, 269934.90606715087778866 793082.4695704011246562, 270920.90424561296822503 793829.84181461902335286, 271116.27432868792675436 793978.55830594967119396, 271326.54219736193772405 794137.53336017089895904, 271554.97490988043136895 794309.9033531981986016, 271932.38547838910017163 794261.9429381558438763, 271900.49898991396185011 794187.06196317123249173, 271751.25976926402654499 794101.33435481193009764, 271714.93008157523581758 793992.08392708573956043, 272294.6368966389563866 794037.30001320212613791, 272763.00236669939476997 793702.75324887316673994, 272858.13910280546406284 793757.11709807661827654, 272922.9575383941992186 793734.11700802901759744, 272919.82116247859084979 793515.61615257663652301, 273133.09472473827190697 793518.75252849224489182, 273163.41302525554783642 793548.02537037106230855, 273159.23119070148095489 793701.7077902345918119, 273336.95915925124427304 793713.20783525845035911, 273566.96005972736747935 793597.16192638187203556, 273813.6882984199328348 793548.02537037106230855, 274065.64383030513999984 793553.25266356370411813, 274400.19059463404119015 793610.75288868276402354, 274593.60044276161352172 793597.16192638187203556, 274794.32850135891931131 794124.07308019977062941, 275297.54259270348120481 794710.92386262607760727, 274922.57142768491758034 794764.93922561663202941, 274891.90464095474453643 795021.42507826874498278, 274779.69208041951060295 795271.98666530265472829, 275238.29993652034318075 795754.29158387670759112, 275907.39346517808735371 795759.86736328224651515, 276081.63657159934518859 795837.92827495897654444, 276493.19878896628506482 795520.98006437870208174, 276872.35178853897377849 795193.86767259053885937, 277087.94859221758088097 794937.381819938425906, 277210.61573913809843361 789900.59442365379072726, 279165.8557173268054612 789108.83374807552900165, 279359.14940338348969817 787298.56403442937880754, 279418.62438370857853442 785607.24428143340628594, 277232.91885676002129912 781224.68166872533038259, 277218.05011167871998623 779931.10084665368776768, 280266.14285334170563146 778882.85431842319667339, 281232.61128362512681633 771976.32222816732246429, 282228.81720407109241933 765021.46671639732085168, 284236.09779004426673055 761166.74455407471396029, 281857.09857703896705061 757657.7207148919114843, 280682.46771561761852354 755962.68377562565729022, 279701.13054025295423344 754286.23276771104428917, 279478.09936403372557834 753052.12692596460692585, 279849.81799106579273939 751003.95729101786855608, 279225.33069765195250511 747970.73329443612601608, 278526.49967883160570636 747346.2460010222857818, 277998.65922844607848674 746658.56654101307503879, 275820.38807403814280406 743859.52527946152258664, 274816.74778105155564845 742807.56156496074981987, 271270.55207916558720171 739153.56746123556513339, 266917.72695661999750882 736438.16289076628163457, 261208.12884540736558847 732936.57342412415891886, 259238.02012213738635182 733010.91714953060727566, 259273.77167902450310066 734985.82284490228630602, 260001.41089143988210708 735370.55162388051394373, 260381.95783586401375942 735861.91718398872762918, 260741.59560751757817343 736664.82941837806720287, 262188.51036324014421552 740277.93447313026990741, 262790.69453903217799962 743623.40211641939822584, 263292.51468552550068125 748608.14890492020640522, 263192.1506562267895788 750648.88416732661426067, 261820.50892247827141546 752681.25576062453910708, 260114.32042440082295798 755658.7219631519401446, 259913.59236580348806456 757900.18528415553737432, 259746.31898363900836557 760308.92198732378892601, 261051.05136452167062089 770244.96088789240457118, 261084.50604095455491915 771348.96521017781924456, 260783.41395305853802711 774301.34040538046974689, 260833.59596770786447451 776442.43969708541408181, 260783.41395305853802711 778679.72118353506084532, 260683.04992375985602848 780402.63701982889324427, 260933.95999700654647313 781452.27749291085638106, 261720.14489317950210534 783509.74009353364817798, 263877.97152310097590089 788619.94191865785978734, 264028.51756704895524308 789991.58365240634884685, 263576.87943520495900884 791112.31531290814746171, 263158.69597979378886521 792617.7757523882901296, 263058.33195049513597041 793337.05129569547716528, 263125.24130336090456694 793688.32539824082050472)))',
          'POLYGON (((195097.24769435363123193 745720.59214530629105866, 195235.24823463929351419 745995.54776723869144917, 195987.97845437936484814 743954.81250483240000904, 196339.25255692470818758 743034.80890292790718377, 196339.25255692470818758 741780.25853669445496053, 196255.61586584249744192 741099.66496301291044801, 195904.34176329712499864 740380.38941970572341233, 195670.15902826690580696 739293.11243563680909574, 195553.0676607517816592 738339.65415729943197221, 194967.61082317619002424 735901.64461225247941911, 194599.60938241437543184 734283.27463981136679649, 194449.06333846636698581 732727.63218568195588887, 194298.51729451835853979 730624.16940496396273375, 194147.97125057035009377 725074.87495165807195008, 193855.24283178255427629 722551.13779825181700289, 193754.87880248387227766 720445.58410025702323765, 193830.15182445786194876 718549.1221299673197791, 193671.24211140163242817 716686.11483611073344946, 193612.69642764408490621 714706.01617473899386823, 194323.60830184302176349 713355.28361376107204705, 195452.70363145307055674 711745.27731042820960283, 196539.980615522043081 710683.09133368392940611, 197376.34752634432516061 710082.99807516892906278, 198028.7137167856853921 709137.90346593980211765, 199023.99034066419699229 708000.44446722150314599, 199316.71875945199280977 707757.89806308306287974, 199575.99250180690432899 707055.34985799237620085, 199688.90203476790338755 706605.80264342541340739, 199931.44843890637275763 706045.43681317439768463, 200516.90527648196439259 705551.98033578926697373, 200792.90635705331806093 705033.43285107950214297, 201177.63513603157480247 704623.61306477652397007, 201570.72758411802351475 703496.60865244350861758, 201938.72902487983810715 702225.33094799367245287, 202097.63873793606762774 701407.78229266486596316, 202080.91139971962547861 700646.68840381666086614, 202089.27506882784655318 699160.04621983005199581, 201972.18370131272240542 697096.31086737604346126, 201562.36391500980244018 695442.39530122501309961, 201110.72578316577710211 693746.6613895328482613, 200633.99664399708854035 692184.74618357222061604, 200265.99520323527394794 691256.3789125595940277, 199596.90167457747156732 689842.91883326997049153, 198961.26282235252438113 688889.46055493247695267, 198241.98727904536644928 686932.36198360845446587, 197238.34698605863377452 685577.44758807634934783, 196460.52575899392832071 684615.6256406307220459, 195875.06892141833668575 683611.98534764396026731, 194503.42718766978941858 681253.430659125209786, 193466.33221825017244555 679062.14935277076438069, 193081.60343927191570401 677130.14178877137601376, 193181.96746857059770264 675352.86210327397566289, 193332.51351251860614866 672835.39770169893745333, 193432.87754181728814729 670326.29696923214942217, 193733.96962971330503933 667871.56008596869651228, 193834.33365901198703796 664547.00161545025184751, 194085.2437322586774826 660954.80573346849996597, 193667.0602768475364428 659934.4381022653542459, 193650.33293863106518984 658378.79564813594333827, 193800.87898257910273969 657759.88413412740919739, 193767.4243061461893376 656722.78916470776312053, 192830.69336602525436319 655844.60390834440477192, 191927.41710233717458323 655208.96505611948668957, 191325.23292654514079913 653904.23267523676622659, 191057.59551508200820535 652386.22673209430649877, 190806.68544183534686454 649458.94254421629011631, 190421.956662857090123 647355.47976349829696119, 189585.58975203480804339 645620.0184235421475023, 188498.31276796586462297 643332.55492244311608374, 188013.2199596889258828 642044.54987977689597756, 187227.03506351599935442 641007.4549103572499007, 185462.30088168100337498 639171.6295411023311317, 184140.84116258181165904 637197.8036315618082881, 182735.7447524003800936 635612.88833555357996374, 181347.3756804353906773 633793.79030451516155154, 181029.55625432293163612 632606.14929114747792482, 180352.09905655687907711 630619.77787794452160597, 179683.00552789907669649 628746.31599770265165716, 178562.27386739721987396 627224.1282200061250478, 177040.08608970066416077 624715.02748753933701664, 176337.53788460994837806 622983.74798213713802397, 175885.89975276592303999 621281.74131861387286335, 175618.26234130279044621 619358.09742372261825949, 175517.89831200413755141 617635.18158742878586054, 175484.44363557122414932 615100.98984763724729419, 175300.44291519033140503 612943.16321771580260247, 174648.07672474897117354 609367.69467395055107772, 173661.16376997868064791 606908.7759561330312863, 172975.34290310440701433 606080.77271441894117743, 173778.25513749380479567 605010.22306856652721763, 174898.98679799563251436 603605.12665838503744453, 175986.26378206460503861 601284.20848085323814303, 175986.26378206460503861 599356.38275140791665763, 175384.07960627257125452 597453.64802928722929209, 175066.26018016011221334 595463.0947815302060917, 173728.07312284444924444 593531.08721753070130944, 172289.52203623013338074 591657.62533728883136064, 172088.79397763282759115 590909.07695210294332355, 171469.88246362435165793 590173.0740705793723464, 170181.87742095804424025 588567.24960180046036839, 169525.32939596264623106 587778.97378835058771074, 169048.60025679392856546 586758.60615714732557535, 168442.23424644771148451 584908.14436695305630565, 167363.32093148696003482 583578.3209787457017228, 166844.77344677716610022 582290.31593607936520129, 165038.22091940103564411 579747.76052717969287187, 164653.49214042280800641 578530.84667193330824375, 163131.30436272625229321 576088.6552923321723938, 161458.570541081688134 573730.10060381342191249, 160279.29319682228378952 571793.91120525985024869, 158640.0140516106330324 569569.17522247252054513, 156515.64209812204353511 567699.89517678483389318, 154307.63345355124329217 565659.15991437842603773, 153027.99207999315694906 564780.97465801506768912, 151990.89711057353997603 563426.06026248296257108, 150552.34602395922411233 562322.0559401975478977, 148294.15536473906831816 559946.7739134622970596, 147165.06003512899042107 558261.49458815541584045, 145910.50966889556730166 556839.67083975754212588, 145174.50678737196722068 555790.03036667557898909, 144187.59383260167669505 554853.29942655458580703, 143183.95353961494402029 553414.74833994032815099, 140791.94417466325103305 555790.03036667557898909, 134477.373997955059167 560034.59243909863289446, 131694.36310219427105039 563499.24236717959865928, 129151.80769329459872097 573535.64529704698361456, 127345.25516591848281678 578520.39208554779179394, 125605.61199140815006103 580059.30720146070234478, 144881.7783685841714032 600159.29498579737264663, 152174.89783095443272032 609777.51446025352925062, 162345.119466553296661 626621.94404421420767903, 170574.96986904449295253 644737.65133262472227216, 173385.16268940735608339 650542.03769373125396669, 175726.99003970972262323 658571.16003762511536479, 180945.91956324072089046 674345.03997573326341808, 186800.48793899666634388 696391.67174500843975693, 190681.23040521203074604 715979.38479646609630436, 193558.33257844066247344 732154.72085176897235215, 194695.79157715896144509 742107.48709055408835411, 195097.24769435363123193 745720.59214530629105866)))',
          'POLYGON (((131794.72713149295304902 563323.60531590681057423, 134420.91923147489433177 560078.5017019163351506, 137130.74802253907546401 558238.49449810734950006, 140710.39840085842297412 555767.0302766275126487, 143202.77179510879795998 553358.29357345937751234, 144198.04841898730956018 554729.93530720786657184, 145251.87072662336868234 555800.48495306039694697, 147342.78800367907388136 558355.58586562250275165, 148463.51966418090160005 560028.31968726706691086, 150136.25348582546575926 561784.69019999378360808, 150612.98262499415432103 562282.32851193309761584, 152068.26104982494143769 563436.51484886778052896, 153071.90134281164500862 564737.0653951964341104, 154376.63372369442367926 565657.06899710092693567, 158842.83302748535061255 569654.90283083147369325, 162731.93916280893608928 575434.19818461337126791, 164647.21938859196961857 578390.75521437008865178, 165132.31219686887925491 579812.57896276796236634, 165914.31525848768069409 580268.39892916637472808, 167620.50375656512915157 580502.58166419656481594, 170112.87715081550413743 581305.49389858602080494, 176502.72034949768567458 581037.8564871228300035, 183260.5649889416527003 580636.400369928102009, 194300.60821179571212269 580569.49101706233341247, 194490.95160570516600274 580547.00110940495505929, 197043.8916792927775532 579967.30684127029962838, 199118.08161813201149926 578829.84784255200065672, 203366.82552510919049382 577826.20754956523887813, 207849.75216711658868007 577157.11402090743649751, 209656.30469449271913618 576688.74855084693990648, 211596.67592760038678534 575752.01761072594672441, 216079.60256960778497159 575350.56149353133514524, 219090.52344856798299588 574932.37803812010679394, 222837.44720905181020498 574882.19602347072213888, 225982.18679374357452616 574748.37731773918494582, 233676.76237330850563012 573142.55284896038938314, 235126.46501873357919976 571179.87849823117721826, 235884.77101787913125008 564399.73074116534553468, 237178.35183995089028031 563239.96862482512369752, 237758.23289812100119889 558868.55757092731073499, 237490.59548665792681277 557128.91439641651231796, 235661.73984165984438732 551107.07263849664013833, 235840.16478263525641523 546256.14455572748556733, 235527.92113592827809043 542955.28314768220297992, 239274.8448964120761957 542955.28314768220297992, 242129.64395201884326525 543211.76900033419951797, 243637.7661794314335566 534036.506516222958453, 242999.1216336204088293 532949.75226147251669317, 242201.6980570828600321 532549.27626175130717456, 242039.39060345132020302 531363.72616566007491201, 241783.57994283639709465 530155.24132068606559187, 241144.93539702534326352 529545.70626384159550071, 240661.5414590357686393 527991.43597417429555207, 239634.77039367103134282 525596.51892738288734108, 239377.19552160360035487 524059.00864651461597532, 239991.14110707939835265 524101.34972137497970834, 240411.02343277839827351 523840.24642640253296122, 239433.65028808414353989 522908.74277947371592745, 239116.09222663112450391 522403.29619832767639309, 239094.92168920091353357 521334.18405810254625976, 238600.94248249623342417 520960.17123016901314259, 239687.69673724652966484 519044.23759273585164919, 239306.62706350290682167 517075.37761172722093761, 239659.46935400625807233 515244.12612401490332559, 239878.23157411837019026 513388.17567596730077639, 237817.63259757883497514 512597.80894523981260136, 235841.71577076020184904 508998.81758210598491132, 235390.0776389159145765 505054.04077427857555449, 233498.84296181800891645 501063.39446868578670546, 233682.32095287975971587 499680.25268991268239915, 235686.46516293872264214 500837.57540276367217302, 235493.57804413011763245 502106.63150760711869225, 235945.21617597440490499 502887.5891105878399685, 236613.26424599406891502 504701.19848377502057701, 237234.26667727995663881 505493.91749643918592483, 237921.13300279312534258 506140.79502902866806835, 239134.91048212460009381 506009.0672405741061084, 239915.8680851053504739 505369.24655379471369088, 240461.59749441719031893 504465.97029010613914579, 240226.36930074827978387 503647.37617613840848207, 241440.1467800798418466 502708.81568339944351465, 246822.16785122410510667 504068.43464280554326251, 248431.12869591926573776 503816.74047557980520651, 247857.17190336715430021 502941.69159513153135777, 247904.21754210095969029 501682.04461803461890668, 246751.59939312335336581 500718.7851649604854174, 245180.27505941514391452 500003.69145620701601729, 243743.03079609817359596 499262.72264615003950894, 244326.39671639705193229 498382.96920182835310698, 245568.40157896879827604 498239.48000369034707546, 245055.60411677061347291 497124.49836569977924228, 244476.94276034511858597 495568.46386458002962172, 243465.46152756889932789 493140.90890591708011925, 241992.93303520159679465 492966.84004260209621862, 241047.31569665268762037 491494.31155023473547772, 240219.31245493819005787 490666.30830852023791522, 239786.49257858743658289 488304.61724408459849656, 236615.61652793077519163 486742.70203812309773639, 234061.03834468658897094 479855.22052749781869352, 231548.80123630279558711 478020.44061688048532233, 231595.84687503657187335 476910.1635427632718347, 232169.80366758865420707 474736.65503326279576868, 229676.38481469836551696 473457.01365970401093364, 226783.07803257097839378 473083.00083177047781646, 225926.84740761620923877 471840.99596919870236889, 227394.67133611009921879 469705.123970685119275, 230349.13744859147118405 468632.48340755503159016, 232569.69159682583995163 468218.48178669775370508, 233999.87901433272054419 467089.38645708706462756, 235044.29219422253663652 465583.92601760593242943, 230584.36564226029440761 463513.91791331965941936, 228382.62974951943033375 462911.7337375272763893, 226049.16606832400429994 463363.3718693716218695, 225094.13960202818270773 462907.02917365392204374, 224774.22925863848649897 461486.25088389375014231, 224256.72723256691824645 460340.68958072626264766, 224332.00025454096612521 458837.58142318204045296, 224557.81932046310976148 457689.66783807781757787, 223852.13473945640726015 456617.02727494767168537, 223094.69995584260323085 455944.27464105462422594, 222379.60624708916293457 454429.40507382695795968, 222558.3796742775302846 453356.76451069681206718, 222520.74316329052089714 452606.38657289301045239, 222087.92328693973831832 448870.96285743097541854, 221796.24032679028459825 447505.4631931830663234, 220137.88156142461230047 446262.28218964295228943, 219813.26665416153264232 444908.54393507848726586, 219225.19616998929996043 443347.80487008532509208, 219316.93516552017536014 441562.42288013844517991, 218620.6597122602397576 441361.30277455155737698, 218578.31863739984692074 439838.20022054546279833, 218079.63486682178336196 438555.03042408160399646, 217439.81418004239094444 437329.49153506668517366, 217359.83659419495961629 436628.51151793339522555, 216950.53953721109428443 435411.20561569684650749, 216216.62757296414929442 435017.19839130144100636, 215755.5803133730951231 433997.48417174682253972, 216136.64998711671796627 433348.25435722066322342, 217068.15363404553500004 432917.78676280658692122, 216687.0839603019412607 432150.9428514459868893, 216009.62676253551035188 432075.66982947190990672, 215289.82848990868660621 431228.84833226393675432, 215082.8276794800767675 429648.11487080896040425, 215252.19197892167721875 428519.01954119827132672, 215101.64593497358146124 427314.65118961356347427, 214800.55384707738994621 426491.35251177242025733, 214499.46175918122753501 424929.43730581097770482, 212579.99969884305028245 421692.69736092700622976, 211770.81471262202830985 418399.50264956243336201, 210923.9932154139096383 417308.04383093875367194, 210613.49199977100943215 415548.53694229538086802, 210124.21735693971277215 414325.350335217139218, 209898.39829101756913587 412575.25257432059152052, 209070.39504930307157338 410302.94822347903391346, 208901.03074986147112213 408665.75999554357258603, 208054.20925265343976207 405603.08891397452680394, 207433.20682136755203828 404737.44916127301985398, 207696.66239827673416585 404003.53719702607486397, 207621.38937630268628709 403137.89744432450970635, 206567.56706866604508832 401034.95739292463986203, 205683.1090604710043408 396090.4607620044844225, 205777.20033793855691329 393644.08754784794291481, 205664.29080497747054324 391705.80723201629007235, 205984.201148367166752 390468.50693331786897033, 207113.29647797785582952 389965.11859886645106599, 206417.02102471794933081 389043.024079684400931, 205814.83684892556630075 388026.83828303474001586, 206115.92893682175781578 387161.1985303332330659, 203368.46363476908300072 384489.00625025457702577, 202785.09771447020466439 383962.0950964362709783, 201957.0944727557071019 383698.63951952708885074, 201392.54680795036256313 382832.99976682558190078, 201656.00238485951558687 381948.54175863054115325, 201260.81901949577149935 381101.72026142250979319, 200395.17926679423544556 380819.44642901985207573, 199887.08636846943409182 381308.72107185114873573, 199585.99428057324257679 382569.54418991639977321, 198343.98941800149623305 383397.54743163089733571, 197083.16629993621609174 384131.45939587784232572, 195069.61296213045716286 384808.91659364430233836, 194693.2478522602468729 383830.36730798170901835, 192133.96510514267720282 380518.3543411236605607, 191305.96186342817964032 379088.16692361677996814, 190402.68559973972151056 378787.07483572058845311, 188897.22516025876393542 381722.72269270842662081, 188144.49494051831425168 384131.45939587790053338, 186940.12658893357729539 389626.3899999832501635, 187993.94889657021849416 391508.21554933441802859, 188219.76796249236213043 395196.5936260626767762, 186112.12334721907973289 399637.70192253141431138, 185284.1201055045821704 407616.64225178031483665, 183025.92944628317491151 413638.48400970397051424, 162387.00773377440054901 475988.06902358104707673, 156346.34772035718197003 480161.01717926724813879, 155857.07307752588531002 482080.47923960542539135, 156289.892953876638785 483689.4400843006442301, 156543.93940303905401379 484844.41051521489862353, 156774.46303283458109945 486008.79007387603633106, 157221.3966008054849226 488476.33382546273060143, 155810.02743879210902378 490348.75024706713156775, 153401.29073562260600738 492992.7151439055451192, 153344.83596914209192619 496281.20529139670543373, 153533.01852407719707116 499541.46805564756505191, 153071.97126448617200367 502528.86611524253385141, 152545.06011066783685237 505424.52517930662725121, 151580.6245166253647767 509392.8248065008665435, 150268.05119595295400359 512521.35978229716420174, 145972.78437955892877653 522019.87424264708533883, 143413.50163244135910645 527966.44297859678044915, 141522.26695534342434257 533668.37439313088543713, 140637.80894714838359505 535761.90531678404659033, 139696.8961724727996625 537878.95905980409588665, 139014.73441083301440813 540170.08166613907087594, 138073.82163615743047558 543037.51334696286357939, 134427.78463428953546099 554370.80771793029271066, 133505.69011510748532601 557127.68214772967621684, 133223.41628270479850471 558000.37874624133110046, 133101.09762199697433971 558470.83513357909396291, 131794.72713149295304902 563323.60531590681057423)))',
          'POLYGON (((195164.15704721931251697 746486.91332734643947333, 198241.98727904530824162 747590.9176496317377314, 200951.81607010948937386 745449.81835792679339647, 201788.18298093174234964 744245.45000634272582829, 202658.00456818690872751 742137.80539107054937631, 204807.46752900019055232 739559.70438846095930785, 205317.65134460176341236 738407.60896880330983549, 205418.01537390044541098 737245.05896276026032865, 205944.92652771848952398 735965.41758920217398554, 207182.74955573544139042 734303.13835394289344549, 208228.20819426327943802 731996.85659735056106001, 209047.84776686911936849 728505.02474466746207327, 210034.76072163940989412 727639.38499196653719991, 210703.85425029724137858 726936.83678687585052103, 212343.13339550889213569 724427.73605440894607455, 214634.77873116193222813 722922.27561492891982198, 215972.96578847759519704 722403.72813021903857589, 216926.42406681497232057 721634.27057226258330047, 218824.97695438156370074 719530.80779154459014535, 220447.52876137677230872 717243.34429044555872679, 221200.25898111681453884 715432.60992851539049298, 222220.62661231998936273 713977.33150368463248014, 223207.53956709027988836 712990.41854891437105834, 226695.18958521916647442 711443.13976389309391379, 227732.28455463878344744 710807.50091166817583144, 229087.19895017088856548 709753.67860403214581311, 229655.92844953003805131 708984.22104607569053769, 230458.84068391940672882 708582.76492888096254319, 231654.84536639528232627 708770.94748381595127285, 232725.39501224778359756 709339.67698317510075867, 234699.22092178836464882 710326.58993794536218047, 236405.4094198658131063 711714.95900991035159677, 236974.13891922496259212 712166.59714175434783101, 237559.59575680055422708 712450.96189143392257392, 238596.69072622017120011 712082.96045067219529301, 239901.42310710292076692 711932.41440672415774316, 240470.15260646204114892 710794.95540800597518682, 241306.51951728429412469 709958.58849718375131488, 243941.07528637448558584 708076.76294783363118768, 246157.44760005350690335 706429.12013351370114833, 246182.53860737819923088 705224.75178192951716483, 245755.99148285883711651 704221.11148894287180156, 245914.9011959150666371 702851.56067247129976749, 246416.72134240841842256 701747.55635018588509411, 247629.45336310073616914 700254.64141436805948615, 249452.73322869330877438 699058.63673189224209636, 249929.46236786199733615 698565.18025450711138546, 249929.46236786199733615 697973.45066510036122054, 249653.4612872906436678 696769.08231351629365236, 249277.09617742060800083 694673.98320190643426031, 249034.54977328216773458 691631.69856379041448236, 248842.18538379302481189 689149.77975592529401183, 249369.09653761106892489 687362.04548404272645712, 249845.82567677975748666 685407.03782999562099576, 250498.19186722114682198 682718.11821170197799802, 251250.92208696118905209 679928.8345641097985208, 251434.92280734208179638 679485.56010137393604964, 251342.92244715164997615 678059.55451842199545354, 250899.64798441581660882 676662.82177734875585884, 250280.73647040734067559 675266.08903627551626414, 248875.64006022593821399 673432.35458429786376655, 247319.99760609649820253 672328.35026201233267784, 247520.72566469386219978 670199.79647396982181817, 247587.63501755963079631 668961.97344595286995173, 247353.45228252941160463 667724.15041793580166996, 244677.07816789811477065 663007.04104089818429202, 244844.35155006259446964 661677.21765269071329385, 244861.07888827903661877 660238.66656607645563781, 244677.07816789811477065 658783.38814124569762498, 244309.07672713632928208 657461.92842214647680521, 243823.98391885941964574 655977.37715543690137565, 243924.34794815807254054 654187.55196627730038017, 244099.98499943071510643 652355.90843157656490803, 240344.69756983869592659 653376.27606277971062809, 234373.03782656765542924 654037.00592232937924564, 229936.11136465545860119 654865.00916404335293919, 225499.18490274329087697 655266.46528123808093369, 221718.80646582660847344 655849.83120153658092022, 220079.52732061492861249 656284.74199516419321299, 217516.0627389446599409 657202.65467979165259749, 216725.69600821760832332 657275.83678448863793164, 215763.87406077198102139 657677.29290168324951082, 214191.5042684260988608 658639.11484912887681276, 213183.68214088527020067 659138.84407834522426128, 212213.49652433142182417 659707.57357770437374711, 210406.9439969553204719 660744.66854712401982397, 208240.75369792562560178 661622.85380348737817258, 207575.84200382191920653 661921.85497410630341619, 206580.56537994340760633 662197.85605467774439603, 204615.10313951104762964 662900.40425976843107492, 201909.4561830009915866 663912.40822186332661659, 200562.90545657710754313 664322.22800816630478948, 198338.16947378983604722 664453.95579662080854177, 196431.25291711505269632 664713.22953897574916482, 194164.69858878667582758 664738.32054630038328469, 193311.60433974798070267 677451.09759079897776246, 193884.51567366131348535 679267.05924592225346714, 194888.15596664804616012 681374.70386119442991912, 198262.89645181590458378 686383.49619838094804436, 200537.81444925250252709 691033.69622255279682577, 201742.18280083657009527 694805.71099036128725857, 202344.36697662860387936 699188.27360307006165385, 202244.00294732995098457 702123.92146005621179938, 201474.54538937343750149 704766.84089825465343893, 199969.08494989335304126 706297.39234505943022668, 199400.35545053420355543 708070.49019600264728069, 198329.80580468170228414 709032.31214344827458262, 197493.43889385942020454 710337.0445243309950456, 196473.07126265624538064 710955.95603833941277117, 195820.70507221485604532 711775.59561094525270164, 194867.24679387747892179 712959.05478975875303149, 193930.51585375651484355 714644.33411506563425064, 194081.06189770455239341 721622.77052723907399923, 194206.51693432789761573 723184.68573319970164448, 194515.97269133216468617 729920.57574123470112681, 194883.97413209395017475 733868.22756031586322933, 195745.43205024089547805 737817.9702966739423573, 196573.4352919549564831 741067.25574521848466247, 196623.61730660428293049 741803.25862674205563962, 196648.70831392894615419 743199.99136781529523432, 196289.07054227538174018 744205.72257807920686901, 195619.97701361755025573 745276.27222393162082881, 195218.52089642285136506 745978.82042902242392302, 195164.15704721931251697 746486.91332734643947333)))',
          'POLYGON (((209064.57510508556151763 776729.94082267896737903, 213447.13771779430680908 776947.39621949277352542, 213112.59095346540561877 773401.2005176063394174, 212978.77224773383932188 769788.09546285413671285, 214049.321893586369697 768115.36164120957255363, 214450.77801078103948385 766977.90264249127358198, 214316.95930504947318695 763364.79758773895446211, 213915.50318785477429628 761692.0637660943903029, 214316.95930504947318695 758814.96159286587499082, 213982.41254072057199664 756941.49971262388862669, 213982.41254072057199664 755536.40330244251526892, 214651.5060693784034811 750468.01982285955455154, 213580.95642352587310597 746788.00541524146683514, 211908.22260188130894676 744646.9061235364060849, 208863.84704648822662421 742204.71474393538665026, 206488.56501975294668227 740665.79962802235968411, 204983.10458027286222205 739896.34207006590440869, 204213.6470223163778428 740364.70754012640099972, 202641.27722997049568221 742405.44280253269243985, 201202.72614335617981851 745617.09174009028356522, 202808.55061213494627737 746445.09498180425725877, 205351.10602103467681445 749322.19715503288898617, 206187.47293185692979023 751521.84213049546815455, 206488.56501975294668227 753094.21192284137941897, 206020.19954969247919507 760337.14937056216876954, 206672.56574013386853039 764669.52996862155850977, 207592.56934203836135566 769077.18358865508344024, 208495.8456057264120318 772481.19691570173017681, 208663.11898789089173079 776127.75664688693359494, 209064.57510508556151763 776729.94082267896737903)))',
          'POLYGON (((112357.56012398321763612 571620.36507126374635845, 117208.48820675241586287 574096.01112729765009135, 125696.11408530024345964 579908.74861058336682618, 127327.02956140457536094 578531.87958364142104983, 128380.85186904121655971 575721.68676327704451978, 129296.67363639212271664 572804.85716178268194199, 130413.2234623404656304 568918.88740237255115062, 131467.04576997712138109 564430.7334671700373292, 132520.86807761376257986 560786.26465325988829136, 133148.14326073080883361 558076.43586219428107142, 134151.78355371809448116 555059.24223140126559883, 135650.9712413678644225 550335.86010252987034619, 136340.97394279661239125 548040.03293232142459601, 138348.25452877118368633 542077.78231679380405694, 139602.80489500527619384 538053.81201709795277566, 140311.62585192755796015 536378.9872781754238531, 141114.53808631736319512 534547.34374347364064306, 141515.99420351229491644 533694.24949443445075303, 141679.08575112270773388 533007.38316892122384161, 142394.17945987614803016 530548.46445110242348164, 143278.63746807118877769 528058.18197412777226418, 144533.18783430531038903 525122.53411713999230415, 145812.82920786409522407 521992.4309533858904615, 148089.83812257900717668 516967.95673661824548617, 149946.57266460548271425 513157.25999918213346973, 151571.21538887862698175 509101.92594033037312329, 152524.67366721655707806 505350.82034529041266069, 153478.13194555448717438 499551.66127737326314673, 153277.4038869570067618 496619.14979630103334785, 153377.76791625574696809 492949.5899750663083978, 155497.95803519137552939 490653.76280485792085528, 157179.05552594509208575 488439.48140845471061766, 156589.41685381505521946 485265.46898188244085759, 156213.05174394481582567 483446.37095084297470748, 155824.14113041225937195 482110.27481080364668742, 156300.87026958120986819 480143.76711173169314861, 162354.07578666074550711 475915.93237752298591658, 168852.6466837534098886 455861.94477327080676332, 172064.29562131268903613 446063.90641298249829561, 172716.66181175445672125 443931.17079038452357054, 174234.66775489770225249 440324.33848746144212782, 175288.49006253434345126 436836.68846933066379279, 176944.49654596336768009 431655.39545678382273763, 177697.22676570381736383 429296.84076826367527246, 178274.31993417150806636 426938.28607974358601496, 179641.77983336665784009 422961.36141878145281225, 180695.60214100332814269 419674.43945924809668213, 181849.78847793868044391 416563.15455098752863705, 182753.064741627254989 413489.50615371385356411, 183706.52301996515598148 410930.22340659628389403, 184961.07338619927759282 408051.03031608904711902, 185814.16763523846748285 399908.99843922979198396, 186867.98994287510868162 397399.89770676154876128, 187946.90325783644220792 394991.16100359207484871, 187796.3572138883464504 391654.05702940939227119, 186667.26188427765737288 390004.3232978114974685, 187445.08311134279938415 386893.03838955092942342, 187846.53922853770200163 384057.75456186186056584, 188448.72340433008503169 382175.92901251069270074, 189552.72772661608178169 380526.19528091291431338, 190305.45794635653146543 378217.82260704215150326, 186642.17087695296504535 377314.54634335363516584, 184584.70827632903819904 372459.43642602761974558, 175602.12765409285202622 359274.11207690718583763, 168953.01071305212099105 339301.67024646030040458, 168651.91862515592947602 323155.60703302739420906, 164938.44954110297840089 311776.83521128405118361, 163432.98910162204992957 298190.05474496871465817, 160422.06822266022209078 288818.56350919994292781, 154048.95236219096113928 276034.695277274469845, 152643.85595200877287425 267403.38875758380163461, 145768.91994504586909898 257580.25938997080083936, 141302.72064125243923627 248798.40682633209507912, 141403.08467055117944255 239163.46001365417032503, 145417.64584250032203272 230833.2455818597227335, 143912.18540301933535375 224225.94698636009707116, 144313.64152021426707506 214992.45629087710403837, 142640.90769856877159327 209572.79870874577318318, 140098.35228966767317615 208318.24834251168067567, 137221.25011643744073808 203634.59364190435735509, 133474.32635595160536468 203032.40946611197432503, 132002.32059290359029546 196742.93029672501143068, 128322.30618528355262242 196006.92741520100389607, 126515.753657906447188 191189.45400886205607094, 125579.02271778497379273 186589.43599933700170368, 126047.38818784570321441 183110.14965031441533938, 124943.38386555967736058 182758.87554776889737695, 119122.2701662334438879 189449.81083435076288879, 111762.24135099336854182 191055.63530313043156639, 110691.691705140270642 190319.63242160639492795, 108952.04853062897745986 190453.45112733804853633, 102394.93194977872190066 195940.01806233520619571, 99584.73912941434537061 200623.67276294250041246, 95837.81536892848089337 201761.13176166143966839, 92358.52901990590908099 206712.4238737320411019, 88879.24267088333726861 205708.78358074475545436, 87340.3275549694953952 208251.33898964585387148, 81385.39514991162286606 212198.99080872916965745, 79712.66132826614193618 214942.27427622774848714, 78274.11024165104026906 215109.54765839225728996, 77337.3793015295668738 216079.73327494662953541, 77805.74477159031084739 217785.92177302500931546, 77387.56131617893697694 218923.38077174394857138, 74677.73252511327154934 220629.56926982232835144, 72536.63323340707574971 221399.02682777924928814, 73071.90805633363197558 222469.57647363233263604, 71900.99438118179386947 223473.21676661961828358, 70362.07926526796654798 227320.50455640419386327, 69258.07494298195524607 227947.77973952126922086, 68588.98141432375996374 232054.34127166090183891, 64975.87635956954909489 233024.52688821527408436, 64206.41880161262815818 239113.27799900478566997, 62349.68425958615989657 239004.55030059782438911, 60375.85835004450927954 245018.02838941328809597, 52848.5561526398814749 249935.86582505097612739, 45639.07338134790916229 255046.06765017789439298, 42862.33523741642420646 258893.35543996246997267, 40018.68774061912699835 262029.73135554773034528, 39717.59565272294275928 264714.46913928870344535, 36589.58340624591801316 265969.01950552279595286, 29831.73876679821478319 273989.77818031283095479, 29296.46394387166219531 278731.978564677760005, 25683.3588891174440505 278338.88611659104935825, 25950.99630058072216343 283281.81455955345882103, 22672.43801015559802181 288458.92573754617478698, 26586.63515280598949175 298963.69413747964426875, 20832.43080634556827135 309803.00930174230597913, 22572.0739808568614535 316226.30717686092248186, 21501.52433500376355369 318869.22661506081931293, 21367.70562927212449722 325827.79931310593383387, 12134.21493378911691252 332384.91589395620394498, 9324.02211342472583055 338005.30153468495700508, 3569.81776696431188611 343625.68717541376827285, 960.35300519737938885 347874.43108239327557385, -2117.47722663028980605 348944.98072824638802558, -6934.9506329692521831 352424.26707726897438988, -6399.67581004269595724 356037.37213202321436256, -11083.33051065001927782 360051.93330397235695273, -12555.33627369803434703 365404.68153323786100373, -11752.42403930820000824 368214.87435360223753378, -12689.15497942965885159 370757.42976250336505473, -18309.54062015844101552 375039.62834591575665399, -21387.37085198611021042 381462.92622103437315673, -22591.7392035708471667 389625.86727066425373778, -24866.65720100869657472 398390.99249608651734889, -23662.28884942395961843 407223.02707437460776418, -53102.40411038423917489 474600.74541025410871953, -59994.06745556356327143 505981.23190432315459475, -58254.42428105227736523 537679.53782450477592647, -58789.69910397882631514 557986.52641928079538047, -52567.12928745767567307 567153.10776189796160907, -24063.74496661885495996 553436.6904244051547721, 28560.4610623476546607 554105.78395306330639869, 86018.8678358695760835 562285.45234090962912887, 112357.56012398321763612 571620.36507126374635845)))',
          'POLYGON (((255178.71019190730294213 794449.94201640144456178, 255099.25533537918818183 794211.57744681718759239, 254944.52745687711285427 793672.12078933685552329, 254869.25443490309407935 793513.21107628068421036, 254781.43590926678734832 793442.11988886073231697, 254701.98105273867258802 793274.84650669631082565, 254622.52619621055782773 793199.57348472240846604, 254547.25317423656815663 793187.02798105997499079, 254551.43500879069324583 793061.57294443668797612, 254480.3438213707995601 792973.75441880035214126, 254007.79651675629429519 792589.02563982212450355, 254007.79651675629429519 792041.2053132337750867, 253940.88716389052569866 791196.47473330341745168, 253840.52313459187280387 790744.83660145942121744, 253777.79561628025840037 788868.23834530229214579, 253698.34075975214364007 788253.50866584794130176, 253543.61288125003920868 787548.86954348022118211, 253464.15802472195355222 787247.77745558426249772, 253309.43014621984912083 786854.68500749790109694, 253221.61162058351328596 786695.77529444161336869, 253066.8837420814379584 786503.41090495279058814, 252991.61072010747739114 785759.04435432108584791, 252774.15532329370034859 784905.95010528259444982, 252958.15604367450578138 783589.71767937613185495, 253786.15928538842126727 781500.89131959795486182, 253777.79561628022929654 780455.43268107017502189, 253702.52259430621052161 779721.52071682375390083, 253217.42978602935909294 776221.32519503298681229, 253351.248491760896286 773227.1316542896674946, 253652.34057965688407421 772541.31078741559758782, 254313.07043920637806877 770550.75753965880721807, 256245.0780032055627089 769187.47947501868475229, 254639.25353442702908069 767280.56291834416333586, 253133.79309494711924344 764972.19024447503034025, 253066.88374208135064691 760723.44633749837521464, 252933.06503634984255768 758632.52906044304836541, 251494.51394973567221314 755347.69801818893756717, 249462.14235643786378205 753819.23748866154346615, 247371.2250793824205175 752550.05070148897357285, 246467.94881569442804903 752980.77966056228615344, 245631.58190487226238474 753792.05556405975949019, 244870.48801602408639155 754745.5138423970201984, 244519.21391347880125977 755264.06132710678502917, 244310.12218577324529178 755763.79055632301606238, 243992.30275966084445827 757520.16106904949992895, 243758.12002463062526658 758507.07402381976135075, 243758.12002463062526658 759623.62384976726025343, 243565.75563514154055156 759759.53347277594730258, 243482.1189440593298059 759926.8068549403687939, 243385.93674931477289647 760175.62601090990938246, 243252.11804358323570341 760158.89867269352544099, 242649.93386779126012698 760468.35442969773430377, 242449.20580919395433739 760535.2637825635029003, 242407.38746365284896456 760643.99148097028955817, 242123.02271397330332547 760643.99148097028955817, 241357.74699057103134692 760202.80793551169335842, 241307.56497592170489952 760010.44354602252133191, 241065.01857178326463327 759884.98850939923431724, 240964.65454248461173847 759784.62448010058142245, 240738.83547656264272518 759751.16980366769712418, 240738.83547656264272518 759617.35109793615993112, 239902.4685657404770609 759617.35109793615993112, 239601.37647784448927268 759859.89750207460019737, 239559.55813230338389985 760261.35361926921177655, 239233.37503708273288794 760487.17268519115168601, 239007.55597116076387465 760537.35469984053634107, 238898.82827275388990529 760629.35506003093905747, 238246.46208231258788146 760646.08239824743941426, 238121.00704568927176297 760512.2636925159022212, 237527.18653900554636493 760169.35325907880906016, 237184.27610556845320389 760085.71656799654010683, 236966.82070875467616133 760244.62628105271141976, 236791.18365748203359544 760462.08167786651756614, 236080.27178328318404965 760487.17268519115168601, 235795.90703360372572206 760077.35289888840634376, 235478.08760749129578471 760160.98958997067529708, 234407.53796163894003257 760980.62916257628239691, 234357.35594698961358517 761499.17664728604722768, 233596.26205814143759198 761816.99607339850626886, 232609.34910337129258551 761382.08527977101039141, 231923.52823649710626341 761131.17520652431994677, 231421.70809000381268561 760830.08311862836126238, 230543.52283364051254466 760411.89966321724932641, 227064.23648462031269446 760445.35433965013362467, 226160.96022093237843364 759424.98670844710431993, 225324.59331011024187319 758722.43850335653405637, 224488.2263992880762089 758521.71044475922826678, 223534.76812095081550069 758471.52843010984361172, 222966.03862159172422253 758872.9845473044551909, 221142.75875599941355176 759073.71260590176098049, 220590.75659485679352656 758538.43778297561220825, 219804.57169868395430967 758638.80181227426510304, 216224.92132036513066851 759073.71260590187739581, 214568.9148369372705929 757463.70630256936419755, 214368.18677833993569948 761076.81135732121765614, 214401.64145477281999774 761996.81495922559406608, 214502.00548407147289254 762598.99913501751143485, 214669.27886623592348769 765024.46317640179768205, 214769.64289553457638249 767567.01858530112076551, 213398.00116178626194596 769975.75528846890665591, 213147.09108853960060515 771564.85241903108544648, 213163.81842675604275428 772246.49145135108847171, 213314.36447070402209647 772748.31159784446936101, 213498.36519108491484076 773158.13138414733111858, 213615.45655860000988469 775458.14038890821393579, 213548.54720573432859965 776817.23661899426952004, 214167.45871974271722138 776917.60064829292241484, 222230.03574006835697219 777235.42007440538145602, 223685.31416489891125821 777252.14741262188181281, 223760.58718687284272164 777168.51072153949644417, 224220.58898782503092661 777135.0560451066121459, 224923.13719291563029401 776909.23697918467223644, 226319.86993398863705806 776608.14489128859713674, 227858.78504990148940124 776198.3251049859682098, 228293.69584352901438251 776064.50639925443101674, 228661.69728429077076726 775700.68679304677061737, 229330.79081294851494022 775550.14074909884948283, 229682.064915493800072 775115.22995547123719007, 231455.16276643678429537 773291.95008987898472697, 232375.16636834116070531 773174.85872236383147538, 233311.89730846197926439 773342.1321045282529667, 235352.63257086806697771 773459.22347204340621829, 239116.28366956778336316 774446.13642681355122477, 240086.46928612148622051 775031.59326438908465207, 245857.40097079437691718 777624.33068793767597526, 246033.03802206704858691 779690.15695766836870462, 247220.67903543449938297 780557.88762764644343406, 247362.86141027428675443 780658.25165694509632885, 247689.04450549490866251 780649.88798783684615046, 247755.95385836070636287 780942.61640662455465645, 247889.77256409224355593 781318.98151649453211576, 248617.41177650750614703 785910.63585690828040242, 248834.86717332137050107 787299.00492887303698808, 249152.68659943377133459 788532.64612233568914235, 249353.41465803110622801 789134.83029812772292644, 250173.0542306367715355 790289.01663506228942424, 250574.51034783147042617 791376.29361913108732551, 251176.69452362335869111 792618.29848170198965818, 251912.69740514684235677 794608.85172945878002793, 252247.24416947571444325 795495.40065493027213961, 252832.70100705118966289 796281.58555110322777182, 253602.15856500755762681 796064.13015428953804076, 254388.3434611803968437 795445.21864028112031519, 255074.16432805458316579 794943.3984937877394259, 255174.52835735320695676 794742.67043518926948309, 255178.71019190730294213 794449.94201640144456178)))'],
        names: ['Lower Galilee', 'Judah', 'Jordan valley', 'Jezreel valley', 'Hulah valley', 'Golan polygon', 'Coastal plain', 'All negev', 'Samaria', 'northern coastal plain', 'Sinai2', 'Upper galilee'],
        geometryType: govmap.drawType.Polygon,
        defaultSymbol:
        {
          outlineColor: [0, 80, 255, 1],
          outlineWidth: 1,
          fillColor: [138, 43, 226, 0.5]
        },
        symbols: [],
        clearExisting: false,
        data: {
          tooltips: ['Lower Galilee', 'Judah', 'Jordan valley', 'Jezreel valley', 'Hulah valley', 'Golan polygon', 'Coastal plain', 'All negev', 'Samaria', 'northern coastal plain', 'Sinai2', 'Upper galilee'],
          headers: ['Lower Galilee', 'Judah', 'Jordan valley', 'Jezreel valley', 'Hulah valley', 'Golan polygon', 'Coastal plain', 'All negev', 'Samaria', 'northern coastal plain', 'Sinai2', 'Upper galilee'],
          bubbleHTML: bubbleContent,
        }
      };
      govmap.displayGeometries(data).then(function (response) {
        console.log(response.data);
      });
    }

    else if (!this.Regions) {
      this.Regions = true;
      $("#Reg").css("color", "#797b81");
      govmap.clearGeometriesByName(['Lower Galilee', 'Judah', 'Jordan valley', 'Jezreel valley', 'Hulah valley', 'Golan polygon', 'Coastal plain', 'All negev', 'Samaria', 'northern coastal plain', 'Sinai2', 'Upper galilee']);
    }

  }*/

  openRegions(){
    this.reg.showRegions();
  }

  //Remeber last location

  mapZoom(zoom: number){
    sessionStorage.setItem('Zoom', JSON.stringify(zoom));
  }

  mapLocation(x: number, y:number){
    sessionStorage.setItem('locationX', JSON.stringify(x));
    sessionStorage.setItem('locationY', JSON.stringify(y));
  }

  changeLocation(e: any) {
    if(!this.changeSiteLocation){
      this._snackBar.open("נא לבצע הזזות באתר יחיד בלבד ולאחר מכן לעבור להבא","OK", {horizontalPosition:'center', verticalPosition:'top', panelClass:'snackLengthMove'});
      //govmap.setMapCursor(govmap.cursorType.TARGET);
      this.changeSiteLocation = true;
      govmap.unbindEvent(govmap.events.CLICK);
      $("#Loc").css("color", "#0bb500");
    }

    else if(this.changeSiteLocation){
      //govmap.setMapCursor(govmap.cursorType.DEFAULT);
      govmap.unbindEvent(govmap.events.CLICK);
      this.changeSiteLocation = false;
      govmap.clearGeometriesByName(['selected']);
      $("#Loc").css("color", "#797b81");
    }
  }

  undoMove(){
    this.disableUndo = true;
    //govmap.clearGeometriesByName(['selected']);
    sessionStorage.setItem('LocX', sessionStorage.getItem('e.pointX'));
    sessionStorage.setItem('LocY', sessionStorage.getItem('e.pointY'));
    //govmap.onEvent(govmap.events.CLICK).progress((n) =>{ 
    //  govmap.unbindEvent(govmap.events.CLICK);
      //sessionStorage.setItem('LocX', sessionStorage.getItem('e.pointX'));
      //sessionStorage.setItem('LocY', sessionStorage.getItem('e.pointY'));
    //});
    govmap.unbindEvent(govmap.events.CLICK);
    govmap.clearGeometriesByName(["e.moved" + this.moveSite]);
    govmap.clearGeometriesByName(["moved" + this.moveSite]);
    this.moveBack++;
    var data = {
      'wkts': ['POINT(' + parseInt(sessionStorage.getItem('e.pointX')) + " " + parseInt(sessionStorage.getItem('e.pointY')) + ')'],
      'geomData': { a: false },
      'showBubble': false,
      'names': ['selected' + this.moveBack],
      'geometryType': govmap.drawType.Point,
      'defaultSymbol':
      {
        outlineColor: [40, 41, 82, 1],
        outlineWidth: 1,
        fillColor: [40, 41, 82, 1]
      },
      'symbols': [],
      'clearExisting': false,
      'data': {
        'headers': [''],
        'bubbles': [''],
        'tooltips': [sessionStorage.getItem('e.resourceID') + ", " + sessionStorage.getItem('e.name')]
      }
    }

    var res_list = [];
    govmap.displayGeometries(data).progress((res) => {
      console.log(res);
      res_list.push(res);
      this.searchService.hide();
      setTimeout(() => {
        if (res_list[0]) {
          this.ngZone.run(() => {
            this.openInformation(res.data.geomData, res.data.x, res.data.y);
          });
          res_list = [];
        }
      }, 10);
    })
    this.updateLocation(sessionStorage.getItem('e.resourceID'), sessionStorage.getItem('e.pointX'), sessionStorage.getItem('e.pointY'));
    this.removeLog();
  }

/*createLog(){
  this.http.post('http://localhost:8080/api/Sites/LogSite?log=', JSON.stringify(this.finalLog), this.httpOptions).subscribe(data => {})
}*/

createLog(){
  this.http.post('https://jkc.biu.ac.il/Devwebapi/api/' + 'Sites/LogSite?data=', {'siteName': this.theSite , 'theSource': '(' + this.theLocation + ')' , 'theDestination' : '(' + this.logX.toString() + " " +  this.logY.toString() + ')'}, this.httpOptions).subscribe(data => {})
}


removeLog(){
  this.http.post('https://jkc.biu.ac.il/Devwebapi/api/' + 'Sites/RemoveSite?columns=', this.relocations, this.httpOptions).subscribe(data => {})
}

updateLocation(ID, x, y){
  this.http.post('https://jkc.biu.ac.il/Devwebapi/api/' + 'Sites/UpdateLocation?data=', {'ID': ID , 'x': + x , 'y' : + y}, this.httpOptions).subscribe(data => {})
}

}




//change envi
//DEL DEX
//change to dev link
