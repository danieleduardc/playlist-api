import { Component, OnInit } from '@angular/core';
import { PlaylistService, Playlist } from '../services/playlist.service';
import { CommonModule } from '@angular/common';
import { PlaylistDetailComponent } from './playlist-detail.component';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [CommonModule, PlaylistDetailComponent],
  template: `
    <div class="playlist-list-container">
      <h2>Listas de Reproducción</h2>

      <div class="actions">
        <button (click)="load()" class="reload-btn">🔄 Recargar</button>
        <span class="count">{{ playlists.length }} lista(s)</span>
      </div>

      <div *ngIf="loading" class="loading">
        Cargando listas...
      </div>

      <div *ngIf="!loading && playlists.length === 0" class="no-playlists">
        No hay listas de reproducción creadas
      </div>

      <div *ngIf="!loading && playlists.length > 0" class="playlists">
        <div *ngFor="let p of playlists; let i = index" class="playlist-item">
          <div class="playlist-header" (click)="toggleDetail(i)">
            <div class="playlist-info">
              <h3>{{ p.nombre }}</h3>
              <p>{{ p.descripcion || 'Sin descripción' }}</p>
              <small>{{ p.canciones.length }} canción(es)</small>
            </div>
            <div class="playlist-actions">
              <button (click)="toggleDetail(i); $event.stopPropagation()" class="detail-btn">
                {{ expandedIndex === i ? '▼' : '▶' }} Ver detalles
              </button>
              <button (click)="remove(p.nombre); $event.stopPropagation()" class="delete-btn">
                🗑️ Eliminar
              </button>
            </div>
          </div>

          <div *ngIf="expandedIndex === i" class="playlist-detail-container">
            <app-playlist-detail [playlistName]="p.nombre"></app-playlist-detail>
          </div>
        </div>
      </div>

      <div *ngIf="message" class="message" [ngClass]="messageType">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .playlist-list-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
    }

    .reload-btn {
      padding: 10px 20px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .reload-btn:hover {
      background-color: #218838;
    }

    .count {
      color: #666;
      font-size: 0.9em;
    }

    .playlist-item {
      border: 1px solid #ddd;
      border-radius: 8px;
      margin: 15px 0;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .playlist-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      cursor: pointer;
      background-color: #f8f9fa;
    }

    .playlist-header:hover {
      background-color: #e9ecef;
    }

    .playlist-info h3 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .playlist-info p {
      margin: 0 0 5px 0;
      color: #666;
    }

    .playlist-info small {
      color: #888;
    }

    .playlist-actions {
      display: flex;
      gap: 10px;
    }

    .detail-btn {
      padding: 8px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .detail-btn:hover {
      background-color: #0056b3;
    }

    .delete-btn {
      padding: 8px 15px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .delete-btn:hover {
      background-color: #c82333;
    }

    .playlist-detail-container {
      border-top: 1px solid #ddd;
    }

    .loading, .no-playlists {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .message {
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
      text-align: center;
    }

    .message.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .message.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class PlaylistListComponent implements OnInit {
  playlists: Playlist[] = [];
  loading = false;
  expandedIndex: number | null = null;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private api: PlaylistService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.loading = true;
    this.clearMessage();

    this.api.findAll().subscribe({
      next: (data) => {
        this.playlists = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(`Error al cargar listas: ${error.message}`, 'error');
      }
    });
  }

  remove(name: string) {
    if (confirm(`¿Estás seguro de que quieres eliminar la lista "${name}"?`)) {
      this.api.deleteByName(name).subscribe({
        next: () => {
          this.showMessage(`Lista "${name}" eliminada exitosamente`, 'success');
          this.load(); // Recargar la lista
          this.expandedIndex = null; // Cerrar detalles si estaban abiertos
        },
        error: (error) => {
          this.showMessage(`Error al eliminar lista: ${error.message}`, 'error');
        }
      });
    }
  }

  toggleDetail(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 5000);
  }

  private clearMessage() {
    this.message = '';
  }
}
