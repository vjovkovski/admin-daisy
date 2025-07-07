// src/app/app.component.ts
import { Component, signal } from '@angular/core';
import {
  DrawerLayoutComponent,
  MenuItem,
} from './layout/drawer-layout.component';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DrawerLayoutComponent, RouterOutlet],
  template: `
    <app-drawer-layout
      [title]="appName()"
      [menuItems]="menuItems"
      (menuItemSelected)="onMenuItemSelected($event)"
      (drawerStateChanged)="onDrawerStateChanged($event)"
    >
      <!-- Main content -->
      <div class="space-y-6">
        <router-outlet></router-outlet>
      </div>

      <!-- Sidebar footer content -->
      <div slot="sidebar-footer" class="text-center">
        <!-- <p class="text-sm text-base-content/70">
          © {{ year() }} {{ companyName() }}
        </p> -->
      </div>
    </app-drawer-layout>
  `,
})
export class AppComponent {
  readonly year = signal(new Date().getFullYear());
  readonly appName = signal(environment.appName);
  readonly companyName = signal(environment.companyName);
  readonly menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      id: 'audits',
      label: 'Audits',
      icon: 'audits',
      route: '/audits',
      badge: 5, // Example badge count, replace with dynamic value as needed
    },
    { id: 'users', label: 'Users', icon: 'users', route: '/users' },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'analytics',
      route: '/analytics',
    },
    { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  onMenuItemSelected(item: MenuItem): void {
    console.log('Menu item selected:', item);
    // Handle navigation or other actions here
  }

  onDrawerStateChanged(isOpen: boolean): void {
    console.log('Drawer state changed:', isOpen);
    // Handle drawer state changes if needed
  }
}
