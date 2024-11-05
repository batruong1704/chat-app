package site.chat.services;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import site.chat.helper.object.NullAwareBeanUtils;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public abstract class BaseService<T, ID extends Serializable, R extends JpaRepository<T, ID>> {

    protected final R repository;

    public BaseService(R repository) {
        this.repository = repository;
    }

    public Optional<T> get(ID id) {
        return repository.findById(id);
    }

    public List<T> getAll() {
        return repository.findAll();
    }

    public T save(T entity) {
        return repository.save(entity);
    }

    public T update(ID id, T input, Function<T, T> callback) {
        T entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not found: " + id));

        NullAwareBeanUtils.copyNonNullProperties(input, entity);

        T updatedEntity = repository.save(entity);

        if (callback != null) {
            return callback.apply(updatedEntity);
        }
        return updatedEntity;
    }

    public T delete(ID id) {
        T entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not found: " + id));
        repository.deleteById(id);
        return entity;
    }
}
