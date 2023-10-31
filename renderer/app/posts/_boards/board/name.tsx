import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function BoardName({
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
        placeholder={t("input.board_name")}
        {...register("name", {
          required: true,
          validate: {
            notEmpty: (value) =>
              value.trim().length > 0 ||
              t("error.not_empty", { column: t("input.board_name") }),
          },
        })}
      />
      {errors.name && (
        <div>
          <small className="text-red-600">{errors.name.message}</small>
        </div>
      )}
    </div>
  );
}
