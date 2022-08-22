import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchByLocationComponent } from './search/search-by-location/search-by-location.component';
import { MaterialsModule } from './material/materials.module';
import { SearchByPeriodComponent } from './search/search-by-period/search-by-period.component';
import { MapsComponent, CustomPaginator } from './maps/maps.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SearchByKindComponent } from './search/search-by-kind/search-by-kind.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBySourceComponent } from './search/search-by-source/search-by-source.component';
import { InformationComponent } from './maps/information/information.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { NavBarBottomComponent } from './nav-bar-bottom/nav-bar-bottom.component';
// import { JwPaginationComponent } from 'jw-angular-pagination';
import { StylePaginatorDirective } from './maps/style-paginator.directive';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { VerticalTimelineModule } from 'angular-vertical-timeline';
import { MatPaginatorIntl } from '@angular/material';
import { InformationHistoryComponent } from './maps/information-history/information-history.component';
import { LezichramComponent } from './about/lezichram/lezichram.component';
import { TheCenterComponent } from './about/the-center/the-center.component';
import { PartnersComponent } from './about/partners/partners.component';
import { AbouUsComponent } from './about/abou-us/abou-us.component';
import { LightboxModule } from 'ngx-lightbox';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { OKComponent } from './contact-us/ok/ok.component';
import { OnlyNumberDirective } from './maps/only-number.directive';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartModule } from 'angular-highcharts';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ScrollToBottomDirective } from './maps/scroolToBottom.directive';
import { AutoFocusDirective } from './auto-focus.directive';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SiteConstructionComponent } from './site-construction/site-construction.component';
import { DistanceTimeComponent } from './maps/distance-time/distance-time.component';
import { ViewshedComponent } from './maps/viewshed/viewshed.component';
import { AzimuthComponent } from './maps/azimuth/azimuth.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RegionsComponent } from './maps/regions/regions.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    SearchByLocationComponent,
    SearchByPeriodComponent,
    MapsComponent,
    NavBarComponent,
    SearchByKindComponent,
    SearchBySourceComponent,
    InformationComponent,
    NavBarBottomComponent,
    // JwPaginationComponent,
    StylePaginatorDirective,
    ContactUsComponent,
    InformationHistoryComponent,
    LezichramComponent,
    TheCenterComponent,
    PartnersComponent,
    AbouUsComponent,
    OKComponent,
    OnlyNumberDirective,
    ScrollToBottomDirective,
    AutoFocusDirective,
    PageNotFoundComponent,
    SiteConstructionComponent,
    DistanceTimeComponent,
    ViewshedComponent,
    AzimuthComponent,
    RegionsComponent,
    // HighchartsChartModule
  ],
  imports: [
    GalleryModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialsModule,
    HttpClientModule,
    FormsModule,
    ClickOutsideModule,
    ReactiveFormsModule,
    VerticalTimelineModule,
    LightboxModule,
    HighchartsChartModule,
    ChartModule,
    DragDropModule,
    MDBBootstrapModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }],
  bootstrap: [AppComponent],
  entryComponents: [
    InformationComponent, OKComponent, InformationHistoryComponent, LezichramComponent, SiteConstructionComponent
  ]
})
export class AppModule { }