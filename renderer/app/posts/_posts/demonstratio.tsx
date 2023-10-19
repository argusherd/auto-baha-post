import axios from "axios";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";

const Demonstratio = forwardRef(function Demonstratio(_props, ref) {
  const { register, getValues, setValue, watch } = useFormContext();
  const [demonstratios, setDemonstratios] = useState([]);
  const demonstratio = getValues("demonstratio");
  const boardId = watch("board_id");

  const getDemonstratios = useCallback(async () => {
    if (!boardId) return;

    const getDemonstratios = await axios.get(
      `${window.backendUrl}/api/boards/${boardId}/demonstratios`
    );

    setDemonstratios(getDemonstratios.data);
  }, [boardId]);

  useImperativeHandle(ref, () => ({ getDemonstratios }), [getDemonstratios]);

  useEffect(() => {
    getDemonstratios();
  }, [boardId, getDemonstratios]);

  useEffect(() => {
    if (demonstratio) setValue("demonstratio", demonstratio);
  }, [demonstratios, setValue, demonstratio]);

  return (
    <select placeholder="Demonstratio" {...register("demonstratio")}>
      {demonstratios.map((demonstratio) => (
        <option key={demonstratio.id} value={demonstratio.value}>
          {demonstratio.text}
        </option>
      ))}
    </select>
  );
});

export default Demonstratio;
