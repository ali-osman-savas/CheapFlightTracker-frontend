import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePicker],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Tarih seçin';
  @Input() dateFormat: string = 'dd/mm/yy';
  @Input() styleClass: string = 'w-full';
  @Input() inputStyleClass: string = 'w-full';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() showIcon: boolean = false;
  @Input() showButtonBar: boolean = false;
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() id: string = '';

  @Output() onSelect = new EventEmitter<Date | null>();
  @Output() onClear = new EventEmitter<void>();

  value: Date | null = null;

  private onChange = (value: Date | null) => {};
  private onTouched = () => {};

  writeValue(value: Date | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateSelect(event: any): void {
    this.value = event;
    this.onChange(this.value);
    this.onTouched();
    this.onSelect.emit(this.value);
  }

  onDateClear(): void {
    this.value = null;
    this.onChange(this.value);
    this.onTouched();
    this.onClear.emit();

  }
}
