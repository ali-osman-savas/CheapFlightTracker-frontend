import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule],
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ]
})
export class InputNumberComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() styleClass: string = 'w-full';
  @Input() inputStyleClass: string = 'w-full';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() min: number | undefined = undefined;
  @Input() max: number | undefined = undefined;
  @Input() step: number = 1;
  @Input() mode: 'decimal' | 'currency' = 'decimal';
  @Input() currency: string = 'TRY';
  @Input() currencyDisplay: 'symbol' | 'code' | 'name' = 'symbol';
  @Input() locale: string = 'tr-TR';
  @Input() minFractionDigits: number = 0;
  @Input() maxFractionDigits: number = 2;
  @Input() useGrouping: boolean = true;
  @Input() showButtons: boolean = false;
  @Input() buttonLayout: 'stacked' | 'horizontal' | 'vertical' = 'stacked';
  @Input() incrementButtonIcon: string = 'pi pi-angle-up';
  @Input() decrementButtonIcon: string = 'pi pi-angle-down';
  @Input() id: string = '';
  @Input() size: 'small' | 'large' | undefined = undefined;

  @Output() onInput = new EventEmitter<number | null>();
  @Output() onFocus = new EventEmitter<Event>();
  @Output() onBlur = new EventEmitter<Event>();

  value: number | null = null;
  
  private onChange = (value: number | null) => {};
  private onTouched = () => {};

  writeValue(value: number | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: any): void {
    let newValue = event.value;
    
    // Apply min/max constraints
    if (this.min !== undefined && newValue < this.min) {
      newValue = this.min;
    }
    if (this.max !== undefined && newValue > this.max) {
      newValue = this.max;
    }
    
    this.value = newValue;
    this.onChange(this.value);
    this.onInput.emit(this.value);
  }

  onInputFocus(event: Event): void {
    this.onTouched();
    this.onFocus.emit(event);
  }

  onInputBlur(event: Event): void {
    this.onBlur.emit(event);
  }
}