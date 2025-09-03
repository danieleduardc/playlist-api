package demo.playlist_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Entidad Playlist que modela la lista de reproducción.
 * - Nombre único (clave natural) para cumplir el contrato de /lists/{listName}
 * - Relación 1:N con Song (cascada total y eliminación de huérfanos)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "name") // Usa solo el campo 'name' para equals y hashCode
@Entity
@Table(name = "playlists", uniqueConstraints = @UniqueConstraint(name = "uk_playlist_name", columnNames = "name"))
public class Playlist {

    /**
     * Identificador único de la lista de reproducción.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Versión de la entidad para el control de concurrencia optimista.
     */
    @Version
    private Long version;

    /**
     * Nombre de la lista de reproducción. Debe ser único.
     */
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    /**
     * Descripción de la lista de reproducción.
     */
    @Column(name = "description", length = 500)
    private String description;

    /**
     * Conjunto de canciones asociadas a esta lista de reproducción.
     * La relación es gestionada por la lista, y los cambios se propagan a las canciones.
     */
    @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Setter(AccessLevel.NONE) // Lombok no generará un setter para 'songs'
    private Set<Song> songs = new LinkedHashSet<>();

    /**
     * Marca de tiempo de la creación de la lista de reproducción.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    /**
     * Marca de tiempo de la última actualización de la lista de reproducción.
     */
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    /**
     * Actualiza la marca de tiempo 'updatedAt' antes de que la entidad sea actualizada en la base de datos.
     */
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    /**
     * Constructor para crear una lista de reproducción con nombre y descripción.
     * @param name El nombre de la lista.
     * @param description La descripción de la lista.
     */
    public Playlist(String name, String description) {
        this.name = name;
        this.description = description;
    }

    /**
     * Establece las canciones de la lista, reemplazando las existentes.
     * Asocia cada canción con esta lista.
     * @param songs El nuevo conjunto de canciones.
     */
    public void setSongs(Set<Song> songs) {
        this.songs.clear();
        if (songs != null) {
            songs.forEach(this::addSong);
        }
    }

    /**
     * Añade una canción a la lista de reproducción.
     * Establece la relación bidireccional.
     * @param song La canción a añadir.
     */
    public void addSong(Song song) {
        song.setPlaylist(this);
        this.songs.add(song);
    }

    /**
     * Elimina una canción de la lista de reproducción.
     * Elimina la relación bidireccional.
     * @param song La canción a eliminar.
     */
    public void removeSong(Song song) {
        song.setPlaylist(null);
        this.songs.remove(song);
    }
}