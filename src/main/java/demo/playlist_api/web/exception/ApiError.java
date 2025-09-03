package demo.playlist_api.web.exception;

import java.time.Instant;

/**
 * Representa un error de API estandarizado para las respuestas JSON.
 * Utiliza un registro de Java para una definición concisa e inmutable.
 * @param error El tipo de error (ej. "Not Found").
 * @param message Un mensaje descriptivo del error.
 * @param status El código de estado HTTP.
 * @param timestamp La marca de tiempo de cuando ocurrió el error.
 */
public record ApiError(String error, String message, int status, Instant timestamp) {
    /**
     * Método de fábrica para crear una nueva instancia de ApiError.
     * @param error El tipo de error.
     * @param message El mensaje descriptivo.
     * @param status El código de estado HTTP.
     * @return Una nueva instancia de ApiError con la marca de tiempo actual.
     */
    public static ApiError of(String error, String message, int status) {
        return new ApiError(error, message, status, Instant.now());
    }
}
