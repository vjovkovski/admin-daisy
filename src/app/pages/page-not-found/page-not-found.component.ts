import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
})
export class PageNotFound {
  @Output() goBack = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();
  @Output() contactSupport = new EventEmitter<void>();
  @Output() viewSitemap = new EventEmitter<void>();
  @Output() searchSite = new EventEmitter<void>();
  @Output() refreshPage = new EventEmitter<void>();

  constructor(private router: Router) {}

  onGoBack(): void {
    // Try to go back in browser history, fallback to home
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
    this.goBack.emit();
  }

  onGoHome(): void {
    this.router.navigate(['/']);
    this.goHome.emit();
  }

  onContactSupport(): void {
    // Implement your contact support logic
    console.log('Contact support clicked');
    this.contactSupport.emit();
  }

  onViewSitemap(): void {
    // Implement your sitemap logic
    this.router.navigate(['/sitemap']);
    this.viewSitemap.emit();
  }

  onSearchSite(): void {
    // Implement your site search logic
    this.router.navigate(['/search']);
    this.searchSite.emit();
  }

  onRefreshPage(): void {
    window.location.reload();
    this.refreshPage.emit();
  }
}
