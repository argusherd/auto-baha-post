import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";

const BsnExtractor = forwardRef(function BsnExtractor(
  { setValue }: { setValue: UseFormSetValue<FieldValues> },
  forwardedRef,
) {
  const selfRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();
  const bsnInQuery = () => (
    <span>
      <span className="text-yellow-300">bsn=</span>
      <b className="text-red-500">60111</b>
    </span>
  );
  const [bsnURL, setBsnURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useImperativeHandle(forwardedRef, () => ({
    showModal: () => {
      if (selfRef.current.hasAttribute("open")) return;
      selfRef.current.showModal();
      setBsnURL("");
      setErrorMessage("");
    },
  }));

  function extractBSN() {
    try {
      const { searchParams } = new URL(bsnURL);
      const bsn = searchParams.get("bsn");

      if (!bsn) {
        setErrorMessage(t("error.no_bsn"));
      } else {
        setValue("no", bsn);
        selfRef.current.close();
      }
    } catch (error) {
      setErrorMessage(t("error.invalid_url"));
    }
  }

  return (
    <dialog
      ref={selfRef}
      className="relative rounded p-0"
      onClick={() => selfRef.current.close()}
    >
      <div
        className="relative min-w-[200px] px-5 py-4 leading-7"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="mb-4 text-xl">{t("bsn.what_is")}</h2>
        <p>{t("bsn.it_is")}</p>
        <p>{t("bsn.for_example")}</p>
        <p className="mb-1 rounded bg-gray-700 px-2 py-1 text-white">
          https://forum.gamer.com.tw/A.php?{bsnInQuery()}
        </p>
        <p className="mb-1 rounded bg-gray-700 px-2 py-1 text-white">
          https://forum.gamer.com.tw/B.php?{bsnInQuery()}
        </p>
        <p className="rounded bg-gray-700 px-2 py-1 text-white">
          https://forum.gamer.com.tw/C.php?
          {bsnInQuery()}
          &snA=123456&tnum=101
        </p>
        <p className="mb-3">
          {t("bsn.therefore")} <b>60111</b>
        </p>
        <p className="mb-1">{t("bsn.enter_here")}</p>
        <div className="flex">
          <input
            className="grow rounded-s border px-2 py-1"
            type="url"
            value={bsnURL}
            onChange={(event) => {
              setBsnURL(event.target.value);
              setErrorMessage("");
            }}
          />
          <button
            className="rounded-e bg-teal-500 px-2 text-white"
            type="button"
            onClick={extractBSN}
          >
            {t("action.extract")}
          </button>
        </div>
        <small className="text-red-500">{errorMessage}</small>
      </div>
      <button className="icon-[material-symbols--close] absolute right-1 top-1 text-2xl"></button>
    </dialog>
  );
});

export default BsnExtractor;
