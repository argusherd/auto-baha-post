import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [feedback, setFeedback] = useState("");

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
      setFeedback(t("update.downloading", { progress }));
    });

    window.electron.updateError((errorMessage) => {
      setIsChecking(false);
      setIsAvailable(false);
      setFeedback(errorMessage);
    });
  }, [t]);

  return (
    <div className="bg-teal-600 p-2 text-sm text-white">
      <div className="flex items-center gap-1">
        <button
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
    </div>
  );
}
