import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaTrash, FaFolderOpen } from 'react-icons/fa'; // Import icons
import './App.css';

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [comment, setComment] = useState('');
  const [emoji, setEmoji] = useState(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [inputType, setInputType] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null); // Track which comment is being edited
  const [editText, setEditText] = useState(''); // Store the edited text for comments
  const [editingRoomId, setEditingRoomId] = useState(null); // Track which room is being edited
  const [editRoomName, setEditRoomName] = useState(''); // Store the edited room name
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Load rooms from localStorage on initial render
  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, []);

  // Save rooms to localStorage whenever rooms change
  useEffect(() => {
    if (rooms.length > 0) {
      localStorage.setItem('rooms', JSON.stringify(rooms));
    }
  }, [rooms]);

  // Create a new room
  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom = {
      id: Date.now(),
      name: newRoomName,
      comments: [],
      timestamp: new Date().toLocaleString(),
    };
    setRooms([newRoom, ...rooms]);
    setCurrentRoom(newRoom);
    setNewRoomName('');
  };

  // Delete a room
  const handleDeleteRoom = (roomId) => {
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    setRooms(updatedRooms);
    if (currentRoom?.id === roomId) setCurrentRoom(null);
  };

  // Enter edit mode for a room
  const handleEditRoom = (roomId, currentName) => {
    setEditingRoomId(roomId); // Set the room ID being edited
    setEditRoomName(currentName); // Pre-fill the input with the current room name
  };

  // Save edited room name
  const handleSaveRoomEdit = (roomId) => {
    const updatedRooms = rooms.map((room) =>
      room.id === roomId ? { ...room, name: editRoomName } : room
    );
    setRooms(updatedRooms);
    setEditingRoomId(null); // Exit edit mode
  };

  // Post a comment (text or audio)
  const handlePost = () => {
    if (!comment && !recordedAudio) return;
    const newComment = {
      id: Date.now(),
      type: inputType,
      content: inputType === 'text' ? comment : recordedAudio,
      emoji,
      timestamp: new Date().toLocaleString(),
    };
    const updatedRoom = { ...currentRoom, comments: [newComment, ...currentRoom.comments] };
    setCurrentRoom(updatedRoom);
    setRooms(rooms.map((room) => (room.id === currentRoom.id ? updatedRoom : room)));
    setComment('');
    setEmoji(null);
    setInputType(null);
    setRecordedAudio(null);
  };

  // Delete a comment
  const handleDeleteComment = (commentId) => {
    const updatedRoom = {
      ...currentRoom,
      comments: currentRoom.comments.filter((comment) => comment.id !== commentId),
    };
    setCurrentRoom(updatedRoom);
    setRooms(rooms.map((room) => (room.id === currentRoom.id ? updatedRoom : room)));
  };

  // Enter edit mode for a comment
  const handleEditComment = (commentId) => {
    setEditingCommentId(commentId); // Set the comment ID being edited
    const commentToEdit = currentRoom.comments.find((comment) => comment.id === commentId);
    setEditText(commentToEdit.content); // Pre-fill the input with the current content
  };

  // Save edited comment
  const handleSaveEdit = (commentId) => {
    const updatedRoom = {
      ...currentRoom,
      comments: currentRoom.comments.map((comment) =>
        comment.id === commentId ? { ...comment, content: editText } : comment
      ),
    };
    setCurrentRoom(updatedRoom);
    setRooms(rooms.map((room) => (room.id === currentRoom.id ? updatedRoom : room)));
    setEditingCommentId(null); // Exit edit mode
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      audioChunksRef.current = []; // Clear previous audio data
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          setRecordedAudio(base64Audio); // Store base64 audio in state
        };
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop voice recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Thought Threads</h1>
      </header>

      {!currentRoom && (
        <div className="home-page">
          <div className="create-room-section">
            <h2>Create a New Thread</h2>
            <input
              type="text"
              placeholder="Name Your Thread"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Record Moment</button>
          </div>
          <div className="room-list">
            <h2>Captured Moments</h2>
            {rooms.length === 0 ? (
              <p>No rooms created yet. Create one to get started!</p>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="room-card">
                  {editingRoomId === room.id ? ( // Check if this room is being edited
                    <input
                      type="text"
                      value={editRoomName}
                      onChange={(e) => setEditRoomName(e.target.value)}
                      onBlur={() => handleSaveRoomEdit(room.id)} // Save on blur
                      autoFocus
                    />
                  ) : (
                    <h3>{room.name}</h3>
                  )}
                  <p>Created: {room.timestamp}</p>
                  <div className="room-actions">
                    <button onClick={() => setCurrentRoom(room)}>
                      <FaFolderOpen /> {/* Open icon */}
                    </button>
                    <button onClick={() => handleEditRoom(room.id, room.name)}>
                      <FaEdit /> {/* Edit icon */}
                    </button>
                    <button onClick={() => handleDeleteRoom(room.id)}>
                      <FaTrash /> {/* Delete icon */}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {currentRoom && (
        <div className="room-page">
          <div className="room-header">
            <h2>{currentRoom.name}</h2>
            <button onClick={() => setCurrentRoom(null)}>Back to Home</button>
          </div>

          {!inputType && (
            <div className="input-type-selector">
              <button onClick={() => setInputType('text')}>Share your Thoughts</button>
              <button onClick={() => setInputType('voice')}>Voice Your Thoughts</button>
            </div>
          )}

          {inputType === 'text' && (
            <div className="text-input-section">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Record your moment..."
              />
              <div className="emoji-selector">
                {['😊', '😢', '😡', '😍', '😎', '😂', '🥰', '😜', '😅', '😏','😐', '🤓'].map((em) => (
                  <span key={em} onClick={() => setEmoji(em)}>
                    {em}
                  </span>
                ))}
              </div>
            </div>
          )}

          {inputType === 'voice' && (
            <div className="voice-input-section">
              <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
              <button onClick={handleStopRecording} disabled={!isRecording}>Stop Recording</button>
              {recordedAudio && <audio controls src={recordedAudio} />}
              <div className="emoji-selector">
                {['😊', '😢', '😡', '😍', '😎', '😂', '🥰', '😜', '😅', '😏','😐', '🤓'].map((em) => (
                  <span key={em} onClick={() => setEmoji(em)}>
                    {em}
                  </span>
                ))}
              </div>
            </div>
          )}

          {inputType && (
            <button className="post-button" onClick={handlePost}>
              Post
            </button>
          )}

<div className="thread">
  {currentRoom.comments.map((comment) => (
    <div key={comment.id} className="comment">
      {comment.type === 'text' ? (
        editingCommentId === comment.id ? ( // Check if this comment is being edited
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={() => handleSaveEdit(comment.id)} // Save on blur
            autoFocus
          />
        ) : (
          <p>{comment.content}</p>
        )
      ) : (
        <audio controls src={comment.content} />
      )}
      {comment.emoji && <span className="comment-emoji">{comment.emoji}</span>}
      <p className="timestamp">{comment.timestamp}</p>
      <div className="comment-actions">
        {comment.type === 'text' && ( // Only show edit button for text comments
          <button className="edit-button" onClick={() => handleEditComment(comment.id)}>
            <FaEdit /> {/* Edit icon */}
          </button>
        )}
        <button className="delete-button" onClick={() => handleDeleteComment(comment.id)}>
          <FaTrash /> {/* Delete icon */}
        </button>
      </div>
    </div>
  ))}
</div>
        </div>
      )}
    </div>
  );
}

export default App;