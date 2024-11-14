package site.whatsapp.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import site.whatsapp.models.UserModel;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserModel, UUID> {
    UserModel findByEmail(String email);

    @Query("SELECT u FROM UserModel u WHERE u.email LIKE %:name% OR u.full_name LIKE %:name%")
    List<UserModel> searchUser(@Param("name") String name);
}
