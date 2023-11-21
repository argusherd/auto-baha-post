"use client";

import Post from "@/backend-api/database/entities/Post";
import handleFormRequest from "@/renderer/helpers/handleFormRequest";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PostInputs from "../_posts/post-inputs";

export default function CreatePost() {
  const methods = useForm();
  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    setError,
  } = methods;
  const router = useRouter();
  const { t } = useTranslation();

  async function onSubmit(data: Post) {
    handleFormRequest(async () => {
      await axios.post(`${window.backendUrl}/api/posts`, data);

      reset();

      router.push("/posts");
    }, setError);
  }

  return (
    <div>
      <div className="mb-3 flex justify-between">
        <h2 className="text-lg font-semibold">{t("page.create_post")}</h2>
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
      <form onSubmit={(event) => event.preventDefault()}>
        <FormProvider {...methods}>
          <PostInputs />
        </FormProvider>

        <button
          aria-label="save"
          className="relative mt-2 rounded bg-teal-500 px-2 py-1 text-white"
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
      </form>
    </div>
  );
}
