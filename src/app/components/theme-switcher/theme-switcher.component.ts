// src/app/components/theme-switcher/theme-switcher.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DaisyUIThemeService } from 'app/services/daisyui-theme.service';

@Component({
    selector: 'app-theme-switcher',
    imports: [CommonModule, FormsModule],
    template: `
    <div class="dropdown dropdown-end">
      <!-- Theme Switcher Trigger -->
      <div
        tabindex="0"
        role="button"
        class="btn btn-ghost btn-circle"
        [attr.aria-label]="
          'Current theme: ' + (currentTheme()?.name || 'Unknown')
        "
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5zM21 15a2 2 0 00-2-2h-4a2 2 0 00-2 2v2a2 2 0 002 2h4a2 2 0 002-2v-2z"
          />
        </svg>
      </div>

      <!-- Theme Dropdown Menu -->
      <div
        tabindex="0"
        class="dropdown-content bg-base-100 rounded-box z-[1] w-80 p-4 shadow-2xl border border-base-300 max-h-96 overflow-y-auto"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-base-content">Choose Theme</h3>
          <div class="flex gap-1">
            <!-- Random Theme Button -->
            <button
              class="btn btn-ghost btn-xs"
              (click)="setRandomTheme()"
              title="Random theme"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
            <!-- Previous Theme Button -->
            <button
              class="btn btn-ghost btn-xs"
              (click)="cycleToPreviousTheme()"
              title="Previous theme"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <!-- Next Theme Button -->
            <button
              class="btn btn-ghost btn-xs"
              (click)="cycleToNextTheme()"
              title="Next theme"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- System Preference Toggle -->
        <div class="form-control mb-4">
          <label class="label cursor-pointer">
            <span class="label-text">Follow system preference</span>
            <input
              type="checkbox"
              class="toggle toggle-primary toggle-sm"
              [checked]="themeService.useSystemPreference()"
              (change)="toggleSystemPreference()"
            />
          </label>
        </div>

        <!-- Search/Filter -->
        <div class="form-control mb-4">
          <input
            type="text"
            placeholder="Search themes..."
            class="input input-bordered input-sm w-full"
            [(ngModel)]="searchTerm"
            #searchInput
          />
        </div>

        <!-- Current Theme Display -->
        <div class="mb-4 p-3 bg-base-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-sm">
                {{ currentTheme()?.name || 'Unknown' }}
              </div>
              <div class="text-xs text-base-content/70">
                {{ currentTheme()?.description || '' }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="badge badge-sm"
                [class]="
                  currentTheme()?.type === 'dark'
                    ? 'badge-neutral'
                    : 'badge-primary'
                "
              >
                {{ currentTheme()?.type }}
              </div>
              <button
                class="btn btn-ghost btn-xs"
                (click)="toggleFavorite(themeService.currentTheme())"
                [class.text-error]="isFavorite(themeService.currentTheme())"
              >
                <svg
                  class="w-4 h-4"
                  [attr.fill]="
                    isFavorite(themeService.currentTheme())
                      ? 'currentColor'
                      : 'none'
                  "
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Favorites Section -->
        @if (favoriteThemes().length > 0) {
        <div class="mb-4">
          <h4 class="text-sm font-medium text-base-content/80 mb-2">
            Favorites
          </h4>
          <div class="grid grid-cols-2 gap-2">
            @for (theme of favoriteThemes(); track theme.id) {
            <button
              class="btn btn-sm justify-start"
              [class.btn-primary]="theme.id === themeService.currentTheme()"
              [class.btn-outline]="theme.id !== themeService.currentTheme()"
              (click)="selectTheme(theme.id)"
            >
              <span class="truncate">{{ theme.name }}</span>
            </button>
            }
          </div>
        </div>
        }

        <!-- Theme Categories -->
        <div class="space-y-4">
          <!-- Light Themes -->
          <div>
            <h4
              class="text-sm font-medium text-base-content/80 mb-2 flex items-center gap-2"
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Light Themes
            </h4>
            <div class="grid grid-cols-2 gap-1">
              @for (theme of filteredLightThemes(); track theme.id) {
              <div class="relative">
                <button
                  class="btn btn-sm w-full justify-start text-left"
                  [class.btn-primary]="theme.id === themeService.currentTheme()"
                  [class.btn-ghost]="theme.id !== themeService.currentTheme()"
                  (click)="selectTheme(theme.id)"
                  [title]="theme.description"
                >
                  <span class="truncate">{{ theme.name }}</span>
                </button>

                <!-- Favorite Toggle -->
                <button
                  class="absolute right-1 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs p-0 w-5 h-5"
                  (click)="toggleFavorite(theme.id); $event.stopPropagation()"
                  [class.text-error]="isFavorite(theme.id)"
                >
                  <svg
                    class="w-3 h-3"
                    [attr.fill]="isFavorite(theme.id) ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              }
            </div>
          </div>

          <!-- Dark Themes -->
          <div>
            <h4
              class="text-sm font-medium text-base-content/80 mb-2 flex items-center gap-2"
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              Dark Themes
            </h4>
            <div class="grid grid-cols-2 gap-1">
              @for (theme of filteredDarkThemes(); track theme.id) {
              <div class="relative">
                <button
                  class="btn btn-sm w-full justify-start text-left"
                  [class.btn-primary]="theme.id === themeService.currentTheme()"
                  [class.btn-ghost]="theme.id !== themeService.currentTheme()"
                  (click)="selectTheme(theme.id)"
                  [title]="theme.description"
                >
                  <span class="truncate">{{ theme.name }}</span>
                </button>

                <!-- Favorite Toggle -->
                <button
                  class="absolute right-1 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs p-0 w-5 h-5"
                  (click)="toggleFavorite(theme.id); $event.stopPropagation()"
                  [class.text-error]="isFavorite(theme.id)"
                >
                  <svg
                    class="w-3 h-3"
                    [attr.fill]="isFavorite(theme.id) ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              }
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div
          class="mt-4 pt-3 border-t border-base-300 text-xs text-base-content/60 text-center"
        >
          {{ filteredThemes().length }} of
          {{ themeService.availableThemes.length }} themes
        </div>
      </div>
    </div>
  `,
    styles: [
        `
      .dropdown-content {
        animation: fadeIn 0.2s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Custom scrollbar for theme list */
      .dropdown-content::-webkit-scrollbar {
        width: 6px;
      }

      .dropdown-content::-webkit-scrollbar-track {
        background: transparent;
      }

      .dropdown-content::-webkit-scrollbar-thumb {
        background: hsl(var(--bc) / 0.2);
        border-radius: 3px;
      }

      .dropdown-content::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--bc) / 0.3);
      }

      /* Smooth theme transitions */
      .btn {
        transition: all 0.2s ease;
      }

      /* Hover effects */
      .btn:hover {
        transform: translateY(-1px);
      }
    `,
    ]
})
export class ThemeSwitcherComponent {
  themeService = inject(DaisyUIThemeService);

