package site.chat.repository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import site.chat.helper.object.NullAwareBeanUtils;

import java.io.Serializable;
import java.util.List;
import java.util.function.Function;

@Slf4j
@Repository
@Component
@NoArgsConstructor
public class BaseRepository<T, ID extends Serializable> implements IBaseRepository<T, ID> {

    private JpaRepository<T, ID> repository;
    protected Class<T> entityClass;

    public BaseRepository(JpaRepository<T, ID> repository, Class<T> entityClass) {
        this.repository = repository;
        this.entityClass = entityClass;
    }

    @Override
    @Transactional(readOnly=true)
    public T get(ID id) {
        try {
            return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Not found: " + id));
        } catch (EntityNotFoundException e) {
            log.error(e.getMessage());
            throw new RuntimeException("Error get: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly=true)
    public List<T> getAll() {
        try {
            return repository.findAll();
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public T save(T input) {
        try {
            return repository.save(input);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public T save(T input, Function<T, T> callback) {
        try {
            T result = repository.save(input);
            if(callback != null) {
                return callback.apply(result);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
        return input;
    }

    @Override
    @Transactional
    public T update(ID id, T input) {
        try {
            T data = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Not found: " + id));
            NullAwareBeanUtils.copyNonNullProperties(input, data);
            return repository.save(data);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public T update(ID id, T input, Function<T, T> callback) {
        try {
            T entity = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Not found: " + id));
            NullAwareBeanUtils.copyNonNullProperties(input, entity);
            T data = repository.save(entity);
            if (callback != null){
                return callback.apply(data);
            }
            return data;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public T delete(ID id) {
        T result = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Not found: " + id));
        repository.deleteById(id);
        return result;
    }

    @Override
    @Transactional
    public T delete(ID id, Function<T, T> callback) {
        T result = repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Not found: " + id));
        repository.deleteById(id);
        if(callback != null){
            return callback.apply(result);
        }
        return result;
    }
}
