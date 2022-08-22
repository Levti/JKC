import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { SitesService } from 'src/app/Services/sites.service';
import { ArrayBook, Jos, Site } from '../classes';

// English range label:
const englishRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 of ${length}`; }
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} of ${length}`;
}
//Hebrew range label:
const hebrewRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 מתוך ${length}`; }
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} מתוך ${length}`;
}

@Component({
  selector: 'app-information-history',
  templateUrl: './information-history.component.html',
  styleUrls: ['./information-history.component.css']
})

export class InformationHistoryComponent implements OnInit {
  browserLang: any;
  he: boolean;
  en: boolean;
  histSite: Site;
  public unitsJ: Jos[] = [];
  public allUnits: Jos[] = [];
  @ViewChild(MatPaginator, undefined) public paginator: MatPaginator;
  dataSource: MatTableDataSource<Jos>;
  textUnits: Observable<Jos[]>;
  values: any;
  unitsJF: FormGroup;
  arrayBook: ArrayBook[] = [];
  event: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public searchservice: SitesService, private fb: FormBuilder, private translate: TranslateService) { }

  ngOnInit() {
    //Gets a current language:
    this.browserLang = this.data.lang;
    if (this.browserLang === 'he') {
      this.he = true;
      this.en = false;
      //lang of paginator range label:
      this.paginator._intl.getRangeLabel = hebrewRangeLabel;
    }
    else if (this.browserLang === 'en') {
      this.en = true;
      this.he = false;
      //lang of paginator range label:
      this.paginator._intl.getRangeLabel = englishRangeLabel;
    }
    //location and name of this site:
    this.histSite = this.data.hist;
    console.log("hist")
    console.log(this.histSite);
    //
    // this.allUnits = this.data.book;
    // console.log("allUnits");
    // console.log(this.allUnits);
    //units in the book:
    from<any>(this.data.book).pipe(distinct((p: Jos) => p['newSection']),).subscribe(x => {
      this.unitsJ.push(x)
    });
    from<any>(this.data.book).pipe(distinct((p: Jos) => p['essayCode']),).subscribe(x => {
      this.arrayBook.push(x);
    });
    //all current book:
    console.log("arrayBook")
    console.log(this.arrayBook);
    // units:
    console.log("unitsJ")
    this.unitsJ[0].selected = true;
    console.log(this.unitsJ);
    this.goToPage(this.unitsJ[0])
  }
  //Show of a selected sentence from the book
  goToPage(event) {
    this.event = event;
    for (let index = 0; index < this.unitsJ.length; index++) {
      if (this.unitsJ[index].newSection == event.newSection) {
        this.unitsJ[index].selected = true;
      }
      else {
        this.unitsJ[index].selected = false;
      }
    }
    // Receiving a book according to the chosen units:
    this.searchservice.getvalues(event.textUnitsCode, event.essayCode, event.bookNum, event.codeConversion).subscribe(x => {
      this.values = x;
      console.log("values")
      console.log(this.values);
      this.dataSource = new MatTableDataSource<any>(this.values.bookJ);
      this.textUnits = this.dataSource.connect();
      this.dataSource.paginator = this.paginator;
      //paginator like the choosen units:
      this.paginator.pageIndex = this.values.bookJ.findIndex(x => x.code === this.values.codeSelect);
      this.paginator.page.next({
        pageIndex: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
        length: this.paginator.length
      });
    });
  }
}