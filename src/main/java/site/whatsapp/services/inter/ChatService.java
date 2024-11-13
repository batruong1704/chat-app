package site.whatsapp.services.inter;

import java.util.List;
import java.util.UUID;

import site.whatsapp.models.UserModel;
import site.whatsapp.request.GroupChatRequest;
import site.whatsapp.exception.ChatException;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.ChatModel;

public interface ChatService {
     ChatModel createChat (UserModel reqUser, UUID reqUserId2) throws UserException;
     ChatModel findChatById (UUID chatId) throws ChatException;
     List<ChatModel> findAllChatByUserId(UUID userId) throws ChatException, UserException;
     ChatModel createGroupver1(GroupChatRequest groupChatRequest, UserModel reqUser) throws UserException;
     ChatModel createGroup(GroupChatRequest groupChatRequest, UserModel reqUser) throws UserException;
     ChatModel addUserToGroup(UUID userId, UUID chatId, UserModel reqUser) throws UserException, ChatException;
     ChatModel renameGroup(UUID chatId, String groupName, UserModel reqUser) throws ChatException, UserException;
     ChatModel removeUserFromGroup(UUID chatId, UUID userId, UserModel reqUser) throws ChatException, UserException;
     void deleteChat(UUID chatId, UUID reqUser) throws ChatException, UserException;
}
