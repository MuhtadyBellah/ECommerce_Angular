import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-slider',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css',
})
export class HomeSliderComponent implements OnInit, OnDestroy {
  currentIndex = signal(0);

  slides = [
    {
      image: '/images/images/home-slider-1.png',
      title: 'Fresh Products Delivered to your Door',
      desc: 'Get 20% off your first order',
      primaryText: 'Shop Now',
      primaryLink: '/products',
      secondaryText: 'View Deals',
      secondaryLink: '/deals',
    },
    {
      image: '/images/images/home-slider-1.png',
      title: 'Premium Quality Guaranteed',
      desc: 'Fresh from farm to your table',
      primaryText: 'Shop Now',
      primaryLink: '/products',
      secondaryText: 'Learn More',
      secondaryLink: '/about',
    },
    {
      image: '/images/images/home-slider-1.png',
      title: 'Fast & Free Delivery',
      desc: 'Same day delivery available',
      primaryText: 'Order Now',
      primaryLink: '/products',
      secondaryText: 'Delivery Info',
      secondaryLink: '/delivery',
    },
  ];

  private intervalId: any;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 4000);
  }

  next() {
    this.currentIndex.update((i) => (i + 1) % this.slides.length);
  }

  prev() {
    this.currentIndex.update((i) => (i - 1 + this.slides.length) % this.slides.length);
  }

  goToSlide(index: number) {
    this.currentIndex.set(index);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
