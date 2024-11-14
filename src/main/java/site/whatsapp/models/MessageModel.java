package site.whatsapp.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UuidGenerator;
import site.whatsapp.configs.UUIDConverter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class MessageModel {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "BINARY(16)")
    @Convert(converter = UUIDConverter.class)
    private UUID id;

    private String content;

    private LocalDateTime timestamp;

    @ManyToOne
    private UserModel userModel;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private ChatModel chatModel;
}
