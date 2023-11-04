"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PostInputs from "../_posts/post-inputs";

const HTTP_CREATED = 201;

export default function CreatePost() {
  const methods = useForm();
  const { handleSubmit, reset } = methods;
  const router = useRouter();
  const { t } = useTranslation();

  async function onSubmit(data: Post) {
    const url = window.backendUrl + "/api/posts";

    const res = await axios.post(url, data);

    if (res.status == HTTP_CREATED) {
      reset();

      router.push("/posts");
    }
  }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <FormProvider {...methods}>
        <PostInputs />
      </FormProvider>

      <button
        aria-label="save"
        className="mt-2 rounded bg-teal-500 px-2 py-1 text-white"
        onClick={handleSubmit(onSubmit)}
      >
        {t("action.save")}
      </button>
    </form>
  );
}
