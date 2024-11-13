package site.whatsapp.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class MessageModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String content;

    private LocalDateTime timestamp;

    @ManyToOne
    private UserModel userModel;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private ChatModel chatModel;
}
