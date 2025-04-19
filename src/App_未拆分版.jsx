import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// `${BASE_URL}/v2/api/${API_PATH}/admin/`

function App2() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const modalRef = useRef(null);
  const delModalRef = useRef(null);
  const [modalMode, setModalMode] = useState("");
  const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""],
  };
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const fileInputRef = useRef(null);
  const [pageInfo, setPageInfo] = useState({});

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
      alert("登入失敗/" + error.response.data.message);
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
        console.log("checkUserLogin ok");
        getProducts();
        setIsAuth(true);
      } else {
        alert("請重新登入");
      }
    } catch (error) {
      alert("請檢查登入權限/" + error.response.data.message);
    }
  };

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      alert("取得產品資訊失敗/" + error.response.data.message);
    }
  };

  useEffect(() => {
    checkUserLogin();
    new Modal(modalRef.current, { backdrop: false });
    new Modal(delModalRef.current, { backdrop: false });
    fixBsModalFocusProblem();
  }, []);

  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case "create":
        setTempProduct(defaultModalState);
        break;

      case "edit":
        setTempProduct(product);
        break;

      default:
        break;
    }
    const productModal = Modal.getInstance(modalRef.current);
    productModal.show();
  };

  const handleCloseProductModal = () => {
    const productModal = Modal.getInstance(modalRef.current);
    productModal.hide();
    fileInputRef.current.value = ""; // 清空上傳圖片欄位
  };

  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    const delModal = Modal.getInstance(delModalRef.current);
    delModal.show();
  };

  const handleCloseDelProductModal = () => {
    const delModal = Modal.getInstance(delModalRef.current);
    delModal.hide();
  };

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const modalInput = {
      ...tempProduct,
      [name]: type === "checkbox" ? checked : value,
    };
    setTempProduct(modalInput);
  };

  const createProduct = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        }
      );
      return res;
    } catch (error) {
      alert("新增產品失敗 / " + error.response.data.message);
    }
  };

  const editProduct = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        }
      );
      return res;
    } catch (error) {
      alert("編輯產品失敗 / " + error.response.data.message);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const apiCall = modalMode === "create" ? createProduct : editProduct;
      const res = await apiCall();
      getProducts();
      if (res.status === 200) {
        handleCloseProductModal();
      }
    } catch (error) {
      alert("更新產品失敗 / " + error.response.data.message);
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`
      );
    } catch (error) {
      alert("刪除產品失敗 / " + error.response.data.message);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct();
      getProducts();
      handleCloseDelProductModal();
    } catch (error) {
      alert("刪除產品失敗 / " + error.response.data.message);
    }
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ""];
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    // newImages.splice(newImages.length-1)
    newImages.pop();
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };

  // 上傳檔案功能
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return console.log("No file selected!");

    const formData = new FormData();
    formData.append("file-to-upload", file);

    // 特殊物件，開發者工具無法直接預覽其內容
    // console.log(formData)

    // 正確印出所有內容
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/admin/upload`,
        formData
      );
      console.log("image successfully uploaded");
      const uploadedImageUrl = res.data.imageUrl;
      setTempProduct({
        ...tempProduct,
        imageUrl: uploadedImageUrl,
      });
    } catch (error) {
      alert("上傳圖片失敗 / " + error.response.data.message);
    }
  };

  const handlePageChange = (page) => {
    getProducts(page);
  };

  // 修正BS關閉modal失去焦點問題紅字
  const fixBsModalFocusProblem = () => {
    window.addEventListener("hide.bs.modal", () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  };

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
    <>
      {isAuth ? (
        <div className="container py-5">
          <div className="row">
            <div className="col">
              <div className="d-flex justify-content-between">
                <h2>產品列表</h2>
                <button
                  className="btn btn-success"
                  onClick={() => handleOpenProductModal("create")}
                >
                  建立新的產品
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">產品名稱</th>
                    <th scope="col">類別</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">{product.title}</th>
                      <td>{product.category}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>
                        {product.is_enabled ? (
                          <span className="text-success">啟用</span>
                        ) : (
                          <span>未啟用</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              handleOpenProductModal("edit", product)
                            }
                          >
                            編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleOpenDelProductModal(product)}
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* pagination */}
          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
                  <button
                    onClick={() => handlePageChange(pageInfo.current_page - 1)}
                    className="page-link"
                  >
                    上一頁
                  </button>
                </li>
                {Array.from({ length: pageInfo.total_pages }).map(
                  (_, index) => {
                    return (
                      <li
                        key={index + 1}
                        className={`page-item ${
                          pageInfo.current_page === index + 1 && "active"
                        }`}
                      >
                        <button
                          onClick={() => handlePageChange(index + 1)}
                          className="page-link"
                        >
                          {index + 1}
                        </button>
                      </li>
                    );
                  }
                )}
                <li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
                  <button
                    onClick={() => handlePageChange(pageInfo.current_page + 1)}
                    className="page-link"
                  >
                    下一頁
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : (
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
      )}
      {/* productModal */}
      <div
        ref={modalRef}
        id="productModal"
        className="modal"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div
              className={`modal-header border-bottom ${
                modalMode === "edit" ? "bg-primary" : "bg-success"
              }`}
            >
              <h5 className="modal-title text-white fs-4">
                {modalMode === "edit" ? "編輯產品" : "新增產品"}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseProductModal}
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label">
                      {" "}
                      圖片上傳{" "}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        onChange={handleModalInputChange}
                        value={tempProduct.imageUrl}
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl || null} // 避免src=""的紅字
                      alt={tempProduct.title}
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                          value={image}
                          onChange={(e) => handleImageChange(e, index)}
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 &&
                        tempProduct.imagesUrl[
                          tempProduct.imagesUrl.length - 1
                        ] !== "" && (
                          <button
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={handleAddImage}
                          >
                            新增圖片
                          </button>
                        )}
                      {tempProduct.imagesUrl.length > 1 && (
                        <button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={handleRemoveImage}
                        >
                          取消圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      onChange={handleModalInputChange}
                      value={tempProduct.title}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      onChange={handleModalInputChange}
                      value={tempProduct.category}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      onChange={handleModalInputChange}
                      value={tempProduct.unit}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        onChange={handleModalInputChange}
                        value={tempProduct.origin_price}
                        min={0}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        onChange={handleModalInputChange}
                        value={tempProduct.price}
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                      onChange={handleModalInputChange}
                      value={tempProduct.description}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                      onChange={handleModalInputChange}
                      value={tempProduct.content}
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                      onChange={handleModalInputChange}
                      checked={tempProduct.is_enabled}
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseProductModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateProduct}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* delProductModal */}
      <div
        ref={delModalRef}
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseDelProductModal}
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseDelProductModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteProduct}
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App2;
