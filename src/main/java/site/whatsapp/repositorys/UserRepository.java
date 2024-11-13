package site.whatsapp.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import site.whatsapp.models.UserModel;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserModel, UUID> {
    public UserModel findByEmail(String email);

    @Query("SELECT u FROM UserModel u WHERE u.full_name LIKE %:query% OR u.email LIKE %:query%")
    public List<UserModel> searchUser(@Param("query") String query);
}
