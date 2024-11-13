package site.whatsapp.services.inter;

import site.whatsapp.exception.ChatException;
import site.whatsapp.exception.MessageException;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.MessageModel;
import site.whatsapp.models.UserModel;
import site.whatsapp.request.SendMessageRequest;

import java.util.List;
import java.util.UUID;

public interface MessageService {
    MessageModel sendMessage(SendMessageRequest sendMessageRequest) throws UserException, ChatException;
    List<MessageModel> getChatsMessages(UUID chatId, UserModel reqUser) throws ChatException, UserException;
    MessageModel findMessageById(UUID messageId) throws MessageException;
    void deleteMessage(UUID messageId, UserModel reqUser) throws MessageException;
}
