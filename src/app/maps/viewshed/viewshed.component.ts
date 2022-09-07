declare const govmap: any;
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SitesService } from 'src/app/Services/sites.service';
import { ComputeService } from '../compute.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-viewshed',
  templateUrl: './viewshed.component.html',
  styleUrls: ['./viewshed.component.css']
})
export class ViewshedComponent implements OnInit {
  isLoadingViewShed:boolean;
  reCalc: boolean;
  he: boolean; // err fix

  constructor(private fb: FormBuilder, private ngZone: NgZone, public computes: ComputeService, private siteservice: SitesService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.pointToViewshed();
  }
  //click on the map to get point to viewshed:
  pointToViewshed() {
    this.computes.locationToViewshed = true;
    govmap.setMapCursor(govmap.cursorType.TARGET);
    govmap.onEvent(govmap.events.CLICK).progress((res) => {
      govmap.unbindEvent(govmap.events.CLICK);
      govmap.setMapCursor(govmap.cursorType.DEFAULT);
      this.computes.xToViewshed = res.mapPoint.x;
      this.computes.yToViewshed = res.mapPoint.y;
      this.computes.locationToViewshed = false;
      this.computes.displayGeojsonViewshed(this.computes.xToViewshed, this.computes.yToViewshed);
    })
  }
  //Calculation viewshad:
  calculationViewshed() {
    console.log('check xy viewshed', this.computes.xToViewshed, ' ', this.computes.yToViewshed);
    if (this.computes.strIntoObj != null) govmap.clearGeometriesByName(this.computes.strIntoObj.wkts);
    // this.computes.keyupViewShed(this.rad);
    if (this.computes.viewShedForm.controls['height'].valid && this.computes.viewShedForm.controls['radius'].valid) {
      let data;
      this.isLoadingViewShed = true;
      console.log(this.computes.xToViewshed, ' ', this.computes.yToViewshed);
      this.siteservice.getGeojson(this.computes.xToViewshed, this.computes.yToViewshed, this.computes.viewShedForm.controls['height'].value, this.computes.viewShedForm.controls['radius'].value).subscribe(x => {
        //parse to json:
        this.computes.strIntoObj = JSON.parse(x);
        //polygonArr.length;
        const symbolArr = new Array(this.computes.strIntoObj.wkts.length);
        symbolArr.fill({
          outlineColor: [173, 275, 47, 1],
          outlineWidth: 1,
          fillColor: [173, 255, 47, 0.3]
        });
        var data = {
          wkts: this.computes.strIntoObj.wkts,//["POLYGON((      185320.0 493390.0, 185320.0 493380.0, 185310.0 493380.0, 185290.0 493380.0, 185290.0 493370.0, 185280.0 493370.0, 185280.0 493360.0, 185290.0 493360.0, 185290.0 493350.0, 185300.0 493350.0, 185300.0 493340.0, 185320.0 493340.0, 185320.0 493330.0, 185380.0 493330.0, 185380.0 493320.0, 185390.0 493320.0, 185390.0 493310.0, 185400.0 493310.0, 185400.0 493300.0, 185420.0 493300.0, 185420.0 493290.0, 185440.0 493290.0, 185440.0 493280.0, 185460.0 493280.0, 185460.0 493290.0, 185470.0 493290.0, 185470.0 493300.0, 185460.0 493300.0, 185460.0 493310.0, 185450.0 493310.0, 185450.0 493340.0, 185430.0 493340.0, 185430.0 493330.0, 185400.0 493330.0, 185400.0 493340.0, 185390.0 493340.0, 185390.0 493350.0, 185370.0 493350.0, 185370.0 493360.0, 185360.0 493360.0, 185360.0 493370.0, 185330.0 493370.0, 185330.0 493390.0, 185320.0 493390.0))","POLYGON((      185560.0 493080.0, 185560.0 493070.0, 185570.0 493070.0, 185570.0 493060.0, 185580.0 493060.0, 185580.0 493050.0, 185590.0 493050.0, 185590.0 493040.0, 185600.0 493040.0, 185600.0 493000.0, 185620.0 493000.0, 185620.0 493010.0, 185630.0 493010.0, 185630.0 493020.0, 185620.0 493020.0, 185620.0 493050.0, 185610.0 493050.0, 185610.0 493060.0, 185600.0 493060.0, 185600.0 493080.0, 185560.0 493080.0))","POLYGON((      184580.0 492890.0, 184580.0 492870.0, 184590.0 492870.0, 184590.0 492860.0, 184610.0 492860.0, 184610.0 492850.0, 184630.0 492850.0, 184630.0 492860.0, 184620.0 492860.0, 184620.0 492870.0, 184600.0 492870.0, 184600.0 492880.0, 184590.0 492880.0, 184590.0 492890.0, 184580.0 492890.0))","POLYGON((      182980.0 492520.0, 182980.0 492510.0, 183000.0 492510.0, 183000.0 492520.0, 182980.0 492520.0))"],//[a],
          geomData: { a: false },
          showBubble: false,
          names: this.computes.strIntoObj.wkts,
          geometryType: govmap.drawType.Polygon,
          defaultSymbol:
          {
            outlineColor: [173, 275, 47, 1],
            outlineWidth: 1,
            fillColor: [173, 255, 47, 0.3]
          },
          symbols: [],
          clearExisting: false,
          data: {
            tooltips: [],
            headers: [],
            bubbles: [],
          }
        };

        console.log("calculationViewshed");
        var res_list = [];
        govmap.displayGeometries(data).progress((res) => {
          if (res.data.geomData)
            res_list.push(res);
          setTimeout(() => {
            if (res_list[0]) {
              this.ngZone.run(() => {// open information
                this.computes.openInformation(res_list[0].data.geomData, res.data.x, res.data.y);
              })
              res_list = [];
            }
          }, 10);
        })
        this.reCalc = true;
        this.isLoadingViewShed = false;
      });
    }
    else {
      //alert(" הכנס נתונים תקינים")
      this._snackBar.open(" הכנס נתונים תקינים","OK", {duration:5000, verticalPosition:'top' , panelClass:'snackLength'});
    }
  }
  //Order to re-calculation viewshed:
  recalculationViewshed() {
    this.reCalc = false;
    this.computes.clearGeom();
    this.pointToViewshed();
  }
  ngOnDestroy() {
    govmap.unbindEvent(govmap.events.CLICK);
    govmap.setMapCursor(govmap.cursorType.DEFAULT);
  }
}
