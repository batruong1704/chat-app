package site.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @Builder
public class RoomDTO {
    public String name;

    private RoomType type;

    private LocalDateTime createdAt;

    public enum RoomType {
        PUBLIC,
        GROUP,
        PRIVATE
    }
}
