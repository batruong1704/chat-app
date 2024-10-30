package site.chat.services;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import site.chat.dto.UserDTO;
import site.chat.dto.constant.StatusMessage;
import site.chat.dto.response.ResponseObject;
import site.chat.models.UserModel;
import site.chat.repository.BaseRepository;
import site.chat.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Builder
public class UserService {
    private final BaseRepository<UserModel, UUID> baseRepository;
    private final UserRepository userRepository;

    public ResponseObject<?> login(UserDTO userdto) {
        return userRepository.findByUsername(userdto.getUsername())
                .map(user -> {
                    if(userdto.getPassword().equals(user.getPassword())){
                        return ResponseObject.success(StatusMessage.SUCCESS, user);
                    }
                    return ResponseObject.error("Login fail!");
                }).orElse(ResponseObject.error("Not found user + " + userdto.getUsername() +"!"));
    }

}
