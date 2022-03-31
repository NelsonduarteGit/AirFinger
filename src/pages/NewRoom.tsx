import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

import "../styles/auth.scss";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

import { database } from "../services/firebase";

export function NewRoom() {
  const { user } = useAuth();

  const [newRoom, setNewRoom] = useState("");
  const navigate = useNavigate();

  async function handleCreateRoom(e: FormEvent) {
    e.preventDefault();

    if (newRoom.trim() === "") return;

    // create a ref for database -> refer to "rooms"
    const roomRef = database.ref("rooms");

    // create new room on database
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    navigate(`/room/${firebaseRoom.key}`);
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
          {/* <h1>{user?.name}</h1> */}
          <h2>Create new room</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Enter class code"
              onChange={(e) => setNewRoom(e.target.value)}
              value={newRoom}
            ></input>
            <Button type="submit">Create room</Button>
          </form>
          <p>
            want to enter an already existing room?
            <Link to="/">click here</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
