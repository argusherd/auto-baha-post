import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BsnExtractor from "./bsn-extractor";

export default function BoardNo({ methods }: { methods: UseFormReturn }) {
  const { t } = useTranslation();
  const bsnExtractorRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    formState: { errors },
    setValue,
  } = methods;

  return (
    <div>
      <div className="relative">
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
        <button
          className="icon-[mdi--help-box-outline] absolute right-0.5 top-0.5 text-3xl text-gray-300 hover:text-gray-700"
          onClick={() => bsnExtractorRef.current.showModal()}
        ></button>
      </div>
      {errors.no && (
        <div>
          <small className="text-red-600">{errors.no.message}</small>
        </div>
      )}
      <BsnExtractor ref={bsnExtractorRef} setValue={setValue} />
    </div>
  );
}
