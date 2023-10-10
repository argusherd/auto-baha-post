import axios from "axios";
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
    const checkLogin = async () => {
      const res = await axios.get(`${window.backendUrl}/api/login/check`);

      setUserInfo(res?.data);
    };

    checkLogin();
  }, []);

  return (
    <header>
      <Link href={"/"}>Home</Link>
      {userInfo?.name ? (
        <span
          data-testid="userinfo"
          title={`Last time checked at: ${new Date(userInfo.created_at)}`}
        >
          {`${userInfo.name} (${userInfo.account})`}
        </span>
      ) : (
        <span data-testid="userinfo">User is not logged in yet</span>
      )}
      <button onClick={() => window.electron.openBaha()}>Open Baha</button>
    </header>
  );
}
