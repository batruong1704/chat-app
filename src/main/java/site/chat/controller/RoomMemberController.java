package site.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import site.chat.dto.response.ResponseObject;
import site.chat.services.RoomMemberService;

import java.util.UUID;

@RestController
@RequestMapping("/api/roomMember")
@RequiredArgsConstructor(onConstructor_ = @__(@Autowired))
@CrossOrigin("http://localhost:5173/")
public class RoomMemberController {
    private final RoomMemberService roomMemberService;

    @GetMapping("/findRoomIdByUserId/{id}")
    public ResponseObject<?> findRoomIdByUserId(@PathVariable UUID id) {
        return roomMemberService.findRoomIdByUserId(id);
    }

}
