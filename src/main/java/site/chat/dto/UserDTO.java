package site.chat.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    @Column(name = "username")
    private String Username;

    @Column(name = "password")
    private String Password;
}
