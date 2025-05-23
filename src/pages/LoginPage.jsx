import {  useState, useEffect } from "react"
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({ setIsAuth }) {

  const [account, setAccount] = useState({ // 帳號狀態
    "username": "example@test.com",    
    "password": "example"
  })

  // account狀態改變觸發
  const handleInputChange = (e) => {
    const {value, name} = e.target;
    setAccount({
      ...account,
      [name]:value
    })
  }

  // 登入才觸發
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`,account)
      const {token, expired} = res.data; // 取得token
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`; // token寫入cookie
      axios.defaults.headers.common['Authorization'] = token; // 請求開始都會加入token
      // getProducts();
      setIsAuth(true);
    } catch (error) {
      console.log(error);
      alert('登入失敗')
    }
  }

  // 戳檢查登入api
  const checkUserLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`)
      // getProducts();
      setIsAuth(true);
    } catch (error) {
      // console.log(error)
      // alert('您尚未登入') 
    }
  }

  // 初始從cookie取出token帶入之後的請求，並檢查登入
  useEffect(() => {
      const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
          "$1",
        );
        axios.defaults.headers.common['Authorization'] = token; 
      checkUserLogin();
  },[])


  return (<>
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form  onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="Password" />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div></>)
}


export default LoginPage;