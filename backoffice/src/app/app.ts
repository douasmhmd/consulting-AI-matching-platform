import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">
          <span class="logo-emoji">🤝</span>
          <div class="logo-text">
            <span class="logo-name">Consulting AI</span>
            <span class="logo-sub">Administration</span>
          </div>
        </div>

        <nav class="nav">
          <p class="nav-label">PRINCIPAL</p>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/consultants" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span>
            <span>Consultants</span>
          </a>
          <a routerLink="/users" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👤</span>
            <span>Utilisateurs</span>
          </a>
          <a routerLink="/appointments" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📅</span>
            <span>Rendez-vous</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="admin-info">
            <div class="admin-avatar">A</div>
            <div class="admin-details">
              <span class="admin-name">Administrateur</span>
              <span class="admin-email">test2&#64;test.com</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="main">
        <header class="topbar">
          <div class="topbar-left">
            <h2 class="topbar-title">Backoffice Admin</h2>
          </div>
          <div class="topbar-right">
            <button class="topbar-btn">🔔</button>
            <button class="topbar-btn">⚙️</button>
          </div>
        </header>
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    * { margin: 0; padding: 0; box-sizing: border-box; }

    .layout {
      display: flex;
      height: 100vh;
      font-family: 'Inter', -apple-system, sans-serif;
      background: #f8fafc;
    }

    /* SIDEBAR */
    .sidebar {
      width: 260px;
      background: white;
      border-right: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid #f1f5f9;
    }

    .logo-emoji { font-size: 32px; }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-name {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .logo-sub {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .nav {
      flex: 1;
      padding: 20px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-label {
      font-size: 10px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 1px;
      padding: 0 8px;
      margin-bottom: 8px;
      margin-top: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      text-decoration: none;
      color: #475569;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s;
    }

    .nav-item:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .nav-item.active {
      background: #eff6ff;
      color: #2563eb;
      font-weight: 600;
    }

    .nav-icon { font-size: 18px; }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid #f1f5f9;
    }

    .admin-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .admin-avatar {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      background: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }

    .admin-details {
      display: flex;
      flex-direction: column;
    }

    .admin-name {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }

    .admin-email {
      font-size: 11px;
      color: #94a3b8;
    }

    /* MAIN */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .topbar {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 0 28px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .topbar-title {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
    }

    .topbar-right {
      display: flex;
      gap: 8px;
    }

    .topbar-btn {
      width: 38px;
      height: 38px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }

    .topbar-btn:hover { background: #f8fafc; }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 28px;
      background: #f8fafc;
    }
  `]
})
export class App {}