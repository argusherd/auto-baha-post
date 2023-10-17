import axios from "axios";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";

const SubBoard = forwardRef(function SubBoard(_props, ref) {
  const { register, getValues, setValue, watch } = useFormContext();
  const boardId = watch("board_id");
  const [subBoards, setSubBoards] = useState([]);
  const subBoard = getValues("sub_board");

  const getSubBoards = useCallback(async () => {
    if (!boardId) return;

    const getSubBoards = await axios.get(
      `${window.backendUrl}/api/boards/${boardId}/sub-boards`
    );

    setSubBoards(getSubBoards.data);
  }, [boardId]);

  useImperativeHandle(ref, () => ({ getSubBoards }), [getSubBoards]);

  useEffect(() => {
    getSubBoards();
  }, [boardId, getSubBoards]);

  useEffect(() => {
    if (subBoard) setValue("sub_board", subBoard);
  }, [subBoards, setValue, subBoard]);

  return (
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
  );
});

export default SubBoard;
