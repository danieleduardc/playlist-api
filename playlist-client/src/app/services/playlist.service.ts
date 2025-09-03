import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Song {
  titulo: string;
  artista: string;
  album?: string;
  anno?: string;
  genero?: string;
}

export interface Playlist {
  nombre: string;
  descripcion?: string;
  canciones: Song[];
}

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private baseUrl = 'http://localhost:8080';
  private userAuthHeader = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('user:user123'),
    'Content-Type': 'application/json'
  });

  private adminAuthHeader = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('admin:admin123'),
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  create(p: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.baseUrl}/lists`, p, { headers: this.userAuthHeader })
      .pipe(catchError(this.handleError));
  }

  findAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.baseUrl}/lists`, { headers: this.userAuthHeader })
      .pipe(catchError(this.handleError));
  }

  findByName(name: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.baseUrl}/lists/${encodeURIComponent(name)}`, { headers: this.userAuthHeader })
      .pipe(catchError(this.handleError));
  }

  deleteByName(name: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/lists/${encodeURIComponent(name)}`, { headers: this.adminAuthHeader })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'No autorizado - Credenciales incorrectas';
      } else if (error.status === 403) {
        errorMessage = 'Acceso prohibido - Permisos insuficientes';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 409) {
        errorMessage = error.error?.message || 'El recurso ya existe';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor';
      } else {
        errorMessage = error.error?.message || `Error HTTP ${error.status}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
