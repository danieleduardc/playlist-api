package demo.playlist_api.web.mapper;

import demo.playlist_api.domain.entity.Playlist;
import demo.playlist_api.domain.entity.Song;
import demo.playlist_api.web.dto.PlaylistDto;
import demo.playlist_api.web.dto.SongDto;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Clase de utilidad para mapear entre entidades de dominio y objetos de transferencia de datos (DTOs).
 * Esta clase no está pensada para ser instanciada.
 */
public final class PlaylistMapper {

    /**
     * Constructor privado para evitar la instanciación de la clase de utilidad.
     */
    private PlaylistMapper() {}

    /**
     * Convierte una entidad {@link Playlist} a un {@link PlaylistDto}.
     * @param entity La entidad a convertir.
     * @return El DTO resultante.
     */
    public static PlaylistDto toDto(Playlist entity) {
        Set<SongDto> canciones = entity.getSongs().stream()
                .map(s -> new SongDto(s.getTitulo(), s.getArtista(), s.getAlbum(), s.getAnno(), s.getGenero()))
                .collect(Collectors.toSet());
        return new PlaylistDto(entity.getName(), entity.getDescription(), canciones);
    }

    /**
     * Convierte un {@link PlaylistDto} a una entidad {@link Playlist}.
     * @param dto El DTO a convertir.
     * @return La entidad resultante.
     */
    public static Playlist toEntity(PlaylistDto dto) {
        Playlist p = new Playlist(dto.nombre(), dto.descripcion());
        if (dto.canciones() != null) {
            dto.canciones().forEach(c -> p.addSong(new Song(c.titulo(), c.artista(), c.album(), c.anno(), c.genero())));
        }
        return p;
    }

    /**
     * Actualiza una entidad {@link Playlist} existente con datos de un {@link PlaylistDto}.
     * @param target La entidad de destino a actualizar.
     * @param dto El DTO con los nuevos datos.
     */
    public static void updateEntity(Playlist target, PlaylistDto dto) {
        if (dto.descripcion() != null) target.setDescription(dto.descripcion());
        if (dto.canciones() != null) {
            Set<Song> songs = dto.canciones().stream()
                    .map(c -> new Song(c.titulo(), c.artista(), c.album(), c.anno(), c.genero()))
                    .collect(Collectors.toSet());
            target.setSongs(songs);
        }
    }
}
