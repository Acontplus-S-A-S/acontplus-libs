import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[acpToUpperCase]'
})
export class ToUpperCaseDirective {

  constructor(private elementRef: ElementRef) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.elementRef.nativeElement.value = value.toUpperCase();
  }

}
