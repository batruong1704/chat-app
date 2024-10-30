package site.chat.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ResponseObject <T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> ResponseObject<T> success(String message, T data) {
        return ResponseObject.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ResponseObject<T> error(String message) {
        return ResponseObject.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}