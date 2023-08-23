import Board from "@/backend-api/database/entities/Board";
import axios from "axios";

export default function BoardItem({
  board,
  assign,
  fetchBoards,
}: {
  board: Board;
  assign: Function;
  fetchBoards: Function;
}) {
  async function handleDelete() {
    await axios.delete(`${window.backendUrl}/api/boards/${board.id}`);

    fetchBoards();
  }

  return (
    <li onClick={() => assign(board)}>
      <span>{board.name}</span>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
