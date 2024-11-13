package site.whatsapp.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Getter @Setter @Builder
@AllArgsConstructor @NoArgsConstructor
public class ChatModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String chat_name;
    private String chat_image;

    @ManyToMany
    private Set<UserModel> admins = new HashSet<>();

    @Column(name = "is_group")
    private boolean isGroup;

    @JoinColumn(name = "created_by")
    @ManyToOne
    private UserModel createdBy;

    @ManyToMany
    private Set<UserModel> users = new HashSet<>();

    @OneToMany
    private List<MessageModel> messages = new ArrayList<>();

}
