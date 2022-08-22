import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SearchSService } from '../Services/search-s.service';
import { OKComponent } from './ok/ok.component';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  name: string;
  email: EmailValidator;
  content: string;
  contactForm: FormGroup;
  comment: string;
  FirstName = new FormControl('', [Validators.required]);
  browserLang = 'he';
  he: boolean = true;
  en: boolean;

  constructor(private searchService: SearchSService, private dialog: MatDialog, private formBuilder: FormBuilder, private translate: TranslateService) {
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.browserLang = event.lang;
      if (this.browserLang == 'he') {
        this.he = true
        this.en = false
      }
      else if (this.browserLang == 'en') {
        this.en = true
        this.he = false
      }
    });
    this.createValid();
  }
  createValid() {
    this.contactForm = new FormGroup({
      'email': new FormControl('', [Validators.email]),
      'name': new FormControl('', Validators.maxLength(20)),
      'comment': new FormControl('', Validators.maxLength(1000))
    });
  }
  getErrorMessageFirstName() { return this.FirstName.hasError('required') ? 'שדה חובה!!' : ''; }

  sendQue() {
    console.log(this.browserLang)
    if (this.contactForm.valid) {

      this.searchService.sendEmail(this.email, this.name, this.comment).subscribe(x => {
        if (x) {
          return this.dialog.open(OKComponent, { data: { lang: this.browserLang } });
        }
        else {
          if (this.he) alert("המערכת נתקלה בבעיה, נסה שוב מאוחר יותר");
          else if (this.en) alert("The system encountered a problem, please try again later")
        }
      });
    }
    else {
      if (this.he) alert("נא ודא שהכנסת את כל הפרטים");
      else if (this.en) alert("Please make sure you have entered all the details");
    }
  }
  closeSearch() {
    this.searchService.hide();
  }

}
