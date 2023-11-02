import axios from "axios";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Login from "../../backend-api/database/entities/Login";
import Languages from "./languages";

export default function Header() {
  const [userInfo, setUserInfo] = useState<Partial<Login>>({
    name: null,
    account: null,
    logged_in: false,
    created_at: null,
  });
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    window.electron.loginStatusRefreshed(checkLogin);

    checkLogin();
  }, []);

  async function checkLogin() {
    const res = await axios.get(`${window.backendUrl}/api/login/check`);

    setUserInfo(res?.data);
  }

  function avatarUrl() {
    const account = userInfo?.account;

    if (!account) return "https://i2.bahamut.com.tw/none.gif";

    return `https://avatar2.bahamut.com.tw/avataruserpic/${account[0]}/${account[1]}/${account}/${account}_s.png`;
  }

  async function refreshLoginStatus() {
    setIsRefreshing(true);

    await window.electron.refreshLoginStatus();

    await checkLogin();

    setIsRefreshing(false);
  }

  return (
    <header className="flex items-center justify-between gap-2 bg-teal-600 p-2  text-white">
      <Link href={"/"} className="text-lg font-bold">
        {t("dashboard")}
      </Link>
      <div className="flex items-center gap-3">
        <Languages />
        <button
          className="flex items-center gap-2"
          data-testid="userinfo"
          onClick={() => window.electron.openBaha()}
          title={t("action.open_baha")}
        >
          <Image
            src={avatarUrl()}
            alt="avatar"
            width={40}
            height={40}
            unoptimized={true}
          />
          <div className="flex flex-col">
            <span>{userInfo?.name ? userInfo.name : "Login"}</span>
            {userInfo?.name && (
              <span className="text-xs">{userInfo.account}</span>
            )}
          </div>
        </button>
        <button
          className="text-xl"
          disabled={isRefreshing}
          onClick={() => refreshLoginStatus()}
          title={t("last_time_checked_at", {
            checked_at: moment(userInfo.created_at).fromNow(),
          })}
        >
          {isRefreshing ? (
            <i className="icon-[eos-icons--loading]" />
          ) : (
            <i className="icon-[material-symbols--refresh]" />
          )}
        </button>
      </div>
    </header>
  );
}
