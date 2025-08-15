import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChartModule } from 'primeng/chart';
import { FlightService } from '../../core/services/flight.service';
import { FlightSearchRequest, FlightPrice, CheapestDay } from '../../core/models/flight.model';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DatePicker,
    InputNumberModule,
    ButtonModule,
    TableModule,
    MessageModule,
    ProgressSpinnerModule,
    ChartModule
  ],
  template: `
    <div class="container">
      <h1 class="page-title">Uçuş Arama</h1>
      
      <p-card header="Uçuş Ara" class="search-card">
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
          <div class="grid">
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="origin">Nereden</label>
                <input 
                  id="origin"
                  type="text" 
                  pInputText 
                  formControlName="origin"
                  placeholder="Kalkış şehri (örn: IST)"
                  class="w-full"
                />
              </div>
            </div>
            
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="destination">Nereye</label>
                <input 
                  id="destination"
                  type="text" 
                  pInputText 
                  formControlName="destination"
                  placeholder="Varış şehri (örn: AMS)"
                  class="w-full"
                />
              </div>
            </div>
            
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="startDate">Başlangıç Tarihi</label>
                <p-datepicker 
                  id="startDate"
                  formControlName="startDate"
                  dateFormat="dd/mm/yy"
                  placeholder="Tarih seçin"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                />
              </div>
            </div>
            
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="endDate">Bitiş Tarihi</label>
                <p-datepicker 
                  id="endDate"
                  formControlName="endDate"
                  dateFormat="dd/mm/yy"
                  placeholder="Tarih seçin"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                />
              </div>
            </div>
            
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="maxPrice">Maksimum Fiyat (TL)</label>
                <p-inputNumber 
                  id="maxPrice"
                  formControlName="maxPrice"
                  placeholder="Fiyat limiti"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [min]="0"
                  currency="TRY"
                  mode="currency"
                />
              </div>
            </div>
            
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="limit">Sonuç Sayısı</label>
                <p-inputNumber 
                  id="limit"
                  formControlName="limit"
                  placeholder="Kaç sonuç"
                  styleClass="w-full"
                  inputStyleClass="w-full"
                  [min]="1"
                  [max]="100"
                />
              </div>
            </div>
          </div>
          
          <div class="search-actions">
            <p-button 
              type="submit"
              label="Uçuş Ara"
              icon="pi pi-search"
              [loading]="loading"
              [disabled]="searchForm.invalid"
              styleClass="mr-2"
            />
            <p-button 
              type="button"
              label="En Ucuz Günler"
              icon="pi pi-chart-line"
              severity="secondary"
              [loading]="loadingCheapest"
              [disabled]="!searchForm.get('origin')?.value || !searchForm.get('destination')?.value"
              (click)="getCheapestDays()"
            />
          </div>
        </form>
      </p-card>

      <!-- Search Results -->
      <p-card *ngIf="searchResults.length > 0" header="Arama Sonuçları" class="results-card">
        <p-table [value]="searchResults" [paginator]="true" [rows]="10">
          <ng-template pTemplate="header">
            <tr>
              <th>Fiyat</th>
              <th>Tarih</th>
              <th>Rota</th>
              <th>Sağlayıcı</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-flight>
            <tr>
              <td>
                <span class="price">{{ flight.price | currency:'TRY':'symbol':'1.0-0' }}</span>
              </td>
              <td>{{ flight.departureDate | date:'dd/MM/yyyy' }}</td>
              <td>{{ flight.route.origin }} → {{ flight.route.destination }}</td>
              <td>{{ flight.provider.name }}</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Cheapest Days Chart -->
      <p-card *ngIf="cheapestDaysData" header="En Ucuz Günler" class="chart-card">
        <p-chart type="line" [data]="cheapestDaysData" [options]="chartOptions"></p-chart>
      </p-card>

      <!-- Loading -->
      <div *ngIf="loading || loadingCheapest" class="loading-container">
        <p-progressSpinner></p-progressSpinner>
      </div>

      <!-- Error Message -->
      <p-message 
        *ngIf="errorMessage" 
        severity="error" 
        [text]="errorMessage"
        styleClass="w-full mt-3"
      />
    </div>
  `,
  styles: [`
    .page-title {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--primary-color);
    }

    .search-card, .results-card, .chart-card {
      margin-bottom: 2rem;
    }

    .field {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .search-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .price {
      font-weight: bold;
      color: var(--green-500);
      font-size: 1.1rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .grid .col-12.md\\:col-6 {
        grid-column: span 1;
      }
    }
  `]
})
export class FlightSearchComponent implements OnInit {
  searchForm: FormGroup;
  searchResults: FlightPrice[] = [];
  cheapestDays: CheapestDay[] = [];
  cheapestDaysData: any;
  loading = false;
  loadingCheapest = false;
  errorMessage = '';
  chartOptions: any;

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService
  ) {
    this.searchForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      maxPrice: [''],
      limit: [50]
    });
  }

  ngOnInit() {
    this.initChartOptions();
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.searchResults = [];

      const searchRequest: FlightSearchRequest = {
        origin: this.searchForm.value.origin,
        destination: this.searchForm.value.destination,
        startDate: this.formatDate(this.searchForm.value.startDate),
        endDate: this.formatDate(this.searchForm.value.endDate),
        maxPrice: this.searchForm.value.maxPrice,
        limit: this.searchForm.value.limit
      };

      this.flightService.searchFlights(searchRequest).subscribe({
        next: (results) => {
          this.loading = false;
          this.searchResults = results;
          if (results.length === 0) {
            this.errorMessage = 'Arama kriterlerinize uygun uçuş bulunamadı.';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Arama sırasında bir hata oluştu';
        }
      });
    }
  }

  getCheapestDays(): void {
    this.loadingCheapest = true;
    this.errorMessage = '';
    this.cheapestDaysData = null;

    const searchRequest: FlightSearchRequest = {
      origin: this.searchForm.value.origin,
      destination: this.searchForm.value.destination,
      startDate: this.formatDate(this.searchForm.value.startDate),
      endDate: this.formatDate(this.searchForm.value.endDate),
      maxPrice: this.searchForm.value.maxPrice
    };

    this.flightService.getCheapestDays(searchRequest).subscribe({
      next: (results) => {
        this.loadingCheapest = false;
        this.cheapestDays = results;
        this.prepareCheapestDaysChart(results);
      },
      error: (error) => {
        this.loadingCheapest = false;
        this.errorMessage = error.error?.message || 'En ucuz günler alınırken bir hata oluştu';
      }
    });
  }

  private formatDate(date: Date): string | undefined {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  }

  private prepareCheapestDaysChart(data: CheapestDay[]): void {
    const labels = data.map(item => new Date(item.day).toLocaleDateString('tr-TR'));
    const prices = data.map(item => item.minPrice);

    this.cheapestDaysData = {
      labels: labels,
      datasets: [
        {
          label: 'En Düşük Fiyat (TL)',
          data: prices,
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
          tension: 0.4
        }
      ]
    };
  }

  private initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: 'Tarihlere Göre En Düşük Fiyatlar'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value: any) {
              return value + ' TL';
            }
          }
        }
      }
    };
  }
}