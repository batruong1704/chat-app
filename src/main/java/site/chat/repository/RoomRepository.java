package site.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import site.chat.models.RoomModel;

import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<RoomModel, UUID> {
}
