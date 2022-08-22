import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LezichramComponent } from '../lezichram/lezichram.component';

@Component({
  selector: 'app-abou-us',
  templateUrl: './abou-us.component.html',
  styleUrls: ['./abou-us.component.css']
})
export class AbouUsComponent implements OnInit {
  browserLang: any;
  he: boolean = true;
  en: boolean;
  constructor(public translate: TranslateService, public dialog: MatDialog) { }

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
  openI(data: any) {
    return this.dialog.open(LezichramComponent, { data: { num: data }, panelClass: 'lezichram' })
  }
}
