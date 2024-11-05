package site.chat.services;

import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import site.chat.dto.constant.StatusMessage;
import site.chat.dto.response.ResponseObject;
import site.chat.models.RoomModel;
import site.chat.repository.RoomRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@Builder
public class RoomService extends BaseService<RoomModel, UUID, RoomRepository>{
    private final RoomRepository roomRepository;
    private final String publicRoomId = "cb6e6cb1-975f-11ef-8682-0242ac140002";
    @Autowired
    public RoomService(RoomRepository roomRepository) {
        super(roomRepository);
        this.roomRepository = roomRepository;
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
}
