declare const govmap: any;

import { HttpErrorResponse } from '@angular/common/http';
import { AzimuthComponent } from './../maps/azimuth/azimuth.component';
import { ComputeService } from './../maps/compute.service';
import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2, HostListener, Directive } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { trigger, state, group, animate, transition, style } from '@angular/animations';
import { SearchSService, ShowState } from '../Services/search-s.service';
import { Subscription } from 'rxjs';
import { ListsSearch } from '../search/search.model';
import { RegionsComponent } from './../maps/regions/regions.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export const SlideInOutAnimation = [
  trigger('slideInOut', [
    state('in', style({
      'max-height': '500px', 'opacity': '1', 'visibility': 'visible'
    })),
    state('out', style({
      'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
    })),
    transition('in => out', [group([
      animate('200ms ease-in-out', style({
        'opacity': '0'
      })),
      animate('200ms ease-in-out', style({
        'max-height': '0px'
      })),
      animate('200ms ease-in-out', style({
        'visibility': 'hidden'
      }))
    ]
    )]),
    transition('out => in', [group([
      animate('1ms ease-in-out', style({
        'visibility': 'visible'
      })),
      animate('100ms ease-in-out', style({
        'max-height': '500px'
      })),
      animate('100ms ease-in-out', style({
        'opacity': '1'
      }))
    ]
    )])
  ]),
];

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  animations: [SlideInOutAnimation]
})
export class NavBarComponent implements OnInit {
  //@Input() Regions: boolean;
  panelOpenState = false;
  locationOp = true;
  kindOp: boolean;
  periodOp: boolean;
  sourceOp: boolean;
  showBox = true;
  conta: boolean;
  aboutUs: boolean;
  theCenter: boolean;
  partners: boolean;
  map: boolean;
  he: boolean;

  aniLocationVisible: boolean;
  myRef: any;
  fileName= 'Sites.xlsx'; 

  showLo = false;
  showKi = false;
  showPe = false;
  showSo = false;
  public subscription: Subscription;
  filterNull: boolean = true;
  filter: ListsSearch[] = [];
  filterPeriod: ListsSearch[] = [];
  filterPerdiocals: ListsSearch[] = [];
  filterNature: ListsSearch[] = [];
  filterLocation: ListsSearch[] = [];
  sitesB: boolean;
  navDesign: boolean = true;

  constructor(private translate: TranslateService, private s: SearchSService, public reg: RegionsComponent) {
    this.sitesB = true;
    this.filter = s.getSearch();
    s.GetFilterNature().subscribe(x => this.filterNature = x);
    s.GetFilterPerdiocals().subscribe(x => this.filterPerdiocals = x);
    s.GetFilterPeriod().subscribe(x => this.filterPeriod = x);
    s.GetFilterLocation().subscribe(x => this.filterLocation = x);
    if (this.filter == null || this.filter.length == 0) this.filterNull = true;
    else this.filterNull = false;
  }

  ngOnInit() {
    this.translate.get(['']).subscribe(x => x);
    this.s.getList(this.sitesB);
    this.subscription = this.s.showState.subscribe((state: ShowState) => {
      this.showLo = state.show;
      this.showPe = state.show;
      this.showSo = state.show;
      this.showKi = state.show;
      this.filter = this.s.getSearch();
      this.s.GetFilterNature().subscribe(x => { this.filterNature = x });
      this.s.GetFilterPerdiocals().subscribe(x => this.filterPerdiocals = x);
      this.s.GetFilterPeriod().subscribe(x => this.filterPeriod = x);
      this.s.GetFilterLocation().subscribe(x => this.filterLocation = x);
      if (this.filter == null || this.filter.length == 0) {
        this.filterNull = true;
      }
      else {
        this.filterNull = false;
      }
    })
  }
  useLanguage(language: string) {
    this.he = !this.he;
    this.translate.use(language);
    this.showKi = false; this.showSo = false; this.showPe = false; this.showLo = false;
    $("#Reg").css("color", "#797b81");
    //this.reg.showRegions();
  }

