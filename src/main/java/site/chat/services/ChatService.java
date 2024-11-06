package site.chat.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import site.chat.dto.MessageDTO;
import site.chat.models.MessagesModel;
import site.chat.models.RoomModel;
import site.chat.models.UserModel;
import site.chat.repository.MessagesRepository;
import site.chat.repository.RoomRepository;
import site.chat.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatService extends BaseService<MessagesModel, UUID, MessagesRepository>{
    private final UserRepository userRepository;
    private final UserService userService;
    private final RoomRepository roomRepository;
    private final MessagesRepository messagesRepository;

    @Autowired
    public ChatService(MessagesRepository messagesRepository, RoomRepository roomRepository, UserRepository userRepository, UserService userService) {
        super(messagesRepository);
        this.messagesRepository = messagesRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public RoomModel findPublicRoomChat() {
        UUID roomId = UUID.fromString("cb6e6cb1-975f-11ef-8682-0242ac140002");
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Room not found: " + roomId));
    }

    public void saveMessageToRoom (MessageDTO input){
        Optional<UserModel> senderModelOpt = userRepository.findById(input.getSenderId());
        UserModel senderModel = userService.convertOptionalToModelForUser(senderModelOpt);
        Optional<RoomModel> roomModelOpt = roomRepository.findById(input.getRoomId());
        RoomModel roomModel = roomModelOpt.orElseThrow(() -> new EntityNotFoundException("Room not found: " + input.getRoomId()));
        save(MessagesModel.builder()
                .senderId(senderModel)
                .content(input.getContent())
                .messageType(input.getType())
                .roomId(roomModel)
                .createdAt(LocalDateTime.now())
                .build()
        );
    }

    public void saveMessageToPublicRoom (MessageDTO input){
        RoomModel publicRoom = findPublicRoomChat();
        Optional<UserModel> senderModelOpt = userRepository.findById(input.getSenderId());
        UserModel senderModel = userService.convertOptionalToModelForUser(senderModelOpt);
        save(MessagesModel.builder()
                .senderId(senderModel)
                .content(input.getContent())
                .messageType(input.getType())
                .roomId(publicRoom)
                .createdAt(LocalDateTime.now())
                .build()
        );
    }

}
