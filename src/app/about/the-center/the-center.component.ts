import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-the-center',
  templateUrl: './the-center.component.html',
  styleUrls: ['./the-center.component.css']
})
export class TheCenterComponent implements OnInit {
  browserLang: any;
  he: boolean = true;
  en: boolean;
  navDesign: boolean = false;

  constructor(public translate: TranslateService) { }

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
  }

}
