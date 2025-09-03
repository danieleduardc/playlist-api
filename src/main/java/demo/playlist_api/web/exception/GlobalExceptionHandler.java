package demo.playlist_api.web.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Manejador de excepciones global para la aplicación.
 * Captura excepciones específicas y las convierte en respuestas de error HTTP estandarizadas.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Maneja las excepciones {@link NotFoundException}.
     * @param ex La excepción capturada.
     * @return Una respuesta con estado HTTP 404 Not Found y un cuerpo de error ApiError.
     */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(NotFoundException ex) {
        return new ResponseEntity<>(ApiError.of("Not Found", ex.getMessage(), 404), HttpStatus.NOT_FOUND);
    }

    /**
     * Maneja las excepciones {@link AlreadyExistsException}.
     * @param ex La excepción capturada.
     * @return Una respuesta con estado HTTP 409 Conflict y un cuerpo de error ApiError.
     */
    @ExceptionHandler(AlreadyExistsException.class)
    public ResponseEntity<ApiError> handleExists(AlreadyExistsException ex) {
        return new ResponseEntity<>(ApiError.of("Conflict", ex.getMessage(), 409), HttpStatus.CONFLICT);
    }

    /**
     * Maneja las excepciones de validación de argumentos de método {@link MethodArgumentNotValidException}.
     * @param ex La excepción capturada.
     * @return Una respuesta con estado HTTP 400 Bad Request y un cuerpo de error ApiError.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        var msg = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .findFirst().orElse("Datos inválidos");
        return new ResponseEntity<>(ApiError.of("Bad Request", msg, 400), HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja las excepciones de violación de restricciones de base de datos {@link ConstraintViolationException}.
     * @param ex La excepción capturada.
     * @return Una respuesta con estado HTTP 400 Bad Request y un cuerpo de error ApiError.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraint(ConstraintViolationException ex) {
        return new ResponseEntity<>(ApiError.of("Bad Request", ex.getMessage(), 400), HttpStatus.BAD_REQUEST);
    }
}
