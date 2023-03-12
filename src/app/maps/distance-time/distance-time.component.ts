declare const govmap: any;
declare const proj4: any;
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild, OnDestroy, OnChanges, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SitesService } from 'src/app/Services/sites.service';
import { ComputeService } from '../compute.service';
import { ScrollToBottomDirective } from '../scroolToBottom.directive';
import { ChartType, ChartOptions, ChartXAxe, ChartYAxe, Tooltip } from "chart.js";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThrowStmt } from '@angular/compiler';
import { TutorialsComponent } from 'src/app/tutorials/tutorials.component';
import { MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-distance-time',
  templateUrl: './distance-time.component.html',
  styleUrls: ['./distance-time.component.css']
})
export class DistanceTimeComponent implements OnInit, OnDestroy {
  newWay: boolean;
  isLoadingWalkindPath: boolean;
  calcWalkingPath: boolean;
  isChart: boolean;
  chartData: any;
  selection: any;
  incorrectWay: any;
  incorrectData: any;
  wktAPI: any;
  w: any;
  meterWay: any;
  durationWay: any;
  chartLabels: any[] = [];
  length_metres: number;
  wkt: any;
  isOpen = false;
  

  @ViewChild(ScrollToBottomDirective, { static: false }) scroll: ScrollToBottomDirective;
  lineChartType: ChartType = "line";
  xLabel: any;
  yLabel: any;
  distanceFrom: any;
  heightSea: any;
  meter: any;
  lineChartOptions: ChartOptions = {
    plugins: {
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          type: 'linear',
          // position:'bottom'
        }
      ],
      yAxes: [{
        type: 'linear',
        // position:'bottom'
      }]
    },
    tooltips: {
      bodyAlign: 'center',
      custom: (tooltip) => {
        if (!tooltip) return;
        tooltip.displayColors = false
      },
      // textDirection: 'ltr',
      callbacks: {
        title: (tooltipItems, data) => {
          return '';
        },
        label: (tooltipItem, data) => {
          const datasetLabel = '';
          this.xLabel = <number>tooltipItem.xLabel;
          this.yLabel = <number>tooltipItem.yLabel;
          this.translate.get('walkingPath.distanceFrom').subscribe(value => this.distanceFrom = value)
          this.translate.get('walkingPath.heightSea').subscribe(value => this.heightSea = value);
          this.translate.get('walkingPath.meter').subscribe(value => this.meter = value);
          return this.distanceFrom + ": " + this.xLabel.toFixed(0) + ' ' + this.meter;
        },
        afterBody: (data) => {
          var multistringText = [this.heightSea + ': ' + this.yLabel.toFixed(0) + ' ' + this.meter];
          return multistringText;
        },
      }
    }
  };
  public chartColors: Array<any> = [
    { // all colors in order
      borderColor: '#000000',
      pointRadius: 0.0,
    }
  ]
  lineChartLegend = false;
  browserLang: string;
  he: boolean;
  //Set focus on first element in walkingPath:
  @ViewChild('input', { static: false })
  set input(element: ElementRef<HTMLInputElement>) {
    if (element && this.computes.xySelectionRel[0] == null) {
      // element.nativeElement.focus();
      element.nativeElement.click();
    }
  }

  constructor(private dialog: MatDialog, private ngZone: NgZone, private translate: TranslateService, public computes: ComputeService,
    private siteservice: SitesService, private http: HttpClient, private _snackBar: MatSnackBar) {
    this.browserLang = translate.getDefaultLang();
    if (this.browserLang === 'he') {
      this.he = true;
    }
    else {
      this.he = false;
    }
  }

  ngOnInit() {
    this.isOpen = true;
    this.computes.heightCalcDis = 400;
    this.newWay = false;
    this.isLoadingWalkindPath = false;
    this.calcWalkingPath = false;
    this.isChart = false;
    this.computes.timeFunc = 0;
    this.chartData = undefined;
    govmap.clearMapMarker();
    govmap.unbindEvent(govmap.events.CLICK);
    govmap.setMapCursor(govmap.cursorType.DEFAULT);
    this.computes.xySelectionRel.length = 2; this.computes.xySelectionRel[0] = null; this.computes.xySelectionRel[1] = null;
  }

  //Draw a point by xySelection:
  DrawPointInWay(x: number, y: number, index: number) {
    this.computes.iWay = index;
    this.computes.arrayNamePoint = 'wayPoint' + this.computes.iWay;
    var data = {
      'wkts': ['POINT(' + x + ' ' + y + ')'],
      'geomData': { a: false },
      'showBubble': false,
      'names': [this.computes.arrayNamePoint],
      'geometryType': 0,
      'defaultSymbol':
      {
        outlineColor: [132, 132, 130, 1],
        outlineWidth: 1,
        fillColor: [242, 243, 244, 1]
      },
      'symbols': [{
        url: 'http://jkc.biu.ac.il/assets/picture/outline_room_black_24dp.png',
        width: 30,
        height: 30
      }],
      'clearExisting': false,
      'data': {
        'headers': ['header1'],
        'bubbles': [''],
      }
    };

    console.log("addPointInWay")
    var res_list = [];
    //if(this.isOpen){
      govmap.displayGeometries(data).progress((res) => {
        console.log("DrawPointInWay")
        //debugger;
        console.log(res);
        res_list.push(res);
        setTimeout(() => {
          if (res_list[0]) {
            this.ngZone.run(() => {
              this.computes.openInformation(res.data.geomData, res.data.x, res.data.y);
            })
            res_list = [];
          }
        }, 10);
      })
  //}
  }
  //Add point to polyline:
  addPoint() {
    this.computes.xySelection.length += 1;
    this.computes.xySelectionOSRM.length += 1;
    this.computes.xySelectionRel.length += 1;
    this.computes.xySelectionRel
    console.log(this.computes.xySelectionRel);
    console.log(this.computes.xySelectionRel.length);
    console.log(this.computes.xySelectionRel[length - 1]);
    //this.computes.xySelectionRel[length + 1] = null; (?)
    // this.moveToNext(this.event, this.indexNext + 1);
    let next = this.computes.event.srcElement.nextElementSibling;
    if (next == null)  // check the maxLength from here
      return;
    else {
      next.focus();   // focus if not null
      //console.log("call to dis");
      //debugger;
      this.computes.xyDis(this.computes.event, this.computes.indexNext); //call to xyDis()
    }
  }
  //Remove specific point from the way:
  removeXY(index) {
    govmap.clearGeometriesByName(['wayPoint' + index]);
    this.computes.xySelectionRel.splice(index, 1)
    if (this.selection != undefined)
      this.howCalc()
  }
  //Recalculate way:
  recalculateWalkingPath() {
    this.computes.clearGeom();
    this.computes.timeFunc = 0;
    this.computes.xySelectionRel = [];
    this.computes.xySelection = [];
    this.computes.xySelectionOSRM = [];
    this.computes.xySelectionRel.length = 2; this.computes.xySelectionRel[0] = null; this.computes.xySelectionRel[1] = null;
    this.calcWalkingPath = false;
    this.newWay = false;
    this.isChart = false;
    this.computes.heightCalcDis = 400;
    this.computes.timeFunc = 0;
    this.isLoadingWalkindPath = false;
  }
  //Check which road type to calculate:
  howCalc() {
    if (this.selection == undefined) {
      this.translate.get('walkingPath.incorrectWay').subscribe(value => this.incorrectWay = value);
      //alert(this.incorrectWay)
      this._snackBar.open(this.incorrectWay,"OK", {duration:5000, verticalPosition:'top' , panelClass:'snackLength'});
    }
    if (this.selection == "1")
      this.calc()
    else if (this.selection == "2")
      this.calcU()
  }
  //Get walking path from OSRM:
  calc() {
    // this.clearGeom();
    govmap.clearGeometriesByName(['Polyline1', 'Polyline2'])
    console.log(this.computes.xySelectionRel);
    if (this.computes.xySelection[0] == null || this.computes.xySelection[1] == null) {
      this.translate.get('walkingPath.incorrectData').subscribe(value => this.incorrectData = value);
      //alert(this.incorrectData)
      this._snackBar.open(this.incorrectData,"OK", {duration:5000, verticalPosition:'top' , panelClass:'snackLength'});
    }
    else {
      this.calcWalkingPath = true;
      this.newWay = true;
      this.isLoadingWalkindPath = true;
      // govmap.setMapCursor(govmap.cursorType.DEFAULT)
      var polyline = require('google-polyline')
      if (this.computes.strIntoObj != null) govmap.clearGeometriesByName(this.computes.strIntoObj.wkts);
      // govmap.clearGeometriesByName(['person1']);
      // wkts: ['LINESTRING(181638.5702018566 691584.9075372377, 230586.58476455236 683382.807799705)'],  
      var WKT = "LINESTRING(";
      for (let index = 0; index < this.computes.xySelection.length; index++) {
        WKT += this.computes.xySelection[index] + ",";
      }

      WKT += ")";
      console.log(WKT);
      var httposrm = "https://router.project-osrm.org/route/v1/foot/";
      for (let i = 0; i < this.computes.xySelectionOSRM.length; i++) {
        if (i != this.computes.xySelectionOSRM.length - 1) {
          httposrm += this.computes.xySelectionOSRM[i] + ";";
        }
        else httposrm += this.computes.xySelectionOSRM[i];
      }
      httposrm += "?steps=false&geometries=geojson";
      this.http.get<any>(httposrm).subscribe(x => {
        // this.meterWay = (x.routes[0].distance).toFixed(1);
        // this.durationWay = (x.routes[0].duration / 60).toFixed(1);
        this.wktAPI = "{\"wkt\":\"LINESTRING (";
        this.w = "LINESTRING(";
        for (let i = 0; i < x.routes[0].geometry.coordinates.length; i++) {
          const element = x.routes[0].geometry.coordinates[i];
          this.computes.computeLatLngToITM(element[1], element[0]);
          this.wktAPI += this.computes.itm_east + " " + this.computes.itm_north + ",";
          this.w += this.computes.itm_east + " " + this.computes.itm_north + ",";
        }
        this.w += ")";
        this.wktAPI = this.wktAPI.slice(0, -1);
        this.wktAPI += ")\"}";
        var data = {
          wkts: [this.w],
          geomData: { a: false },
          showBubble: false,
          names: ['Polyline1'],
          geometryType: govmap.drawType.Polyline,
          defaultSymbol:
          {
            color: [16, 12, 8, 1],
            width: 1,
          },
          symbols: [],
          clearExisting: false,
          data: {
            tooltip: 'polyline'
          }
        };
        console.log("calc")
        this.computes.heightCalcDis = 570;
        var res_list = [];

          govmap.displayGeometries(data).progress((res) => {
            res_list.push(res);
            console.log(res_list);
            setTimeout(() => {
              if (res_list[0]) {
                this.ngZone.run(() => {
                  this.computes.openInformation(res.data.geomData, res.data.x, res.data.y);
                })
                res_list = [];
              }
            }, 10);
          })


        this.siteservice.getWalkingPath(this.wktAPI).subscribe(y => {
          let re = /\'/gi;
          y = y.replace(re, '"')
          y = y.replace(/^"/, '')
          y = y.replace(/"\s*$/, '');
          y = y.replace(/n\s*$/, '');
          y = y.replace(/\\s*$/, '');
          y = JSON.parse(y)
          this.meterWay = (y.data.length_metres).toFixed(0);
          this.durationWay = (y.data.duration_minutes).toFixed(0);
          let profile = [];
          this.chartLabels = [];
          this.length_metres = y.data.length_metres / 150;
          this.length_metres = parseFloat(this.length_metres.toFixed(0));
          let num = 0;
          for (let index = 0; index < y.data.z_profile.length; index += this.length_metres) {
            const yx = { x: num, y: y.data.z_profile[index] }
            profile.push(yx)
            num += this.length_metres;
          }
          // profile.push(x.data.z_profile[x.data.z_profile.length - 1])
          this.chartData = [
            { indexAxis: 'y', data: profile, /*label: 'Distance: ' + x.routes[0].distance.toFixed(0),*/ fill: false },
          ];
          let offset_shnatot = y.data.length_metres / 10;
          let calValue = 0;
          for (let index = 0; index < 10; index++) {
            this.chartLabels[index] = parseFloat(calValue.toFixed(0));
            calValue += offset_shnatot;
          }
          this.isLoadingWalkindPath = false;
          this.isChart = true;
        })
      });
    }

  }
  //Get walking path from API:
  calcU() {
    govmap.clearGeometriesByName(['Polyline1', 'Polyline2'])
    // govmap.setMapCursor(govmap.cursorType.DEFAULT)
    if (this.computes.xySelection[0] == null || this.computes.xySelection[1] == null) {
      //alert("אחד או יותר מהנתונים שגויים, אנא בדוק שוב את הנתונים")
      this._snackBar.open("אחד או יותר מהנתונים שגויים, אנא בדוק שוב את הנתונים","OK", {duration:5000, verticalPosition:'top' , panelClass:'snackLength'});
    }

    else if(this.computes.xySelection[0] == this.computes.xySelection[1]){
      //alert("אנא בחר נקודות שונות");
      this._snackBar.open("אנא בחר נקודות שונות","OK", {duration:5000, verticalPosition:'top' , panelClass:'snackLength'});
    }

    else {
      this.calcWalkingPath = true;
      this.newWay = true;
      this.isLoadingWalkindPath = true;
      this.wkt = "LINESTRING(";
      this.w = "{\"wkt\":\"LINESTRING (";
      for (let i = 0; i < this.computes.xySelectionRel.length; i++) {
        const element = this.computes.xySelectionRel[i];
        this.w += element + ",";
        this.wkt += element + ",";
      }
      this.w = this.w.slice(0, -1);
      this.w += ")\"}";
      this.wkt += ")";
      this.siteservice.getWalkingPath(this.w).subscribe(x => {
        let re = /\'/gi;
        x = x.replace(re, '"')
        x = x.replace(/^"/, '')
        x = x.replace(/"\s*$/, '');
        x = x.replace(/n\s*$/, '');
        x = x.replace(/\\s*$/, '');
        x = JSON.parse(x)
        this.meterWay = (x.data.length_metres).toFixed(0);
        this.durationWay = (x.data.duration_minutes).toFixed(0);
        let profile = [];
        let xpro: ChartXAxe[] = [];
        let ypro: ChartYAxe[] = [];
        this.chartLabels = [];
        console.log(x.data.length_metres);
        this.length_metres = x.data.length_metres / 150;
        this.length_metres = parseFloat(this.length_metres.toFixed(0));
        let num = 0;

        $(document).ready(function() {
          $('.viewshed.viewshedListClose.ng-star-inserted').delay(50).queue(function() {
            $(this).css('height', '610px');
          });
        });

        for (let index = 0; index < x.data.z_profile.length; index += this.length_metres) {
          const yx = { x: num, y: x.data.z_profile[index] }
          ypro.push(x)
          xpro.push(x.data.z_profile[index])
          profile.push(yx)
          num += this.length_metres;
        }
        profile.push({ x: num + 1, y: x.data.z_profile[x.data.z_profile.length - 1] })
        this.chartData = [
          { data: profile, fill: false, /*label: 'Distance: ' + x.data.length_metres.toFixed(0) */ },
        ];
        let offset_shnatot = x.data.length_metres / 10;
        let calValue = 0;
        for (let index = 0; index < 10; index++) {
          this.chartLabels[index] = parseFloat(calValue.toFixed(0));
          calValue += offset_shnatot;
        }
        this.isChart = true;
        var data = {
          wkts: [this.wkt],
          geomData: { a: false },
          showBubble: false,
          names: ['Polyline2'],
          geometryType: govmap.drawType.Polyline,
          defaultSymbol:
          {
            color: [16, 12, 8, 1],
            width: 1,
          },
          symbols: [],
          clearExisting: false,
          data: {
          }
        };
        this.computes.heightCalcDis = 570;
        var res_list = [];

        if(this.isOpen){
          govmap.displayGeometries(data).progress((res) => {
            console.log(res);
            res_list.push(res);
            setTimeout(() => {
              if (res_list[0]) {
                this.ngZone.run(() => {
                  this.computes.openInformation(res.data.geomData, res.data.x, res.data.y);
                })
                res_list = [];
              }
            }, 10);
          })
        }

        this.isLoadingWalkindPath = false;
      })
    }
  }

  openTutorial(){
    this.dialog.open(TutorialsComponent, {data: { showViewshed: false, showDistanceTime: true, showAzimuth: false }});
  }

  ngOnDestroy(): void {
    this.isOpen = false;
    this.recalculateWalkingPath();


  //mat-button-ripple mat-ripple mat-button-ripple-round

  // var calcDone = false;

  // if(!calcDone){
  //   setTimeout(function() {
  //     $('.bbtn.btnDisTime.disAndTimeHeb.ng-star-inserted').trigger("click");
  //     setTimeout(function() {
  //       calcDone = true;
  //       $('.bbtn.btnDisTime.disAndTimeHeb.ng-star-inserted').trigger("click");
  //     }, 1000);
  //   }, 1000);
  // }

  }

}




