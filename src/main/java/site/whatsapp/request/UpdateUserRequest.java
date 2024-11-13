package site.whatsapp.request;

import lombok.*;

@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class UpdateUserRequest {
    private String full_name;
    private String profile_picture;
}
