package site.whatsapp.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import site.whatsapp.models.ChatModel;
import site.whatsapp.models.MessageModel;
import site.whatsapp.models.UserModel;
import site.whatsapp.repositorys.ChatRepository;
import site.whatsapp.repositorys.UserRepository;
import site.whatsapp.request.SendMessageRequest;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class SocketController {
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat")
    public void processMessage(@Payload MessageModel message) {
        System.out.println("[WebSocket Server] Processing message: " + message);

        // Thêm prefix /topic để match với client subscription
        String destination = "/topic/room/" + message.getChatModel().getId();
        System.out.println("[WebSocket Server] Sending to: " + destination);

        simpMessagingTemplate.convertAndSend(destination, message);
    }

}
