import { Component, OnInit, Output, EventEmitter, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchSService } from 'src/app/Services/search-s.service';
import { startWith, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject, iif } from 'rxjs';
import { searchDetails } from '../search.model';
import { exists } from 'fs';

@Component({
  selector: 'app-search-by-location',
  templateUrl: './search-by-location.component.html',
  styleUrls: ['./search-by-location.component.css'],
})
export class SearchByLocationComponent implements OnInit, AfterViewInit {
  searctrl: FormControl;
  searchText = new Subject<string>();
  placeSearch = new Observable<searchDetails[]>();
  @Output() displayR = new EventEmitter<boolean>();
  @Output() custsearc = new EventEmitter<string[]>();
  @Input() resultSearch;
  hideorn: boolean = true;
  disDraw: boolean;
  disPoint: boolean;
  disEnter: boolean;
  selectedValue: string;
  x: any;
  y: any;
  sitesB: boolean;
  xy: number[] = [];
  sitesNames: any;
  @ViewChild("endInput", { static: false }) endInput;
  isLoadingData: boolean;

  constructor(private searchservice: SearchSService) {
    this.searctrl = new FormControl();
    this.placeSearch = null;
  }

  ngOnInit() {
    this.selectedValue = '';
    this.searchText.pipe(debounceTime(200), distinctUntilChanged(), switchMap(x => this.searchservice.searchByLocation(<any>x)))
      .subscribe((x: any[]) => this.placeSearch = <any>x);
    for (let index = 0; index < this.searchservice.list_search_result.length; index++) {
      const element = this.searchservice.list_search_result[index];
      if (element.id == 0.1) {
        this.selectedValue = element.nameHe;
      }
    }
    this.placeSearch = this.searchservice.searchByLocation(<any>this.searchText);
  }
  ngAfterViewInit() {
    this.endInput.nativeElement.focus();
  }
  setElement(event) {
    console.log(event);
  }
  searchL(searchL: string) {
    this.searchText.next(searchL);
  }
  search() {
    this.isLoadingData = this.searchservice.isLoadingData = true;
    let selectValue = { id: 0.1, nameHe: this.selectedValue, nameEn: this.selectedValue, timeline: null, period: null, perdiocal: null, siternature: null, location: this.selectedValue };
    let selectedValueExists: boolean;
    for (let index = 0; index < this.searchservice.list_search_result.length; index++) {
      const element = this.searchservice.list_search_result[index];
      if (this.selectedValue != null) {
        if (element.id == 0.1) {
          selectedValueExists = true;
          this.searchservice.list_search_result[index] = selectValue;
          this.searchservice.filterLocation[0] = selectValue;
        }
      }
    }
    if (!selectedValueExists && this.selectedValue != null) {
      this.searchservice.list_search_result.push(selectValue);
      this.searchservice.filterLocation.push(selectValue);
    }

    this.sitesB = true;
    this.searchservice.getList(this.sitesB);
    this.searchservice.hide();
  }

  selectedOption(event) {
    this.selectedValue = event.option.value;
    console.log(this.selectedValue);
  }
}
