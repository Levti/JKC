import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapsComponent } from './maps/maps.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TheCenterComponent } from './about/the-center/the-center.component';
import { PartnersComponent } from './about/partners/partners.component';
import { AbouUsComponent } from './about/abou-us/abou-us.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    { path: '', component: MapsComponent },
    { path: 'Dev', component: MapsComponent },
    { path: 'map', component: MapsComponent },
    { path: 'Contact', component: ContactUsComponent },
    { path: 'TheCenter', component: TheCenterComponent },
    { path: "Partners", component: PartnersComponent },
    { path: "AboutUs", component: AbouUsComponent },
    { path: '**', component: PageNotFoundComponent }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
