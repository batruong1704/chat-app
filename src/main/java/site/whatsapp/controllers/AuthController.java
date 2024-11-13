package site.whatsapp.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.whatsapp.configs.TokenProvider;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.UserModel;
import site.whatsapp.repositorys.UserRepository;
import site.whatsapp.request.LoginRequest;
import site.whatsapp.response.AuthResponse;
import site.whatsapp.services.CustomUserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final CustomUserService customUserService;

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody UserModel input) throws UserException {
        UserModel userModel = userRepository.findByEmail(input.getEmail());
        if (userModel != null) {
            throw new UserException("Email đã tồn tại!");
        }
        UserModel createdUser = UserModel.builder()
            .email(input.getEmail())
                .full_name(input.getFull_name())
                .password(passwordEncoder.encode(input.getPassword()))
                .build();
        userRepository.save(createdUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        AuthResponse res = new AuthResponse(token, true);

        return new ResponseEntity<AuthResponse>(res, HttpStatus.ACCEPTED);
    }

    public ResponseEntity<AuthResponse> loginHandle(@RequestBody LoginRequest req) {
        String email = req.getEmail();
        String password = req.getPassword();

        Authentication authentication = authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        AuthResponse res = new AuthResponse(jwt, true);
        return new ResponseEntity<AuthResponse>(res, HttpStatus.ACCEPTED);
    }

    public Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Không tìm thấy user: " + username);
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Sai tài khoản hoặc mật khẩu!");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}
