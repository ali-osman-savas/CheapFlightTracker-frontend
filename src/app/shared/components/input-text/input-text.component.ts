import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule],
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() maxlength: number | undefined = undefined;
  @Input() size: 'small' | 'large' | undefined = undefined;
  @Input() id: string = '';
  @Input() autocomplete: string = '';
  @Input() ariaLabel: string = '';
  @Input() ariaLabelledBy: string = '';
  @Input() styleClass: string = '';
  @Input() inputStyleClass: string = '';

  @Output() onInput = new EventEmitter<string>();
  @Output() onFocus = new EventEmitter<Event>();
  @Output() onBlur = new EventEmitter<Event>();
  @Output() onKeyDown = new EventEmitter<KeyboardEvent>();
  @Output() onKeyUp = new EventEmitter<KeyboardEvent>();

  value: string = '';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
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

  onInputKeyDown(event: KeyboardEvent): void {
    this.onKeyDown.emit(event);
  }

  onInputKeyUp(event: KeyboardEvent): void {
    this.onKeyUp.emit(event);
  }
}