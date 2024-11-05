package site.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @Builder
public class RoomInfoDTO {
    private UUID id;
    private String name;
}
