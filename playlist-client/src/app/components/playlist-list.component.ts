import { Component, OnInit } from '@angular/core';
import { PlaylistService, Playlist } from '../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaylistDetailComponent } from './playlist-detail.component';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, PlaylistDetailComponent],
  template: `
    <div class="playlist-list-container">
      <h2>Listas de Reproducción</h2>

      <div class="controls">
        <div class="actions">
          <button (click)="load()" class="reload-btn" [disabled]="loading">
            {{ loading ? '⏳ Cargando...' : '🔄 Recargar' }}
          </button>
          <span class="count">{{ filteredPlaylists.length || 0 }} de {{ playlists.length || 0 }} lista(s)</span>
        </div>

        <div class="filters">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            placeholder="🔍 Buscar por nombre o descripción..."
            class="search-input">

          <select [(ngModel)]="sortBy" (change)="applySort()" class="sort-select">
            <option value="">Ordenar por...</option>
            <option value="nombre-asc">Nombre A-Z</option>
            <option value="nombre-desc">Nombre Z-A</option>
            <option value="canciones-asc">Menos canciones</option>
            <option value="canciones-desc">Más canciones</option>
          </select>

          <select [(ngModel)]="pageSize" (change)="updatePagination()" class="page-size-select">
            <option value="5">5 por página</option>
            <option value="10">10 por página</option>
            <option value="25">25 por página</option>
            <option value="50">50 por página</option>
          </select>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="loading-spinner"></div>
        Cargando listas...
      </div>

      <div *ngIf="!loading && playlists.length === 0" class="no-playlists">
        <div class="empty-state">
          <div class="empty-icon">🎵</div>
          <h3>No hay listas de reproducción</h3>
          <p>Crea tu primera lista de reproducción para comenzar</p>
        </div>
      </div>

      <div *ngIf="!loading && playlists.length > 0" class="table-view">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th (click)="sortTable('nombre')" class="sortable">
                  Nombre
                  <span class="sort-icon" [ngClass]="getSortClass('nombre')">⇅</span>
                </th>
                <th (click)="sortTable('descripcion')" class="sortable">
                  Descripción
                  <span class="sort-icon" [ngClass]="getSortClass('descripcion')">⇅</span>
                </th>
                <th (click)="sortTable('canciones')" class="sortable">
                  Canciones
                  <span class="sort-icon" [ngClass]="getSortClass('canciones')">⇅</span>
                </th>
                <th class="actions-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of paginatedPlaylists; let i = index; trackBy: trackByName"
                  class="table-row"
                  [class.expanded]="expandedPlaylist === p.nombre">
                <td class="name-cell">
                  <strong>{{ p.nombre }}</strong>
                </td>
                <td class="description-cell">
                  <span class="description-text">{{ p.descripcion || 'Sin descripción' }}</span>
                </td>
                <td class="songs-cell">
                  <span class="songs-count">{{ p.canciones.length }}</span>
                  <span class="songs-label">canción{{ p.canciones.length !== 1 ? 'es' : '' }}</span>
                </td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <button
                      (click)="toggleTableDetail(p.nombre)"
                      class="action-btn detail-btn"
                      title="Ver detalles">
                      {{ expandedPlaylist === p.nombre ? '👁️‍🗨️' : '👁️' }}
                    </button>
                    <button
                      (click)="remove(p.nombre)"
                      class="action-btn delete-btn"
                      title="Eliminar lista">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="expandedPlaylist && getExpandedPlaylist()" class="detail-row">
                <td colspan="4" class="detail-cell">
                  <div class="table-detail-container">
                    <app-playlist-detail [playlistName]="expandedPlaylist"></app-playlist-detail>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button
            (click)="changePage(currentPage - 1)"
            [disabled]="currentPage === 1"
            class="page-btn">
            ‹ Anterior
          </button>

          <span class="page-info">
            Página {{ currentPage }} de {{ totalPages }}
          </span>

          <button
            (click)="changePage(currentPage + 1)"
            [disabled]="currentPage === totalPages"
            class="page-btn">
            Siguiente ›
          </button>
        </div>
      </div>

      <div *ngIf="message" class="message" [ngClass]="messageType">
        {{ message }}
      </div>
    </div>
  `,
  styles: [`
    .playlist-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    /* Controls */
    .controls {
      margin: 20px 0;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      flex-wrap: wrap;
      gap: 10px;
    }


    .reload-btn {
      padding: 10px 20px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .reload-btn:hover {
      background-color: #218838;
    }

    .count {
      color: #666;
      font-size: 0.9em;
      font-weight: 500;
    }

    .filters {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .sort-select, .page-size-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      font-size: 14px;
      cursor: pointer;
    }

    /* Loading */
    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Empty State */
    .no-playlists {
      text-align: center;
      padding: 60px 40px;
    }

    .empty-state {
      max-width: 300px;
      margin: 0 auto;
    }

    .spinner-inline {
      display: inline-block;
      width: 14px; height: 14px;
      border: 2px solid #fff; border-top-color: transparent;
      border-radius: 50%;
      vertical-align: -2px;
      animation: spin .8s linear infinite;
    }

    .empty-icon {
      font-size: 4em;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .empty-state h3 {
      color: #333;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #666;
      line-height: 1.5;
    }

    /* Table View */
    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      margin: 20px 0;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .data-table th {
      background-color: #f8f9fa;
      padding: 15px 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e9ecef;
      white-space: nowrap;
    }

    .data-table th.sortable {
      cursor: pointer;
      user-select: none;
      position: relative;
      transition: background-color 0.3s;
    }

    .data-table th.sortable:hover {
      background-color: #e9ecef;
    }

    .sort-icon {
      margin-left: 5px;
      opacity: 0.5;
      transition: opacity 0.3s;
    }

    .sort-icon.asc {
      opacity: 1;
      transform: rotate(180deg);
    }

    .sort-icon.desc {
      opacity: 1;
    }

    .data-table td {
      padding: 12px;
      border-bottom: 1px solid #f1f1f1;
      vertical-align: middle;
    }

    .table-row {
      transition: background-color 0.3s;
    }

    .table-row:hover {
      background-color: #f8f9fa;
    }

    .table-row.expanded {
      background-color: #e3f2fd;
    }

    .name-cell strong {
      color: #333;
      font-weight: 600;
    }

    .description-cell {
      max-width: 300px;
    }

    .description-text {
      color: #666;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .songs-cell {
      text-align: center;
      min-width: 100px;
    }

    .songs-count {
      font-weight: 600;
      color: #007bff;
      font-size: 16px;
    }

    .songs-label {
      color: #666;
      font-size: 12px;
      display: block;
      margin-top: 2px;
    }

    .actions-cell {
      text-align: center;
      min-width: 120px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .action-btn {
      padding: 6px 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
      min-width: 36px;
    }

    .action-btn.detail-btn {
      background-color: #007bff;
      color: white;
    }

    .action-btn.detail-btn:hover {
      background-color: #0056b3;
      transform: scale(1.1);
    }

    .action-btn.delete-btn {
      background-color: #dc3545;
      color: white;
    }

    .action-btn.delete-btn:hover {
      background-color: #c82333;
      transform: scale(1.1);
    }

    .detail-row {
      background-color: #f8f9fa;
    }

    .detail-cell {
      padding: 0 !important;
      border-bottom: 2px solid #e9ecef;
    }

    .table-detail-container {
      padding: 20px;
      background-color: white;
      border-left: 4px solid #007bff;
      margin: 10px;
      border-radius: 4px;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      margin: 20px 0;
      padding: 15px;
    }

    .page-btn {
      padding: 8px 15px;
      border: 1px solid #ddd;
      background-color: white;
      color: #333;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s;
    }

    .page-btn:hover:not(:disabled) {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      color: #666;
      font-weight: 500;
    }


    /* Messages */
    .message {
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
      text-align: center;
      font-weight: 500;
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

    /* Responsive */
    @media (max-width: 768px) {
      .playlist-list-container {
        padding: 10px;
      }

      .actions {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .search-input {
        min-width: auto;
      }

      .data-table {
        font-size: 12px;
      }

      .data-table th,
      .data-table td {
        padding: 8px 6px;
      }

      .description-cell {
        max-width: 150px;
      }

      .action-buttons {
        flex-direction: column;
        gap: 4px;
      }

      .action-btn {
        padding: 4px 8px;
        font-size: 12px;
      }
    }

    @media (max-width: 480px) {
      .data-table th:nth-child(2),
      .data-table td:nth-child(2) {
        display: none;
      }
    }
  `]
})
export class PlaylistListComponent implements OnInit {
  playlists: Playlist[] = [];
  filteredPlaylists: Playlist[] = [];
  paginatedPlaylists: Playlist[] = [];
  loading = false;
  expandedPlaylist: string | null = null;
  message = '';
  messageType: 'success' | 'error' = 'success';

