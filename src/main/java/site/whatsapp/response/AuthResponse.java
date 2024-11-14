package site.whatsapp.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor @Getter @Setter
public class AuthResponse {
    private String jwt;
    private boolean isAuth;
}
