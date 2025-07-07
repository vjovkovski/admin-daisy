// src/app/components/drawer-layout/drawer-layout.component.ts
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  badge?: number; // Optional badge for notifications or counts
  action?: () => void;
  children?: MenuItem[];
}

@Component({
  standalone: true,
  selector: 'app-drawer-layout',
  imports: [CommonModule, NgIcon],
  template: `
    <div class="drawer lg:drawer-open">
      <!-- Drawer toggle checkbox -->
      <input
        #drawerToggle
        id="drawer-toggle"
        type="checkbox"
        class="drawer-toggle"
        [checked]="isDrawerOpen()"
        (change)="onDrawerToggle($event)"
      />

      <!-- Main content area -->
      <div class="drawer-content flex flex-col">
        <!-- Header/Navbar -->
        <div class="navbar bg-base-100 hidden lg:flex">
          <ng-content select="[slot=navbar-header]"></ng-content>
        </div>

        <div
          class="navbar bg-base-100 shadow-sm border-b border-base-300 lg:hidden"
        >
          <div class="navbar-start">
            <label
              for="drawer-toggle"
              class="btn btn-square btn-ghost drawer-button"
              aria-label="Open navigation menu"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          <div class="navbar-center">
            <h1 class="text-xl font-bold">{{ title }}</h1>
          </div>

          <div class="navbar-end">
            <div class="flex-none">
              <div class="dropdown">
                <div
                  tabindex="0"
                  role="button"
                  class="btn btn-ghost btn-circle avatar avatar-placeholder"
                >
                  <div
                    class="bg-primary text-neutral-content w-10 rounded-full"
                  >
                    <span class="text-xl">E</span>
                  </div>
                </div>
                <ul
                  tabindex="0"
                  class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-1 p-1 shadow"
                >
                  <ng-content select="[slot=navbar-dropdown]"></ng-content>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Page content -->
        <main class="flex-1 p-4 lg:p-8">
          <div class="max-w-7xl mx-auto">
            <!-- Desktop theme toggle -->

            <!-- Content slot -->
            <ng-content></ng-content>
          </div>
        </main>
      </div>

      <!-- Drawer sidebar -->
      <div class="drawer-side z-40">
        <label
          for="drawer-toggle"
          aria-label="Close navigation menu"
          class="drawer-overlay"
          (click)="closeDrawer()"
        ></label>

        <aside
          class="bg-base-200 text-base-content min-h-full w-55 flex flex-col"
        >
          <!-- Sidebar header -->
          <div class="p-4 border-b border-base-300">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">
                {{ sidebarTitle || title }}
              </h2>

              <button
                class="btn btn-sm btn-ghost btn-circle lg:hidden"
                (click)="closeDrawer()"
                aria-label="Close sidebar"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Navigation menu -->
          <nav class="flex-1 p-4">
            <ul class="menu bg-transparent w-full">
              @for (item of menuItems; track item.id) {
              <li>
                @if (item.children && item.children.length > 0) {
                <!-- Submenu -->
                <details [open]="expandedItems().includes(item.id)">
                  <summary
                    class="flex items-center gap-3"
                    (click)="toggleSubmenu(item.id)"
                  >
                    @if (item.icon) {
                    <ng-icon [name]="item.icon" />
                    <!-- <i [class]="item.icon"></i> -->
                    }
                    {{ item.label }}
                  </summary>
                  <ul>
                    @for (child of item.children; track child.id) {
                    <li>
                      <a
                        [href]="child.route || '#'"
                        (click)="onMenuItemClick(child, $event)"
                        class="flex items-center gap-3"
                      >
                        @if (child.icon) {
                        <ng-icon [name]="child.icon" />
                        <!-- <i [class]="child.icon"></i> -->
                        }
                        {{ child.label }}
                      </a>
                    </li>
                    }
                  </ul>
                </details>
                } @else {
                <!-- Regular menu item -->
                <a
                  [href]="item.route || '#'"
                  (click)="onMenuItemClick(item, $event)"
                  class="flex items-center gap-3"
                >
                  @if (item.icon) {
                  <ng-icon [name]="item.icon" />
                  <!-- <i [class]="item.icon"></i> -->

                  }
                  {{ item.label }}
                </a>
                }
              </li>
              }
            </ul>
          </nav>

          <!-- Sidebar footer -->
          <div class="p-4 border-t border-base-300">
            <!-- <div class="flex items-center justify-between">
              <button class="btn btn-ghost btn-error">Logout</button>
            </div> -->
            <!-- <app-theme-toggle /> -->
            <ng-content select="[slot=sidebar-footer]"></ng-content>
          </div>
        </aside>
      </div>
    </div>
  `,
})
export class DrawerLayoutComponent {
  @Input() title: string = 'App Title';
  @Input() sidebarTitle?: string;
  @Input() menuItems: MenuItem[] = [];
  @Input() initialDrawerState: boolean = false;

  @Output() menuItemSelected = new EventEmitter<MenuItem>();
  @Output() drawerStateChanged = new EventEmitter<boolean>();

  isDrawerOpen = signal(this.initialDrawerState);
  expandedItems = signal<string[]>([]);

  onDrawerToggle(event: Event): void {
    const target = event.target as HTMLInputElement;
    const isOpen = target.checked;
    this.isDrawerOpen.set(isOpen);
    this.drawerStateChanged.emit(isOpen);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
    this.drawerStateChanged.emit(false);
  }

  toggleSubmenu(itemId: string): void {
    const current = this.expandedItems();
    if (current.includes(itemId)) {
      this.expandedItems.set(current.filter((id) => id !== itemId));
    } else {
      this.expandedItems.set([...current, itemId]);
    }
  }

  onMenuItemClick(item: MenuItem, event: Event): void {
    if (item.action) {
      event.preventDefault();
      item.action();
    }

    this.menuItemSelected.emit(item);

    // Close drawer on mobile after selection
    if (window.innerWidth < 1024) {
      this.closeDrawer();
    }
  }
}
