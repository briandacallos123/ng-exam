import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, SimpleChanges } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true,
    },
  ],
})
export class FormSelectComponent implements ControlValueAccessor, Validator {
  @Input({ required: true }) options: string[] = [];
  @Input() label!: string;
  @Input() errorMessage: string = '';

  value: string = '';
  disabled = false;
  touched = false;

  // ControlValueAccessor
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.touched = true;
  }

  // Validator
  validate(control: AbstractControl): ValidationErrors | null {
    return control.valid ? null : { invalid: true };
  }
}
