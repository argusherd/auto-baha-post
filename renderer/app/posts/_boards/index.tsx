import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { useEffect, useState } from "react";
import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";
import BoardItem from "./board";
import CreateBoard from "./create";

export default function Boards({
  defaultValue,
  register,
  setValue,
}: {
  defaultValue?: number;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}) {
  const [boards, setBoards] = useState<Board[]>();
  const [publishTo, setPublishTo] = useState<Board>();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, [defaultValue]); // eslint-disable-line react-hooks/exhaustive-deps

  function assign(board: Board) {
    setValue("board", board.id);
    setPublishTo(board);
  }

  async function fetchBoards() {
    const res = await axios.get<Board[]>(`${window.backendUrl}/api/boards`);

    setBoards(() => {
      const boards = res.data;

      const foundDefault =
        boards && boards.find((board) => board.id == defaultValue);

      if (foundDefault) assign(foundDefault);

      return boards;
    });
  }

  return (
    <>
      <h5>{publishTo?.name || "Publish to"}</h5>
      <button onClick={() => setIsCreating((prev) => !prev)}>
        Add new board
      </button>
      {isCreating && <CreateBoard fetchBoards={fetchBoards} />}
      <input type="hidden" placeholder="board" {...register("board")} />
      <ul>
        {boards &&
          boards.map((board) => (
            <BoardItem
              key={board.id}
              board={board}
              assign={assign}
              fetchBoards={fetchBoards}
            />
          ))}
      </ul>
    </>
  );
}
