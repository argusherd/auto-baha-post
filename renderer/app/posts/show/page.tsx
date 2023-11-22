"use client";

import Post from "@/backend-api/database/entities/Post";
import handleFormRequest from "@/renderer/helpers/handleFormRequest";
import axios from "axios";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PostInputs from "../_posts/post-inputs";

export default function ShowPost() {
  const router = useRouter();
  const params = useSearchParams();
  const POST_ID = params.get("id");
  const methods = useForm<Partial<Post>>({
    defaultValues: getPostData,
  });
  const {
    handleSubmit,
    watch,
    formState: { isDirty, defaultValues },
    reset,
    setError,
  } = methods;
  const boardId = watch("board_id");
  const { t } = useTranslation();
  const [isPublishing, setIsPublishing] = useState(false);

  async function getPostData() {
    const getPost = await axios.get<Post>(
      `${window.backendUrl}/api/posts/${POST_ID}`,
    );

    if (getPost.status == 404) {
      router.push("/posts/create");
    }

    return formatPostData(getPost.data);
  }

  function formatPostData(data: Post) {
    const { scheduled_at, ...others } = data;

    return {
      ...others,
      scheduled_at: scheduled_at
        ? moment(scheduled_at).format("YYYY-MM-DDTHH:mm")
        : null,
    };
  }

  async function onSubmit(data: Post) {
    handleFormRequest(async () => {
      const updatedPost = await axios.put(
        `${window.backendUrl}/api/posts/${POST_ID}`,
        data,
      );

      reset(formatPostData(updatedPost.data));
    }, setError);
  }

  async function handleDelete() {
    const res = await axios.delete(`${window.backendUrl}/api/posts/${POST_ID}`);

    if (res.status == 200) router.push("/posts");
  }

  return (
    <div>
      <div className="mb-3 flex justify-between">
        <h2 className="text-lg font-semibold">{t("page.update_post")}</h2>
        <button
          className="flex items-center rounded border px-2 py-1"
          onClick={() => router.back()}
        >
          <i className="icon-[mingcute--arrows-left-line] text-xl"></i>
          <span>
            {t("action.back_to", { destination: t("page.previous") })}
          </span>
        </button>
      </div>
      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <FormProvider {...methods}>
          <PostInputs />
        </FormProvider>

        <div className="flex justify-between">
          <button
            className="relative rounded bg-teal-500 px-2 py-1 text-white"
            onClick={handleSubmit(onSubmit)}
          >
            {t("action.save")}

            {isDirty && (
              <span
                data-testid="is-dirty"
                className="absolute -top-1 h-3 w-3 rounded-full bg-red-500"
              ></span>
            )}
          </button>
          <div className="flex gap-2">
            <button
              aria-label="publish-now"
              className="flex items-center rounded border px-2 py-1 disabled:cursor-not-allowed disabled:bg-gray-200"
              disabled={!boardId || isDirty || isPublishing}
              title={
                boardId
                  ? isDirty
                    ? t("save_to_unlock")
                    : undefined
                  : t("select_a_board_to_unlock")
              }
              onClick={async () => {
                setIsPublishing(true);
                await window.electron.publishNow(Number(POST_ID));
                reset(await getPostData());
                setIsPublishing(false);
              }}
            >
              {isPublishing && <i className="icon-[eos-icons--loading]" />}
              <span>{t("action.publish_now")}</span>
            </button>
            <button
              className="rounded border border-red-600 px-2 py-1 text-red-600"
              data-testid="delete-post"
              onClick={handleDelete}
            >
              {t("action.delete")}
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {defaultValues?.publish_failed && (
            <div className="mb-1">
              <small className="rounded border border-red-600 p-1 font-bold text-red-600">
                <i className="icon-[material-symbols--warning-outline] align-sub text-lg"></i>
                {t("post.publish_failed", {
                  publish_failed: defaultValues.publish_failed,
                })}
              </small>
            </div>
          )}
          <small>
            {t("post.published_at", {
              published_at: defaultValues?.published_at
                ? moment(defaultValues.published_at).format("YYYY-MM-DD HH:mm")
                : "-",
            })}
          </small>
          <small>
            {t("post.updated_at", {
              updated_at: moment(defaultValues?.updated_at).format(
                "YYYY-MM-DD HH:mm",
              ),
            })}
          </small>
          <small>
            {t("post.created_at", {
              created_at: moment(defaultValues?.created_at).format(
                "YYYY-MM-DD HH:mm",
              ),
            })}
          </small>
        </div>
      </form>
    </div>
  );
}
