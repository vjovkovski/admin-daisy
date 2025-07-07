// src/app/services/daisyui-theme.service.ts
import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface DaisyUITheme {
  id: string;
  name: string;
  type: 'light' | 'dark';
  description?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    neutral?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DaisyUIThemeService {
  private readonly THEME_KEY = 'daisyui-theme';
  private readonly DEFAULT_THEME = 'corporate';
  private mediaQuery?: MediaQueryList;

  // All available DaisyUI themes
  readonly availableThemes: DaisyUITheme[] = [
    // Light themes
    {
      id: 'light',
      name: 'Light',
      type: 'light',
      description: 'Clean and minimal',
    },
    { id: 'dark', name: 'Dark', type: 'dark', description: 'Easy on the eyes' },
    {
      id: 'corporate',
      name: 'Corporate',
      type: 'light',
      description: 'Professional and clean',
    },
    {
      id: 'cupcake',
      name: 'Cupcake',
      type: 'light',
      description: 'Sweet and colorful',
    },
    {
      id: 'bumblebee',
      name: 'Bumblebee',
      type: 'light',
      description: 'Energetic yellow',
    },
    {
      id: 'emerald',
      name: 'Emerald',
      type: 'light',
      description: 'Fresh green vibes',
    },
    {
      id: 'valentine',
      name: 'Valentine',
      type: 'light',
      description: 'Romantic pink',
    },
    {
      id: 'garden',
      name: 'Garden',
      type: 'light',
      description: 'Natural and earthy',
    },
    {
      id: 'lofi',
      name: 'Lofi',
      type: 'light',
      description: 'Relaxed and muted',
    },
    {
      id: 'pastel',
      name: 'Pastel',
      type: 'light',
      description: 'Soft and gentle',
    },
    {
      id: 'fantasy',
      name: 'Fantasy',
      type: 'light',
      description: 'Magical and whimsical',
    },
    {
      id: 'wireframe',
      name: 'Wireframe',
      type: 'light',
      description: 'Minimalist outline',
    },
    { id: 'cmyk', name: 'CMYK', type: 'light', description: 'Print-inspired' },
    {
      id: 'autumn',
      name: 'Autumn',
      type: 'light',
      description: 'Warm fall colors',
    },
    {
      id: 'acid',
      name: 'Acid',
      type: 'light',
      description: 'Vibrant and bold',
    },
    {
      id: 'lemonade',
      name: 'Lemonade',
      type: 'light',
      description: 'Fresh and zesty',
    },
    {
      id: 'nord',
      name: 'Nord',
      type: 'light',
      description: 'Arctic simplicity',
    },
    {
      id: 'winter',
      name: 'Winter',
      type: 'light',
      description: 'Cool and crisp',
    },

    // Dark themes
    {
      id: 'synthwave',
      name: 'Synthwave',
      type: 'dark',
      description: 'Retro neon vibes',
    },
    {
      id: 'retro',
      name: 'Retro',
      type: 'dark',
      description: 'Vintage computing',
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      type: 'dark',
      description: 'Futuristic neon',
    },
    {
      id: 'halloween',
      name: 'Halloween',
      type: 'dark',
      description: 'Spooky orange',
    },
    {
      id: 'forest',
      name: 'Forest',
      type: 'dark',
      description: 'Deep woodland',
    },
    { id: 'aqua', name: 'Aqua', type: 'dark', description: 'Ocean depths' },
    { id: 'black', name: 'Black', type: 'dark', description: 'Pure darkness' },
    {
      id: 'luxury',
      name: 'Luxury',
      type: 'dark',
      description: 'Rich and elegant',
    },
    {
      id: 'dracula',
      name: 'Dracula',
      type: 'dark',
      description: 'Classic vampire',
    },
    {
      id: 'business',
      name: 'Business',
      type: 'dark',
      description: 'Professional dark',
    },
    {
      id: 'night',
      name: 'Night',
      type: 'dark',
      description: 'Peaceful evening',
    },
    {
      id: 'coffee',
      name: 'Coffee',
      type: 'dark',
      description: 'Rich and warm',
    },
    { id: 'dim', name: 'Dim', type: 'dark', description: 'Subtle darkness' },
    { id: 'sunset', name: 'Sunset', type: 'dark', description: 'Evening glow' },
  ];

  // Signals for reactive theme management
  currentTheme = signal<string>(this.DEFAULT_THEME);
  favoriteThemes = signal<string[]>([]);
  useSystemPreference = signal<boolean>(true);
  systemPrefersDark = signal<boolean>(false);

  // Computed properties
  readonly lightThemes = this.availableThemes.filter(
    (theme) => theme.type === 'light'
  );
  readonly darkThemes = this.availableThemes.filter(
    (theme) => theme.type === 'dark'
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
      this.setupMediaQueryListener();

      // Effect to apply theme changes to DOM
      effect(() => {
        this.applyTheme(this.getEffectiveTheme());
      });

      // Effect to save settings
      effect(() => {
        this.saveSettings();
      });
    }
  }

  private initializeTheme(): void {
    const settings = this.loadSettings();
    this.currentTheme.set(settings.theme);
    this.favoriteThemes.set(settings.favorites);
    this.useSystemPreference.set(settings.useSystemPreference);
    this.systemPrefersDark.set(this.getSystemPreference());
  }

  private setupMediaQueryListener(): void {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPrefersDark.set(this.mediaQuery.matches);

    this.mediaQuery.addEventListener('change', (e) => {
      this.systemPrefersDark.set(e.matches);
    });
  }

  private getSystemPreference(): boolean {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }

  private getEffectiveTheme(): string {
    if (!this.useSystemPreference()) {
      return this.currentTheme();
    }

    // Auto-select theme based on system preference
    const isDark = this.systemPrefersDark();
    const currentThemeObj = this.getThemeById(this.currentTheme());

    if (
      currentThemeObj &&
      currentThemeObj.type === (isDark ? 'dark' : 'light')
    ) {
      return this.currentTheme();
    }

    // Switch to appropriate theme type
    if (isDark) {
      return this.getDefaultDarkTheme();
    } else {
      return this.getDefaultLightTheme();
    }
  }

  private getDefaultLightTheme(): string {
    return 'corporate';
  }

  private getDefaultDarkTheme(): string {
    return 'dark';
  }

  private applyTheme(themeId: string): void {
    const html = document.documentElement;
    html.setAttribute('data-theme', themeId);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(themeId);
  }

  private updateMetaThemeColor(themeId: string): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const theme = this.getThemeById(themeId);

    if (metaThemeColor && theme) {
      // You can customize this based on your theme's primary colors
      const color = theme.type === 'dark' ? '#1f2937' : '#ffffff';
      metaThemeColor.setAttribute('content', color);
    }
  }

  private loadSettings(): {
    theme: string;
    favorites: string[];
    useSystemPreference: boolean;
  } {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.THEME_KEY);
        if (saved) {
          const settings = JSON.parse(saved);
          return {
            theme: settings.theme || this.DEFAULT_THEME,
            favorites: settings.favorites || [],
            useSystemPreference: settings.useSystemPreference ?? true,
          };
        }
      } catch (error) {
        console.warn('Failed to load theme settings:', error);
      }
    }

    return {
      theme: this.DEFAULT_THEME,
      favorites: [],
      useSystemPreference: true,
    };
  }

  private saveSettings(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const settings = {
          theme: this.currentTheme(),
          favorites: this.favoriteThemes(),
          useSystemPreference: this.useSystemPreference(),
        };
        localStorage.setItem(this.THEME_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save theme settings:', error);
      }
    }
  }

  // Public methods
  setTheme(themeId: string): void {
    if (this.isValidTheme(themeId)) {
      this.currentTheme.set(themeId);
    }
  }

  // set theme based on type. if light, set to first light theme, if dark, set to first dark theme
  setThemeByType(type: 'light' | 'dark'): void {
    const themes = type === 'light' ? this.lightThemes : this.darkThemes;
    if (themes.length > 0) {
      this.setTheme(themes[0].id);
    }
  }

  // set theme based on system preference
  setThemeBySystemPreference(): void {
    if (this.useSystemPreference()) {
      this.setTheme(this.getEffectiveTheme());
    }
  }

  toggleSystemPreference(): void {
    this.useSystemPreference.set(!this.useSystemPreference());
  }

  addToFavorites(themeId: string): void {
    if (this.isValidTheme(themeId) && !this.isFavorite(themeId)) {
      this.favoriteThemes.update((favorites) => [...favorites, themeId]);
    }
  }

  removeFromFavorites(themeId: string): void {
    this.favoriteThemes.update((favorites) =>
      favorites.filter((id) => id !== themeId)
    );
  }

  toggleFavorite(themeId: string): void {
    if (this.isFavorite(themeId)) {
      this.removeFromFavorites(themeId);
    } else {
      this.addToFavorites(themeId);
    }
  }

  isFavorite(themeId: string): boolean {
    return this.favoriteThemes().includes(themeId);
  }

  isValidTheme(themeId: string): boolean {
    return this.availableThemes.some((theme) => theme.id === themeId);
  }

  getThemeById(themeId: string): DaisyUITheme | undefined {
    return this.availableThemes.find((theme) => theme.id === themeId);
  }

  getCurrentThemeObject(): DaisyUITheme | undefined {
    return this.getThemeById(this.getEffectiveTheme());
  }

  getFavoriteThemeObjects(): DaisyUITheme[] {
    return this.favoriteThemes()
      .map((id) => this.getThemeById(id))
      .filter((theme): theme is DaisyUITheme => theme !== undefined);
  }

  getRandomTheme(): string {
    const themes = this.availableThemes;
    return themes[Math.floor(Math.random() * themes.length)].id;
  }

  cycleTheme(direction: 'next' | 'prev' = 'next'): void {
    const currentIndex = this.availableThemes.findIndex(
      (theme) => theme.id === this.currentTheme()
    );
    let nextIndex: number;

    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % this.availableThemes.length;
    } else {
      nextIndex =
        currentIndex === 0 ? this.availableThemes.length - 1 : currentIndex - 1;
    }

    this.setTheme(this.availableThemes[nextIndex].id);
  }
}
