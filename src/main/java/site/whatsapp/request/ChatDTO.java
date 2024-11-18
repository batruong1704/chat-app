package site.whatsapp.request;

import lombok.*;
import site.whatsapp.models.ChatModel;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class ChatDTO implements Serializable {
    private UUID id;
    private String chatName;
    private String chatImage;
    private boolean isGroup;
    private Set<UUID> userIds = new HashSet<>();
    private Set<UUID> adminIds = new HashSet<>();
    private UUID createdById;

    public static ChatDTO fromEntity(ChatModel entity) {
        ChatDTO dto = new ChatDTO();
        dto.setId(entity.getId());
        dto.setChatName(entity.getChat_name());
        dto.setChatImage(entity.getChat_image());
        dto.setGroup(entity.isGroup());

        if (entity.getCreatedBy() != null) {
            dto.setCreatedById(entity.getCreatedBy().getId());
        }

        entity.getUsers().forEach(user -> dto.getUserIds().add(user.getId()));
        entity.getAdmins().forEach(admin -> dto.getAdminIds().add(admin.getId()));

        return dto;
    }
}