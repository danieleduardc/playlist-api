package demo.playlist_api.web.dto;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO in/out para Song.
 */
@Schema(description = "Canción")
public record SongDto(
        @NotBlank @Schema(example = "Viva la Vida") String titulo,
        @NotBlank @Schema(example = "Coldplay") String artista,
        @Schema(example = "Viva la Vida or Death and All His Friends") String album,
        @Schema(example = "2008") String anno,
        @Schema(example = "Rock") String genero
) {}
