package demo.playlist_api.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

/**
 * DTO para representar una lista de reproducción.
 * Utiliza un registro de Java para una definición concisa e inmutable.
 * @param nombre El nombre de la lista de reproducción. No puede estar en blanco.
 * @param descripcion Una breve descripción de la lista de reproducción.
 * @param canciones Un conjunto de DTOs de canciones asociadas a la lista.
 */
@Schema(description = "Lista de reproducción")
public record PlaylistDto(
        @NotBlank @Schema(example = "Lista 1") String nombre,
        @Schema(example = "Lista de canciones de Spotify") String descripcion,
        @Valid Set<SongDto> canciones
) {}
