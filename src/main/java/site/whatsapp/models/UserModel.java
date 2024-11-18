package site.whatsapp.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import site.whatsapp.configs.UUIDConverter;

import java.util.UUID;

@Entity
@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode
public class UserModel {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "BINARY(16)")
    @Convert(converter = UUIDConverter.class)
    private UUID id;

    private String full_name;
    private String email;
    private String profile_picture;
    private String password;
}
