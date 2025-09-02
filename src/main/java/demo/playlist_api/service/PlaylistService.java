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

@Service
@Transactional
public class PlaylistService {

    private final PlaylistRepository repository;

    public PlaylistService(PlaylistRepository repository) {
        this.repository = repository;
    }

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

    @Transactional(readOnly = true)
    public List<PlaylistDto> findAll() {
        return repository.findAll().stream().map(PlaylistMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public PlaylistDto findByName(String name) {
        Playlist p = repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new NotFoundException("No existe la lista '" + name + "'"));
        return PlaylistMapper.toDto(p);
    }

    public void deleteByName(String name) {
        Playlist p = repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new NotFoundException("No existe la lista '" + name + "'"));
        repository.delete(p);
    }
}
