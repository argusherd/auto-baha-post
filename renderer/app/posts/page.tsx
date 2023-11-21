"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PostIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const res = await axios.get(window.backendUrl + "/api/posts");

      setPosts(res.data);
    })();
  }, []);

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
          className="flex items-center gap-1 rounded bg-teal-500 px-2 py-1 text-white"
        >
          <i className="icon-[ic--baseline-add] text-xl"></i>
          <span>{t("page.create_post")}</span>
        </Link>
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
                  <small className="basis-1/2">
                    {t("post.board", {
                      board: post.board?.name || "-",
                    })}
                  </small>
                  {post.publish_failed && (
                    <small className="basis-1/2 font-bold text-red-600">
                      {t("post.publish_failed", {
                        publish_failed: post.publish_failed,
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
