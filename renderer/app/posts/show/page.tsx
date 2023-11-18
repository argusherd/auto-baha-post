"use client";

import Post from "@/backend-api/database/entities/Post";
import handleFormRequest from "@/renderer/helpers/handleFormRequest";
import axios from "axios";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PostInputs from "../_posts/post-inputs";

export default function ShowPost() {
  const router = useRouter();
  const params = useSearchParams();
  const POST_ID = params.get("id");
  const requestUrl = `${window.backendUrl}/api/posts/${POST_ID}`;
  const methods = useForm<Partial<Post>>({
    defaultValues: getPostData,
  });
  const {
    handleSubmit,
    watch,
    formState: { isDirty },
    reset,
    setError,
  } = methods;
  const boardId = watch("board_id");
  const { t } = useTranslation();

  async function getPostData() {
    const getPost = await axios.get<Post>(requestUrl);

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
        : "",
    };
  }

  async function onSubmit(data: Post) {
    handleFormRequest(async () => {
      const updatedPost = await axios.put(requestUrl, data);

      reset(formatPostData(updatedPost.data));
    }, setError);
  }

  async function handleDelete() {
    const res = await axios.delete(requestUrl);

    if (res.status == 200) router.push("/posts");
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">{t("page.update_post")}</h2>
      <form onSubmit={(event) => event.preventDefault()}>
        <FormProvider {...methods}>
          <PostInputs />
        </FormProvider>

        <div className="mt-2 flex justify-between">
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
              className="rounded border px-2 py-1 disabled:cursor-not-allowed disabled:bg-gray-200"
              disabled={!boardId}
              title={boardId ? undefined : t("select_a_board_to_unlock")}
              onClick={() => window.electron.publishNow(Number(POST_ID))}
            >
              {t("action.publish_now")}
            </button>
            <button
              className="rounded bg-red-600 px-2 py-1 text-white"
              data-testid="delete-post"
              onClick={handleDelete}
            >
              {t("action.delete")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
