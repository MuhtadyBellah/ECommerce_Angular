import { Component } from '@angular/core';
import { ChangPasswordComponent } from '../chang-password/chang-password.component';

@Component({
  selector: 'app-profile-settings',
  imports: [ChangPasswordComponent],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css',
})
export class ProfileSettingsComponent {}
