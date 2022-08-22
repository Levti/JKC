import { AfterViewInit, Directive, Host, Optional, Renderer2, Self, ViewContainerRef, Input } from '@angular/core';
import { MatPaginator } from '@angular/material';

@Directive({
  selector: '[style-paginator]'
})
export class StylePaginatorDirective implements AfterViewInit {
  private _currentPage = 1;
  private _pageGapTxt = '...';
  private _rangeStart;
  private _rangeEnd;
  private _buttons = [];

  private _showTotalPages = 3;

  @Input()

  get showTotalPages(): number { return this._showTotalPages; }
  set showTotalPages(value: number) {
    this._showTotalPages = value % 2 === 0 ? value + 1 : value;
  }

  constructor(@Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private vr: ViewContainerRef, private ren: Renderer2) {
  }
  public ngAfterViewInit() {
    this.initPageRange();
    //Sub to rerender buttons when next page and last page is used
    this.matPag.page.subscribe((v) => {
      this.switchPage(v.pageIndex);
    });
  }
  private buildPageNumbers() {
    const actionContainer = this.vr.element.nativeElement.querySelector(
      'div.mat-paginator-range-actions'
    );
    const nextPageNode = this.vr.element.nativeElement.querySelector(
      'button.mat-paginator-navigation-next'
    );

    const paginatorRangeLabel = this.vr.element.nativeElement.querySelector(
      'div.mat-paginator-range-label'
    );
    // this.ren.setStyle(paginatorRangeLabel, 'visibility', 'hidden');
    //visibility: hidden;
    const prevButtonCount = this._buttons.length;
    // remove buttons before creating new ones
    if (this._buttons.length >= 1) {
      this._buttons.forEach(button => {
        this.ren.removeChild(actionContainer, button);
      });
      //Empty state array
      this._buttons.length = 0;
    }

    //initialize next page and last page buttons
    if (this._buttons.length === 0) {
      let nodeArray = this.vr.element.nativeElement.childNodes[0].childNodes[0]
        .childNodes[1].childNodes;
      setTimeout(() => {
        for (let i = 0; i < nodeArray.length; i++) {
          if (nodeArray[i].nodeName === 'BUTTON') {
            if (nodeArray[i].disabled) {
              this.ren.setStyle(nodeArray[i], 'color', 'black');
              this.ren.setStyle(nodeArray[i], 'cursor', 'arrow');
            }
            else {
              this.ren.setStyle(nodeArray[i], 'color', 'black');
              this.ren.setStyle(nodeArray[i], 'background-color', 'transparent ');
            }
          }
        }
      });
    }

    let dots = false;
    for (let i = 0; i < this.matPag.getNumberOfPages() + 3; i += 1) {
      if (
        (i < this._showTotalPages && this._currentPage < this._showTotalPages && i > this._rangeStart) ||
        (i >= this._rangeStart && i <= this._rangeEnd)
      ) {
        // debugger
        this.ren.insertBefore(
          actionContainer,
          this.createButton(i, this.matPag.pageIndex),
          nextPageNode
        );
      } 
      //...
      // else {
      //   if (i > this._rangeEnd && !dots) {
      //     this.ren.insertBefore(
      //       actionContainer,
      //       this.createButton(this._pageGapTxt, this.matPag.pageIndex),
      //       nextPageNode
      //     );
      //     dots = true;
      //   }
      // }    
    }
  }

  private createButton(i: any, pageIndex: number): any {
    const linkBtn = this.ren.createElement('button');
    this.ren.addClass(linkBtn, 'mat-mini-fab');
    this.ren.setStyle(linkBtn, 'background-color', 'Transparent');
    this.ren.setStyle(linkBtn, 'margin', '0.8%');
    this.ren.setStyle(linkBtn, 'box-shadow', 'none')
    const pagingTxt = isNaN(i + 1) ? this._pageGapTxt : +(i + 1);
    const text = this.ren.createText(pagingTxt + '');

    this.ren.addClass(linkBtn, 'mat-custom-page');
    switch (i) {
      case pageIndex:
        //this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        this.ren.setStyle(linkBtn, 'border-style', 'solid');
        this.ren.setStyle(linkBtn, 'border-width', '1.5px')
        break;
      case this._pageGapTxt:
        this.ren.listen(linkBtn, 'click', () => {
          this.switchPage(this._currentPage + this._showTotalPages);
        });
        break;
      default:
        this.ren.listen(linkBtn, 'click', () => {
          this.switchPage(i);
        });
        break;
    }
    this.ren.appendChild(linkBtn, text);
    this._buttons.push(linkBtn);
    return linkBtn;
  }

  private initPageRange(): void {
    this._rangeStart = this._currentPage - this._showTotalPages / 2;
    this._rangeEnd = this._currentPage + this._showTotalPages / 2;

    this.buildPageNumbers();
  }

  private switchPage(i: number): void {
    this._currentPage = i;
    this.matPag.pageIndex = i;
    this.initPageRange();
  }
}