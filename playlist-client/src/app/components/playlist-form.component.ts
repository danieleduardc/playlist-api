import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormArray, Validators } from '@angular/forms';
import { PlaylistService, Song } from '../services/playlist.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlist-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="playlist-form-container">
      <h2>📝 Crear Nueva Lista de Reproducción</h2>

      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="basic-info">
          <h3>Información Básica</h3>
          <div class="form-group">
            <label for="nombre">Nombre de la lista *</label>
            <input 
              id="nombre" 
              formControlName="nombre" 
              placeholder="Ej: Mi Lista Favorita"
              [class.error]="isFieldInvalid('nombre')"
            >
            <div *ngIf="isFieldInvalid('nombre')" class="error-message">
              El nombre es requerido
            </div>
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea 
              id="descripcion" 
              formControlName="descripcion" 
              placeholder="Describe tu lista de reproducción..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="songs-section">
          <div class="songs-header">
            <h3>🎵 Canciones</h3>
            <button type="button" (click)="addSong()" class="add-song-btn">
              ➕ Agregar Canción
            </button>
          </div>

          <div formArrayName="canciones" class="songs-list">
            <div *ngFor="let song of songsArray.controls; let i = index" 
                 [formGroupName]="i" class="song-form">
              <div class="song-header">
                <h4>Canción {{ i + 1 }}</h4>
                <button type="button" (click)="removeSong(i)" class="remove-btn">
                  🗑️ Eliminar
                </button>
              </div>

              <div class="song-fields">
                <div class="form-row">
                  <div class="form-group">
                    <label>Título *</label>
                    <input 
                      formControlName="titulo" 
                      placeholder="Título de la canción"
                      [class.error]="isSongFieldInvalid(i, 'titulo')"
                    >
                    <div *ngIf="isSongFieldInvalid(i, 'titulo')" class="error-message">
                      El título es requerido
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Artista *</label>
                    <input 
                      formControlName="artista" 
                      placeholder="Nombre del artista"
                      [class.error]="isSongFieldInvalid(i, 'artista')"
                    >
                    <div *ngIf="isSongFieldInvalid(i, 'artista')" class="error-message">
                      El artista es requerido
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Álbum</label>
                    <input formControlName="album" placeholder="Nombre del álbum">
                  </div>

                  <div class="form-group">
                    <label>Año</label>
                    <input 
                      formControlName="anno" 
                      placeholder="2024" 
                      maxlength="4"
                      [class.error]="isSongFieldInvalid(i, 'anno')"
                    >
                    <div *ngIf="isSongFieldInvalid(i, 'anno')" class="error-message">
                      Debe ser un año válido (4 dígitos)
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Género</label>
                    <input formControlName="genero" placeholder="Rock, Pop, etc.">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="songsArray.length === 0" class="no-songs">
            No hay canciones agregadas. Haz clic en "Agregar Canción" para empezar.
          </div>
        </div>

        <div class="form-actions">
          <button type="button" (click)="resetForm()" class="reset-btn">
            🔄 Limpiar Formulario
          </button>
          <button 
            type="submit" 
            [disabled]="form.invalid || submitting"
            class="submit-btn"
          >
            {{ submitting ? '⏳ Guardando...' : '💾 Guardar Lista' }}
          </button>
        </div>
      </form>

      <div *ngIf="message" class="message" [ngClass]="messageType">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .playlist-form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 10px;
    }

    .form-group {
      margin: 15px 0;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }

    input, textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    input.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
    }

    .songs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0 15px 0;
    }

    .add-song-btn {
      padding: 10px 20px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    .add-song-btn:hover {
      background-color: #218838;
    }

    .song-form {
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
    }

    .song-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .song-header h4 {
      margin: 0;
      color: #007bff;
    }

    .remove-btn {
      padding: 6px 12px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .remove-btn:hover {
      background-color: #c82333;
    }

    .form-row {
      display: flex;
      gap: 15px;
    }

    .form-row .form-group {
      flex: 1;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }

    .reset-btn {
      padding: 12px 24px;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }

    .reset-btn:hover {
      background-color: #545b62;
    }

    .submit-btn {
      padding: 12px 24px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }

    .submit-btn:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .submit-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .message {
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
      text-align: center;
      font-weight: bold;
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
      text-align: center;
      padding: 40px;
      color: #666;
      font-style: italic;
      background-color: white;
      border: 2px dashed #ddd;
      border-radius: 8px;
    }

    h2, h3 {
      color: #333;
      margin-top: 0;
    }
  `]
})
export class PlaylistFormComponent {
  @Output() playlistCreated = new EventEmitter<void>();

  form: FormGroup;
  message = '';
  messageType: 'success' | 'error' = 'success';
  submitting = false;

  constructor(
    private fb: FormBuilder, 
    private api: PlaylistService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      descripcion: [''],
      canciones: this.fb.array([])
    });
  }

  get songsArray() {
    return this.form.get('canciones') as FormArray;
  }

  addSong() {
    const songGroup = this.fb.group({
      titulo: ['', Validators.required],
      artista: ['', Validators.required],
      album: [''],
      anno: ['', [Validators.pattern(/^\d{4}$/)]],
      genero: ['']
    });

    this.songsArray.push(songGroup);
  }

  removeSong(index: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta canción?')) {
      this.songsArray.removeAt(index);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isSongFieldInvalid(songIndex: number, fieldName: string): boolean {
    const songGroup = this.songsArray.at(songIndex);
    const field = songGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  save() {
    if (this.form.valid) {
      this.submitting = true;
      this.clearMessage();

      const formValue = this.form.value;
      const dto = {
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion?.trim() || '',
        canciones: formValue.canciones || []
      };

      this.api.create(dto).subscribe({
        next: (response) => {
          this.submitting = false;
          this.showMessage(`Lista "${response.nombre}" creada exitosamente`, 'success');
          this.resetForm();
          this.playlistCreated.emit(); // Notificar al componente padre
        },
        error: (error) => {
          this.submitting = false;
          this.showMessage(`Error al crear lista: ${error.message}`, 'error');
        }
      });
    } else {
      this.markFormGroupTouched();
      this.showMessage('Por favor, completa todos los campos requeridos', 'error');
    }
  }

  resetForm() {
    this.form.reset();
    this.songsArray.clear();
    this.clearMessage();
    // Agregar una canción por defecto para empezar
    this.addSong();
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(subControl => {
          subControl.markAsTouched();
          if (subControl instanceof FormGroup) {
            Object.keys(subControl.controls).forEach(subKey => {
              subControl.get(subKey)?.markAsTouched();
            });
          }
        });
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
