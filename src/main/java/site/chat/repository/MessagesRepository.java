package site.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import site.chat.models.MessagesModel;
import site.chat.models.RoomModel;
import site.chat.models.UserModel;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MessagesRepository extends JpaRepository<MessagesModel, UUID> {
    List<MessagesModel> findMessagesModelByRoomIdOrderByCreatedAt(RoomModel roomModel);
}