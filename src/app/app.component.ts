// src/app/app.component.ts
import { Component, signal } from '@angular/core';
import {
  DrawerLayoutComponent,
  MenuItem,
} from './layout/drawer-layout.component';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

import { NgIcon } from '@ng-icons/core';
import { ThemeToggleComponent } from './layout/theme-toggle.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DrawerLayoutComponent, RouterOutlet, NgIcon, ThemeToggleComponent],
  template: `
    <app-drawer-layout
      [title]="appName()"
      [menuItems]="menuItems"
      (menuItemSelected)="onMenuItemSelected($event)"
      (drawerStateChanged)="onDrawerStateChanged($event)"
    >
      <div slot="navbar-header" class="flex-1">
        <!-- <h1 class="text-2xl font-bold">{{ appName() }}</h1>
        <p class="text-sm text-base-content/70">
          {{ companyName() }}
        </p> -->
      </div>

      <div slot="navbar-dropdown" class="p-1">
        <ul class="menu menu-compact">
          <li>
            <a routerLink="/logout" class="flex items-center">
              <ng-icon name="heroArrowRightOnRectangle"></ng-icon>
              Logout
            </a>
          </li>
        </ul>
      </div>
      <!-- Main content -->
      <div class="space-y-6">
        <router-outlet></router-outlet>
      </div>

      <!-- Sidebar footer content -->
      <div slot="sidebar-footer" class="text-center">
        <app-theme-toggle class="mt-2"></app-theme-toggle>
        <p class="text-sm text-base-content/70">
          © {{ year() }} {{ companyName() }}
        </p>
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
      icon: 'heroSquares2x2',
      route: '/dashboard',
    },
    { id: 'home', label: 'Home', icon: 'heroHome', route: '/home' },

    // {
    //   id: 'audits',
    //   label: 'Audits',
    //   icon: 'audits',
    //   route: '/audits',
    //   badge: 5, // Example badge count, replace with dynamic value as needed
    // },
    { id: 'users', label: 'Users', icon: 'heroUser', route: '/users' },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'heroCog6Tooth',
      route: '/settings',
    },
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
