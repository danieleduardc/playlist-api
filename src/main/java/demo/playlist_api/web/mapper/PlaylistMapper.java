package demo.playlist_api.web.mapper;

import demo.playlist_api.domain.entity.Playlist;
import demo.playlist_api.domain.entity.Song;
import demo.playlist_api.web.dto.PlaylistDto;
import demo.playlist_api.web.dto.SongDto;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper manual entre entidades y DTOs.
 * (Se podría usar MapStruct en un proyecto real)
 */
public final class PlaylistMapper {

    private PlaylistMapper() {}

    public static PlaylistDto toDto(Playlist entity) {
        Set<SongDto> canciones = entity.getSongs().stream()
                .map(s -> new SongDto(s.getTitulo(), s.getArtista(), s.getAlbum(), s.getAnno(), s.getGenero()))
                .collect(Collectors.toSet());
        return new PlaylistDto(entity.getName(), entity.getDescription(), canciones);
    }

    public static Playlist toEntity(PlaylistDto dto) {
        Playlist p = new Playlist(dto.nombre(), dto.descripcion());
        if (dto.canciones() != null) {
            dto.canciones().forEach(c -> p.addSong(new Song(c.titulo(), c.artista(), c.album(), c.anno(), c.genero())));
        }
        return p;
    }

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
