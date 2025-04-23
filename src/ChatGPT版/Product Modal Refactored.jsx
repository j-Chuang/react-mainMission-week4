// 🔁 重構後：ProductModal.jsx
import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

function ProductModal({ mode, tempProduct, setTempProduct, onClose, getProducts }) {
  const productModalRef = useRef(null);

  useEffect(() => {
    const modal = new Modal(productModalRef.current);
    modal.show();

    // 關閉時呼叫 onClose 回傳給外層
    const node = productModalRef.current;
    node.addEventListener("hidden.bs.modal", onClose);

    return () => {
      node.removeEventListener("hidden.bs.modal", onClose);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProduct({ ...tempProduct, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // 模擬 API
      if (mode === "create") {
        // await axios.post(...)
      } else {
        // await axios.put(...)
      }
      getProducts();
      onClose();
    } catch (error) {
      console.error("更新失敗", error);
    }
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={productModalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "create" ? "新增產品" : "編輯產品"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              name="title"
              value={tempProduct.title || ""}
              onChange={handleChange}
              placeholder="請輸入產品名稱"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              關閉
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
