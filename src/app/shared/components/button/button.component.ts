import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() iconPos: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @Input() styleClass: string = '';
  @Input() style: { [key: string]: any } | null = null;
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() severity: 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast' | undefined = undefined;
  @Input() raised: boolean = false;
  @Input() rounded: boolean = false;
  @Input() text: boolean = false;
  @Input() outlined: boolean = false;
  @Input() size: 'small' | 'large' | undefined = undefined;
  @Input() plain: boolean = false;
  @Input() loading: boolean = false;
  @Input() loadingIcon: string = 'pi pi-spinner pi-spin';
  @Input() link: boolean = false;
  @Input() tabindex: number | undefined = undefined;
  @Input() ariaLabel: string = '';
  @Input() badge: string = '';
  @Input() badgeClass: string = '';
  @Input() tooltip: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @Output() onClick = new EventEmitter<Event>();
  @Output() onFocus = new EventEmitter<Event>();
  @Output() onBlur = new EventEmitter<Event>();

  @ContentChild('contentTemplate') contentTemplate: TemplateRef<any> | undefined;

  onButtonClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }

  onButtonFocus(event: Event): void {
    this.onFocus.emit(event);
  }

  onButtonBlur(event: Event): void {
    this.onBlur.emit(event);
  }
}