package site.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import site.chat.dto.UserDTO;
import site.chat.dto.response.ResponseObject;
import site.chat.dto.UpdateStatusDTO;
import site.chat.services.UserService;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173/")
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseObject<?> login(@RequestBody UserDTO userDTO) {
        return userService.login(userDTO);
    }

    @GetMapping("/getAll")
    public ResponseObject<?> getAllUser() {
        return userService.getAllUser();
    }

    @GetMapping("/getUser/{id}")
    public ResponseObject<?> getAllUser(@PathVariable String id) {
        UUID uuid = UUID.fromString(id);
        return userService.getUserById(uuid);
    }

    @PutMapping("/updateStatus")
    public ResponseObject<?> updateStatus(@RequestBody UpdateStatusDTO status) {
        UUID user_Id = UUID.fromString(status.getId());
        return userService.updateStatus(user_Id, status.getStatus());
    }

}
