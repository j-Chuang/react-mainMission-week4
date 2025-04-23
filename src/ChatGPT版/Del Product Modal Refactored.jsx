// 🔁 重構後：DelProductModal.jsx
import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

function DelProductModal({ tempProduct, onClose, getProducts }) {
  const delModalRef = useRef(null);

  useEffect(() => {
    const modal = new Modal(delModalRef.current);
    modal.show();
    const node = delModalRef.current;
    node.addEventListener("hidden.bs.modal", onClose);

    return () => {
      node.removeEventListener("hidden.bs.modal", onClose);
    };
  }, [onClose]);

  const handleDelete = async () => {
    try {
      // 模擬 API 刪除
      // await axios.delete(...)
      getProducts();
      onClose();
    } catch (error) {
      console.error("刪除失敗", error);
    }
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={delModalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">刪除產品</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            確定要刪除「{tempProduct.title}」嗎？
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              確定刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DelProductModal;
