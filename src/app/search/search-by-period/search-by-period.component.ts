import { Component, OnInit, Output, EventEmitter, Input, Injectable } from '@angular/core';
//import { SearchComponent } from '../search.component';
import { SearchSService } from 'src/app/Services/search-s.service';
import { FormControl } from '@angular/forms';
import { of as ofObservable, BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { period } from './Period.model';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-by-period',
  templateUrl: './search-by-period.component.html',
  styleUrls: ['./search-by-period.component.css'],
})
export class SearchByPeriodComponent implements OnInit {
  @Output() displayR = new EventEmitter<boolean>();
  @Input() resultSearch;
  resultp: period[] = [];
  periodChecked: period[] = [];
  resultperiod$ = new Observable<period[]>();
  hideorn: boolean;
  searctrl = new FormControl();
  value = 0;
  selectedValue: any;
  min = -2000;
  max = 1948;
  c = true;
  browserLang: any;
  he: boolean = true;
  en: boolean;
  rl: string;
  sitesB: boolean;
  periodRange: PeriodRange;

  constructor(private searchservice: SearchSService, private translate: TranslateService) {
    this.browserLang = translate.currentLang;
    if (this.browserLang == 'he') {
      this.he = true
      this.en = false
      this.rl = "rtl"
    }
    else if (this.browserLang == 'en') {
      this.en = true
      this.he = false
      this.rl = "ltr"
    };
  }

  ngOnInit() {
    this.searchservice.getAllPeriods().subscribe(x => {
      this.resultp = x;
      for (let i = 0; i < this.resultp.length; i++) {
        const period = this.resultp[i];
        for (let p = 0; p < this.searchservice.filterPeriod.length; p++) {
          const element = this.searchservice.filterPeriod[p];
          if (period.periodID == element.id) {
            this.resultp[i].checked = true;
          }
          if (element.id == 0) {
            this.periodRange = new PeriodRange(element.timeline.start, element.timeline.end);
          }
        }
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.browserLang = event.lang;
      if (this.browserLang == 'he') {
        this.he = true
        this.en = false
        this.rl = "rtl"
      }
      else if (this.browserLang == 'en') {
        this.en = true
        this.he = false
        this.rl = "ltr"
      }
    });

  }

  //send timeline of period to search:
  searchs() {
    if (this.periodRange != null) {
      let exists: boolean = false;
      let num: number = 0;
      let id = 0;
      for (let i = 0; i < this.searchservice.list_search_result.length; i++) {
        const element = this.searchservice.list_search_result[i];
        if (element.id != 0) {
          exists = false;
        }
        if (element.id == 0) {
          exists = true;
          num = i;
          break
        }
      }
      if (!exists) {
        let name = `${this.periodRange.lower} - ${this.periodRange.upper}`;
        this.searchservice.list_search_result.push({ id: id, nameEn: name, nameHe: name, timeline: { start: this.periodRange.lower, end: this.periodRange.upper }, siternature: null, period: null, perdiocal: null, location: null })
        this.searchservice.filterPeriod.push({ id: id, nameEn: name, nameHe: name, timeline: { start: this.periodRange.lower, end: this.periodRange.upper }, siternature: null, period: null, perdiocal: null, location: null })

      }

      else if (exists) {
        let names = `${this.periodRange.lower} - ${this.periodRange.upper}`;
        let t = { id: id, nameEn: names, nameHe: names, timeline: { start: this.periodRange.lower, end: this.periodRange.upper }, siternature: null, perdiocal: null, period: null, location: null };
        this.searchservice.list_search_result[num] = t;
        this.searchservice.filterPeriod[num] = t;
        num = 0;
      }
    }
    this.sitesB = true;
    this.searchservice.getListSearch(this.sitesB);
    this.searchservice.hide();
  }

  //send list period data to search:
  search() {
    let num = 0;
    for (let i = 0; i < this.resultp.length; i++) {
      if (this.resultp[i].checked) {
        this.periodChecked[num] = this.resultp[i];
        num++
      }
    }
    let exists: boolean;
    for (let index = 0; index < this.periodChecked.length; index++) {
      const elements = this.periodChecked[index];
      if (this.searchservice.list_search_result.length != 0) {
        for (let i = 0; i < this.searchservice.list_search_result.length; i++) {
          const element = this.searchservice.list_search_result[i];
          if (element.id == elements.periodID && element.nameEn == elements.nameEng) {
            exists = true;
            break
          }
          else exists = false;
        }
        if (!exists) {
          this.searchservice.list_search_result.push({ id: elements.periodID, nameEn: elements.nameEng, nameHe: elements.nameHeb, timeline: null, siternature: null, location: null, period: elements, perdiocal: null });
          this.searchservice.filterPeriod.push({ id: elements.periodID, nameEn: elements.nameEng, nameHe: elements.nameHeb, timeline: null, siternature: null, location: null, period: elements, perdiocal: null });
        }
      }
      else {
        this.searchservice.list_search_result.push({ id: elements.periodID, nameEn: elements.nameEng, nameHe: elements.nameHeb, timeline: null, siternature: null, location: null, period: elements, perdiocal: null });
        this.searchservice.filterPeriod.push({ id: elements.periodID, nameEn: elements.nameEng, nameHe: elements.nameHeb, timeline: null, siternature: null, location: null, period: elements, perdiocal: null });
      }
    }
    let periodExist = false;
    for (let index = 0; index < this.searchservice.filterPeriod.length; index++) {
      periodExist = false;
      const element = this.searchservice.filterPeriod[index];
      this.periodChecked.filter(x => { if (x.periodID == element.id) periodExist = true })
      if (!periodExist) {
        this.searchservice.filterPeriod.splice(index, 1);
        for (let ip = 0; ip < this.searchservice.list_search_result.length; ip++) {
          const elementsearch = this.searchservice.list_search_result[ip];
          if (element.id == elementsearch.id) this.searchservice.list_search_result.splice(ip, 1);
        }
      }
    }
    this.searchs();
    this.sitesB = true;
    this.searchservice.getListSearch(this.sitesB);
    this.searchservice.hide();
  }

  selectedOption(event) {
    this.selectedValue = event.option.value;
  }
}
export class PeriodRange {
  constructor(public lower: number, public upper: number) { }
}
