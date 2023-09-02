import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import BoardItem from "./board";
import CreateBoard from "./create";

export default function Boards() {
  const { register, watch } = useFormContext();
  const [boards, setBoards] = useState<Board[]>();
  const [publishTo, setPublishTo] = useState<Board>();
  const [isCreating, setIsCreating] = useState(false);
  const watchBoard = watch("board");

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (watchBoard) {
      const picked = boards.find((board) => board.id == watchBoard);

      setPublishTo(picked);
    } else {
      setPublishTo(null);
    }
  }, [watchBoard, boards]);

  async function fetchBoards() {
    const res = await axios.get<Board[]>(`${window.backendUrl}/api/boards`);

    setBoards(res.data);
    setIsCreating(false);
  }

  return (
    <>
      <h5>{publishTo?.name || "Publish to"}</h5>
      <button onClick={() => setIsCreating((prev) => !prev)}>
        Add new board
      </button>
      {isCreating && (
        <CreateBoard fetchBoards={fetchBoards} setIsCreating={setIsCreating} />
      )}
      <input type="hidden" placeholder="board" {...register("board")} />
      <ul>
        {boards &&
          boards.map((board) => (
            <BoardItem key={board.id} board={board} fetchBoards={fetchBoards} />
          ))}
      </ul>
    </>
  );
}
