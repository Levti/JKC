declare const proj4: any;
declare const govmap: any;
import { ElementRef, Injectable, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SearchSService } from '../Services/search-s.service';
import { SitesService } from '../Services/sites.service';
import { Site } from './classes';
import { InformationHistoryComponent } from './information-history/information-history.component';
import { InformationComponent } from './information/information.component';

@Injectable({
  providedIn: 'root'
})

export class ComputeService {
  //properties to compute: //done
  latitude: string;
  longitude: string;
  itm_north: string;
  itm_east: string;
  itm_northD: string;
  itm_eastD: string;
  old_grid_north: any;
  old_grid_east: any;

  //properties to calculation viewshed: //done
  locationToViewshed: boolean;
  xToViewshed: any;
  yToViewshed: any;
  rad: number;
  viewShedForm: FormGroup;

  //properties to calculation azimuth: //done
  locationToAz: boolean;
  numAz: number;
  firstXYAzimuth: any;
  secondXYAzimuth: any;
  firstXAzimuth: any;
  firstYAzimuth: any;
  secondXAzimuth: any;
  secondYAzimuth: any;
  firstx: any; firsty: any;
  secondx: any; secondy: any;
  @ViewChild("secondInputAz", { static: false }) nameField: ElementRef;
  arrayxyAzimuth: any = [];
  timeFuncAz: number = 0;
  distance: any;

  //properties to calculation distance and time: //done
  locationToDisWalk: boolean;
  xySelectionRel: any[] = [];
  indexDis: number;
  xySelectionOSRM: any[] = [];
  xySelection: any[] = [];
  iWay: number;
  event: any;
  indexNext: any;
  timeFunc: number = 0;
  eventDis: any;
  arrayNamePoint: any;
  load: boolean = false;
  browserLang: any;
  strIntoObj: any;
  heightCalcDis: number = 400;

