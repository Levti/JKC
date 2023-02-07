import { Dexie } from 'dexie';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SearchSService } from 'src/app/Services/search-s.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SiteType } from './siteType.model';
import { ThemePalette } from '@angular/material';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-search-by-kind',
  templateUrl: './search-by-kind.component.html',
  styleUrls: ['./search-by-kind.component.css']
})
export class SearchByKindComponent implements OnInit {
  siteTypeList: SiteType[];
  checked: boolean;
  browserLang: any;
  he: boolean;
  en: boolean;
  siteNatureChecked: SiteType[] = [];
  result_search: any[] = [];
  rl: string = "rtl";
  sitesB: boolean;
  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'accent',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'},
    ],
  };

  constructor(private searchService: SearchSService, private translate: TranslateService) {
    this.browserLang = translate.currentLang;
    if (this.browserLang == 'en') {
      this.en = true
      this.he = false
      this.rl = "ltr"
    }
    else {
      this.he = true
      this.en = false
      this.rl = "rtl"
    }
  }

  ngOnInit() {
    this.searchService.kindSearch().subscribe(x => {
      this.siteTypeList = x;
      console.log(this.siteTypeList);
      for (let index = 0; index < this.siteTypeList.length; index++) {
        const element = this.siteTypeList[index];
        for (let kind = 0; kind < this.searchService.filterNature.length; kind++) {
          const nature = this.searchService.filterNature[kind];
          if (nature.id == element.findingSiteTypeID) this.siteTypeList[index].checked = true;
        }
      }
      var r = 0;
      for (let index = 0; index < this.siteTypeList.length; index++) {
        if (this.siteTypeList[index].findingSiteTypeHeb == null && this.siteTypeList[index].findingSiteTypeEng == null) {
          this.siteTypeList.splice(index, 1);
          r++;
        }
      }
    })
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

  search() {
    //var db = new Dexie("sitesData");
    /*const db = new Dexie('sitesData');

    db.open().then(() => {
      // Perform operations with the database
    
      // Wait for all transactions to complete
      db.transaction('rw', db.table("Sites"), function () {
        // Perform transactions with the database
    
        // End the transaction
        return Promise.resolve();
      }).then(() => {
        // Close the connection
        db.close();
    
        // Delete the database
        Dexie.delete('sitesData').then(() => {
          console.log('Database deleted successfully');
        }).catch(error => {
          console.error('Error deleting database: ', error);
        });
      });
    });
    console.log("deleted");*/
    let n = 0;
    for (let index = 0; index < this.siteTypeList.length; index++) {
      if (this.siteTypeList[index].checked) {
        this.siteNatureChecked[n] = this.siteTypeList[index];
        n++;
      }
    }
    n = 0;
    for (let i = 0; i < this.siteNatureChecked.length; i++) {
      let exists: boolean = false;
      const elements = this.siteNatureChecked[i];
      if (this.searchService.list_search_result.length != 0) {
        for (let index = 0; index < this.searchService.list_search_result.length; index++) {
          const element = this.searchService.list_search_result[index];
          if (element.id == elements.findingSiteTypeID && element.nameEn == elements.findingSiteTypeEng) {
            exists = true;
            break
          }
        }
        if (!exists) {
          this.searchService.list_search_result.push({ id: elements.findingSiteTypeID, nameEn: elements.findingSiteTypeEng, nameHe: elements.findingSiteTypeHeb, timeline: null, siternature: elements, perdiocal: null, period: null, location: null })
          this.searchService.filterNature.push({ id: elements.findingSiteTypeID, nameEn: elements.findingSiteTypeEng, nameHe: elements.findingSiteTypeHeb, timeline: null, siternature: elements, perdiocal: null, period: null, location: null })
        }
      }
      else {
        this.searchService.list_search_result.push({ id: elements.findingSiteTypeID, nameEn: elements.findingSiteTypeEng, nameHe: elements.findingSiteTypeHeb, timeline: null, siternature: elements, perdiocal: null, period: null, location: null })
        this.searchService.filterNature.push({ id: elements.findingSiteTypeID, nameEn: elements.findingSiteTypeEng, nameHe: elements.findingSiteTypeHeb, timeline: null, siternature: elements, perdiocal: null, period: null, location: null })
      }
    }
    let netureExist;
    for (let index = 0; index < this.searchService.filterNature.length; index++) {
      const element = this.searchService.filterNature[index];
      this.siteNatureChecked.filter(x => { if (x.findingSiteTypeID == element.id) netureExist = true; })
      if (!netureExist) {
        this.searchService.filterNature.splice(index, 1)
        for (let i = 0; i < this.searchService.list_search_result.length; i++) {
          const nature = this.searchService.list_search_result[i];
          if (nature.id == element.id) this.searchService.list_search_result.splice(i, 1)
        }
      }
    }

    this.sitesB = true;
    this.searchService.getListSearch(this.sitesB);
    this.searchService.hide();
    // this.searchService.getListSite(this.searchService.list_search_result).subscribe(x=>{console.log(x)});
    // alert("החיפוש יהיה זמין בקרוב")
  }
}