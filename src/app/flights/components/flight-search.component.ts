import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChartModule } from 'primeng/chart';
import { FlightService } from '../../core/services/flight.service';
import { FlightSearchRequest, FlightPrice, CheapestDay } from '../../core/models/flight.model';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component';
import { InputNumberComponent } from '../../shared/components/input-number/input-number.component';
import { InputTextComponent } from '../../shared/components/input-text/input-text.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    InputTextComponent,
    DatePickerComponent,
    InputNumberComponent,
    ButtonModule,
    TableModule,
    MessageModule,
    ProgressSpinnerModule,
    ChartModule
  ],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
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