package site.chat.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
@Table(name="messages")
public class MessagesModel {

    @Id
    @GeneratedValue(generator = "UUID")
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "room_id")
    public RoomModel roomId;

    @JoinColumn(name = "sender_id")
    @ManyToOne
    private UserModel senderId;

    @Column(name = "content")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type")
    private MessageType messageType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
