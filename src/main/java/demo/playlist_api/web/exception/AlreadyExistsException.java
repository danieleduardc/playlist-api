package demo.playlist_api.web.exception;

/**
 * Excepción que se lanza cuando se intenta crear un recurso que ya existe.
 * Corresponde a un estado HTTP 409 Conflict.
 */
public class AlreadyExistsException extends RuntimeException {
    /**
     * Construye una nueva AlreadyExistsException con el mensaje de detalle especificado.
     * @param message El mensaje de detalle.
     */
    public AlreadyExistsException(String message) { super(message); }
}
