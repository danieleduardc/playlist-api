package demo.playlist_api.domain.repository;

import demo.playlist_api.domain.entity.Playlist;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repositorio de Playlist.
 */
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    boolean existsByNameIgnoreCase(String name);

    @EntityGraph(attributePaths = {"songs"})
    Optional<Playlist> findByNameIgnoreCase(String name);
}
