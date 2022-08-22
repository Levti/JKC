import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule, MatButtonModule, MatSidenavModule,
  MatIconModule, MatListModule, MatInputModule, MatSelectModule,
  MatRadioModule, MatCardModule, MatExpansionModule, MatCheckboxModule, MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule,
  MatTabsModule, MatButtonToggleModule, MatProgressSpinnerModule, MatSlideToggleModule, MatStepperModule,
  MatSnackBarModule, MatGridListModule, MatGridTile, MatTooltipModule, MatFormFieldModule, MatChipsModule,
  MatPaginatorModule, MAT_DATE_LOCALE, MatSlider, MatSliderModule, MatTreeModule, MatTableModule,MatProgressBarModule
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
// import { JwPaginationComponent } from 'jw-angular-pagination';
import { IgxSliderModule } from "igniteui-angular";
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { MatBadgeModule } from '@angular/material/badge';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule, ThemeService } from 'ng2-charts';

@NgModule({

  declarations: [],
  imports: [
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LayoutModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatSnackBarModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    ScrollDispatchModule,
    MatChipsModule,
    MatPaginatorModule,
    MatBadgeModule,
    MatSliderModule,
    MatTreeModule,
    MatTableModule,
    IgxSliderModule,
    BrowserModule,
    ChartsModule,
    MatProgressBarModule],
  exports: [
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LayoutModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatSnackBarModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    ScrollDispatchModule,
    MatChipsModule,
    MatPaginatorModule,
    MatBadgeModule,
    MatSliderModule,
    MatTreeModule,
    MatTableModule,
    IgxSliderModule,
    BrowserModule,
    ChartsModule,
    MatProgressBarModule],
  entryComponents: [],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'he' },
    ThemeService
  ]
})
export class MaterialsModule { }


