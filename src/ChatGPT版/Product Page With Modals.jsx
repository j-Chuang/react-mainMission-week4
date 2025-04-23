///// 說明

// 主要差別
// 1. Modal 的 conditional rendering
// 2. 配合modal元件裡副作用依賴條件onClose有新參考(新建立、重渲染)時

// ChatGPT
// 當 showProductModal 是 false 的時候，這段程式碼：

// {showProductModal && (
//   <ProductModal
//     ...
//     onClose={() => setShowProductModal(false)}
//   />
// )}

// 根本就 不會執行，也就：

// ❌ 不會：
// 建立 ProductModal 元件

// 不會觸發 useEffect

// 不會建立 Modal 實例

// ✅ onClose 的函式也不會重新產生


// 🔍 當 showProductModal === true 才會發生的事：
// ProductModal 被渲染

// onClose={() => setShowProductModal(false)} 被傳進去（是匿名函式，每次都是新的參考）

// useEffect() 執行 → 綁定 hidden.bs.modal 的關閉事件

// Modal 關閉時會觸發 onClose()，父元件將 showProductModal 設為 false

// Modal 被移除，useEffect cleanup → removeEventListener

// ✅ 總結：
// React 的 conditional rendering 是「不渲染就什麼都不做」，所以你說的對：

// 只要 showProductModal 是 false，就不會建立新的 onClose 參考、也不會有任何副作用。


// 🔁 重構後：ProductPage2.jsx
import { useState } from "react";
import ProductModal from "./ProductModal";
import DelProductModal from "./DelProductModal";

function ProductPage2() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState({});
  const [modalMode, setModalMode] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);

  const getProducts = async () => {
    // 模擬取得資料
    // const res = await axios.get(...)
    // setProducts(res.data);
  };

  const handleOpenProductModal = (mode, product = {}) => {
    setModalMode(mode);
    setTempProduct(product);
    setShowProductModal(true);
  };

  const handleOpenDelModal = (product) => {
    setTempProduct(product);
    setShowDelModal(true);
  };

  return (
    <>
      {/* 假設是產品列表 */}
      <button onClick={() => handleOpenProductModal("create")}>新增產品</button>

      {/* 示例：刪除與編輯按鈕 */}
      {products.map((item) => (
        <div key={item.id}>
          <span>{item.title}</span>
          <button onClick={() => handleOpenProductModal("edit", item)}>編輯</button>
          <button onClick={() => handleOpenDelModal(item)}>刪除</button>
        </div>
      ))}

      {showProductModal && (
        <ProductModal
          mode={modalMode}
          tempProduct={tempProduct}
          setTempProduct={setTempProduct}
          onClose={() => setShowProductModal(false)}
          getProducts={getProducts}
        />
      )}

      {showDelModal && (
        <DelProductModal
          tempProduct={tempProduct}
          onClose={() => setShowDelModal(false)}
          getProducts={getProducts}
        />
      )}
    </>
  );
}

export default ProductPage2;
