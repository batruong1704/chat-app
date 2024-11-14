package site.whatsapp.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import site.whatsapp.exception.ChatException;
import site.whatsapp.exception.MessageException;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.ChatModel;
import site.whatsapp.models.MessageModel;
import site.whatsapp.models.UserModel;
import site.whatsapp.repositorys.MessageRepository;
import site.whatsapp.request.SendMessageRequest;
import site.whatsapp.services.inter.ChatService;
import site.whatsapp.services.inter.MessageService;
import site.whatsapp.services.inter.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImplementation implements MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    private final ChatService chatService;

    @Override
    public MessageModel sendMessage(SendMessageRequest request) throws UserException, ChatException {
        UserModel userModel = userService.findUserById(request.getUserId());
        ChatModel chatModel = chatService.findChatById(request.getChatId());
//        MessageModel messageModel = MessageModel.builder()
//                .chatModel(chatModel)
//                .userModel(userModel)
//                .content(request.getContent())
//                .timestamp(LocalDateTime.now())
//                .build();
        return messageRepository.save(MessageModel.builder()
                .chatModel(chatModel)
                .userModel(userModel)
                .content(request.getContent())
                .timestamp(LocalDateTime.now())
                .build());
    }

    @Override
    public List<MessageModel> getChatsMessages(UUID chatId, UserModel reqUser) throws ChatException, UserException {
        ChatModel chatModel = chatService.findChatById(chatId);
        if (!chatModel.getUsers().contains(reqUser)) {
            throw new UserException("Bạn không tham gia cuộc trò chuyện "+ chatModel.getChat_name());
        }
        return messageRepository.findByChatId(chatModel.getId());
    }

    @Override
    public MessageModel findMessageById(UUID messageId) throws MessageException {
        Optional<MessageModel> messageOpt = messageRepository.findById(messageId);
        if(messageOpt.isPresent()) {
            return messageOpt.get();
        }
        throw new MessageException("Tin nhắn với mã định danh "+ messageId + " không tồn tại");
    }

    @Override
    public void deleteMessage(UUID messageId, UserModel requestUser) throws MessageException {
        MessageModel messageModel = findMessageById(messageId);
        if (!messageModel.getUserModel().getId().equals(requestUser.getId())) {
            throw new MessageException("Bạn không thể xóa tin nhắn của người khác");
        }
        messageRepository.delete(messageModel);
    }
}
