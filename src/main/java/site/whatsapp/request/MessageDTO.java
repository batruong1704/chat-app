package site.whatsapp.request;

import lombok.*;
import site.whatsapp.models.MessageModel;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class MessageDTO implements Serializable {
    private UUID id;
    private String content;
    private LocalDateTime timestamp;
    private UUID userId;
    private UUID chatId;

    public static MessageDTO fromEntity(MessageModel entity) {
        MessageDTO dto = new MessageDTO();
        dto.setId(entity.getId());
        dto.setContent(entity.getContent());
        dto.setTimestamp(entity.getTimestamp());

        if (entity.getUserModel() != null) {
            dto.setUserId(entity.getUserModel().getId());
        }

        if (entity.getChatModel() != null) {
            dto.setChatId(entity.getChatModel().getId());
        }

        return dto;
    }
}