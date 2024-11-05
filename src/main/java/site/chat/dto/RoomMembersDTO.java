package site.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class RoomMembersDTO {
    public UUID roomId;

    private UUID userId;

    private LocalDateTime joinedAt;
}
