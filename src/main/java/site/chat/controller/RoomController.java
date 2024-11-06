package site.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import site.chat.dto.CreatePrivateRoomDTO;
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

    @PostMapping("/createPrivateRoom")
    public ResponseObject<?> createPrivateRoom(@RequestBody CreatePrivateRoomDTO createPrivateRoomDTO){
        return roomService.createPrivateRoom(createPrivateRoomDTO);
    }

}
