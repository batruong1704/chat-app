package site.whatsapp.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.whatsapp.exception.ChatException;
import site.whatsapp.exception.MessageException;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.ChatModel;
import site.whatsapp.models.MessageModel;
import site.whatsapp.models.UserModel;
import site.whatsapp.repositorys.MessageRepository;
import site.whatsapp.request.MessageDTO;
import site.whatsapp.request.SendMessageRequest;
import site.whatsapp.services.inter.ChatService;
import site.whatsapp.services.inter.MessageService;
import site.whatsapp.services.inter.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class MessageServiceImplementation implements MessageService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final MessageRepository messageRepository;
    private final UserService userService;
    private final ChatService chatService;

    @Value("${cache.redis.chat_messages}")
    private String CHAT_MESSAGES_KEY_PREFIX;

    @Value("${cache.redis.message_details}")
    private String MESSAGE_DETAILS_KEY_PREFIX;

    @Value("${cache.redis.message_ttl:3600}")
    private long messageCacheTTL;

    private String getChatMessagesKey(UUID chatId) {
        return CHAT_MESSAGES_KEY_PREFIX + ":" + chatId;
    }

    private String getMessageKey(UUID messageId) {
        return MESSAGE_DETAILS_KEY_PREFIX + ":" + messageId;
    }

    @Override
    @Transactional
    public MessageModel sendMessage(SendMessageRequest request) throws UserException, ChatException {
        UserModel userModel = userService.findUserById(request.getUserId());
        ChatModel chatModel = chatService.findChatById(request.getChatId());

        MessageModel newMessage = messageRepository.save(MessageModel.builder()
                .chatModel(chatModel)
                .userModel(userModel)
                .content(request.getContent())
                .timestamp(LocalDateTime.now())
                .build());

        // Lưu tin nhắn mới vào cache dưới dạng DTO
        String messageKey = getMessageKey(newMessage.getId());
        MessageDTO messageDTO = MessageDTO.fromEntity(newMessage);
        redisTemplate.opsForValue().set(messageKey, messageDTO, messageCacheTTL, TimeUnit.SECONDS);

        // Xóa cache của tin nhắn trong cuộc trò chuyện
        String chatMessagesKey = getChatMessagesKey(chatModel.getId());
        redisTemplate.delete(chatMessagesKey);

        return newMessage;
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<MessageModel> getChatsMessages(UUID chatId, UserModel reqUser) throws ChatException, UserException {
        ChatModel chatModel = chatService.findChatById(chatId);
        if (!chatModel.getUsers().contains(reqUser)) {
            throw new UserException("Bạn không tham gia cuộc trò chuyện " + chatModel.getChat_name());
        }

        String chatMessagesKey = getChatMessagesKey(chatId);

        // Thử lấy tin nhắn từ cache
        List<MessageDTO> cachedMessages = (List<MessageDTO>) redisTemplate.opsForValue().get(chatMessagesKey);
        if (cachedMessages != null) {
            log.debug("Cache hit for chat messages: {}", chatId);
            // Chuyển đổi DTO thành entity và trả về
            return messageRepository.findAllById(
                    cachedMessages.stream()
                            .map(MessageDTO::getId)
                            .collect(Collectors.toList())
            );
        }

        // Nếu không có trong cache, lấy từ database và lưu vào cache
        log.debug("Cache miss for chat messages: {}", chatId);
        List<MessageModel> messages = messageRepository.findByChatId(chatModel.getId());
        List<MessageDTO> messageDTOs = messages.stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());

        redisTemplate.opsForValue().set(chatMessagesKey, messageDTOs, messageCacheTTL, TimeUnit.SECONDS);

        return messages;
    }

    @Override
    @Transactional(readOnly = true)
    public MessageModel findMessageById(UUID messageId) throws MessageException {
        // Thử lấy từ cache trước
        String messageKey = getMessageKey(messageId);
        MessageDTO cachedMessage = (MessageDTO) redisTemplate.opsForValue().get(messageKey);

        if (cachedMessage != null) {
            log.debug("Cache hit for message: {}", messageId);
            return messageRepository.findById(messageId)
                    .orElseThrow(() -> new MessageException("Tin nhắn với mã định danh " + messageId + " không tồn tại"));
        }

        // Nếu không có trong cache, lấy từ database và lưu vào cache
        log.debug("Cache miss for message: {}", messageId);
        Optional<MessageModel> messageOpt = messageRepository.findById(messageId);
        if (messageOpt.isPresent()) {
            MessageModel message = messageOpt.get();
            MessageDTO messageDTO = MessageDTO.fromEntity(message);
            redisTemplate.opsForValue().set(messageKey, messageDTO, messageCacheTTL, TimeUnit.SECONDS);
            return message;
        }

        throw new MessageException("Tin nhắn với mã định danh " + messageId + " không tồn tại");
    }

    @Override
    @Transactional
    public void deleteMessage(UUID messageId, UserModel requestUser) throws MessageException {
        MessageModel messageModel = findMessageById(messageId);
        if (!messageModel.getUserModel().getId().equals(requestUser.getId())) {
            throw new MessageException("Bạn không thể xóa tin nhắn của người khác");
        }

        // Xóa khỏi database
        messageRepository.delete(messageModel);

        // Xóa khỏi cache
        String messageKey = getMessageKey(messageId);
        redisTemplate.delete(messageKey);

        // Xóa cache của tin nhắn trong cuộc trò chuyện
        String chatMessagesKey = getChatMessagesKey(messageModel.getChatModel().getId());
        redisTemplate.delete(chatMessagesKey);
    }
}