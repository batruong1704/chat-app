package site.whatsapp.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import site.whatsapp.models.ChatModel;
import site.whatsapp.models.UserModel;

import java.util.List;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<ChatModel, UUID> {

    // Ver1
//    @Query("SELECT c FROM ChatModel c JOIN c.users u WHERE u.id = :userId")
//    public List<ChatModel> findChatByUserId(@Param("userId") UUID userId);

    @Query("SELECT c FROM ChatModel c WHERE c.createdBy.id = :userId OR :userId IN (SELECT u.id FROM c.users u)")
    public List<ChatModel> findChatByUserId(@Param("userId") UUID userId);

    @Query("SELECT c FROM ChatModel c WHERE c.isGroup=false AND :user MEMBER of c.users AND :reqUser MEMBER of c.users")
    public ChatModel findSingleChatByUserIds(@Param("user")UserModel userModel, @Param("reqUser") UserModel reqUser);
}
