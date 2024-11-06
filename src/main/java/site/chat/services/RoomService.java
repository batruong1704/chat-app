package site.chat.services;

import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import site.chat.dto.constant.StatusMessage;
import site.chat.dto.CreatePrivateRoomDTO;
import site.chat.dto.response.ResponseObject;
import site.chat.models.RoomMembersModel;
import site.chat.models.RoomModel;
import site.chat.repository.RoomMemberRepository;
import site.chat.repository.RoomRepository;
import site.chat.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@Builder
public class RoomService extends BaseService<RoomModel, UUID, RoomRepository>{
    private final RoomRepository roomRepository;
    private final String publicRoomId = "cb6e6cb1-975f-11ef-8682-0242ac140002";
    private final UserRepository userRepository;
    private final RoomMemberRepository roomMemberRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository, UserRepository userRepository, RoomMemberRepository roomMemberRepository) {
        super(roomRepository);
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.roomMemberRepository = roomMemberRepository;
    }

    public ResponseObject<?> getAllUser(){
        List<RoomModel> data = getAll();
        if (!data.isEmpty()) {
            return ResponseObject.success(StatusMessage.SUCCESS, data);
        }
        return ResponseObject.error(StatusMessage.NOT_FOUND);
    }

    public ResponseObject<?> getPublicRoom() {
        Optional<RoomModel> data = get(UUID.fromString(publicRoomId));
        if (data.isPresent()) {
            return ResponseObject.success(StatusMessage.SUCCESS, data);
        }
        return ResponseObject.success(StatusMessage.NOT_FOUND, data);
    }

    public boolean isPrivateRoomExist(String currentId, String targetId) {
        String Ability = currentId + "+" + targetId;
        String Ability2 = targetId + "+" + currentId;
        return roomRepository.existsByNameOrName(Ability, Ability2);
    }

    public ResponseObject<?> createPrivateRoom(CreatePrivateRoomDTO createPrivateRoomDTO) {
        if (!isPrivateRoomExist(createPrivateRoomDTO.getCurrentId(), createPrivateRoomDTO.getTargetId())) {
            RoomModel roomModel = RoomModel.builder()
                    .id(UUID.randomUUID())
                    .type(RoomModel.RoomType.PRIVATE)
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
            RoomMembersModel currentMember = RoomMembersModel.builder()
                    .id(UUID.randomUUID())
                    .room(roomModel)
                    .user(userRepository.findById(UUID.fromString(createPrivateRoomDTO.getCurrentId())).get())
                    .joinedAt(java.time.LocalDateTime.now())
                    .build();
            RoomMembersModel targetMember = RoomMembersModel.builder()
                    .id(UUID.randomUUID())
                    .room(roomModel)
                    .user(userRepository.findById(UUID.fromString(createPrivateRoomDTO.getTargetId())).get())
                    .joinedAt(java.time.LocalDateTime.now())
                    .build();
            RoomModel data = null;
            try {
                data = save(roomModel);
                roomMemberRepository.save(currentMember);
                roomMemberRepository.save(targetMember);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            if (data != null) {
                return ResponseObject.success(StatusMessage.SUCCESS, data);
            }
        }
        return ResponseObject.error(StatusMessage.ERROR);
    }
}
