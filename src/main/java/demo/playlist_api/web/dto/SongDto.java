package demo.playlist_api.web.dto;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO para representar una canción.
 * Utiliza un registro de Java para una definición concisa e inmutable.
 * @param titulo El título de la canción. No puede estar en blanco.
 * @param artista El artista de la canción. No puede estar en blanco.
 * @param album El álbum al que pertenece la canción.
 * @param anno El año de lanzamiento de la canción.
 * @param genero El género musical de la canción.
 */
@Schema(description = "Canción")
public record SongDto(
        @NotBlank @Schema(example = "Viva la Vida") String titulo,
        @NotBlank @Schema(example = "Coldplay") String artista,
        @Schema(example = "Viva la Vida or Death and All His Friends") String album,
        @Schema(example = "2008") String anno,
        @Schema(example = "Rock") String genero
) {}
