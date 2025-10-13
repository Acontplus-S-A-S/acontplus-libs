import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[acpToUpperCase]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ToUpperCase,
      multi: true,
    },
  ],
})
export class ToUpperCase implements ControlValueAccessor {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('input') onInput() {
    const value = this.el.nativeElement.value;
    this.el.nativeElement.value = value.toUpperCase();
    this.onChange(value.toUpperCase()); // Llamar a la función que actualiza el valor del modelo
  }

  // Funciones de ControlValueAccessor
  onChange = (_value: string) => {
    // ControlValueAccessor callback
  };
  onTouched = () => {
    // ControlValueAccessor callback
  };

  writeValue(value: string): void {
    if (value) {
      this.el.nativeElement.value = value.toUpperCase();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
