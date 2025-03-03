import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const createRoom = (name) => axios.post(`${API_URL}/rooms`, { name });
export const getRooms = () => axios.get(`${API_URL}/rooms`);
export const addComment = (roomId, text, emoji) =>
    axios.post(`${API_URL}/comments`, { roomId, text, emoji });
export const getComments = (roomId) => axios.get(`${API_URL}/comments/${roomId}`);
