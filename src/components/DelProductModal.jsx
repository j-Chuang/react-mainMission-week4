import axios from "axios";
import { Modal } from "bootstrap";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DelProductModal({ tempProduct, getProducts, isOpen, setIsOpen }) {
  const delModalRef = useRef(null);

  useEffect(() => {
    new Modal(delModalRef.current, { backdrop: false });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const delModal = Modal.getInstance(delModalRef.current);
      delModal.show();
    }
  }, [isOpen]);

  const handleCloseDelProductModal = () => {
    const delModal = Modal.getInstance(delModalRef.current);
    delModal.hide();
    setIsOpen(false);
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

  return (
    <>
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

export default DelProductModal;

DelProductModal.propTypes = {
  tempProduct: PropTypes.shape({
    id: PropTypes.string,
  }),
  getProducts: PropTypes.func,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};
