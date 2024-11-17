package site.whatsapp.request;

import lombok.*;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class TypingStatusRequest {
    private String chatId;
    private String userId;
    private boolean booleanTyping;
}
