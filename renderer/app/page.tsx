"use client";

import Post from "@/backend-api/database/entities/Post";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  const [upcoming, setUpcoming] = useState<Post>(null);
  const [failed, setFailed] = useState<Post>(null);
  const [draft, setDraft] = useState<Post>(null);
  const [published, setPublished] = useState<Post>(null);
  const noPost = <small>-</small>;

  useEffect(() => {
    getPost("upcoming", setUpcoming);
    getPost("failed", setFailed);
    getPost("draft", setDraft);
    getPost("published", setPublished);
  }, []);

  async function getPost(
    type: string,
    setPost: Dispatch<SetStateAction<Post>>,
  ) {
    const res = await axios.get(
      `${window.backendUrl}/api/posts/${type}?take=1`,
    );

    setPost(res.data[0]);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("page.dashboard")}</h2>
        <div className="flex gap-2">
          <Link
            href="/posts/create"
            className="flex items-center gap-1 rounded border border-transparent bg-teal-500 px-2 py-1 text-white"
          >
            <i className="icon-[ic--baseline-add] text-xl"></i>
            <span>{t("page.create_post")}</span>
          </Link>
          <Link
            href="/posts"
            className="flex items-center gap-1 rounded border px-2 py-1"
          >
            <i className="icon-[material-symbols--list] text-xl"></i>
            <span>{t("page.post_list")}</span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 rounded border-4 border-green-100 bg-green-50 p-2 hover:shadow">
          <Link href="/posts?type=upcoming">{t("page.upcoming")}</Link>
          {upcoming ? (
            <Link
              className="flex items-center justify-between hover:text-teal-500"
              href={`/posts/show?id=${upcoming.id}`}
            >
              <h4 className="font-semibold">{upcoming.title}</h4>
              <small data-testid="scheduled_at">
                {t("post.scheduled_at", {
                  scheduled_at: moment(upcoming.scheduled_at).fromNow(),
                })}
              </small>
            </Link>
          ) : (
            noPost
          )}
        </div>
        <div className="flex flex-col gap-2 rounded border-4 border-red-100 bg-red-50 p-2 hover:shadow">
          <Link href="/posts?type=failed">{t("page.failed")}</Link>
          {failed ? (
            <Link
              className="flex items-center justify-between hover:text-teal-500"
              href={`/posts/show?id=${failed.id}`}
            >
              <h4 className="font-semibold">{failed.title}</h4>
              <small className="text-red-600" data-testid="publish_failed">
                {failed.publish_failed}
              </small>
            </Link>
          ) : (
            noPost
          )}
        </div>
        <div className="flex flex-col gap-2 rounded border-4 border-blue-100 bg-blue-50 p-2 hover:shadow">
          <Link href="/posts?type=draft">{t("page.draft")}</Link>
          {draft ? (
            <Link
              className="flex items-center justify-between hover:text-teal-500"
              href={`/posts/show?id=${draft.id}`}
            >
              <h4 className="font-semibold">{draft.title}</h4>
              <small data-testid="updated_at">
                {t("post.updated_at", {
                  updated_at: moment(draft.updated_at).fromNow(),
                })}
              </small>
            </Link>
          ) : (
            noPost
          )}
        </div>
        <div className="flex flex-col gap-2 rounded border-4 border-gray-100 bg-gray-50 p-2 hover:shadow">
          <Link href="/posts?type=published">{t("page.published")}</Link>
          {published ? (
            <Link
              className="flex items-center justify-between hover:text-teal-500"
              href={`/posts/show?id=${published.id}`}
            >
              <h4 className="font-semibold">{published.title}</h4>
              <small data-testid="published_at">
                {t("post.published_at", {
                  published_at: moment(published.published_at).fromNow(),
                })}
              </small>
            </Link>
          ) : (
            noPost
          )}
        </div>
      </div>
    </div>
  );
}
