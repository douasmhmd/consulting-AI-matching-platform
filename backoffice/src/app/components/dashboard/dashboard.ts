import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Api } from '../../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard">
      <h1 class="page-title">Dashboard</h1>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon blue">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.consultants }}</div>
              <div class="stat-label">Consultants approuvés</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon orange">
              <mat-icon>pending</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.pending }}</div>
              <div class="stat-label">En attente</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon green">
              <mat-icon>calendar_today</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.appointments }}</div>
              <div class="stat-label">Rendez-vous</div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon purple">
              <mat-icon>psychology</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">5</div>
              <div class="stat-label">Disciplines</div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Pending consultants -->
      <mat-card class="pending-card">
        <mat-card-header>
          <mat-card-title>⏳ Consultants en attente d'approbation</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="pendingConsultants.length === 0" class="empty">
            <mat-icon>check_circle</mat-icon>
            <p>Aucun consultant en attente</p>
          </div>
          <div class="pending-list">
            <div class="pending-item" *ngFor="let c of pendingConsultants">
              <div class="pending-avatar">{{ c.discipline[0] }}</div>
              <div class="pending-info">
                <div class="pending-discipline">{{ c.discipline }}</div>
                <div class="pending-bio">{{ c.bio?.slice(0, 80) }}...</div>
              </div>
              <div class="pending-actions">
                <button class="btn-approve" (click)="approve(c.id)">✅ Approuver</button>
                <button class="btn-reject" (click)="reject(c.id)">❌ Rejeter</button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard { padding: 0; }
    .page-title { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 24px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px !important;
    }
    .stat-icon {
      width: 56px; height: 56px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon mat-icon { color: white; font-size: 28px; width: 28px; height: 28px; }
    .blue { background: #2563eb; }
    .orange { background: #f59e0b; }
    .green { background: #10b981; }
    .purple { background: #8b5cf6; }
    .stat-number { font-size: 32px; font-weight: 700; color: #1a1a1a; }
    .stat-label { font-size: 13px; color: #666; margin-top: 4px; }
    .pending-card { margin-bottom: 24px; }
    .pending-list { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
    .pending-item {
      display: flex; align-items: center; gap: 16px;
      padding: 16px; background: #f9fafb; border-radius: 12px;
    }
    .pending-avatar {
      width: 48px; height: 48px; border-radius: 24px;
      background: #2563eb; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 700; flex-shrink: 0;
    }
    .pending-info { flex: 1; }
    .pending-discipline { font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
    .pending-bio { font-size: 13px; color: #666; }
    .pending-actions { display: flex; gap: 8px; }
    .btn-approve {
      padding: 8px 16px; background: #10b981; color: white;
      border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
    }
    .btn-reject {
      padding: 8px 16px; background: #ef4444; color: white;
      border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
    }
    .empty { display: flex; align-items: center; gap: 12px; color: #10b981; padding: 16px; }
    .empty mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .empty p { font-size: 16px; margin: 0; }
  `]
})
export class Dashboard implements OnInit {
  stats = { consultants: 0, pending: 0, appointments: 0 };
  pendingConsultants: any[] = [];
  loading = true;

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      const pending = await this.api.getPendingConsultants();
      this.pendingConsultants = pending;
      this.stats.pending = pending.length;

      const disciplines = ['PSYCHOLOGY', 'NUTRITION', 'BUSINESS', 'IT', 'RELATIONSHIP'];
      let total = 0;
      for (const d of disciplines) {
        const consultants = await this.api.getConsultantsByDiscipline(d);
        total += consultants.length;
      }
      this.stats = { ...this.stats, consultants: total }; // ✅ trigger change detection
      this.cdr.detectChanges(); // ✅ force update
    } catch (err) {
      console.log('Erreur dashboard:', err);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async approve(id: string) {
    await this.api.approveConsultant(id);
    await this.loadData();
  }

  async reject(id: string) {
    await this.api.rejectConsultant(id);
    await this.loadData();
  }
}