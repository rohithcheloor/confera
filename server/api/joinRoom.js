import { getRoom } from "../store/roomStore.js";

const authenticateRoom = (req, res) => {
    const { roomId, secureRoom, password } = req.body;
    const result = getRoom(roomId, password, secureRoom);
    console.log(result);
    return res.json(result);
}

export { authenticateRoom }