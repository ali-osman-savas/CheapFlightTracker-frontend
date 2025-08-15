import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    MenubarModule
  ],
  template: `
    <div class="dashboard-container">
      <p-menubar [model]="menuItems">
        <ng-template pTemplate="start">
          <span class="app-title">UcuzGider</span>
        </ng-template>
        <ng-template pTemplate="end">
          <div class="user-info">
            <span class="welcome-text">Hoş geldin, {{ currentUser?.fullName }}</span>
            <p-button 
              label="Çıkış"
              icon="pi pi-sign-out"
              severity="danger"
              text
              (click)="logout()"
            />
          </div>
        </ng-template>
      </p-menubar>

      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Dashboard</h1>
          <p>Uçak bileti fiyatlarını karşılaştırın ve en uygun seçenekleri bulun!</p>
        </div>

        <div class="dashboard-grid">
          <p-card header="Uçuş Ara" class="dashboard-card">
            <div class="card-content">
              <i class="pi pi-search card-icon"></i>
              <p>Uçuş fiyatlarını karşılaştırın ve en uygun seçenekleri bulun.</p>
              <p-button 
                label="Uçuş Ara"
                icon="pi pi-search"
                (click)="navigateToSearch()"
                styleClass="w-full"
              />
            </div>
          </p-card>

          <p-card header="Favori Rotalar" class="dashboard-card">
            <div class="card-content">
              <i class="pi pi-heart card-icon"></i>
              <p>Sık kullandığınız rotaları kaydedin ve hızlıca erişin.</p>
              <p-button 
                label="Favoriler"
                icon="pi pi-heart"
                severity="secondary"
                styleClass="w-full"
                [disabled]="true"
              />
            </div>
          </p-card>

          <p-card header="Fiyat Alarmları" class="dashboard-card">
            <div class="card-content">
              <i class="pi pi-bell card-icon"></i>
              <p>Belirli rotalar için fiyat alarmı kurun ve bildirim alın.</p>
              <p-button 
                label="Alarm Kur"
                icon="pi pi-bell"
                severity="warn"
                styleClass="w-full"
                [disabled]="true"
              />
            </div>
          </p-card>

          <p-card header="Profil Ayarları" class="dashboard-card">
            <div class="card-content">
              <i class="pi pi-user card-icon"></i>
              <p>Profil bilgilerinizi görüntüleyin ve güncelleyin.</p>
              <p-button 
                label="Profil"
                icon="pi pi-user"
                severity="info"
                styleClass="w-full"
                [disabled]="true"
              />
            </div>
          </p-card>
        </div>

        <div class="stats-section">
          <p-card header="İstatistikler" class="stats-card">
            <div class="stats-grid">
              <div class="stat-item">
                <i class="pi pi-chart-line stat-icon"></i>
                <div class="stat-content">
                  <span class="stat-number">0</span>
                  <span class="stat-label">Toplam Arama</span>
                </div>
              </div>
              
              <div class="stat-item">
                <i class="pi pi-heart stat-icon"></i>
                <div class="stat-content">
                  <span class="stat-number">0</span>
                  <span class="stat-label">Favori Rota</span>
                </div>
              </div>
              
              <div class="stat-item">
                <i class="pi pi-bell stat-icon"></i>
                <div class="stat-content">
                  <span class="stat-number">0</span>
                  <span class="stat-label">Aktif Alarm</span>
                </div>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: var(--surface-ground);
    }

    .app-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome-text {
      font-weight: 500;
    }

    .dashboard-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .welcome-section h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
    }

    .welcome-section p {
      font-size: 1.1rem;
      color: var(--text-color-secondary);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .dashboard-card {
      height: 100%;
    }

    .card-content {
      text-align: center;
      padding: 1rem;
    }

    .card-icon {
      font-size: 3rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
      display: block;
    }

    .card-content p {
      margin-bottom: 1.5rem;
      color: var(--text-color-secondary);
      line-height: 1.5;
    }

    .stats-section {
      margin-top: 2rem;
    }

    .stats-card {
      width: 100%;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      background: var(--surface-card);
    }

    .stat-icon {
      font-size: 2rem;
      color: var(--primary-color);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
    }

    .stat-label {
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }

    :host ::ng-deep .p-menubar {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid var(--surface-border);
    }
  `]
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