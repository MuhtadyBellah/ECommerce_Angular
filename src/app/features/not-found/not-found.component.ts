import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent implements OnInit {
  private readonly router = inject(Router);

  private previousUrl: string = '/';

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.previousUrl = navigation?.previousNavigation?.finalUrl?.toString() || '/';
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate([this.previousUrl]);
    }
  }
}
