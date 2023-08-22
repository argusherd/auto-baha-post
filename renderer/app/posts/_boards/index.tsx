import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CreateBoard from "./create";

export default function Boards({ defaultValue }: { defaultValue?: number }) {
  const [boards, setBoards] = useState<Board[]>();
  const [publishTo, setPublishTo] = useState<Board>();
  const { register, setValue } = useForm();
  const [isCreating, setisCreating] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, [defaultValue]); // eslint-disable-line react-hooks/exhaustive-deps

  function assign(board: Board) {
    setValue("board", board.id);
    setPublishTo(board);
  }

  async function fetchBoards() {
    const res = await axios.get(`${window.backendUrl}}/api/boards`);

    setBoards(res.data);

    if (defaultValue) assign(boards.find((board) => board.id == defaultValue));
  }

  return (
    <>
      <h5>{publishTo ? publishTo.name : "Publish to"}</h5>
      <button onClick={() => setisCreating((prev) => !prev)}>
        Add new board
      </button>
      {isCreating && <CreateBoard fetchBoards={fetchBoards} />}
      <input type="hidden" placeholder="board" {...register("board")} />
      <ul>
        {boards &&
          boards.map((board) => (
            <li key={board.id} onClick={() => assign(board)}>
              {board.name}
            </li>
          ))}
      </ul>
    </>
  );
}
