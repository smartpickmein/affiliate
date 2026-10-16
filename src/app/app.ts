import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LoadingService } from './core/services/loading.service';

interface NavLink {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly loading = inject(LoadingService);
  protected readonly navLinks: NavLink[] = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/products', label: 'Products', icon: 'inventory_2' },
    { path: '/categories', label: 'Categories', icon: 'category' },
    { path: '/deals', label: 'Deals', icon: 'local_offer' },
    { path: '/search', label: 'Search', icon: 'search' },
    { path: '/admin', label: 'Admin', icon: 'admin_panel_settings' },
  ];
}
