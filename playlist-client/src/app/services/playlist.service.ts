import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interfaz que representa una canción.
 */
export interface Song {
  titulo: string;
  artista: string;
  album?: string;
  anno?: string;
  genero?: string;
}

/**
 * Interfaz que representa una lista de reproducción.
 */
export interface Playlist {
  nombre: string;
  descripcion?: string;
  canciones: Song[];
}

/**
 * Servicio para gestionar las operaciones de listas de reproducción con el backend.
 */
@Injectable({ providedIn: 'root' })
export class PlaylistService {
  /** URL base de la API del backend. */
  private baseUrl = 'http://localhost:8080';

  /** Cabeceras de autenticación para el rol de usuario normal. */
  private userAuthHeader = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('user:user123'),
    'Content-Type': 'application/json'
  });

  /** Cabeceras de autenticación para el rol de administrador. */
  private adminAuthHeader = new HttpHeaders({
    'Authorization': 'Basic ' + btoa('admin:admin123'),
    'Content-Type': 'application/json'
  });

  /**
   * @param http Cliente HTTP de Angular para realizar las peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Crea una nueva lista de reproducción en el backend.
   * @param p La lista de reproducción a crear.
   * @returns Un Observable con la lista de reproducción creada.
   */
  create(p: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.baseUrl}/lists`, p, { headers: this.userAuthHeader })
      .pipe(catchError(this.handleError));
  }

  /**
   * Recupera todas las listas de reproducción del backend.
   * @returns Un Observable con un array de todas las listas de reproducción.
   */
  findAll(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.baseUrl}/lists`, { headers: this.userAuthHeader })
      .pipe(catchError(this.handleError));
  }

  /**
   * Busca una lista de reproducción por su nombre.
   * @param name El nombre de la lista a buscar.
   * @returns Un Observable con la lista de reproducción encontrada.
   */
  findByName(name: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.baseUrl}/lists/${encodeURIComponent(name)}`, { headers: this.userAuthHeader })
      .pipe(catchError(this.handleError));
  }

  /**
   * Elimina una lista de reproducción por su nombre (requiere rol de administrador).
   * @param name El nombre de la lista a eliminar.
   * @returns Un Observable<void> que se completa cuando la operación finaliza.
   */
  deleteByName(name: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/lists/${encodeURIComponent(name)}`, { headers: this.adminAuthHeader })
      .pipe(catchError(this.handleError));
  }

  /**
   * Maneja los errores de las peticiones HTTP.
   * @param error El objeto de error HTTP.
   * @returns Un Observable que emite un nuevo error con un mensaje descriptivo.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de error
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