  constructor(private siteservice: SitesService, public dialog: MatDialog, private ngZone: NgZone, private fb: FormBuilder, private searchService: SearchSService) {
    this.viewShedForm = fb.group({
      height: [2, [Validators.required, Validators.max(20)]],
      //radius: [5000, [Validators.required, Validators.max(20000)]],
      radius: [5000, [Validators.required, Validators.max(30000)]],
    })
  }
  //Conversion from ITM to lat-long:
  computeITMToLatLng(x, y) {
    var itm_east = parseFloat(x.toString());
    var itm_north = parseFloat(y.toString());
    if (isNaN(itm_east) || isNaN(itm_north)) {
      this.latitude = 'Invalid';
      this.longitude = 'Invalid';
    } else {
      var lng_lat = proj4('ITM', 'EPSG:4326', [itm_east, itm_north]);
      this.longitude = lng_lat[0].toFixed(3);
      this.latitude = lng_lat[1].toFixed(3);
      return [this.latitude, this.longitude];
    }
  }
  //Conversion from lat-long to ITM:
  computeLatLngToITM(x, y) {
    var latitude = parseFloat(x.toString());
    var longitude = parseFloat(y.toString());
    if (latitude == null || longitude == null) {
      this.itm_north = 'Invalid';
      this.itm_east = '';
      this.old_grid_north = 'Invalid';
      this.old_grid_east = '';
    }
    else {
      var itm_coords = proj4('EPSG:4326', 'ITM', [longitude, latitude]);
      this.old_grid_east = (itm_coords[0] - 50000).toFixed(0);
      this.old_grid_north = itm_coords[1] - 500000;
      if (this.old_grid_north < 0) {
        this.old_grid_north += 1000000;
      }
      this.old_grid_north = this.old_grid_north.toFixed(0);
      this.itm_east = itm_coords[0].toFixed(0);
      this.itm_north = itm_coords[1].toFixed(0);
    }
    return [this.itm_east, this.itm_north];
  }
  // compute() {
  //   var latitude = parseFloat($('lat').value);
  //   var longitude = parseFloat($('long').value);
  //   var itm_north, itm_east, old_grid_north, old_grid_east;
  //   if (isNaN(latitude) || isNaN(longitude)) {
  //     itm_north = 'Invalid';
  //     itm_east = '';
  //     old_grid_north = 'Invalid';
  //     old_grid_east = '';
  //   }
  //   else {
  //     var itm_coords = proj4('EPSG:4326', 'ITM', [longitude, latitude]);
  //     old_grid_east = (itm_coords[0] - 50000).toFixed(0);
  //     old_grid_north = itm_coords[1] - 500000;
  //     if (old_grid_north < 0) {
  //       old_grid_north += 1000000;
  //     }
  //     old_grid_north = old_grid_north.toFixed(0);
  //     itm_east = itm_coords[0].toFixed(0);
  //     itm_north = itm_coords[1].toFixed(0);
  //   }
  // }
  //Conversion to ICS:
  Convert() {

    var x, y;

    // if(Number(document.getElementById("cboCoordSystemFrom").value) == Number(document.getElementById("cboCoordSystemTo").value))
    // {
    //     alert("לא ניתן להתמיר מאותה לאותה רשת קואורדינאטות");
    //     return;
    // }

    // if(document.getElementById("txtCoordX").value != "")
    // {
    //     if(isNaN(document.getElementById("txtCoordX").value))
    //     {
    //         alert("X יש להזין ערך נומרי לקואורדינאטת");
    //         return;
    //     }

    //     x = parseFloat(document.getElementById("txtCoordX").value);
    // }
    // else
    // {
    //     alert("X יש להזין קואורדינאטת");
    //     return;
    // }

    // if(document.getElementById("txtCoordY").value != "")
    // {
    //     if(isNaN(document.getElementById("txtCoordY").value))
    //     {
    //         alert("Y יש להזין ערך נומרי לקואורדינאטת");
    //         return;
    //     }

    //     y = parseFloat(document.getElementById("txtCoordY").value);        
    // }
    // else
    // {
    //     alert("Y יש להזין קואורדינאטת");
    //     return;
    // }

    // sendData("TransformCoord2",
    //         { ProjId: parent.parent.ProjectId,
    //           fromTrans: document.getElementById("cboCoordSystemFrom").value,
    //           toTrans: document.getElementById("cboCoordSystemTo").value,
    //           X: x ,
    //           Y: y ,
    //           bAddNaaz: bZoomClicked,
    //           MapSession: parent.sessionId,
    //           mapName: encodeURIComponent(parent.mapName)
    //         },
    //         OnComplete_TransformCoord);
  }
  //Open an information window on a specific site:
  openInformation(e: any, x: any, y: any) {
      if (!this.locationToAz && !this.locationToDisWalk && !this.locationToViewshed && e != null && e != undefined) {
      // if (e != null) {
      // govmap.zoomToXY({ x: e.pointX, y: e.pointY });
      // if (e != undefined) {
      let closestArch: Site[];
      if (e.siteDef == 'ארכיאולוגי') {
        console.log(e.wgS84_Info.geography);
        this.siteservice.GetClosetsSites(e.wgS84_Info.geography).subscribe(x => {
          closestArch = x;
          console.log('closest:' + closestArch);
          this.siteservice.GetSiteId(e.resourceID).subscribe(x => {
            let r = x;
            // if (!this.dialog.openDialogs) return;
            this.dialog.closeAll();
            return this.dialog.open(InformationComponent, {
              data: { arch: r, closestArch: closestArch, lang: this.browserLang }
              , panelClass: 'custom-dialog-container'
            });
          });
        });
      }
      else if (e.siteDef == 'היסטורי') {
        this.siteservice.GetJUnits(e.resourceID).subscribe(x => {
          let r = x;
          return this.dialog.open(InformationHistoryComponent, {
            data: { hist: e, book: r, lang: this.browserLang },
            panelClass: 'custom-dialog-container-history'
          });
        });
      }
    }
    else console.log("not open information");
    if (this.locationToViewshed) {
      govmap.unbindEvent(govmap.events.CLICK);
      govmap.setMapCursor(govmap.cursorType.DEFAULT);
      this.xToViewshed = x;
      this.yToViewshed = y;
      this.locationToViewshed = false;
      this.displayGeojsonViewshed(this.xToViewshed, this.yToViewshed);
    }
    if (this.locationToDisWalk) {
      this.pointDis(x, y);
    }
    if (this.locationToAz) {
      this.setPointAzimuth(x, y, this.numAz);
    }
  }
  pointDis(x, y) {
    this.locationToDisWalk = false;
    this.load = true;
    this.xySelectionRel[this.indexDis] = x.toFixed(0) + ' ' + y.toFixed(0)
    console.log(this.xySelectionRel);
    govmap.unbindEvent(govmap.events.CLICK);
    govmap.setMapCursor(govmap.cursorType.DEFAULT);
    this.locationToDisWalk = false;
    if (this.xySelectionRel[this.indexDis] != null)
      govmap.clearGeometriesByName(['wayPoint' + this.indexDis]);
    this.computeITMToLatLng(x, y);
    this.xySelection[this.indexDis] = this.latitude + " " + this.longitude;
    this.xySelectionOSRM[this.indexDis] = this.longitude + "," + this.latitude;
    this.DrawPointInWay(x, y, this.indexDis);
    if (this.xySelectionRel.length > this.indexDis) {
      this.moveToNext(this.eventDis, this.indexDis + 1);
    }
    this.load = false;              
  }
  //Move to next input in xySelection:
  moveToNext(event, index) {
    this.timeFunc++;
    this.event = event;
    this.indexNext = index;
    if (this.timeFunc <= 1) {
      let next = event.srcElement.nextElementSibling;
      if (next == null)  // check the maxLength from here
        return;
      else {
        // next.focus();  // focus if not null
        this.xyDis(event, index); //call to xyDis()
      }
    }
    else {
      let n = event.srcElement.nextElementSibling;
      if (n) {
        // n.focus();
      }
    }
  }
  //Move to next input in azimuth
  moveToSecondPointAz(num, event) {
    this.timeFuncAz++;
    if (this.timeFuncAz <= 1) {
      let next = event.srcElement.nextElementSibling;
      if (next == null)
        return;
      else
        this.xyAzimuth(2, this.event);
    }
    else {
      let n = event.srcElement.nextElementSibling;
    }
  }
  //Get tow point to calculate azimuth:
  xyAzimuth(num: number, event) {
    this.locationToAz = true;
    this.event = event;
    this.numAz = num;
    govmap.setMapCursor(govmap.cursorType.TARGET);
    govmap.onEvent(govmap.events.CLICK).progress(x => {
      this.setPointAzimuth(x.mapPoint.x, x.mapPoint.y, num);
    })
  }
  // Draw a line between this points:
  lineBetweenPoints(ss) {
    console.log(ss);
    var dataa = {
      'wkts': ['LINESTRING(' + this.firstx + ' ' + this.firsty + ', ' + this.secondx + ' ' + this.secondy + ')'],
      'geomData': { a: false },
      'showBubble': false,
      'names': ['polylineAzimuth'],
      'geometryType': govmap.drawType.Polyline,
      'defaultSymbol':
      {
        color: [0, 0, 0, 1],
        width: 1,
      },
      'symbols': [],
      'clearExisting': false,
      'data': {
        'headers': ['header1'],
        'bubbles': [''],
      }
    };
    console.log("calcAzimuth");
    var res_list = [];
    govmap.displayGeometries(dataa).progress((res) => {
      console.log(res);
      res_list.push(res);
      setTimeout(() => {
        if (res_list[0]) {
          this.ngZone.run(() => {
            this.openInformation(res.data.geomData, res.data.x, res.data.y);
          })
          res_list = [];
        }
      }, 10);
    });
    //Draw a line from first point up plus the distance:
    var dataab = {
      'wkts': ['LINESTRING(' + this.firstx + ' ' + this.firsty + ', ' + this.secondx + ' ' + ss + ')'],
      'geomData': { a: false },
      'showBubble': false,
      'names': ['polylineAzimuthUp'],
      'geometryType': govmap.drawType.Polyline,
      'defaultSymbol':
      {
        color: [0, 0, 0, 1],
        width: 1,
      },
      'symbols': [],
      'clearExisting': false,
      'data': {
        'headers': ['header2'],
        'bubbles': [''],
      }
    };
    govmap.displayGeometries(dataab).progress((res) => {
      console.log(res);
      res_list.push(res);
      setTimeout(() => {
        if (res_list[0]) {
          this.ngZone.run(() => {
            this.openInformation(res.data.geomData, res.data.x, res.data.y);
          })
          res_list = [];
        }
      }, 10);
    });

    //Draw a circle-angle:
    var dataCircle = {
      'circleGeometries': [{ x: this.firstx, y: this.firsty, radius: this.distance / 3 }],
      'geomData': { a: false },
      'showBubble': false,
      'names': ['circleAzimuth'],
      'geometryType': 4,
      'defaultSymbol':
      {
        'outlineColor': [255, 0, 0, 0.5],
        'outlineWidth': 2,
        'fillColor': [225, 0, 0, 0.01]
      },
      'symbols': [],
      'clearExisting': false,
      'data': {
        //'tooltips': ['viewshed'],
        'headers': ['header1'],
        'bubbles': [''],
        // 'bubbleUrl': 'http://www.porterdavis.com.au/~/media/homes/astor%20grange/lot%20123%20liverpool%20street%20upc/upper-point-cook---astor-grange-54---0741_long-island-facade.jpg?as=1&h=649&la=en&w=1400&crop=1'
      }
    };
    govmap.displayGeometries(dataCircle).progress((res => {
      console.log(res);
      res_list.push(res);
      setTimeout(() => {
        if (res_list[0]) {
          this.ngZone.run(() => {
            this.openInformation(res.data.geomData, res.data.x, res.data.y);
          })
          res_list = [];
        }
      }, 10);
    }))
  }
  xyDis(event, index) {
    this.eventDis = event;
    this.indexDis = index;
    this.locationToDisWalk = true;
    govmap.setMapCursor(govmap.cursorType.TARGET);
    // govmap.draw(govmap.drawType.Polyline).progress(x=>console.log(x))
    govmap.onEvent(govmap.events.CLICK).progress((res) => {
      this.ngZone.run(() => {
        this.pointDis(res.mapPoint.x, res.mapPoint.y);
      })
    })
  }
  //Draw a point by xySelection:
  DrawPointInWay(x: number, y: number, index: number) {
    this.iWay = index;
    this.arrayNamePoint = 'wayPoint' + this.iWay;
    var data = {
      'wkts': ['POINT(' + x + ' ' + y + ')'],
      'geomData': { a: false },
      'showBubble': false,
      'names': [this.arrayNamePoint],
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
    govmap.displayGeometries(data).progress((res) => {
      console.log("DrawPointInWay")
      console.log(res);
      res_list.push(res);
      setTimeout(() => {
        if (res_list[0]) {
          this.ngZone.run(() => {
            this.openInformation(res.data.geomData, res.data.x, res.data.y);
          })
          res_list = [];
        }
      }, 10);
    })
  }
  //Get person of viewshed:
  displayGeojsonViewshed(x: any, y: any) {
    this.locationToViewshed = false;
    console.log(x, y);
    this.keyupViewShed(this.viewShedForm.get('radius').value);
    govmap.zoomToXY({ x: this.xToViewshed, y: this.yToViewshed })
    var data = {
      wkts: ['POINT(' + this.xToViewshed + ' ' + this.yToViewshed + ')'],
      geomData: { a: false },
      showBubble: false,
      names: ['person1'],
      geometryType: govmap.drawType.Point,
      clearExisting: false,
      // defaultSymbol: defaultSmb,
      defaultSymbol: {}
      , symbols: [{
        url: 'https://jkc.biu.ac.il/Dev/assets/picture/person.jpg',
        width: 6,
        height: 16
      }],
      data: {
        headers: ['namesArr'],
      }
    };
    console.log("displayGeojsonViewshed")
    var res_list = [];
    govmap.displayGeometries(data).progress((res) => {
      if (res.data.geomData) {
        res_list.push(res);
      }
      console.log("hi res data");
      console.log(res.data)
      console.log(typeof (res.data));
      setTimeout(() => {
        if (res_list[0]) {
          this.ngZone.run(() => {
            this.openInformation(res_list[0].data.geomData, res.data.x, res.data.y);
          })
          res_list = [];
        }
      }, 10);
    })
  }
  //Drawing a circle according to the radius:
  keyupViewShed(event) {
    console.log(event);
    console.log("come to  keyupViewShed");
    //**govmap.clearGeometriesByName(['circle', 'circleSmall']);
    this.rad = +event;
    var data = {
      'circleGeometries': [{ x: this.xToViewshed, y: this.yToViewshed, radius: this.rad }],
      'geomData': { a: false },
      'showBubble': false,
      'names': ['circle'],
      'geometryType': 4,
      'defaultSymbol':
      {
        'outlineColor': [147, 78, 31, 1],
        'outlineWidth': 2,
        'fillColor': [147, 78, 31, 0.1]
      },
      'symbols': [],
      'clearExisting': false,
      'data': {
        //'tooltips': ['viewshed'],
        'headers': ['header1'],
        'bubbles': [''],
        // 'bubbleUrl': 'http://www.porterdavis.com.au/~/media/homes/astor%20grange/lot%20123%20liverpool%20street%20upc/upper-point-cook---astor-grange-54---0741_long-island-facade.jpg?as=1&h=649&la=en&w=1400&crop=1'
      }
    };
    console.log("keyupViewShed");
    var res_list = [];
    govmap.displayGeometries(data).progress((res) => {
      console.log(res);
      if (res.data.geomData)
        res_list.push(res);
      setTimeout(() => {
        if (res_list[0]) {
          this.ngZone.run(() => {// open information
            this.openInformation(res_list[0].data.geomData, res.data.x, res.data.y);
          })
          res_list = [];
        }
      }, 10);
    })
  }
  //set point to calculaion azimuth:
  setPointAzimuth(x, y, num) {
    this.locationToAz = false;
    // govmap.unbindEvent(govmap.events.CLICK);
    // govmap.setMapCursor(govmap.cursorType.DEFAULT);
    govmap.unbin
    if (num == 1) {
      this.firstx = x; this.firsty = y;
      //Convert ITM to ICS:
      this.firstYAzimuth = this.computeITMToLatLng(x, y)[0];
      this.firstXAzimuth = this.computeITMToLatLng(x, y)[1];
      this.firstXYAzimuth = x.toFixed(0) + " " + y.toFixed(0);
      this.arrayxyAzimuth[0] = this.firstXYAzimuth;
      govmap.unbindEvent(govmap.events.CLICK);
      govmap.setMapCursor(govmap.cursorType.DEFAULT);
      this.moveToSecondPointAz(2, this.event);
    }
    else if (num == 2) {
      //Convert ITM o ICS:
      this.secondx = x; this.secondy = y;
      this.secondYAzimuth = this.computeITMToLatLng(x, y)[0];
      this.secondXAzimuth = this.computeITMToLatLng(x, y)[1];
      this.secondXYAzimuth = x.toFixed(0) + " " + y.toFixed(0);
      this.arrayxyAzimuth[1] = this.secondXYAzimuth;
      govmap.unbindEvent(govmap.events.CLICK);
      govmap.setMapCursor(govmap.cursorType.DEFAULT);
    }
    //Draw point where user click:
    var data = {
      'wkts': ['POINT(' + x + ' ' + y + ')'],
      'geomData': { a: false },
      'showBubble': false,
      'names': ['num ' + num],
      'geometryType': govmap.drawType.Point,
      'defaultSymbol':
      {
        outlineColor: [255, 0, 0, 0.5],
        outlineWidth: 0.1,
        fillColor: [255, 0, 0, 0.5]
      },
      'symbols': [],
      'clearExisting': false,
      'data': {
        'headers': ['header1'],
        'bubbles': [''],
      }
    }
    console.log("xyAzimuth");
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
  }
  //Clear geometriy
  clearGeom() {
    for (let index = 0; index <= this.iWay; index++) {
      console.log('wayPoint' + index)
      govmap.clearGeometriesByName(['wayPoint' + index]);
    }
    govmap.clearGeometriesByName(['Polyline1', 'Polyline2', 'person1', 'circle', 'circleSmall', 'polylineAzimuth', 'polylineAzimuthUp', 'circleAzimuth'])
    //govmap.clearGeometriesByName(['Polyline1', 'Polyline2', 'circleSmall', 'polylineAzimuth', 'polylineAzimuthUp', 'circleAzimuth'])
    govmap.clearGeometriesByName(['num 1', 'num 2'])
    if (this.strIntoObj != null) govmap.clearGeometriesByName(this.strIntoObj.wkts);
  }

}
