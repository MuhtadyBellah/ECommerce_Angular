import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { NavbarComponent } from './features/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent, RouterLinkWithHref, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  ngAfterViewInit(): void {
    initFlowbite();
  }
  protected readonly title = signal('ECommerce');
}
