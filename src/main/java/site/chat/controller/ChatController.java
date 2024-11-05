package site.chat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import site.chat.config.WebSocketEventListener;
import site.chat.dto.LogoutDTO;
import site.chat.dto.MessageDTO;
import site.chat.repository.UserRepository;
import site.chat.services.ChatService;
import site.chat.services.UserService;
import java.util.Objects;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final ChatService chatService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final WebSocketEventListener webSocketEventListener;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    @CrossOrigin("http://localhost:5173/")
    public MessageDTO sendMessage(
            @Payload MessageDTO chatMessage
    ) {
        chatService.saveMessageToPublicRoom(chatMessage);
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    @CrossOrigin("http://localhost:5173/")
    public MessageDTO addUser(
            @Payload MessageDTO input,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        UUID userId = input.getSenderId();
        String username = userService.convertOptionalToModelForUser(userRepository.findById(userId)).getUsername();
        log.info("Username: " + username);

        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("username", username);
        Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("userId", userId);
        webSocketEventListener.handleUserJoined(
                headerAccessor.getSessionId(),
                userId,
                username
        );
        return input;
    }

}