  // Filtros
  searchTerm = '';
  sortBy = '';

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private api: PlaylistService, private cdr: ChangeDetectorRef) {}

  trackByName = (_: number, p: Playlist) => p.nombre;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.clearMessage();

    this.api.findAll()
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.markForCheck(); // 👈 OnPush
      }))
      .subscribe({
        next: (data) => {
          this.playlists = data;
          this.applyFiltersAndPagination();
        },
        error: (error) => {
          this.showMessage(`Error al cargar listas: ${error.message}`, 'error');
        }
      });
  }

  remove(name: string) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la lista "${name}"?`)) return;

    const prev = this.playlists;
    this.playlists = this.playlists.filter(p => p.nombre !== name);
    this.applyFiltersAndPagination();
    this.expandedPlaylist = this.expandedPlaylist === name ? null : this.expandedPlaylist;
    this.cdr.markForCheck();

    this.api.deleteByName(name).subscribe({
      next: () => this.showMessage(`Lista "${name}" eliminada exitosamente`, 'success'),
      error: (error) => {
        this.playlists = prev;
        this.applyFiltersAndPagination();
        this.showMessage(`Error al eliminar lista: ${error.message}`, 'error');
        this.cdr.markForCheck();
      }
    });
  }

  toggleTableDetail(playlistName: string) {
    this.expandedPlaylist = this.expandedPlaylist === playlistName ? null : playlistName;
  }

  getExpandedPlaylist(): Playlist | null {
    if (!this.expandedPlaylist) return null;
    return this.paginatedPlaylists.find(p => p.nombre === this.expandedPlaylist) || null;
  }

  applyFilters() {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  applySort() {
    this.applyFiltersAndPagination();
  }

  private applyFiltersAndPagination() {
    // Aplicar filtros de búsqueda
    if (!this.searchTerm.trim()) {
      this.filteredPlaylists = [...this.playlists];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredPlaylists = this.playlists.filter(playlist =>
        playlist.nombre.toLowerCase().includes(term) ||
        (playlist.descripcion && playlist.descripcion.toLowerCase().includes(term))
      );
    }

    // Aplicar ordenamiento
    if (this.sortBy) {
      const [field, direction] = this.sortBy.split('-');
      this.filteredPlaylists.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (field) {
          case 'nombre':
            aValue = a.nombre.toLowerCase();
            bValue = b.nombre.toLowerCase();
            break;
          case 'descripcion':
            aValue = (a.descripcion || '').toLowerCase();
            bValue = (b.descripcion || '').toLowerCase();
            break;
          case 'canciones':
            aValue = a.canciones.length;
            bValue = b.canciones.length;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Aplicar paginación
    this.updatePagination();
  }

  sortTable(field: string) {
    this.sortBy = this.sortBy === `${field}-asc` ? `${field}-desc` : `${field}-asc`;
    this.applySort();
  }

  getSortClass(field: string): string {
    if (this.sortBy === `${field}-asc`) return 'asc';
    if (this.sortBy === `${field}-desc`) return 'desc';
    return '';
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPlaylists.length / this.pageSize);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = 1;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPlaylists = this.filteredPlaylists.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      this.expandedPlaylist = null;
    }
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
