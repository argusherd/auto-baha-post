import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import Boards from "../_boards";
import ScheduledAt from "./scheduled-at";
import Subject from "./subject";

export default function PostInputs() {
  const {
    register,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const boardId = watch("board_id");
  const [demonstratios, setDemonstratios] = useState([]);
  const [subBoards, setSubBoards] = useState([]);
  const demonstratio = getValues("demonstratio");
  const subBoard = getValues("sub_board");

  const getProperties = useCallback(async () => {
    if (!boardId) return;

    const getDemonstratios = await axios.get(
      `${window.backendUrl}/api/boards/${boardId}/demonstratios`
    );
    const getSubBoards = await axios.get(
      `${window.backendUrl}/api/boards/${boardId}/sub-boards`
    );

    setDemonstratios(getDemonstratios.data);
    setSubBoards(getSubBoards.data);
  }, [boardId]);

  useEffect(() => {
    getProperties();
  }, [boardId, getProperties]);

  React.useEffect(() => {
    if (demonstratio) setValue("demonstratio", demonstratio);
  }, [demonstratios, setValue, demonstratio]);

  React.useEffect(() => {
    if (subBoard) setValue("sub_board", subBoard);
  }, [subBoards, setValue, subBoard]);

  return (
    <>
      <input
        className="border"
        placeholder="Title"
        {...register("title", { required: "Title is required" })}
      />
      {errors.title && <small>{errors.title.message}</small>}

      <Boards />

      <select
        placeholder="Demonstratio"
        {...register("demonstratio", {
          valueAsNumber: true,
        })}
      >
        {demonstratios.map((demonstratio) => (
          <option key={demonstratio.id} value={demonstratio.value}>
            {demonstratio.text}
          </option>
        ))}
      </select>

      <select
        placeholder="Sub Board"
        {...register("sub_board", {
          valueAsNumber: true,
        })}
      >
        {subBoards.map((subBoard) => (
          <option key={subBoard.id} value={subBoard.value}>
            {subBoard.text}
          </option>
        ))}
      </select>

      <Subject />

      <button
        disabled={!boardId}
        onClick={async () => {
          await window.electron.getPostProperties(boardId);
          await getProperties();
        }}
      >
        Refresh
      </button>

      {boardId && <ScheduledAt />}

      <textarea
        className="border"
        placeholder="Content"
        {...register("content", { required: "Content is required" })}
      ></textarea>
      {errors.content && <small>{errors.content.message}</small>}
    </>
  );
}
