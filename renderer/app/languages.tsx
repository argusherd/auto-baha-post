import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Languages() {
  const [show, setShow] = useState(false);
  const { i18n } = useTranslation();

  function setLanguage(lng: string) {
    i18n.changeLanguage(lng);
    moment.locale(lng);
  }

  return (
    <div className="relative flex" onMouseOver={() => setShow(true)}>
      <button
        className="icon-[material-symbols--globe] text-2xl"
        title={i18n.language}
      ></button>
      {show && (
        <ul
          className="absolute right-0 top-8 whitespace-nowrap rounded border bg-white text-black shadow-lg"
          onMouseOut={() => setShow(false)}
        >
          <li
            className="cursor-pointer p-2 hover:bg-gray-200"
            onClick={() => setLanguage("en")}
          >
            English
          </li>
          <li
            className="cursor-pointer p-2 hover:bg-gray-200"
            onClick={() => setLanguage("zh-tw")}
          >
            正體中文
          </li>
        </ul>
      )}
    </div>
  );
}
