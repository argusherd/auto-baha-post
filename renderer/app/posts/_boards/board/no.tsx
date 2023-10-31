import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function BoardNo({
  register,
  errors,
}: {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <input
        className="rounded border p-1"
        type="text"
        placeholder={t("input.board_no")}
        {...register("no", {
          required: true,
          validate: {
            notEmpty: (value) =>
              value.trim().length > 0 ||
              t("error.not_empty", { column: t("input.board_no") }),
            isNumber: (value) =>
              !isNaN(value) ||
              t("error.not_numeric", { column: t("input.board_no") }),
          },
        })}
      />
      {errors.no && (
        <div>
          <small className="text-red-600">{errors.no.message}</small>
        </div>
      )}
    </div>
  );
}
