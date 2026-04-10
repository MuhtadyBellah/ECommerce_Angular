import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() iconClass?: string;
  @Input() breadcrumbItems: { label: string; link?: string }[] = [];
  @Input() showBackButton = false;
  @Input() backLink?: string;
}
