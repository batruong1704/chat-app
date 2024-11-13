package site.whatsapp.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import site.whatsapp.exception.UserException;
import site.whatsapp.models.UserModel;
import site.whatsapp.request.UpdateUserRequest;
import site.whatsapp.response.ApiResponse;
import site.whatsapp.services.inter.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserModel> getUserProfileHandler(@RequestHeader("Authorization") String token) throws UserException {
        UserModel user = userService.findUserProfile(token);
        return new ResponseEntity<UserModel>(user, HttpStatus.ACCEPTED);
    }

    @GetMapping("/query")
    public ResponseEntity<List<UserModel>> searchUserHandler(@PathVariable("query") String query) {
        List<UserModel> users = userService.searchUser(query);
        return new ResponseEntity<List<UserModel>>(users, HttpStatus.ACCEPTED);
    }

    public ResponseEntity<ApiResponse> updateUserHandler(
            @RequestBody UpdateUserRequest req,
            @RequestHeader("Authorization") String token
            ) throws UserException {
        UserModel userModel = userService.findUserProfile(token);
        userService.updateUser(userModel.getId(), req);

        ApiResponse updatedUser = new ApiResponse("Cập nhật thành công!", true);
        return new ResponseEntity<ApiResponse>(updatedUser, HttpStatus.ACCEPTED);
    }


}
