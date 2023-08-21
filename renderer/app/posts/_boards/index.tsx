import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Boards({ defaultValue }: { defaultValue?: number }) {
  const [boards, setBoards] = useState<Board[]>();
  const [publishTo, setPublishTo] = useState<Board>();
  const { register, setValue } = useForm();

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${window.backendUrl}}/api/boards`);

      setBoards(res.data);

      if (defaultValue)
        assign(boards.find((board) => board.id == defaultValue));
    })();
  }, [defaultValue]); // eslint-disable-line react-hooks/exhaustive-deps

  function assign(board: Board) {
    setValue("board", board.id);
    setPublishTo(board);
  }

  return (
    <>
      <h5>{publishTo ? publishTo.name : "Publish to"}</h5>
      <input type="text" {...register("board")} />
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
