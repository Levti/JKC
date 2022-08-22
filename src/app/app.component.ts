import { Component, ViewEncapsulation } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { SearchSService } from './Services/search-s.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent { 
  title = 'JerusalemP';
  constructor(private translate:TranslateService,private s:SearchSService){
    translate.addLangs(['en','he']);
    translate.setDefaultLang('he');
  }
}
