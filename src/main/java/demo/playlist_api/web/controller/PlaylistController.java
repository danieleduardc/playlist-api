package demo.playlist_api.web.controller;

import demo.playlist_api.service.PlaylistService;
import demo.playlist_api.web.dto.PlaylistDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * Gestiona las operaciones de listas de reproducción a través de puntos finales RESTful.
 * Proporciona funcionalidades para crear, recuperar y eliminar listas de reproducción.
 */
@RestController
@RequestMapping("/lists")
@Tag(name = "Lists", description = "APIs para gestionar listas de reproducción")
public class PlaylistController {

    private final PlaylistService service;

    /**
     * Construye un PlaylistController con un PlaylistService.
     * @param service El servicio para las operaciones de listas de reproducción.
     */
    public PlaylistController(PlaylistService service) {
        this.service = service;
    }

    /**
     * Crea una nueva lista de reproducción.
     * @param dto Los datos de la lista de reproducción.
     * @return Una respuesta con la lista de reproducción creada y su ubicación.
     */
    @PostMapping
    @Operation(summary = "Crear una nueva lista")
    public ResponseEntity<PlaylistDto> create(@Valid @RequestBody PlaylistDto dto) {
        PlaylistDto created = service.create(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{name}").buildAndExpand(created.nombre()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    /**
     * Recupera todas las listas de reproducción.
     * @return Una lista de todas las listas de reproducción.
     */
    @GetMapping
    @Operation(summary = "Ver todas las listas")
    public ResponseEntity<List<PlaylistDto>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Recupera una lista de reproducción por su nombre.
     * @param listName El nombre de la lista de reproducción.
     * @return La lista de reproducción con el nombre especificado.
     */
    @GetMapping("/{listName}")
    @Operation(summary = "Ver una lista por nombre")
    public ResponseEntity<PlaylistDto> getByName(@PathVariable String listName) {
        return ResponseEntity.ok(service.findByName(listName));
    }

    /**
     * Elimina una lista de reproducción por su nombre.
     * @param listName El nombre de la lista de reproducción a eliminar.
     * @return Una respuesta sin contenido.
     */
    @DeleteMapping("/{listName}")
    @Operation(summary = "Eliminar una lista por nombre")
    public ResponseEntity<Void> deleteByName(@PathVariable String listName) {
        service.deleteByName(listName);
        return ResponseEntity.noContent().build();
    }
}
