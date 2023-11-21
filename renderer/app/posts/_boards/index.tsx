import Board from "@/backend-api/database/entities/Board";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BoardItem from "./board";
import CreateBoard from "./create";

export default function Boards() {
  const { register, watch } = useFormContext();
  const [boards, setBoards] = useState<Board[]>();
  const [publishTo, setPublishTo] = useState<Board>();
  const [isSelecting, setIsSelecting] = useState(false);
  const watchBoard = watch("board_id");
  const { t } = useTranslation();
  const boardListRef = useRef(null);

  useEffect(() => {
    fetchBoards();

    document.addEventListener("mousedown", closeBoardList);

    return () => {
      document.removeEventListener("mousedown", closeBoardList);
    };
  }, []);

  useEffect(() => {
    if (watchBoard) {
      const picked = boards?.find((board) => board.id == watchBoard);

      setPublishTo(picked);
      setIsSelecting(false);
    } else {
      setPublishTo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchBoard]);

  async function fetchBoards() {
    const res = await axios.get<Board[]>(`${window.backendUrl}/api/boards`);

    setBoards(res.data);
  }

  function closeBoardList(event: MouseEvent) {
    if (boardListRef.current && !boardListRef.current.contains(event.target))
      setIsSelecting(false);
  }

  return (
    <div className="rounded border p-1" ref={boardListRef}>
      <div className="flex items-center justify-between">
        <h5
          className="flex grow cursor-pointer items-center justify-between rounded p-1 hover:bg-gray-200"
          onClick={() => setIsSelecting((prev) => !prev)}
        >
          {publishTo?.name ? (
            <span>
              {t("publish_to")}: {publishTo.name}
            </span>
          ) : (
            <span className="w-full text-gray-400 hover:text-black">
              {t("select_a_board")}
            </span>
          )}
          <i className="icon-[ph--triangle-fill] rotate-180 text-sm"></i>
        </h5>
      </div>

      <input
        type="hidden"
        placeholder="board"
        {...register("board_id", { valueAsNumber: true })}
      />

      <div className="relative">
        {isSelecting && (
          <ul className="absolute left-1/2 z-10 max-h-60 w-[99%] -translate-x-1/2 overflow-y-auto rounded border bg-white shadow-lg">
            <CreateBoard fetchBoards={fetchBoards} />
            {boards && <hr />}
            {boards &&
              boards.map((board) => (
                <BoardItem
                  key={board.id}
                  board={board}
                  fetchBoards={fetchBoards}
                />
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
