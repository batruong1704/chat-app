package site.whatsapp.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.whatsapp.exception.ChatException;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.ChatModel;
import site.whatsapp.request.GroupChatRequest;
import site.whatsapp.request.SingleChatRequest;
import site.whatsapp.models.UserModel;
import site.whatsapp.response.ApiResponse;
import site.whatsapp.services.inter.ChatService;
import site.whatsapp.services.inter.UserService;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;
    private final UserService userService;

    @PostMapping("/single")
    public ResponseEntity<ChatModel> createChatHandle(@RequestBody SingleChatRequest singleChatRequest, @RequestHeader("Authorization") String jwt
    ) throws UserException {
        UserModel userModel = userService.findUserProfile(jwt);
        ChatModel chatModel = chatService.createChat(userModel, singleChatRequest.getUserId());
        return new ResponseEntity<>(chatModel, HttpStatus.OK);
    }

    @PostMapping("/group")
    public ResponseEntity<ChatModel> createGroupHandle(@RequestBody GroupChatRequest req, @RequestHeader("Authorization") String jwt
    ) throws UserException {
        UserModel userModel = userService.findUserProfile(jwt);
        ChatModel chatModel = chatService.createGroup(req, userModel);
        return new ResponseEntity<>(chatModel, HttpStatus.OK);
    }

    @PostMapping("/{chatId}")
    public ResponseEntity<ChatModel> findChatByIdHandle(
            @PathVariable UUID chatId,
            @RequestHeader("Authorization") String jwt
    ) throws UserException, ChatException {
        ChatModel chatModel = chatService.findChatById(chatId);
        return new ResponseEntity<ChatModel>(chatModel, HttpStatus.OK);
    }

    /**
     * Lấy danh sách phòng chat
     *
     * @param jwt
     * @return
     * @throws UserException
     * @throws ChatException
     */
    @GetMapping("/user")
    public ResponseEntity<List<ChatModel>> findAllChatByUserIdHandle(
            @RequestHeader("Authorization") String jwt
    ) throws UserException, ChatException {
        UserModel userModel = userService.findUserProfile(jwt);
        List<ChatModel> chatModels = chatService.findAllChatByUserId(userModel.getId());
        return new ResponseEntity<>(chatModels, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<ChatModel> addUserToGroupHandle(
            @PathVariable UUID chatId,
            @PathVariable UUID userId,
            @RequestHeader("Authorization") String jwt
    ) throws UserException, ChatException {
        UserModel userModel = userService.findUserProfile(jwt);
        ChatModel chatModel = chatService.addUserToGroup(userId, chatId, userModel);
        return new ResponseEntity<>(chatModel, HttpStatus.OK);
    }

    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<ChatModel> removeUserToGroupHandle(
            @PathVariable UUID chatId,
            @PathVariable UUID userId,
            @RequestHeader("Authorization") String jwt
    ) throws UserException, ChatException {
        UserModel userModel = userService.findUserProfile(jwt);
        ChatModel chatModel = chatService.removeUserFromGroup(userId, chatId, userModel);
        return new ResponseEntity<>(chatModel, HttpStatus.OK);
    }

    @PutMapping("/delete/{chatId}")
    public ResponseEntity<ApiResponse> deleteChatHandle(
            @PathVariable UUID chatId,
            @RequestHeader("Authorization") String jwt
    ) throws UserException, ChatException {
        UserModel userModel = userService.findUserProfile(jwt);
        chatService.deleteChat(chatId, userModel.getId());
        ApiResponse res = new ApiResponse("Xóa cuộc hội thoại thành công", true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }


}
