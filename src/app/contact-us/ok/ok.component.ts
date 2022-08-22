import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-ok',
  templateUrl: './ok.component.html',
  styleUrls: ['./ok.component.css']
})
export class OKComponent implements OnInit {
  browserLang: any;
  he: boolean;
  en: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.browserLang = this.data.lang;
    if (this.browserLang == 'he') {
      this.he = true;
      this.en = false;
    }
    else if (this.browserLang == 'en') {
      this.en = true;
      this.he = false;
    }
    console.log(this.browserLang)
  }

}
