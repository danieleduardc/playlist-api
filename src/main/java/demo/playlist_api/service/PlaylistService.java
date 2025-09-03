package demo.playlist_api.service;

import demo.playlist_api.domain.entity.Playlist;
import demo.playlist_api.domain.repository.PlaylistRepository;
import demo.playlist_api.web.dto.PlaylistDto;
import demo.playlist_api.web.exception.AlreadyExistsException;
import demo.playlist_api.web.exception.NotFoundException;
import demo.playlist_api.web.mapper.PlaylistMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Proporciona la lógica de negocio para gestionar las listas de reproducción.
 * Se encarga de la interacción con el repositorio de datos y la validación de la lógica de negocio.
 */
@Service
@Transactional
public class PlaylistService {

    private final PlaylistRepository repository;

    /**
     * Construye un PlaylistService con un PlaylistRepository.
     * @param repository El repositorio para las operaciones de datos de las listas de reproducción.
     */
    public PlaylistService(PlaylistRepository repository) {
        this.repository = repository;
    }

    /**
     * Crea una nueva lista de reproducción.
     * Valida que el nombre no esté vacío y que no exista ya una lista con el mismo nombre.
     * @param dto Los datos de la lista de reproducción a crear.
     * @return La lista de reproducción creada.
     * @throws IllegalArgumentException si el nombre de la lista es nulo o está vacío.
     * @throws AlreadyExistsException si ya existe una lista con el mismo nombre.
     */
    public PlaylistDto create(PlaylistDto dto) {
        if (dto.nombre() == null || dto.nombre().isBlank()) {
            throw new IllegalArgumentException("El nombre de la lista es obligatorio");
        }
        if (repository.existsByNameIgnoreCase(dto.nombre())) {
            throw new AlreadyExistsException("La lista '" + dto.nombre() + "' ya existe");
        }
        Playlist entity = PlaylistMapper.toEntity(dto);
        Playlist saved = repository.save(entity);
        return PlaylistMapper.toDto(saved);
    }

    /**
     * Recupera todas las listas de reproducción.
     * @return Una lista de todas las listas de reproducción.
     */
    @Transactional(readOnly = true)
    public List<PlaylistDto> findAll() {
        return repository.findAll().stream().map(PlaylistMapper::toDto).toList();
    }

    /**
     * Busca una lista de reproducción por su nombre.
     * @param name El nombre de la lista a buscar.
     * @return La lista de reproducción encontrada.
     * @throws NotFoundException si no se encuentra ninguna lista con el nombre especificado.
     */
    @Transactional(readOnly = true)
    public PlaylistDto findByName(String name) {
        Playlist p = repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new NotFoundException("No existe la lista '" + name + "'"));
        return PlaylistMapper.toDto(p);
    }

    /**
     * Elimina una lista de reproducción por su nombre.
     * @param name El nombre de la lista a eliminar.
     * @throws NotFoundException si no se encuentra ninguna lista con el nombre especificado.
     */
    public void deleteByName(String name) {
        Playlist p = repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new NotFoundException("No existe la lista '" + name + "'"));
        repository.delete(p);
    }
}
