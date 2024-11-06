package site.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import site.chat.dto.constant.StatusMessage;
import site.chat.dto.response.ResponseObject;
import site.chat.models.MessagesModel;
import site.chat.services.MessageService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173/")
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/getMessage/{roomId}")
    public ResponseObject<?> getRoomMessages(@PathVariable UUID roomId) {
        return messageService.findMessageByRoomId(roomId);
    }
}
