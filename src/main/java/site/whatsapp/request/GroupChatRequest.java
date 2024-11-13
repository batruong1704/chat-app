package site.whatsapp.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class GroupChatRequest {
    private List<UUID> userIds;
    private String chat_name;
    private String chat_image;

}
