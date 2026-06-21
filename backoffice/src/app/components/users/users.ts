import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Api } from '../../services/api';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule],
  template: `
    <div class="page">
      <h1 class="page-title">Utilisateurs</h1>

      <mat-card>
        <mat-card-content>
          <div *ngIf="users.length === 0" class="empty">
            <mat-icon>person</mat-icon>
            <p>Aucun utilisateur trouvé</p>
          </div>
          <table mat-table [dataSource]="users" class="users-table" *ngIf="users.length > 0">

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let u">
                <div class="user-cell">
                  <div class="user-avatar">{{ u.fullName?.[0] || '?' }}</div>
                  <div>
                    <div class="user-name">{{ u.fullName }}</div>
                    <div class="user-email">{{ u.email }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Rôle</th>
              <td mat-cell *matCellDef="let u">
                <span class="role-badge" [class]="u.role?.toLowerCase()">
                  {{ u.role }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Téléphone</th>
              <td mat-cell *matCellDef="let u">{{ u.phone || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="city">
              <th mat-header-cell *matHeaderCellDef>Ville</th>
              <td mat-cell *matCellDef="let u">{{ u.city || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>Membre depuis</th>
              <td mat-cell *matCellDef="let u">
                {{ u.createdAt | date:'dd/MM/yyyy' }}
              </td>
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
    .users-table { width: 100%; }
    .user-cell { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
    .user-avatar {
      width: 40px; height: 40px; border-radius: 20px;
      background: #2563eb; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 700; flex-shrink: 0;
    }
    .user-name { font-weight: 600; color: #1a1a1a; }
    .user-email { font-size: 12px; color: #666; }
    .role-badge {
      padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
    }
    .role-badge.client { background: #dbeafe; color: #1d4ed8; }
    .role-badge.consultant { background: #dcfce7; color: #15803d; }
    .role-badge.admin { background: #fef3c7; color: #92400e; }
    .empty { display: flex; align-items: center; gap: 12px; color: #999; padding: 32px; }
    .empty mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .empty p { font-size: 16px; margin: 0; }
    th.mat-header-cell { font-weight: 700; color: #666; font-size: 13px; }
  `]
})
export class Users implements OnInit {
  users: any[] = [];
  displayedColumns = ['name', 'role', 'phone', 'city', 'createdAt'];

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.users = await this.api.getUsers();
      this.cdr.detectChanges();
    } catch (err) {
      console.log('Erreur users:', err);
    }
  }
}