import { Component, Input, OnInit } from '@angular/core';
import { PlaylistService, Playlist, Song } from '../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="playlist" class="playlist-detail">
      <h3>{{ playlist.nombre }}</h3>
      <p>{{ playlist.descripcion || 'Sin descripción' }}</p>

      <div class="songs-section">
        <h4>Canciones ({{ playlist.canciones.length }})</h4>

        <div *ngIf="playlist.canciones.length === 0" class="no-songs">
          No hay canciones en esta playlist
        </div>

        <div *ngIf="playlist.canciones.length > 0" class="songs-list">
          <div *ngFor="let song of playlist.canciones; let i = index" class="song-item">
            <div class="song-info">
              <strong>{{ song.titulo }}</strong>
              <span class="artist">{{ song.artista }}</span>
              <span *ngIf="song.album" class="album">{{ song.album }}</span>
              <span *ngIf="song.anno" class="year">({{ song.anno }})</span>
              <span *ngIf="song.genero" class="genre">{{ song.genero }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="add-song-section">
        <h4>Agregar Canción</h4>
        <form [formGroup]="songForm" (ngSubmit)="addSong()">
          <div class="form-row">
            <input formControlName="titulo" placeholder="Título *" required>
            <input formControlName="artista" placeholder="Artista *" required>
          </div>
          <div class="form-row">
            <input formControlName="album" placeholder="Álbum">
            <input formControlName="anno" placeholder="Año" maxlength="4">
            <input formControlName="genero" placeholder="Género">
          </div>
          <button type="submit" [disabled]="songForm.invalid">Agregar Canción</button>
        </form>
      </div>
    </div>

    <div *ngIf="message" class="message" [ngClass]="messageType">
      {{ message }}
    </div>
  `,
  styles: [`
    .playlist-detail {
      border: 1px solid #ddd;
      padding: 20px;
      margin: 10px 0;
      border-radius: 8px;
    }

    .songs-list {
      margin: 10px 0;
    }

    .song-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }

    .song-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .artist {
      color: #666;
      font-style: italic;
    }

    .album, .year, .genre {
      color: #888;
      font-size: 0.9em;
    }

    .form-row {
      display: flex;
      gap: 10px;
      margin: 10px 0;
    }

    .form-row input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .message {
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
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

    .no-songs {
      color: #666;
      font-style: italic;
      padding: 20px;
      text-align: center;
    }
  `]
})
export class PlaylistDetailComponent implements OnInit {
  @Input() playlistName: string = '';
  playlist: Playlist | null = null;
  songForm: FormGroup;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private playlistService: PlaylistService,
    private fb: FormBuilder
  ) {
    this.songForm = this.fb.group({
      titulo: ['', Validators.required],
      artista: ['', Validators.required],
      album: [''],
      anno: ['', [Validators.pattern(/^\d{4}$/)]],
      genero: ['']
    });
  }

  ngOnInit() {
    if (this.playlistName) {
      this.loadPlaylist();
    }
  }

  loadPlaylist() {
    this.playlistService.findByName(this.playlistName).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.clearMessage();
      },
      error: (error) => {
        this.showMessage(error.message, 'error');
      }
    });
  }

  addSong() {
    if (this.songForm.valid && this.playlist) {
      const newSong: Song = {
        titulo: this.songForm.value.titulo,
        artista: this.songForm.value.artista,
        album: this.songForm.value.album || undefined,
        anno: this.songForm.value.anno || undefined,
        genero: this.songForm.value.genero || undefined
      };

      // Crear nueva playlist con la canción agregada
      const updatedPlaylist: Playlist = {
        ...this.playlist,
        canciones: [...this.playlist.canciones, newSong]
      };

      // Como el backend no tiene endpoint de actualización, eliminamos y recreamos
      this.recreatePlaylistWithSong(updatedPlaylist);
    }
  }

  private recreatePlaylistWithSong(updatedPlaylist: Playlist) {
    // Primero eliminar la playlist existente
    this.playlistService.deleteByName(this.playlist!.nombre).subscribe({
      next: () => {
        // Luego crear la nueva playlist con las canciones
        this.playlistService.create(updatedPlaylist).subscribe({
          next: (newPlaylist) => {
            this.playlist = newPlaylist;
            this.songForm.reset();
            this.showMessage('Canción agregada exitosamente', 'success');
          },
          error: (error) => {
            this.showMessage(`Error al agregar canción: ${error.message}`, 'error');
            // Recargar la playlist original
            this.loadPlaylist();
          }
        });
      },
      error: (error) => {
        this.showMessage(`Error al actualizar playlist: ${error.message}`, 'error');
      }
    });
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
