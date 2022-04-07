
import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[uppercase]',
  host: {
    '(input)': '$event'
  }
})
export class UppercaseInputDirective {

  lastValue: string = "";
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  constructor(public ref: ElementRef, private control : NgControl) { }

  @HostListener('input', ['$event']) onInput($event:any) 
  {
    this.control.control!.setValue($event.target.value.toUpperCase())
  }
}