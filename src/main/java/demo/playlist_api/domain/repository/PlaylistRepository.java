package demo.playlist_api.domain.repository;

import demo.playlist_api.domain.entity.Playlist;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repositorio para la entidad Playlist, gestionando las operaciones de base de datos.
 */
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    /**
     * Comprueba si existe una lista de reproducción con un nombre específico, ignorando mayúsculas y minúsculas.
     * @param name El nombre de la lista a comprobar.
     * @return {@code true} si existe una lista con ese nombre, {@code false} en caso contrario.
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * Busca una lista de reproducción por su nombre, ignorando mayúsculas y minúsculas, y carga sus canciones asociadas.
     * La anotación @EntityGraph se utiliza para cargar de forma anticipada la colección de canciones y evitar problemas de N+1.
     * @param name El nombre de la lista a buscar.
     * @return Un {@link Optional} que contiene la lista de reproducción si se encuentra, o un Optional vacío si no.
     */
    @EntityGraph(attributePaths = {"songs"})
    Optional<Playlist> findByNameIgnoreCase(String name);
}
