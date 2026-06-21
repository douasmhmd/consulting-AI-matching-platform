import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { Api } from '../../services/api';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatChipsModule],
  template: `
    <div class="page">
      <h1 class="page-title">Rendez-vous</h1>

      <div class="stats-row">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-number">{{ total }}</div>
            <div class="stat-label">Total</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-number pending">{{ pending }}</div>
            <div class="stat-label">En attente</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-number confirmed">{{ confirmed }}</div>
            <div class="stat-label">Confirmés</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-number cancelled">{{ cancelled }}</div>
            <div class="stat-label">Annulés</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-content>
          <div *ngIf="appointments.length === 0" class="empty">
            <mat-icon>calendar_today</mat-icon>
            <p>Aucun rendez-vous trouvé</p>
          </div>
          <table mat-table [dataSource]="appointments" class="table" *ngIf="appointments.length > 0">

            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let a">
                <span class="id-cell">{{ a.id?.slice(0, 8) }}...</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="client">
              <th mat-header-cell *matHeaderCellDef>Client</th>
              <td mat-cell *matCellDef="let a">
                <span class="mono">{{ a.clientId?.slice(0, 8) }}...</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="consultant">
              <th mat-header-cell *matHeaderCellDef>Consultant</th>
              <td mat-cell *matCellDef="let a">
                <span class="mono">{{ a.consultantId?.slice(0, 8) }}...</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let a">
                {{ a.createdAt | date:'dd/MM/yyyy HH:mm' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let a">
                <span class="status-badge" [class]="a.status?.toLowerCase()">
                  {{ a.status }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="duration">
              <th mat-header-cell *matHeaderCellDef>Durée</th>
              <td mat-cell *matCellDef="let a">{{ a.durationMinutes }} min</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page { padding: 0; }
    .page-title { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 24px; }
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card mat-card-content { padding: 20px !important; text-align: center; }
    .stat-number { font-size: 36px; font-weight: 700; color: #1a1a1a; }
    .stat-number.pending { color: #f59e0b; }
    .stat-number.confirmed { color: #10b981; }
    .stat-number.cancelled { color: #ef4444; }
    .stat-label { font-size: 13px; color: #666; margin-top: 4px; }
    .table { width: 100%; }
    .id-cell { font-family: monospace; font-size: 12px; color: #666; }
    .mono { font-family: monospace; font-size: 12px; color: #666; }
    .status-badge {
      padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
    }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.confirmed { background: #dcfce7; color: #15803d; }
    .status-badge.cancelled { background: #fee2e2; color: #dc2626; }
    .status-badge.completed { background: #dbeafe; color: #1d4ed8; }
    .empty { display: flex; align-items: center; gap: 12px; color: #999; padding: 32px; }
    .empty mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .empty p { font-size: 16px; margin: 0; }
    th.mat-header-cell { font-weight: 700; color: #666; font-size: 13px; }
  `]
})
export class Appointments implements OnInit {
  appointments: any[] = [];
  displayedColumns = ['id', 'client', 'consultant', 'date', 'status', 'duration'];
  total = 0;
  pending = 0;
  confirmed = 0;
  cancelled = 0;

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      this.appointments = await this.api.getAppointments();
      this.total = this.appointments.length;
      this.pending = this.appointments.filter(a => a.status === 'PENDING').length;
      this.confirmed = this.appointments.filter(a => a.status === 'CONFIRMED').length;
      this.cancelled = this.appointments.filter(a => a.status === 'CANCELLED').length;
      this.cdr.detectChanges();
    } catch (err) {
      console.log('Erreur appointments:', err);
    }
  }
}