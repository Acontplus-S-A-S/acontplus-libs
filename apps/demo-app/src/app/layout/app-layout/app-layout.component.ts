import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuItemList, menuItems } from './menu-items';
import { LogoutUseCase } from '@acontplus/ng-auth';
import { ThemeToggleComponent } from '@acontplus/ng-components';

@Component({
  selector: 'app-app-layout',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ThemeToggleComponent,
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private logoutUseCase = inject(LogoutUseCase);
  menuItems = signal<MenuItemList[]>(menuItems);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches),
    shareReplay(),
  );

  logout() {
    this.logoutUseCase.execute().subscribe();
  }

  onMenuClick(item: MenuItemList) {
    console.log('Menu clicked:', item.route);
  }
}
