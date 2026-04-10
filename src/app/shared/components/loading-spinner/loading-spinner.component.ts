import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() text: string = 'Loading...';
  
  get sizeClasses(): string {
    switch (this.size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-8 h-8';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  }
}
