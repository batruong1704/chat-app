package site.chat.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import site.chat.dto.UserDTO;
import site.chat.dto.constant.StatusMessage;
import site.chat.dto.response.ResponseObject;
import site.chat.models.UserModel;
import site.chat.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service @Slf4j @Builder
public class UserService extends BaseService<UserModel, UUID, UserRepository>{
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        super(userRepository);
        this.userRepository = userRepository;
    }

    public ResponseObject<?> login(UserDTO userdto) {
        return userRepository.findByUsername(userdto.getUsername())
                .map(user -> {
                    if(userdto.getPassword().equals(user.getPassword())){
                        return ResponseObject.success(StatusMessage.SUCCESS, user);
                    }
                    return ResponseObject.error("Login fail!");
                }).orElse(ResponseObject.error("Not found user + " + userdto.getUsername() +"!"));
    }

    public ResponseObject<?> getAllUser() {
        List<UserModel> data = getAll();
        if (!data.isEmpty()) {
            return ResponseObject.success(StatusMessage.SUCCESS, data);
        }
        return ResponseObject.error(StatusMessage.NOT_FOUND);
    }

    public ResponseObject<?> getUserById(UUID id) {
        Optional<UserModel> data = get(id);
        if (data.isPresent()) {
            return ResponseObject.success(StatusMessage.SUCCESS, data);
        }
        return ResponseObject.error(StatusMessage.NOT_FOUND);
    }

    public ResponseObject<?> updateStatus(UUID userId, Boolean status) {
        try {
            UserModel userModel = UserModel.builder()
                    .isOnline(status)
                    .build();
            UserModel user = update(userId, userModel, existingUser -> {
                existingUser.setOnline(status);
                return existingUser;
            });
            return ResponseObject.success(StatusMessage.SUCCESS, user);
        } catch (Exception e) {
            log.error("In user service: " + e);
            return ResponseObject.error(StatusMessage.NOT_FOUND);
        }
    }

    public UserModel getUserByUsername(String username){
        return userRepository.findByUsernameGetUUID(username);
    }


    public UUID getUserIdFromOptional(Optional<UserModel> userOptional) {
        UserModel user = userOptional.orElseThrow(() -> new EntityNotFoundException("User not found: " + userOptional));
        return user.getId();
    }


    public UserModel convertOptionalToModelForUser(Optional<UserModel> userOptional){
        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new EntityNotFoundException("User not found: " + getUserIdFromOptional(userOptional));
        }
    }

    public ResponseObject<?> getUsernameById(UUID id) {
        Optional<UserModel> data = userRepository.findById(id);
        if (data.isPresent()) {
            return ResponseObject.success(StatusMessage.SUCCESS, data.get().getUsername());
        }
        return ResponseObject.error(StatusMessage.NOT_FOUND);
    }

}
