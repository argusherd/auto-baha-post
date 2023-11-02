import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function ScheduledAt() {
  const { register, getValues } = useFormContext();
  const { t } = useTranslation();
  const boardId = getValues("board_id");

  return (
    <div className="flex items-center">
      <div className="shrink rounded border">
        <label className="border-r p-2" htmlFor="scheduled_at">
          {t("input.scheduled_at")}
        </label>
        <input
          className="px-2 py-1 disabled:cursor-not-allowed disabled:bg-gray-100"
          disabled={!boardId}
          id="scheduled_at"
          title={boardId ? undefined : t("select_a_board_to_unlock")}
          type="datetime-local"
          placeholder="Scheduled At"
          {...register("scheduled_at")}
        />
      </div>
    </div>
  );
}
