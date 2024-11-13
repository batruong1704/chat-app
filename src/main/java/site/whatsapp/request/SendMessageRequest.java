package site.whatsapp.request;

import lombok.*;

import java.util.UUID;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor @Builder
public class SendMessageRequest {
    private UUID userId;
    private UUID chatId;
    private String content;
}
