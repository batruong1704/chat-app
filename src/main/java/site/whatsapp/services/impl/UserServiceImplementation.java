package site.whatsapp.services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import site.whatsapp.configs.TokenProvider;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.UserModel;
import site.whatsapp.repositorys.UserRepository;
import site.whatsapp.request.UpdateUserRequest;
import site.whatsapp.services.inter.UserService;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImplementation implements UserService {
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;

    @Override
    public UserModel findUserById(UUID id) throws UserException {
        Optional<UserModel> opt = userRepository.findById(id);
        if (opt.isPresent()) {
            return opt.get();
        }
        throw new UserException("User not found with id: " + id);
    }

    @Override
    public UserModel findUserProfile(String jwt) throws UserException {
        String email = tokenProvider.getEmailFormToken(jwt);

        if (email == null) {
            throw new BadCredentialsException("[UserServiceImplementation] Xác thực Token thất bại...");
        }

        UserModel userModel = userRepository.findByEmail(email);

        if (userModel == null) {
            throw new UserException("[UserServiceImplementation] Không tìm thấy User với Email là " + email);
        }

        return userModel;
    }

    @Override
    public UserModel updateUser(UUID id, UpdateUserRequest req) throws UserException {
        UserModel userModel = findUserById(id);
        if (req.getFull_name() != null) {
            userModel.setFull_name(req.getFull_name());
        }
        if (req.getProfile_picture() != null) {
            userModel.setProfile_picture(req.getProfile_picture());
        }
        return userRepository.save(userModel);
    }

    @Override
    public List<UserModel> searchUser(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String sanitizedQuery = query.trim()
                .replace("%", "\\%")
                .replace("_", "\\_");

        log.info("Thực hiện tìm kiếm người dùng bằng truy vấn: {}", sanitizedQuery);

        List<UserModel> results = userRepository.searchUser(sanitizedQuery);
        log.info("Đã tìm thấy {} người dùng phù hợp với truy vấn: {}", results.size(), sanitizedQuery);

        return results;
    }
}
