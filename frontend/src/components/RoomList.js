import { useEffect, useState } from "react";
import { getRooms } from "../api";

const RoomList = ({ onSelectRoom }) => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        getRooms().then(res => setRooms(res.data));
    }, []);

    return (
        <ul>
            {rooms.map((room) => (
                <li key={room._id} onClick={() => onSelectRoom(room._id)}>{room.name}</li>
            ))}
        </ul>
    );
};

export default RoomList;
