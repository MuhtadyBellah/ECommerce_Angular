import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeaduredSideComponent } from '../../shared/components/feadured-side/feadured-side.component';
import { FeaturedCategoriesComponent } from '../../shared/components/featured-categories/featured-categories.component';
import { FeaturedProductsComponent } from '../../shared/components/featured-products/featured-products.component';
import { HomeSliderComponent } from '../../shared/components/home-slider/home-slider.component';

@Component({
  selector: 'app-home',
  imports: [
    HomeSliderComponent,
    FeaduredSideComponent,
    FeaturedCategoriesComponent,
    FeaturedProductsComponent,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
