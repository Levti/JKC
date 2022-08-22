import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SearchSService } from '../Services/search-s.service';

@Component({
  selector: 'app-nav-bar-bottom',
  templateUrl: './nav-bar-bottom.component.html',
  styleUrls: ['./nav-bar-bottom.component.css']
})
export class NavBarBottomComponent implements OnInit {
  he: boolean=true;
  browserLang: string;
  filterNull: boolean = true;
  en: boolean;

  constructor(private translate: TranslateService, private searchService: SearchSService) {
    this.browserLang = this.translate.currentLang;
    if (this.browserLang == 'he') {
      this.he = true;
      this.en = false;
    }
    else if (this.browserLang == 'en') {
      this.en = true;
      this.he = false;
    };
  }


  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.browserLang = event.lang;
      if (this.browserLang == 'he') {
        this.he = true;
        this.en = false;
      }
      else {
        this.he = false;
        this.en = true;
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => { this.browserLang = event.lang; })
  }
}
