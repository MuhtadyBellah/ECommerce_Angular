import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css',
})
export class HomeSliderComponent implements OnInit, OnDestroy {
  currentIndex = signal(0);

  slides = [
    {
      id: 1,
      image: '/images/images/home-slider-1.png',
      title: 'Fresh & Organic Products',
      desc: 'Get 20% off your first order',
      primaryText: 'Shop Now',
      primaryLink: '/products',
      secondaryText: 'View Deals',
      secondaryLink: '/deals',
      subtitle: 'Farm-to-table quality delivered daily',
      badge: 'Best Quality',
    },
    {
      id: 2,
      image: '/images/images/home-slider-1.png',
      title: 'Member Benefits',
      subtitle: 'Exclusive perks and rewards program',
      desc: 'Join our loyalty program and earn points',
      primaryText: 'Join Now',
      primaryLink: '/auth/register',
      secondaryText: 'Learn More',
      secondaryLink: '/about',
      badge: 'New',
    },
    {
      id: 3,
      image: '/images/images/home-slider-1.png',
      title: 'Fast & Free Delivery',
      desc: 'Get your groceries delivered within hours',
      primaryText: 'Order Now',
      primaryLink: '/products',
      secondaryText: 'Delivery Info',
      secondaryLink: '/delivery',
      subtitle: 'Same-day delivery on orders over $50',
      badge: 'Express',
    },
  ];

  private intervalId: any;
  private touchStartX = 0;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 4000);
  }

  pause() {
    clearInterval(this.intervalId);
  }

  resume() {
    this.startAutoPlay();
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

  // Swipe Support
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const diff = event.changedTouches[0].clientX - this.touchStartX;

    if (diff > 50) this.prev();
    else if (diff < -50) this.next();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
