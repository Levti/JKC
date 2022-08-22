import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-lezichram',
  templateUrl: './lezichram.component.html',
  styleUrls: ['./lezichram.component.css']
})
export class LezichramComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
