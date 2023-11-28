"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PostIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { t } = useTranslation();
  const params = useSearchParams();
  const defaultType = params?.get("type");
  const [type, setType] = useState(defaultType || "");
  const [sortBy, setSortBy] = useState("");
  const [isAscending, setIsAscending] = useState(false);

  useEffect(() => {
    (async () => {
      let url = `${window.backendUrl}/api/posts`;

      if (type) url += `/${type}`;
      if (sortBy) url += `?sort_by=${sortBy}`;
      if (isAscending) url += `${sortBy ? "&" : "?"}sort=asc`;

      const res = await axios.get(url);

      setPosts(res.data);
    })();
  }, [type, sortBy, isAscending]);

  function formatDatetime(datetime: string) {
    const momentObj = moment(datetime);

    return momentObj.diff(moment(), "day", true) >= 1
      ? momentObj.format("YYYY-MM-DD HH:mm")
      : momentObj.fromNow();
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("page.post_list")}</h2>
        <Link
          href="/posts/create"
          className="flex items-center gap-1 rounded border border-transparent bg-teal-500 px-2 py-1 text-white"
        >
          <i className="icon-[ic--baseline-add] text-xl"></i>
          <span>{t("page.create_post")}</span>
        </Link>
      </div>
      <div className="mb-2 flex justify-between">
        <select
          className="rounded border p-1"
          data-testid="types"
          defaultValue={defaultType}
          onChange={(event) => setType(event.target.value)}
        >
          <option data-testid="type" value="">
            {t("page.all")}
          </option>
          <option data-testid="type" value="upcoming">
            {t("page.upcoming")}
          </option>
          <option data-testid="type" value="failed">
            {t("page.failed")}
          </option>
          <option data-testid="type" value="draft">
            {t("page.draft")}
          </option>
          <option data-testid="type" value="published">
            {t("page.published")}
          </option>
        </select>
        <div className="flex items-center gap-2">
          <p>{t("sort.by")}</p>
          <select
            className="rounded border p-1"
            data-testid="sort-by"
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option data-testid="sort-by-column" value="updated_at">
              {t("sort.updated_at")}
            </option>
            <option data-testid="sort-by-column" value="created_at">
              {t("sort.created_at")}
            </option>
            <option data-testid="sort-by-column" value="scheduled_at">
              {t("sort.scheduled_at")}
            </option>
            <option data-testid="sort-by-column" value="published_at">
              {t("sort.published_at")}
            </option>
          </select>
          <button
            aria-label="sort"
            className="flex items-center px-1 text-gray-500"
            onClick={() => setIsAscending((prev) => !prev)}
          >
            {isAscending ? (
              <i className="icon-[heroicons-outline--sort-ascending] text-xl"></i>
            ) : (
              <i className="icon-[heroicons-outline--sort-descending] text-xl"></i>
            )}

            <span>{isAscending ? t("sort.asc") : t("sort.desc")}</span>
          </button>
        </div>
      </div>
      {posts.length ? (
        <ul className="flex flex-col gap-2">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="flex flex-col gap-2 rounded border p-2 hover:shadow">
                <Link
                  href={`/posts/show?id=${post.id}`}
                  className="hover:text-teal-500"
                >
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-gray-400">
                    {post.content.length > 100
                      ? post.content.substring(0, 100) + "..."
                      : post.content}
                  </p>
                </Link>
                <hr />
                <div className="flex flex-wrap">
                  <small
                    className="basis-1/2"
                    title={moment(post.created_at).format("YYYY-MM-DD HH:mm")}
                  >
                    {t("post.created_at", {
                      created_at: formatDatetime(post.created_at),
                    })}
                  </small>
                  <small
                    className="basis-1/2"
                    title={moment(post.updated_at).format("YYYY-MM-DD HH:mm")}
                  >
                    {t("post.updated_at", {
                      updated_at: formatDatetime(post.updated_at),
                    })}
                  </small>
                  <small
                    className="basis-1/2"
                    title={
                      post.published_at
                        ? moment(post.published_at).format("YYYY-MM-DD HH:mm")
                        : ""
                    }
                  >
                    {t("post.published_at", {
                      published_at: post.published_at
                        ? formatDatetime(post.published_at)
                        : "-",
                    })}
                  </small>
                  <small
                    className="basis-1/2"
                    title={
                      post.scheduled_at
                        ? moment(post.scheduled_at).format("YYYY-MM-DD HH:mm")
                        : ""
                    }
                  >
                    {t("post.scheduled_at", {
                      scheduled_at: post.scheduled_at
                        ? formatDatetime(post.scheduled_at)
                        : "-",
                    })}
                  </small>
                  <small className="basis-1/2" data-testid="board-name">
                    {t("post.board", {
                      board: post.board?.name || "-",
                    })}
                  </small>
                  {post.publish_failed && (
                    <small className="basis-1/2 font-bold text-red-600">
                      {t("post.publish_failed", {
                        publish_failed: t(`failed.${post.publish_failed}`),
                      })}
                    </small>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t("no_posts")}</p>
      )}
    </div>
  );
}
