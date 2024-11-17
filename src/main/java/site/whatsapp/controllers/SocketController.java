package site.whatsapp.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import site.whatsapp.exception.ChatException;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.MessageModel;
import site.whatsapp.request.TypingStatusRequest;
import site.whatsapp.request.SendMessageRequest;
import site.whatsapp.services.inter.MessageService;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Slf4j
public class SocketController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload MessageModel message) throws ChatException, UserException {
        System.out.println("[WebSocket Server] Processing message: " + message);

        String destination = "/topic/room/" + message.getChatModel().getId();
        System.out.println("[WebSocket Server] Sending to: " + destination);

        // Gửi tin nhắn đến tất cả các client
        simpMessagingTemplate.convertAndSend(destination, message);

        // Lưu lại tin nhắn
        SendMessageRequest sensDTO = SendMessageRequest.builder()
                .userId(message.getUserModel().getId())
                .chatId(message.getChatModel().getId())
                .content(message.getContent())
                .build();
        messageService.sendMessage(sensDTO);
    }

    @MessageMapping("/typing")
    public void handleTypingStatus(@Payload TypingStatusRequest typingStatus) {
        String destination = "/topic/typing/" + typingStatus.getChatId();
        System.out.println("[WebSocket Server] Người dùng " + typingStatus.getUserId() +
                " đang nhập tin nhắn vào phòng " + typingStatus.getChatId());

        simpMessagingTemplate.convertAndSend(destination, typingStatus);
    }

}
