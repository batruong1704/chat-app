package site.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import site.chat.models.UserModel;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserModel, UUID> {
    Optional<UserModel> findByUsername(String username);

    @Query(value = "SELECT * FROM `users` WHERE username = :username", nativeQuery = true)
    UserModel findByUsernameGetUUID(@Param("username") String username);

    // Trả về boolean
    boolean existsByUsername(String username);


}
