import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() header: string = '';
  @Input() subheader: string = '';
  @Input() styleClass: string = '';
  @Input() headerStyleClass: string = '';
  @Input() bodyStyleClass: string = '';
  @Input() footerStyleClass: string = '';

  @ContentChild('headerTemplate') headerTemplate: TemplateRef<any> | undefined;
  @ContentChild('contentTemplate') contentTemplate: TemplateRef<any> | undefined;
  @ContentChild('footerTemplate') footerTemplate: TemplateRef<any> | undefined;
}