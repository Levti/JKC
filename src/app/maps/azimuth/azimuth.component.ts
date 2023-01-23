
declare const govmap: any;
import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { SearchSService } from 'src/app/Services/search-s.service';
import { ComputeService } from '../compute.service';
//import { NavbarComponent } from 'angular-bootstrap-md';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { TutorialsComponent } from 'src/app/tutorials/tutorials.component';

@Component({
  selector: 'app-azimuth',
  templateUrl: './azimuth.component.html',
  styleUrls: ['./azimuth.component.css']
})

export class AzimuthComponent implements OnInit {
  lang:boolean;
  target = 't'
  origin = 'o'
  bearing: any;
  newAzimuth: boolean;
  @Input() browserLang: any;
  he: boolean;
  en: boolean;
  //static he: boolean;
  @ViewChild("inputAz", { static: false }) //inputAzimuth: ElementRef;
  set inputAz(element: ElementRef<HTMLInputElement>) {
    if (element && this.computes.firstXYAzimuth == null) {
      // element.nativeElement.focus();
      element.nativeElement.click();
    }
  }

  constructor(private dialog: MatDialog, private ngZone: NgZone, public computes: ComputeService, private searchService: SearchSService, private translate: TranslateService, private _snackBar: MatSnackBar) {
    //this.browserLang = this.translate.getDefaultLang();
    //debugger;
    /*if (this.browserLang === 'he') {
      this.he = true;
      console.log('True he!');
    }
    else {
      this.he = false;
      console.log('False he!');
    }*/


  }
  event: any;
  ngOnInit() {
    //restart property to azimuth:
    this.computes.timeFuncAz = 0;
    this.computes.arrayxyAzimuth[0] = null;
    this.computes.arrayxyAzimuth[1] = null;
    this.computes.arrayxyAzimuth.length = 2;
    this.computes.firstXYAzimuth = null;
    this.computes.secondXYAzimuth = null;
    this.bearing = null;
    this.computes.distance = null;
    this.newAzimuth = false;
    this.computes.clearGeom();


    /*this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.browserLang = event.lang;
      if (this.browserLang == 'he') {
        this.he = true;
        this.en = false;
      }
      else {
        this.he = false;
        this.en = true;
      }
    });*/

    if (this.browserLang === 'he') {
      this.he = true;
    }
    else {
      this.he = false;
    }

  }
    

  //Calculate azimuth between two coordinates:
  calcAzimuth() {
    if (this.computes.firstXYAzimuth == null || this.computes.secondXYAzimuth == null) {
      //alert("נא וודא אם הנתונים שהכנסת תקינים")
      this._snackBar.open("נא וודא אם הנתונים שהכנסת תקינים","OK", {duration:5000, verticalPosition:'top' , panelClass:'snackLength'});
    }
    else {
      govmap.unbindEvent(govmap.events.CLICK);
      govmap.setMapCursor(govmap.cursorType.DEFAULT);
      //Get azimuth use turf:
      let turf = require('@turf/turf');
      var point1 = turf.point([this.computes.firstXAzimuth, this.computes.firstYAzimuth], { "marker-color": "#F00" });
      var point2 = turf.point([this.computes.secondXAzimuth, this.computes.secondYAzimuth], { "marker-color": "#00F" });
      var bearing = turf.rhumbBearing(point1, point2);

      this.bearing = turf.bearing(point1, point2);
      this.bearing = turf.bearingToAzimuth(bearing);
      this.bearing = Math.round(this.bearing);
      console.log(bearing, this.bearing);
      var from = turf.point([this.computes.firstXAzimuth, this.computes.firstYAzimuth]);
      var to = turf.point([this.computes.secondXAzimuth, this.computes.secondYAzimuth]);
      var options = { units: 'meters' };

      //rhumbDistance and distance return same result:
      var distance = turf.rhumbDistance(from, to, options);
      this.computes.distance = turf.distance(from, to, options);
      this.computes.distance = Math.round(this.computes.distance);
      console.log(this.computes.distance)
      var ss = this.computes.firsty + (this.computes.distance * 1);
      console.log(ss);
      console.log(distance, this.computes.distance);
      // Draw a line between this points:
      console.log(ss)
      this.computes.lineBetweenPoints(ss);
      this.newAzimuth = true;
    }

  }
  //Recalculate azimuth:
  recalculateAzimuth() {
    this.computes.distance = null;
    this.bearing = null;
    this.newAzimuth = false;
    this.computes.arrayxyAzimuth[0] = null;
    this.computes.arrayxyAzimuth[1] = null;
    this.computes.firstXYAzimuth = null; this.computes.secondXYAzimuth = null;
    this.computes.firstXAzimuth = null; this.computes.firstYAzimuth = null; this.computes.secondXAzimuth = null; this.computes.secondYAzimuth = null;
    this.computes.clearGeom();
    this.computes.timeFuncAz = 0;
  }

  openTutorial(){
    this.dialog.open(TutorialsComponent, {data: { showViewshed: false, showDistanceTime: false, showAzimuth: true }});
  }
}

