import { Directive, ElementRef, Input, OnInit, Renderer } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements OnInit{
  @Input('appAutoFocus') isFocused: boolean;

  constructor(private hostElemen?:ElementRef) { }
  ngOnInit(){
    if (!this.isFocused) {
      this.hostElemen.nativeElement.click();
    }
  }

}
