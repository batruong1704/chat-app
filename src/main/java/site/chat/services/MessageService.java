package site.chat.services;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import site.chat.dto.constant.StatusMessage;
import site.chat.dto.response.ResponseObject;
import site.chat.models.MessagesModel;
import site.chat.models.RoomModel;
import site.chat.repository.MessagesRepository;
import site.chat.repository.RoomMemberRepository;
import site.chat.repository.RoomRepository;
import site.chat.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service @Slf4j @Builder @RequiredArgsConstructor(onConstructor_ = @__(@Autowired))
public class MessageService{

    private final MessagesRepository messagesRepository;
    private final UserRepository userRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomRepository roomRepository;

    public ResponseObject<?> findMessageByRoomId(UUID roomId){
        RoomModel roomModel = roomRepository.findById(roomId).orElse(null);
        List<MessagesModel> messageList = messagesRepository.findMessagesModelByRoomIdOrderByCreatedAt(roomModel);
        if (!messageList.isEmpty()) {
            return ResponseObject.success(StatusMessage.SUCCESS, messageList);
        }
        return ResponseObject.error(StatusMessage.NOT_FOUND);
    }


}
