package site.whatsapp.services.inter;

import site.whatsapp.exception.UserException;
import site.whatsapp.models.UserModel;
import site.whatsapp.request.UpdateUserRequest;

import java.util.List;
import java.util.UUID;

public interface UserService {
    public UserModel findUserById(UUID id) throws UserException;
    public UserModel findUserProfile(String jwt) throws UserException;
    public UserModel updateUser(UUID id, UpdateUserRequest req) throws UserException;
    List<UserModel> searchUser(String query);
}
