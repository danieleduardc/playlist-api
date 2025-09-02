package demo.playlist_api.domain.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entidad Song como agregado hijo de Playlist.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"id", "playlist"}) // Excluimos el ID y la relación para la igualdad
@Entity
@Table(name = "songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, length = 150)
    private String artista;

    @Column(length = 150)
    private String album;

    @Column(name = "anno", length = 4)
    private String anno;

    @Column(length = 50)
    private String genero;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "playlist_id", nullable = false, foreignKey = @ForeignKey(name = "fk_song_playlist"))
    private Playlist playlist;

    // Constructor personalizado para manejo de null del campo playlist
    public Song(String titulo, String artista, String album, String anno, String genero) {
        this.titulo = titulo;
        this.artista = artista;
        this.album = album;
        this.anno = anno;
        this.genero = genero;
    }
}
