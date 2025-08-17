import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonModule,
    MenubarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.initMenuItems();
  }

  private initMenuItems(): void {
    this.menuItems = [
      {
        label: 'Ana Sayfa',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/dashboard'])
      },
      {
        label: 'Uçuş Ara',
        icon: 'pi pi-search',
        command: () => this.navigateToSearch()
      },
      {
        label: 'Favoriler',
        icon: 'pi pi-heart',
        disabled: true
      },
      {
        label: 'Alarmlar',
        icon: 'pi pi-bell',
        disabled: true
      }
    ];
  }

  navigateToSearch(): void {
    this.router.navigate(['/flights/search']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}