import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRegex]'
})
export class RegexDirective {
  @Input('regexType') numericType: string;
  private regex: { [key: string]: RegExp } = {
    number: new RegExp(/^\d+$/),
    letter_with: new RegExp(/^[a-zA-Z-&]+$/g),
    letter_only: new RegExp(/^[a-zA-Z]+$/g),
    letter_space: new RegExp(/^[a-zA-Z ]+$/g),
    letter_num: new RegExp(/^[a-zA-Z0-9]+$/g),
    letter_num_space: new RegExp(/^[a-zA-Z0-9 ]+$/g),
    letter_num_special: new RegExp(/^[a-zA-Z0-9-@#$%^&*!()_+\-=\[\]{};':"\\|,.<>\/?]+$/g),
    remark: new RegExp(/^[a-zA-Z0-9-@#$%^&*!()_+\-=\[\]{};:\\,.<>\/? \n]+$/g),
    url: new RegExp(/^[a-zA-Z\-]+$/g),
    decimal: new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g),
    email: new RegExp(/^[a-zA-Z0-9@_.]+$/g),
    long_lat_number: new RegExp(/^[0-9]{0,3}(\.[0-9]{0,5})?$/g),
    global_limit: new RegExp(/^[0-9]{1,12}(\.[0-9]{0,2})?$/g),
    newEmail: new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:(?:,[a-zAZ0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*)?$/g),
    letter_num_dash: new RegExp(/^(G-)?[0-9]+?$/),
    nic: new RegExp(/^[0-9V-v]{1,15}$/g)
  };
  private specialKeys: { [key: string]: string[] } = {
    number: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    letter_with: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    letter_only: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    letter_space: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    letter_num: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    letter_num_space: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    letter_num_special: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    remark: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    url: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    decimal: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    email: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    long_lat_number: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    global_limit: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    newEmail: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    letter_num_dash: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'],
    nic: ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight']
  };

  constructor(private elementRef: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (
      this.numericType &&
      this.specialKeys[this.numericType] &&
      this.specialKeys[this.numericType].indexOf(event.key) !== -1
    ) {
      return;
    }
    if (event.ctrlKey || event.metaKey) {
      // Allow copying and pasting
      return;
    }
    const current: string = this.elementRef.nativeElement.value;
    const next: string = current.concat(event.key);
    if (this.numericType && next && !String(next).match(this.regex[this.numericType])) {
      event.preventDefault();
    }
  }

  @HostListener('click', ['$event'])
  onKeyDown2(event: KeyboardEvent) {
    const current: string = this.elementRef.nativeElement.value;
    const element = this.elementRef.nativeElement;
    if (this.numericType && current) {
      if (!String(current).match(this.regex[this.numericType])) {
        this.elementRef.nativeElement.value = '';
        setTimeout(function (event) {
          element.click();
        }, 100);
      }
    }
  }
}
