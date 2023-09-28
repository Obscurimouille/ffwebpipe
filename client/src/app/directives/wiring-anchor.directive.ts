import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[wiringAnchor]'
})
export class WiringAnchorDirective {

  @Output() mouseDown = new EventEmitter<ElementRef>();
  @Output() mouseUp = new EventEmitter<ElementRef>();

  constructor(private element: ElementRef) { }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.mouseDown.emit(this.element);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.mouseUp.emit(this.element);
  }

}
