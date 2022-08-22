import { Component, OnInit } from '@angular/core';
import { SearchSService } from 'src/app/Services/search-s.service';
import { perdiocal } from './perdiocal.model';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-by-source',
  templateUrl: './search-by-source.component.html',
  styleUrls: ['./search-by-source.component.css']
})
export class SearchBySourceComponent implements OnInit {
  sourceList: perdiocal[];
  sourceChecked: perdiocal[] = [];
  browserLang: any;
  he: boolean = true;
  en: boolean;
  rl: string = "rtl";
  sitesB: boolean;

  constructor(private searchService: SearchSService, private translate: TranslateService) {
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
    console.log(this.he)
  }

  ngOnInit() {
    this.searchService.sourceSearch().subscribe(x => {
      this.sourceList = x;
      for (let i = 0; i < this.sourceList.length; i++) {
        const element = this.sourceList[i];
        for (let index = 0; index < this.searchService.filterPerdiocals.length; index++) {
          const source = this.searchService.filterPerdiocals[index];
          if (element.periodicalID == source.id) this.sourceList[i].checked = true;
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
    let n = 0;
    for (let i = 0; i < this.sourceList.length; i++) {
      if (this.sourceList[i].checked) {
        this.sourceChecked[n] = this.sourceList[i];
        n++;
      }
    }
    n = 0;
    for (let i = 0; i < this.sourceChecked.length; i++) {
      let exists: Boolean = false;
      const elements = this.sourceChecked[i];
      if (this.searchService.list_search_result.length != 0) {
        for (let e = 0; e < this.searchService.list_search_result.length; e++) {
          const element = this.searchService.list_search_result[e];
          if (element.id == elements.periodicalID && element.nameEn == elements.periodicalNameEng) {
            exists = true;
          }
        }
        if (!exists) {
          this.searchService.list_search_result.push({ id: elements.periodicalID, nameEn: elements.periodicalNameEng, nameHe: elements.periodicalNameHeb, timeline: null, siternature: null, period: null, perdiocal: elements, location: null });
          this.searchService.filterPerdiocals.push({ id: elements.periodicalID, nameEn: elements.periodicalNameEng, nameHe: elements.periodicalNameHeb, timeline: null, siternature: null, period: null, perdiocal: elements, location: null });
        }
      }
      else {
        this.searchService.list_search_result.push({ id: elements.periodicalID, nameEn: elements.periodicalNameEng, nameHe: elements.periodicalNameHeb, timeline: null, siternature: null, period: null, perdiocal: elements, location: null });
        this.searchService.filterPerdiocals.push({ id: elements.periodicalID, nameEn: elements.periodicalNameEng, nameHe: elements.periodicalNameHeb, timeline: null, siternature: null, period: null, perdiocal: elements, location: null });
      }
    }
    let sourceExist;
    for (let index = 0; index < this.searchService.filterPerdiocals.length; index++) {
      const element = this.searchService.filterPerdiocals[index];
      this.sourceChecked.filter(x => { if (x.periodicalID == element.id) sourceExist = true; })
      if (!sourceExist) {
        this.searchService.filterPerdiocals.splice(index, 1);
        for (let source = 0; index < this.searchService.list_search_result.length; index++) {
          const sourceSearch = this.searchService.list_search_result[source];
          if (element.id == sourceSearch.id) this.searchService.list_search_result.splice(source, 1);
        }
      }
    }
    this.sitesB = true;
    this.searchService.getList(this.sitesB);
    this.searchService.hide();
  }

}
