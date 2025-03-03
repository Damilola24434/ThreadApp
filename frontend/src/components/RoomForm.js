import { useState } from "react";
import { createRoom } from "../api";

const RoomForm = ({ refreshRooms }) => {
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createRoom(name);
        setName("");
        refreshRooms();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Room Name" />
            <button type="submit">Create Room</button>
        </form>
    );
};

export default RoomForm;
