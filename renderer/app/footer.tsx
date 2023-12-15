import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    window.electron.updateAvailable(() => {
      setIsChecking(false);
      setIsAvailable(true);
      setFeedback(t("update.available"));
    });

    window.electron.updateNotAvailable(() => {
      setIsChecking(false);
      setFeedback(t("update.not_available"));
    });

    window.electron.downloadProgress((progress) => {
      setFeedback(t("update.downloading", { progress: Math.round(progress) }));
    });

    window.electron.updateError((errorMessage) => {
      setIsChecking(false);
      setIsAvailable(false);
      setFeedback(errorMessage);
    });

    setCurrentVersion(window.currentVersion);
  }, [t]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied]);

  return (
    <div className="flex items-center justify-between bg-teal-600 p-2 text-white">
      <div className="flex items-center gap-1 text-sm">
        <p>v{currentVersion}</p>
        <button
          className="hover:underline disabled:text-gray-300"
          disabled={isChecking}
          onClick={() => {
            setIsChecking(true);
            setFeedback("");
            window.electron.checkUpdate();
          }}
        >
          {t("action.check_update")}
        </button>
        {isChecking && <i className="icon-[eos-icons--loading]" />}
        {isAvailable ? (
          <button
            className="hover:underline"
            onClick={() => window.electron.downloadUpdate()}
          >
            <small>{feedback}</small>
          </button>
        ) : (
          <small className="max-w-xs">{feedback}</small>
        )}
      </div>
      <button
        className="text-3xl leading-none"
        title={t("action.copy_repo_link")}
        onClick={() => {
          setIsCopied(true);
          navigator.clipboard.writeText(
            "https://github.com/argusherd/auto-baha-post",
          );
        }}
      >
        {isCopied ? (
          <div className="relative">
            <i className="icon-[basil--checked-box-outline]" />
            <small className="absolute -top-8 right-0 whitespace-nowrap break-keep rounded bg-white p-1 text-sm text-black shadow shadow-gray-700">
              {t("repo_link_copied")}
            </small>
          </div>
        ) : (
          <i className="icon-[mdi--github]" />
        )}
      </button>
    </div>
  );
}
