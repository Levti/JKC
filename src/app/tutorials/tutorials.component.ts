import { Component, Inject, Injectable, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.css']
})

@Injectable({
  providedIn: 'root'
})


export class TutorialsComponent implements OnInit {

  showViewshed: boolean = false;
  showDistanceTime: boolean = false;
  showAzimuth: boolean = false;

  @Input() content: string;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<TutorialsComponent>) { }

  ngOnInit() {
    //this.data = this.dialogRef.componentInstance.data;
    this.showViewshed = this.data.showViewshed;
    this.showDistanceTime = this.data.showDistanceTime;
    this.showAzimuth = this.data.showAzimuth;
  }
}
