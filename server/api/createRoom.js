import { addPrivateRoom, generatePrivateRoomId, generatePublicRoomId, addPublicRoom } from "../store/roomStore.js";

const createRoom = async (req, res) => {
    const { roomId, userId, username = "Anonymous User", password, enableSecureRoom } = req.body;
    if (enableSecureRoom == true) {
        const isCreated = addPrivateRoom(roomId, password, 0);
        if(isCreated.success === false){
            await res.json(isCreated)
            res.end();
            return isCreated;
        }
    } else {
        const isCreated = addPublicRoom(roomId, 0);
        if(isCreated.success === false){
            await res.json(isCreated)
            res.end();
            return isCreated;
        }
    }
    const data = await res.json({ roomId, isPrivateRoom: enableSecureRoom });
    res.end();
    return data;
}

const createRoomId = async (req, res) => {
    const { enableSecureRoom } = req.body;
    if (enableSecureRoom) {
        const roomId = await generatePrivateRoomId();
        res.json({ roomId, isPrivateRoom: true })
        res.end();
    } else {
        const roomId = await generatePublicRoomId();
        res.json({ roomId, isPrivateRoom: false });
        res.end();
    }
}
export { createRoom, createRoomId };