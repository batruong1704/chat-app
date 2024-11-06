package site.chat.services;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import site.chat.dto.RoomInfoDTO;
import site.chat.dto.constant.StatusMessage;
import site.chat.dto.response.ResponseObject;
import site.chat.models.RoomMembersModel;
import site.chat.models.RoomModel;
import site.chat.repository.RoomMemberRepository;
import site.chat.repository.RoomRepository;
import site.chat.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@Builder
@RequiredArgsConstructor(onConstructor_ = @__(@Autowired))
public class RoomMemberService{
    private final RoomMemberRepository roomMemberRepository;

    public ResponseObject<?> findRoomIdByUserId(UUID id){
        List<RoomModel> roomList = roomMemberRepository.findRoomIdByUserId(id);
        if (!roomList.isEmpty()) {
            return ResponseObject.success(StatusMessage.SUCCESS, roomList);
        }
        return ResponseObject.error(StatusMessage.NOT_FOUND);
    }

}
