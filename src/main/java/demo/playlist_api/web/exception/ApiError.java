package demo.playlist_api.web.exception;

import java.time.Instant;

/** Modelo de error simple para respuestas JSON */
public record ApiError(String error, String message, int status, Instant timestamp) {
    public static ApiError of(String error, String message, int status) {
        return new ApiError(error, message, status, Instant.now());
    }
}
