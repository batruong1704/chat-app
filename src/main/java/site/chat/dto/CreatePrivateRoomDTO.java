package site.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @Builder
public class CreatePrivateRoomDTO {
    String currentId;
    String targetId;
}
