import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { from } from 'rxjs';
import { distinct } from 'rxjs/operators';
import { SitesService } from 'src/app/Services/sites.service';
import { lstFinding, lst_src, Sites } from '../arch-site-model';
import { Site } from '../classes';
import { Image } from '@ks89/angular-modal-gallery';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  archSite: Sites;
  browserLang: any;
  he: boolean;
  en: boolean;
  showHebName: boolean;
  ypicture: boolean;
  periods = [];
  i = 0;
  y = 0;
  closestArch = [];
  lstFinding: lstFinding[] = [];
  isImage: boolean = true;
  showModal: boolean;
  lst_src: lst_src[] = [];
  lstFindingIs: boolean;
  albums: any = [];
  arrayImages: Image[] = [];
  larrayImages: Image[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private siteservice: SitesService, private translate: TranslateService, private dialog: MatDialog, public dialogRef: MatDialogRef<InformationComponent>) { }

  ngOnInit() {
    console.log("hi information");

    //Gets a current language:
    this.browserLang = this.translate.getDefaultLang();
    if (this.browserLang === 'he') {
      this.he = true;
      this.en = false;
    }
    else if (this.browserLang === 'en') {
      this.en = true;
      this.he = false;
    }
    console.log(this.en);
    console.log(this.he);
    //pictures of the site:
    for (let index = 0; index < this.data.arch.images.length; index++) {
      const element = this.data.arch.images[index];
      this.arrayImages.push(
        new Image(index, { img: element.imagePath + element.imageName, description: element.imageName })
      )
    }
    this.larrayImages = [new Image(1, { img: '.../../assets/pictures/298-05-3.jpg', description: 'description 1' }),
    new Image(2, { img: '.../../assets/pictures/298-05-5.jpg', description: "description 2" })]
    console.log(this.larrayImages)
    console.log(this.arrayImages)

    this.archSite = this.data.arch;
    console.log(this.archSite)
    //Nearby sites:
    this.closestArch = this.data.closestArch;
    console.log(this.closestArch);
    // this.arrayImages = this.data.arch.images;
    for (let index = 0; index < this.archSite.lst_src.length; index++) {
      const element = this.archSite.lst_src[index];
      if (element.url != null) {
        if (!element.url.startsWith('http')) {
          element.url = null;
        }
      }
    }
    if (this.archSite.lstFinding.length != 0) this.lstFindingIs = true;
    if (this.arrayImages.length == 0) this.isImage = false;
    for (let i = 1; i < 10; i++) this.periods.push(this.archSite.periods[i]);//.replace(/\s*,\s*/g, ', ')) 
    //design hebrew/english if the siteName null
    if (this.archSite.siteNames[2] == null || this.archSite.siteNames[2] == '' || this.archSite.siteNames[2] == undefined) {
      this.showHebName = true;
    }
    else this.showHebName = false;
    from<any>(this.archSite.lstFinding).pipe(distinct((p: lstFinding) => p['findingID']),).subscribe(x => {
      this.lstFinding.push(x);
    });
  }
  ngAfterViewInit() {
    //design pictures:
    if (this.arrayImages.length != 0) {
      (document.querySelector('#current-image') as HTMLElement).style.height = '200px';
    }
  }

  //Open informatio of the choosen sites:
  openInformation(e: any) {
    this.dialogRef.close();
    let closestArchs: Site[];
    console.log(e.wgS84_Info.geography)
    this.siteservice.GetClosetsSites(e.wgS84_Info.geography).subscribe(x => {
      closestArchs = x;
      console.log("closestArch");
      console.log(closestArchs);
      this.siteservice.GetSiteId(e.resourceID).subscribe(x => {
        return this.dialog.open(InformationComponent, {
          data: { arch: x, lang: this.browserLang, closestArch: closestArchs }
          , panelClass: 'custom-dialog-container'
        });
      });
    });
  }
}