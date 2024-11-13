package site.whatsapp.repositorys;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import site.whatsapp.models.MessageModel;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<MessageModel, UUID> {

    @Query("SELECT m FROM MessageModel m JOIN m.chatModel c WHERE c.id = :chatId")
    public List<MessageModel> findByChatId(UUID chatId);
}
