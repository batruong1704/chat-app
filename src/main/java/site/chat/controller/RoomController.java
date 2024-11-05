package site.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.chat.dto.response.ResponseObject;
import site.chat.services.RoomService;

@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173/")
public class RoomController {
    private final RoomService roomService;

    @GetMapping("/getAll")
    public ResponseObject<?> getAll(){
        return roomService.getAllUser();
    }

    @GetMapping("/getPublicRoom")
    public ResponseObject<?> getPublicRoom(){
        return roomService.getPublicRoom();
    }
}
