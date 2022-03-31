import { useParams } from "react-router-dom";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const params = useParams<RoomParams>();
  // const [newQuestion, setNewQuestion] = useState("");

  // ! after params.id! means that it can be trusted to never be null
  const roomId = params.id!;

  const { title, questions } = useRoom(roomId);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img
            src={require("../assets/logo.svg").default}
            alt="App Logo - Let me ask"
          />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined>Close Room</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-tittle">
          <h1>Room {title}</h1>
          {questions.length > 0 && <span>{questions.length} questions</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button>
                  <img src={require("../assets/delete.svg").default} />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
