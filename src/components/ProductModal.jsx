import axios from "axios";
import { Modal } from "bootstrap";
import { useEffect, useRef } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({
  tempProduct,
  setTempProduct,
  getProducts,
  modalMode,
  isOpen,
  setIsOpen,
}) {
  const productModalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    new Modal(productModalRef.current, { backdrop: false });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const productModal = Modal.getInstance(productModalRef.current);
      productModal.show();
    }
  }, [isOpen]);

  const handleCloseProductModal = () => {
    const productModal = Modal.getInstance(productModalRef.current);
    productModal.hide();
    setIsOpen(false);
    fileInputRef.current.value = ""; // 清空上傳圖片欄位
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

  return (
    <>
      <div
        ref={productModalRef}
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
    </>
  );
}

export default ProductModal;
