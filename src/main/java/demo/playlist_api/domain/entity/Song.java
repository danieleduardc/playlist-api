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

    /**
     * Identificador único de la canción.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Título de la canción.
     */
    @Column(nullable = false, length = 200)
    private String titulo;

    /**
     * Artista de la canción.
     */
    @Column(nullable = false, length = 150)
    private String artista;

    /**
     * Álbum al que pertenece la canción.
     */
    @Column(length = 150)
    private String album;

    /**
     * Año de lanzamiento de la canción.
     */
    @Column(name = "anno", length = 4)
    private String anno;

    /**
     * Género musical de la canción.
     */
    @Column(length = 50)
    private String genero;

    /**
     * Lista de reproducción a la que pertenece la canción.
     * La relación es gestionada por la canción y es obligatoria.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "playlist_id", nullable = false, foreignKey = @ForeignKey(name = "fk_song_playlist"))
    private Playlist playlist;

    /**
     * Constructor para crear una canción con sus atributos principales.
     * @param titulo El título de la canción.
     * @param artista El artista de la canción.
     * @param album El álbum de la canción.
     * @param anno El año de lanzamiento de la canción.
     * @param genero El género de la canción.
     */
    public Song(String titulo, String artista, String album, String anno, String genero) {
        this.titulo = titulo;
        this.artista = artista;
        this.album = album;
        this.anno = anno;
        this.genero = genero;
    }
}
