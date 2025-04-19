import axios from "axios";
import { useState } from "react";
import LoginPage2 from "./pages/LoginPage2";
import ProductPage2 from "./pages/ProductPage2";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// `${BASE_URL}/v2/api/${API_PATH}/admin/`

function App2() {
  const [isAuth, setIsAuth] = useState(false);

  // 欲新增之資料集
  const myProducts = [
    // 貼上欲新增資料集
  ];

  // 批次新增資料
  const batchCreateProducts = async () => {
    const requests = myProducts.map((product) =>
      axios
        .post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, { data: product })
        .then((res) => {
          console.log(`✅ 新增成功：${product.title}`);
          return res;
        })
        .catch((err) => {
          console.error(
            `❌ 新增失敗：${product.title}`,
            err.response?.data || err.message
          );
          return null;
        })
    );

    // 等待所有請求完成
    await Promise.all(requests);
    getProducts(); // ✅ 全部送出後呼叫
  };

  return (
    <>{isAuth ? <ProductPage2 /> : <LoginPage2 setIsAuth={setIsAuth} />}</>
  );
}

export default App2;
