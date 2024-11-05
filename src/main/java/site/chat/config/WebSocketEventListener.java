package site.chat.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import site.chat.dto.MessageDTO;
import site.chat.models.MessageType;
import site.chat.models.UserModel;
import site.chat.repository.UserRepository;
import site.chat.services.ChatService;
import site.chat.services.UserService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatService chatService;
    private final UserService userService;
    private static final Map<String, String> sessionUserMap = new ConcurrentHashMap<>();
    private final UserRepository userRepository;

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        if (sessionId != null) {
            log.info("New WebSocket connection, sessionId: {}", sessionId);
        }
    }

    private void broadcastActiveUsers() {
        try {
            var response = userService.getAllUser();
            messagingTemplate.convertAndSend("/topic/users", response);
        } catch (Exception e) {
            log.error("Error broadcasting active users", e);
        }
    }

    public void handleUserJoined(String sessionId, UUID userId, String username) {
        try {
            log.info("User join: {}", username);
            UserModel userModel = UserModel.builder()
                    .id(userId)
                    .username(username)
                    .isOnline(true)
                    .lastSeen(LocalDateTime.now())
                    .build();

            sessionUserMap.put(sessionId, userId.toString());

            userService.updateStatus(userId, true);
            messagingTemplate.convertAndSend("/topic/user-status", userModel);

            MessageDTO joinMessage = MessageDTO.builder()
                    .type(MessageType.JOIN)
                    .content(username + " đã tham gia!")
                    .senderId(userId)
                    .build();

            chatService.saveMessageToPublicRoom(joinMessage);
            messagingTemplate.convertAndSend("/topic/public", joinMessage);

            broadcastActiveUsers();

            log.info("User joined - Username: {}, UserId: {}, SessionId: {}",
                    username, userId, sessionId);
        } catch (Exception e) {
            log.error("Error handling user join: {}", e.getMessage(), e);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        if (headerAccessor.getCommand() == null) {
            log.debug("Ignoring disconnect event with null command for session: {}", sessionId);
            return;
        }
        log.info("Processing disconnect - SessionId: {} - Command: {}",
                sessionId, headerAccessor.getCommand());

        String userIdStr = sessionUserMap.get(sessionId);

        if (userIdStr == null) {
            log.warn("No user found for session: {}", sessionId);
            return;
        }

        try {
            UUID userId = UUID.fromString(userIdStr);
            UserModel userModel = userService.convertOptionalToModelForUser(
                    userRepository.findById(userId)
            );

            if (userModel == null) {
                log.warn("User not found for ID: {}", userId);
                return;
            }

            sessionUserMap.remove(sessionId);
            userService.updateStatus(userId, false);

            UserModel userStatus = UserModel.builder()
                    .id(userId)
                    .username(userModel.getUsername())
                    .isOnline(false)
                    .lastSeen(LocalDateTime.now())
                    .build();
            messagingTemplate.convertAndSend("/topic/user-status", userStatus);

            MessageDTO leaveMessage = MessageDTO.builder()
                    .type(MessageType.LEAVE)
                    .content(userModel.getUsername() + " đã rời đi!")
                    .senderId(userId)
                    .build();
            chatService.saveMessageToPublicRoom(leaveMessage);
            messagingTemplate.convertAndSend("/topic/public", leaveMessage);

            broadcastActiveUsers();

            log.info("User disconnected - Username: {}, UserId: {}, SessionId: {}",
                    userModel.getUsername(), userId, sessionId);

        } catch (Exception e) {
            log.error("Error handling disconnect: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to handle disconnect", e);
        }

    }
}
