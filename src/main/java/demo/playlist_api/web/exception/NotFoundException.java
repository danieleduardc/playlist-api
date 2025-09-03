package demo.playlist_api.web.exception;

/**
 * Excepción que se lanza cuando no se encuentra un recurso solicitado.
 * Corresponde a un estado HTTP 404 Not Found.
 */
public class NotFoundException extends RuntimeException {
    /**
     * Construye una nueva NotFoundException con el mensaje de detalle especificado.
     * @param message El mensaje de detalle.
     */
    public NotFoundException(String message) { super(message); }
}
