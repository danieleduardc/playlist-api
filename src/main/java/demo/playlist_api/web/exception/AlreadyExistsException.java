package demo.playlist_api.web.exception;

/** 409 Conflict - ya existe */
public class AlreadyExistsException extends RuntimeException {
    public AlreadyExistsException(String message) { super(message); }
}
