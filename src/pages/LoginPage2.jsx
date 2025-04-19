import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage2({ setIsAuth }) {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
      document.cookie = `hextoooken=${res.data.token}; expires=${new Date(
        res.data.expired
      )}`;
      checkUserLogin();
    } catch (error) {
      alert("登入失敗 / " + error.response.data.message);
    }
  };

  const checkUserLogin = async () => {
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hextoooken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      if (token) {
        axios.defaults.headers.common["Authorization"] = token;
        await axios.post(`${BASE_URL}/v2/api/user/check`);
        setIsAuth(true);
      } else {
        console.log("請重新登入");
      }
    } catch (error) {
      alert("請檢查登入權限 / " + error.response.data.message);
    }
  };

  useEffect(() => {
    checkUserLogin();
  }, []);

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="email"
              id="username"
              className="form-control"
              name="username"
              onChange={handleInputChange}
              value={account.username}
              placeholder="name@example.com"
            />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              id="password"
              className="form-control"
              name="password"
              onChange={handleInputChange}
              value={account.password}
              placeholder="password"
            />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
}

export default LoginPage2;
