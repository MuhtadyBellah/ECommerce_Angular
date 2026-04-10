import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-profile-layout',
  imports: [RouterOutlet, PageHeaderComponent],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.css',
})
export class ProfileLayoutComponent {}
