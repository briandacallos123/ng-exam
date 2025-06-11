import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [CommonModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor, Validator {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() errorMessage: string = '';
  @Input() label: string = '';
  @Input({ required: true }) name!: string;

  value: string = '';
  disabled = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    console.log(this.label, 'label');
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.valid ? null : { invalid: true };
  }

  onInput(event: any) {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
  }
  onBlur() {
    this.onTouched(); // ✅ Mark as touched when blurred
  }
}
