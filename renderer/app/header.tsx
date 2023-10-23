import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Login from "../../backend-api/database/entities/Login";

export default function Header() {
  const [userInfo, setUserInfo] = useState<Partial<Login>>({
    name: null,
    account: null,
    logged_in: false,
    created_at: null,
  });

  useEffect(() => {
    window.electron.refreshLoginStatus(checkLogin);

    checkLogin();
  }, []);

  async function checkLogin() {
    const res = await axios.get(`${window.backendUrl}/api/login/check`);

    setUserInfo(res?.data);
  }

  function avatarUrl() {
    const { account } = userInfo;

    return `https://avatar2.bahamut.com.tw/avataruserpic/${account[0]}/${account[1]}/${account}/${account}_s.png`;
  }

  return (
    <header>
      <Link href={"/"}>Home</Link>
      {userInfo?.name ? (
        <span
          data-testid="userinfo"
          title={`Last time checked at: ${new Date(userInfo.created_at)}`}
        >
          <Image
            src={avatarUrl()}
            alt="avatart"
            width={40}
            height={40}
            unoptimized={true}
          />
          {`${userInfo.name} (${userInfo.account})`}
        </span>
      ) : (
        <span data-testid="userinfo">User is not logged in yet</span>
      )}
      <button onClick={() => window.electron.openBaha()}>Open Baha</button>
    </header>
  );
}
