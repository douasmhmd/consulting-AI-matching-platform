import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Api } from '../../services/api';

@Component({
  selector: 'app-consultants',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTabsModule, MatChipsModule, MatBadgeModule],
  template: `
    <div class="page">
      <h1 class="page-title">Consultants</h1>

      <mat-tab-group (selectedIndexChange)="onTabChange($event)">
        <mat-tab label="Approuvés ({{ approved.length }})">
          <div class="consultant-list">
            <div *ngIf="approved.length === 0" class="empty">
              <mat-icon>people</mat-icon>
              <p>Aucun consultant approuvé</p>
            </div>
            <mat-card class="consultant-card" *ngFor="let c of approved">
              <mat-card-content>
                <div class="consultant-row">
                  <div class="avatar">{{ c.discipline[0] }}</div>
                  <div class="info">
                    <div class="discipline">{{ disciplineLabel(c.discipline) }}</div>
                    <div class="bio">{{ c.bio?.slice(0, 100) }}...</div>
                    <div class="tags">
                      <span class="tag" *ngFor="let s of c.specialties?.slice(0, 3)">{{ s }}</span>
                    </div>
                    <div class="meta">
                      <span>💰 {{ c.pricePerSession }}€/séance</span>
                      <span>🌍 {{ c.languages?.join(', ') }}</span>
                      <span>⭐ {{ c.rating }}</span>
                    </div>
                  </div>
                  <div class="status-badge approved">✅ Approuvé</div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="En attente ({{ pending.length }})">
          <div class="consultant-list">
            <div *ngIf="pending.length === 0" class="empty">
              <mat-icon>check_circle</mat-icon>
              <p>Aucun consultant en attente</p>
            </div>
            <mat-card class="consultant-card" *ngFor="let c of pending">
              <mat-card-content>
                <div class="consultant-row">
                  <div class="avatar">{{ c.discipline[0] }}</div>
                  <div class="info">
                    <div class="discipline">{{ disciplineLabel(c.discipline) }}</div>
                    <div class="bio">{{ c.bio?.slice(0, 100) }}...</div>
                    <div class="tags">
                      <span class="tag" *ngFor="let s of c.specialties?.slice(0, 3)">{{ s }}</span>
                    </div>
                    <div class="meta">
                      <span>💰 {{ c.pricePerSession }}€/séance</span>
                      <span>🌍 {{ c.languages?.join(', ') }}</span>
                    </div>
                  </div>
                  <div class="actions">
                    <button class="btn-approve" (click)="approve(c.id)">✅ Approuver</button>
                    <button class="btn-reject" (click)="reject(c.id)">❌ Rejeter</button>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page { padding: 0; }
    .page-title { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 24px; }
    .consultant-list { padding: 16px 0; display: flex; flex-direction: column; gap: 12px; }
    .consultant-card { border-radius: 12px; }
    .consultant-row { display: flex; align-items: flex-start; gap: 16px; padding: 8px; }
    .avatar {
      width: 56px; height: 56px; border-radius: 28px;
      background: #2563eb; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 700; flex-shrink: 0;
    }
    .info { flex: 1; }
    .discipline { font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
    .bio { font-size: 13px; color: #666; margin-bottom: 8px; }
    .tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
    .tag {
      background: #eff6ff; color: #2563eb;
      padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
    }
    .meta { display: flex; gap: 16px; font-size: 13px; color: #666; }
    .status-badge {
      padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
    }
    .approved { background: #dcfce7; color: #15803d; }
    .pending-badge { background: #fef3c7; color: #92400e; }
    .actions { display: flex; flex-direction: column; gap: 8px; }
    .btn-approve {
      padding: 8px 16px; background: #10b981; color: white;
      border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
    }
    .btn-reject {
      padding: 8px 16px; background: #ef4444; color: white;
      border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
    }
    .empty { display: flex; align-items: center; gap: 12px; color: #999; padding: 32px; }
    .empty mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .empty p { font-size: 16px; margin: 0; }
  `]
})
export class Consultants implements OnInit {
  approved: any[] = [];
  pending: any[] = [];

  disciplines: Record<string, string> = {
    PSYCHOLOGY: 'Psychologie', NUTRITION: 'Nutrition',
    BUSINESS: 'Business', IT: 'IT', RELATIONSHIP: 'Relations',
  };

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      const disciplineKeys = ['PSYCHOLOGY', 'NUTRITION', 'BUSINESS', 'IT', 'RELATIONSHIP'];
      const all: any[] = [];
      for (const d of disciplineKeys) {
        const res = await this.api.getConsultantsByDiscipline(d);
        all.push(...res);
      }
      this.approved = all;
      this.pending = await this.api.getPendingConsultants();
      this.cdr.detectChanges();
    } catch (err) {
      console.log('Erreur consultants:', err);
    }
  }

  disciplineLabel(key: string): string {
    return this.disciplines[key] || key;
  }

  onTabChange(index: number) {}

  async approve(id: string) {
    await this.api.approveConsultant(id);
    await this.loadData();
  }

  async reject(id: string) {
    await this.api.rejectConsultant(id);
    await this.loadData();
  }
}