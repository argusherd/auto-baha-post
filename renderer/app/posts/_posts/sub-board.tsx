import axios from "axios";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const SubBoard = forwardRef(function SubBoard(_props, ref) {
  const { register, getValues, setValue, watch } = useFormContext();
  const boardId = watch("board_id");
  const [subBoards, setSubBoards] = useState([]);
  const subBoard = getValues("sub_board");
  const { t } = useTranslation();

  const getSubBoards = useCallback(async () => {
    if (!boardId) return;

    const getSubBoards = await axios.get(
      `${window.backendUrl}/api/boards/${boardId}/sub-boards`,
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
      className="rounded border p-1 disabled:cursor-not-allowed disabled:bg-gray-200"
      disabled={!boardId}
      placeholder="Sub Board"
      {...register("sub_board")}
    >
      <option value="">{t("input.sub_board")}</option>
      {subBoards.map((subBoard) => (
        <option key={subBoard.id} value={subBoard.value}>
          {subBoard.text}
        </option>
      ))}
    </select>
  );
});

export default SubBoard;