  closeFilter() {
    // this.filter = [];
    this.s.list_search_result = [];
    this.s.filterNature = this.filterNature = [];
    this.s.filterPerdiocals = this.filterPerdiocals = [];
    this.s.filterPeriod = this.filterPeriod = [];
    this.s.filterLocation = this.filterLocation = [];
    // this.filterNull = true;
    this.sitesB = true;
    this.s.getList(this.sitesB);
    this.filter = this.s.getSearch();
    this.s.GetFilterNature().subscribe(x => this.filterNature = x);
    this.s.GetFilterPerdiocals().subscribe(x => this.filterPerdiocals = x);
    this.s.GetFilterPeriod().subscribe(x => this.filterPeriod = x);
    this.s.GetFilterLocation().subscribe(x => this.filterLocation = x);
  }
  removeAllSites() {
    this.filter = [];
    this.s.list_search_result = [];
    this.s.filterNature = this.filterNature = [];
    this.s.filterPerdiocals = this.filterPerdiocals = [];
    this.s.filterPeriod = this.filterPeriod = [];
    this.s.filterLocation = this.filterLocation = [];
    this.filterNull = true;
    this.s.getSearch();
    this.sitesB = false;
    this.s.getList(this.sitesB);
  }
  remove(f: ListsSearch) {
    //check number item in the array:
    let index = this.s.list_search_result.indexOf(f);
    for (let i = 0; i < this.s.list_search_result.length; i++) {
      if (this.s.list_search_result[i].id == f.id) {
        index = i;
      }
    }
    const indexPeriod = this.s.filterPeriod.indexOf(f);
    const indexPerdiocal = this.s.filterPerdiocals.indexOf(f);
    const indexNature = this.s.filterNature.indexOf(f);
    const indexLocation = this.s.filterLocation.indexOf(f);
    //splice item selected from arrays:
    if (index >= 0) {
      this.s.list_search_result.splice(index, 1);
    }
    if (indexPeriod >= 0) {
      this.s.filterPeriod.splice(indexPeriod, 1);
    }
    if (indexPerdiocal >= 0) {
      this.s.filterPerdiocals.splice(indexPerdiocal, 1);
    }
    if (indexNature >= 0) {
      this.s.filterNature.splice(indexNature, 1);
    }
    if (indexLocation >= 0) {
      this.s.filterLocation.splice(indexLocation, 1)
    }
    if (this.s.list_search_result.length == 0) {
      this.filterNull = true;
    }
    this.s.getSearch();
    this.sitesB = true;
    this.s.getList(this.sitesB);
    this.s.hide();
  }
  openLocation() {
    this.showLo = !this.showLo;
    this.conta = false; this.aboutUs = false; this.partners = false; this.theCenter = false;
    this.showKi = false; this.showSo = false; this.showPe = false; this.map = false;
  }
  openKind() {
    this.showKi = !this.showKi;
    this.conta = false; this.aboutUs = false; this.partners = false; this.theCenter = false;
    this.showPe = false; this.showSo = false; this.showLo = false; this.map = false;

  }
  openPeriod() {
    this.showPe = !this.showPe;
    this.conta = false; this.aboutUs = false; this.partners = false; this.theCenter = false;
    this.showKi = false; this.showLo = false; this.showSo = false; this.map = false;
  }
  openSource() {
    this.showSo = !this.showSo;
    this.conta = false; this.aboutUs = false; this.partners = false; this.theCenter = false;
    this.showPe = false; this.showKi = false; this.showLo = false; this.map = false;
  }
  //routing to contact us:
  contact() {
    this.showSo = false; this.showKi = false; this.showPe = false; this.showLo = false; this.map = false;
    this.conta = true;
    this.aboutUs = false; this.partners = false; this.theCenter = false;
    this.navDesign = true;
  }
  //routing to about us:
  AboutUs() {
    this.navDesign = false;
    console.log(this.navDesign)
    this.showSo = false; this.showKi = false; this.showPe = false; this.showLo = false; this.map = false;
    this.conta = false;
    this.aboutUs = true; this.partners = false; this.theCenter = false;
  }
  //routing to partners:
  partnersF() {
    this.navDesign = false;
    console.log(this.navDesign)
    this.showSo = false; this.showKi = false; this.showPe = false; this.showLo = false; this.map = false;
    this.conta = false;
    this.aboutUs = false; this.partners = true; this.theCenter = false;
  }
  //routing to the center:
  TheCenterF() {
    this.navDesign = false;
    console.log(this.navDesign)
    this.showSo = false; this.showKi = false; this.showPe = false; this.showLo = false; this.map = false;
    this.conta = false;
    this.aboutUs = false; this.partners = false; this.theCenter = true;
  }
  //routing to map:
  mapF() {
    this.navDesign = true;
    this.myRef.current.contentWindow.execCommand('map')
    this.showSo = false; this.showKi = false; this.showPe = false; this.showLo = false; this.map = true;
    this.conta = false;
    this.aboutUs = false; this.partners = false; this.theCenter = false;
    
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
