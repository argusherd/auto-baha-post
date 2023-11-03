import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Boards from "../_boards";
import BahaEmojis from "./baha-emojis";
import Demonstratio from "./demonstratio";
import ScheduledAt from "./scheduled-at";
import SubBoard from "./sub-board";
import Subject from "./subject";

export default function PostInputs() {
  const {
    register,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext();

  const boardId = watch("board_id");
  const demonstratioRef = React.useRef(null);
  const subBoardRef = React.useRef(null);
  const contentRef = useRef(null);
  const { ref: contentRegisterRef, ...contentRegister } = register("content", {
    required: true,
    validate: {
      notEmpty: (value) =>
        value.trim().length > 0 ||
        t("error.not_empty", { column: t("input.content") }),
    },
  });
  const { t } = useTranslation();

  function insertEmoji(emoji: string) {
    contentRef.current.focus();
    const position = contentRef.current.selectionStart;
    const oldContent = getValues("content");
    const before = oldContent.substring(0, position);
    const after = oldContent.substring(position, oldContent.length);
    const insert = emoji + "\n";
    setValue("content", before + insert + after);
    contentRef.current.selectionStart = position + insert.length;
    contentRef.current.selectionEnd = position + insert.length;
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <input
          className="w-full rounded border px-2 py-1"
          placeholder={t("input.title")}
          {...register("title", {
            required: true,
            validate: {
              notEmpty: (value) =>
                value.trim().length > 0 ||
                t("error.not_empty", { column: t("input.title") }),
            },
          })}
        />
        {errors.title && (
          <small className="text-red-600">{errors.title.message}</small>
        )}
      </div>

      <Boards />

      <div className="flex gap-6">
        <div
          className="flex items-center gap-1"
          title={boardId ? "" : t("select_a_board_to_unlock")}
        >
          <Demonstratio ref={demonstratioRef} />

          <SubBoard ref={subBoardRef} />

          <button
            aria-label="refresh"
            className="icon-[material-symbols--refresh] text-xl disabled:cursor-not-allowed disabled:bg-gray-300"
            disabled={!boardId}
            title={boardId ? t("refresh_to_retrieve_latest") : undefined}
            onClick={async () => {
              await window.electron.getPostProperties(boardId);
              await demonstratioRef.current.getDemonstratios();
              await subBoardRef.current.getSubBoards();
            }}
          ></button>
        </div>

        <div className="flex grow justify-between">
          <Subject />

          <BahaEmojis insertEmoji={insertEmoji} />
        </div>
      </div>

      <div>
        <textarea
          className="min-h-[100px] w-full rounded border p-2"
          placeholder={t("input.content")}
          {...contentRegister}
          ref={(el) => {
            contentRegisterRef(el);
            contentRef.current = el;
          }}
        ></textarea>
        {errors.content && (
          <small className="text-red-600">{errors.content.message}</small>
        )}
      </div>

      <ScheduledAt />
    </div>
  );
}
