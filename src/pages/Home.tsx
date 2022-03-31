// React
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";

//components
import { Button } from "../components/Button";

import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

// Styles
import "../styles/auth.scss";

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoomGoogle() {
    if (!user) {
      await signInWithGoogle();
    }
    navigate("/room/new");
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (roomCode.trim() === "") return;

    // .get will get all registry with the specific ref
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    // if doesnt exist
    if (!roomRef.exists()) {
      alert("Room does not exists");
      return;
    }

    // if everything is ok, go into room
    navigate(`room/${roomCode}`);
  }

  return (
    <div className="page-auth">
      <aside>
        <img
          src={require("../assets/illustration.svg").default}
          alt="illustration simbolizing Q and A"
        />
        <strong>Create room for a live Q&amp;A</strong>
        <p>Answer questions from your community in real-time!</p>
      </aside>
      <main>
        <div className="main-content">
          <img
            src={require("../assets/logo.svg").default}
            alt="App Logo - Let me ask"
          />
          <button onClick={handleCreateRoomGoogle} className="create-room">
            <img
              src={require("../assets/google-icon.svg").default}
              alt="google icon"
            />
            Create room with Google
          </button>
          <div className="seperator">or enter a room</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Enter class code"
              onChange={(e) => setRoomCode(e.target.value)}
              value={roomCode}
            ></input>
            <Button type="submit">Enter room</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
