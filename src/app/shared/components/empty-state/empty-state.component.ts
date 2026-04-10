import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
})
export class EmptyStateComponent {
  @Input() icon: string = 'box-open';
  @Input() title: string = 'No data found';
  @Input() description: string = 'There are no items to display at the moment.';
  @Input() actionText?: string;
  @Input() actionRouterLink?: string;
}
