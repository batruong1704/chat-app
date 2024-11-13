package site.whatsapp.response;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AuthResponse {
    private String jwt;
    private boolean isAuth;
}
