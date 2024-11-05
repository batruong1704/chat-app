package site.chat.dto;

import java.util.UUID;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import site.chat.models.MessageType;

@Getter @Setter @Builder
public class MessageDTO {
    private MessageType type;
    private String content;
    private UUID senderId;
    private UUID roomId;
}
