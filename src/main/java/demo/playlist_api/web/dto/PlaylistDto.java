package demo.playlist_api.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

/**
 * DTO de Playlist.
 */
@Schema(description = "Lista de reproducción")
public record PlaylistDto(
        @NotBlank @Schema(example = "Lista 1") String nombre,
        @Schema(example = "Lista de canciones de Spotify") String descripcion,
        @Valid Set<SongDto> canciones
) {}
