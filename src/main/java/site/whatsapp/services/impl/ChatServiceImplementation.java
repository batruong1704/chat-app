package site.whatsapp.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;
import site.whatsapp.exception.ChatException;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.ChatModel;
import site.whatsapp.models.UserModel;
import site.whatsapp.repositorys.ChatRepository;
import site.whatsapp.request.GroupChatRequest;
import site.whatsapp.services.inter.ChatService;
import site.whatsapp.services.inter.UserService;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImplementation implements ChatService {
    private final ChatRepository chatRepository;
    private final UserService userService;

    @Override
    public ChatModel createChat(UserModel reqUser, UUID reqUser2) throws UserException {
        MDC.put("method", "createChat");
        log.info("[CHAT SERVER - createChat] Tạo cuộc trò chuyện giữa người dùng {} và người dùng {}", reqUser.getId(), reqUser2);
        UserModel userModel = userService.findUserById(reqUser2);
        ChatModel isChatExist = chatRepository.findSingleChatByUserIds(userModel, reqUser);

        if (isChatExist != null) {
            log.info("Cuộc trò chuyện đã tồn tại giữa người dùng {} và người dùng {}", reqUser.getId(), reqUser2);
            MDC.clear();
            return isChatExist;
        }
        ChatModel newChat = ChatModel.builder()
                .createdBy(reqUser)
                .users(Set.of(userModel, reqUser))
                .isGroup(false)
                .build();
        log.info("Cuộc trò chuyện mới được tạo giữa người dùng {} và người dùng {}", reqUser.getId(), reqUser2);
        MDC.clear();
        return chatRepository.save(newChat);
    }

    @Override
    public ChatModel findChatById(UUID chatId) throws ChatException {
        MDC.put("method", "findChatById");
        log.info("Tìm cuộc trò chuyện theo ID: {}", chatId);
        Optional<ChatModel> chat = chatRepository.findById(chatId);
        if (chat.isPresent()) {
            log.info("Đã tìm thấy cuộc trò chuyện với ID: {}", chatId);
            MDC.clear();
            return chat.get();
        }
        log.error("Không tìm thấy cuộc trò chuyện với ID: {}", chatId);
        MDC.clear();
        throw new ChatException("[ChatServiceImpl] Không tìm thấy tin nhắn với mã định danh: " + chatId);
    }

    @Override
    public List<ChatModel> findAllChatByUserId(UUID userId) throws ChatException, UserException {
        MDC.put("method", "findAllChatByUserId");
        log.info("Tìm tất cả các cuộc trò chuyện cho ID người dùng: {}", userId);
        UserModel userModel = userService.findUserById(userId);
        List<ChatModel> chats = chatRepository.findChatByUserId(userModel.getId());
        log.info("Đã tìm thấy {} cuộc trò chuyện cho ID người dùng: {}", chats.size(), userId);
        MDC.clear();
        return chats;
    }

    @Override
    public ChatModel createGroupver1(GroupChatRequest groupChatRequest, UserModel reqUser) throws UserException {
        MDC.put("method", "createGroupver1");
        log.info("Tạo nhóm trò chuyện phiên bản 1 với tên: {}", groupChatRequest.getChat_name());
        ChatModel group = new ChatModel();
        group.setGroup(true);
        group.setChat_name(groupChatRequest.getChat_name());
        group.setChat_image(groupChatRequest.getChat_image());
        group.setCreatedBy(reqUser);
        group.getAdmins().add(reqUser);

        for (UUID userId : groupChatRequest.getUserIds()) {
            UserModel userModel = userService.findUserById(userId);
            group.getUsers().add(userModel);
        }
        log.info("Nhóm trò chuyện phiên bản 1 được tạo với tên: {}", groupChatRequest.getChat_name());
        MDC.clear();
        return group;
    }

    @Override
    public ChatModel createGroup(GroupChatRequest groupChatRequest, UserModel reqUser) throws UserException {
        MDC.put("method", "createGroup");
        log.info("[CHAT SERVER - createGroup] Tạo nhóm trò chuyện với tên: {}", groupChatRequest.getChat_name());
        Set<UserModel> userSet = new HashSet<>();
        for (UUID userId : groupChatRequest.getUserIds()) {
            UserModel userModel = userService.findUserById(userId);
            userSet.add(userModel);
        }

        ChatModel group = ChatModel.builder()
                .isGroup(true)
                .createdBy(reqUser)
                .chat_name(groupChatRequest.getChat_name())
                .chat_image(groupChatRequest.getChat_image())
                .admins(Set.of(reqUser))
                .users(userSet)
                .build();
        log.info("[CHAT SERVER - createGroup] Nhóm trò chuyện được tạo với tên: {}", groupChatRequest.getChat_name());
        MDC.clear();
        return chatRepository.save(group);
    }

    @Override
    public ChatModel addUserToGroup(UUID userId, UUID chatId, UserModel reqUser) throws UserException, ChatException {
        MDC.put("method", "addUserToGroup");
        log.info("[CHAT SERVER - addUserToGroup] Thêm người dùng {} vào nhóm {}", userId, chatId);
        Optional<ChatModel> chatOpt = chatRepository.findById(chatId);
        UserModel userModel = userService.findUserById(userId);

        if (chatOpt.isPresent()) {
            ChatModel chat = chatOpt.get();
            if (chat.getAdmins().contains(reqUser)) {
                chat.getUsers().add(userModel);
                log.info("[CHAT SERVER - addUserToGroup] Người dùng {} đã được thêm vào nhóm {}", userId, chatId);
                MDC.clear();
                return chatRepository.save(chat);
            } else {
                log.error("[CHAT SERVER - addUserToGroup] Người dùng {} không phải là quản trị viên của nhóm {}", reqUser.getId(), chatId);
                MDC.clear();
                throw new UserException("[ChatServiceImpl] Bạn không phải là Admin");
            }
        }
        log.error("[CHAT SERVER - addUserToGroup] Không tìm thấy nhóm với ID: {}", chatId);
        MDC.clear();
        throw new ChatException("[ChatServiceImpl] Không tìm thấy group với mã định danh: " + chatId);
    }

    @Override
    public ChatModel renameGroup(UUID chatId, String groupName, UserModel reqUser) throws ChatException, UserException {
        MDC.put("method", "renameGroup");
        log.info("Đổi tên nhóm {} thành {}", chatId, groupName);
        Optional<ChatModel> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isPresent()) {
            ChatModel chat = chatOpt.get();
            if (chat.getUsers().contains(reqUser)) {
                chat.setChat_name(groupName);
                log.info("Nhóm {} đã được đổi tên thành {}", chatId, groupName);
                MDC.clear();
                return chatRepository.save(chat);
            } else {
                log.error("Người dùng {} không phải là thành viên của nhóm {}", reqUser.getId(), chatId);
                MDC.clear();
                throw new UserException("[ChatServiceImpl] Bạn không phải là thành viên của nhóm!");
            }
        }
        log.error("Không tìm thấy nhóm với ID: {}", chatId);
        MDC.clear();
        throw new ChatException("[ChatServiceImpl] Không tìm thấy group với mã định danh: " + chatId);
    }

    @Override
    public ChatModel removeUserFromGroup(UUID chatId, UUID userId, UserModel reqUser) throws ChatException, UserException {
        MDC.put("method", "removeUserFromGroup");
        log.info("Xóa người dùng {} khỏi nhóm {}", userId, chatId);
        Optional<ChatModel> chatOpt = chatRepository.findById(chatId);
        UserModel userModel = userService.findUserById(userId);

        if (chatOpt.isPresent()) {
            ChatModel chat = chatOpt.get();
            if (chat.getAdmins().contains(reqUser)) {
                chat.getUsers().remove(userModel);
                log.info("Người dùng {} đã bị xóa khỏi nhóm {}", userId, chatId);
                MDC.clear();
                return chatRepository.save(chat);
            } else if (chat.getUsers().contains(reqUser)) {
                if (userModel.getId().equals(reqUser.getId())) {
                    chat.getUsers().remove(userModel);
                    log.info("Người dùng {} đã tự xóa mình khỏi nhóm {}", userId, chatId);
                    MDC.clear();
                    return chatRepository.save(chat);
                }
            } else {
                log.error("Người dùng {} không phải là quản trị viên của nhóm {}", reqUser.getId(), chatId);
                MDC.clear();
                throw new UserException("[ChatServiceImpl] Bạn không thể xóa thành viên khác!");
            }
        }
        log.error("Không tìm thấy nhóm với ID: {}", chatId);
        MDC.clear();
        throw new ChatException("[ChatServiceImpl] Không tìm thấy group với mã định danh: " + chatId);
    }

    @Override
    public void deleteChat(UUID chatId, UUID reqUser) throws ChatException, UserException {
        MDC.put("method", "deleteChat");
        log.info("Xóa cuộc trò chuyện với ID: {}", chatId);

        Optional<ChatModel> chatOpt = chatRepository.findById(chatId);
        if (chatOpt.isPresent()) {
            ChatModel chatModel = chatOpt.get();
            chatRepository.deleteById(chatModel.getId());
        }

        MDC.clear();
    }
}