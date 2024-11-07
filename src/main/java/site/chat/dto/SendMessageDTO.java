package site.chat.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import site.chat.models.MessageType;

@Getter @Setter @Builder
public class DetailMessageDTO {
    private UUID idMessage;
    private MessageType type;
    private UUID senderId;
    private String senderName;
    private String content;
    private LocalDateTime createdAt;
}