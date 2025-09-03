import { Component } from '@angular/core';
import { PlaylistListComponent } from './components/playlist-list.component';
import { PlaylistFormComponent } from './components/playlist-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlaylistListComponent, PlaylistFormComponent, CommonModule],
  template: `
    <div class="app-container">
      <header>
        <h1>🎵 Playlist Manager</h1>
        <p>Gestiona tus listas de reproducción favoritas</p>
      </header>

      <main>
        <div class="tabs">
          <button 
            [class.active]="activeTab === 'list'" 
            (click)="activeTab = 'list'"
            class="tab-button"
          >
            📋 Ver Listas
          </button>
          <button 
            [class.active]="activeTab === 'create'" 
            (click)="activeTab = 'create'"
            class="tab-button"
          >
            ➕ Crear Nueva
          </button>
        </div>

        <div class="tab-content">
          <div *ngIf="activeTab === 'list'">
            <app-playlist-list></app-playlist-list>
          </div>

          <div *ngIf="activeTab === 'create'">
            <app-playlist-form (playlistCreated)="onPlaylistCreated()"></app-playlist-form>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2024 Playlist Manager - Demo Application</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 30px 20px;
      text-align: center;
      color: white;
    }

    header h1 {
      margin: 0 0 10px 0;
      font-size: 2.5em;
      font-weight: 300;
    }

    header p {
      margin: 0;
      font-size: 1.2em;
      opacity: 0.9;
    }

    main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .tabs {
      display: flex;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px 10px 0 0;
      overflow: hidden;
      margin-bottom: 0;
    }

    .tab-button {
      flex: 1;
      padding: 15px 20px;
      background: transparent;
      border: none;
      color: white;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .tab-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .tab-button.active {
      background: rgba(255, 255, 255, 0.2);
      font-weight: bold;
    }

    .tab-content {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 0 0 10px 10px;
      min-height: 500px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    footer {
      text-align: center;
      padding: 20px;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
    }
  `]
})
export class AppComponent {
  activeTab: 'list' | 'create' = 'list';

  onPlaylistCreated() {
    // Cambiar a la pestaña de lista después de crear una playlist
    this.activeTab = 'list';
  }
}
