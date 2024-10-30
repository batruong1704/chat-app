package site.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.Aware;
import org.springframework.web.bind.annotation.*;
import site.chat.dto.UserDTO;
import site.chat.dto.response.ResponseObject;
import site.chat.services.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173/")
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseObject<?> login(@RequestBody UserDTO userDTO) throws Exception{
        return userService.login(userDTO);
    }
}