  searchTerm = signal('');

  // Computed properties
  currentTheme = computed(() => this.themeService.getCurrentThemeObject());
  favoriteThemes = computed(() => this.themeService.getFavoriteThemeObjects());

  filteredThemes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.themeService.availableThemes;

    return this.themeService.availableThemes.filter(
      (theme) =>
        theme.name.toLowerCase().includes(term) ||
        theme.description?.toLowerCase().includes(term) ||
        theme.type.toLowerCase().includes(term)
    );
  });

  filteredLightThemes = computed(() =>
    this.filteredThemes().filter((theme) => theme.type === 'light')
  );

  filteredDarkThemes = computed(() =>
    this.filteredThemes().filter((theme) => theme.type === 'dark')
  );

  selectTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }

  toggleSystemPreference(): void {
    this.themeService.toggleSystemPreference();
  }

  toggleFavorite(themeId: string): void {
    this.themeService.toggleFavorite(themeId);
  }

  isFavorite(themeId: string): boolean {
    return this.themeService.isFavorite(themeId);
  }

  setRandomTheme(): void {
    const randomTheme = this.themeService.getRandomTheme();
    this.themeService.setTheme(randomTheme);
  }

  cycleToNextTheme(): void {
    this.themeService.cycleTheme('next');
  }

  cycleToPreviousTheme(): void {
    this.themeService.cycleTheme('prev');
  }
}
