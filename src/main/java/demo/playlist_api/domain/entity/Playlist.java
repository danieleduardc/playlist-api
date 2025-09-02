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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Setter(AccessLevel.NONE) // Lombok no generará un setter para 'songs'
    private Set<Song> songs = new LinkedHashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    // Constructor personalizado para campos clave
    public Playlist(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void setSongs(Set<Song> songs) {
        this.songs.clear();
        if (songs != null) {
            songs.forEach(this::addSong);
        }
    }

    public void addSong(Song song) {
        song.setPlaylist(this);
        this.songs.add(song);
    }

    public void removeSong(Song song) {
        song.setPlaylist(null);
        this.songs.remove(song);
    }
}