package site.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import site.chat.models.RoomMembersModel;
import site.chat.models.RoomModel;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMembersModel, UUID> {
    @Query("SELECT rm.room.id FROM RoomMembersModel rm " +
            "JOIN UserModel u ON u.id = rm.user.id " +
            "WHERE u.username = :username")
    List<String> findRoomIdsByUsername(@Param("username") String username);

    @Query("SELECT rm.room " +
            "FROM RoomMembersModel rm " +
            "JOIN rm.user u " +
            "WHERE u.username = :username")
    List<RoomModel> findRoomNamesByUsername(@Param("username") String username);

    @Query("SELECT rm.room " +
            "FROM RoomMembersModel rm " +
            "JOIN rm.user u " +
            "WHERE u.id = :id")
    List<RoomModel> findRoomIdByUserId(@Param("id") UUID id);
}
