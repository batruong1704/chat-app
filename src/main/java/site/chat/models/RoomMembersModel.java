package site.chat.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
@Table(name="room_members")
public class RoomMembersModel {

    @Id
    @GeneratedValue(generator = "UUID")
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private UUID id;

    @JoinColumn(name = "room_id")
    @ManyToOne
    public RoomModel room;

    @JoinColumn(name = "user_id")
    @ManyToOne
    private UserModel user;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
}
