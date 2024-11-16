package site.whatsapp.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.whatsapp.exception.ChatException;
import site.whatsapp.exception.MessageException;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.MessageModel;
import site.whatsapp.models.UserModel;
import site.whatsapp.request.SendMessageRequest;
import site.whatsapp.response.ApiResponse;
import site.whatsapp.services.inter.MessageService;
import site.whatsapp.services.inter.UserService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<MessageModel> sendMessageHandler(
            @RequestBody SendMessageRequest request,
            @RequestHeader("Authorization") String token
            ) throws UserException, ChatException {
        UserModel userModel = userService.findUserProfile(token);
        request.setUserId(userModel.getId());

        MessageModel  messageModel = messageService.sendMessage(request);

        return new ResponseEntity<MessageModel>(messageModel, HttpStatus.OK);
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<MessageModel>> getChatsMessageHandle(
            @PathVariable UUID chatId,
            @RequestHeader("Authorization") String token
    ) throws UserException, ChatException {
        UserModel userModel = userService.findUserProfile(token);
        List<MessageModel> messageModels = messageService.getChatsMessages(chatId, userModel);
        return new ResponseEntity<>(messageModels, HttpStatus.OK);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessageHandle(
            @PathVariable UUID messageId,
            @RequestHeader("Authorization") String token
    ) throws UserException, ChatException, MessageException {
        UserModel userModel = userService.findUserProfile(token);
        messageService.deleteMessage(messageId, userModel);
        ApiResponse res = new ApiResponse("Xóa tin nhắn thành công!", false);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/getChatRoom")
    public ResponseEntity<String> getChatRoomId(
            @RequestBody MessageModel message,
            @RequestHeader("Authorization") String token
    ) throws UserException, ChatException {
        userService.findUserProfile(token);
        String id = message.getChatModel().getId().toString();
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
