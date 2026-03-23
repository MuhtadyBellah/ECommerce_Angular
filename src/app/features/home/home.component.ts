import { Component } from '@angular/core';
import { HomeSliderComponent } from '../../shared/components/home-slider/home-slider.component';

@Component({
  selector: 'app-home',
  imports: [HomeSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
