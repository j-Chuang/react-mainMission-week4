import { useEffect, useState, useRef } from "react"
import axios from "axios";
import { Modal } from 'bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH

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
  imagesUrl: [""]
};


function ProductPage ({setIsAuth}) {

const [products, setProducts] = useState([]); // 產品狀態

  // 透過 useRef 取得 DOM
  const productModalRef = useRef(null)
  const delProductModalRef = useRef(null)

  // 取得產品
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      alert("取得產品失敗");
    }
  };
  // 初始取得產品
  useEffect(() => {
    getProducts();
  },[])

  //設定modal模式狀態
  const [modalMode, setModalMode] = useState(null)

  useEffect(()=>{

    // 創建一個新的 Modal 實例，不管該元素是否已經有 Modal 物件。
    new Modal(productModalRef.current, {
      backdrop: false
    }) 

    new Modal(delProductModalRef.current, {
      backdrop: false
    }) 

  },[])

  
  // 關閉modal
  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  }

  // 開啟刪除modal
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product)
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.show();
  }

  // 關閉刪除modal
  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
  }

  // 開啟modal要帶入的單一產品狀態
  const [tempProduct, setTempProduct] = useState(defaultModalState);

  // 處理modal表單變化
  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;    
    setTempProduct({
      ...tempProduct,
      [name]: type === "checkbox"? checked : value,
    })
  }

  // 處理副圖變化
  const handleImageChange = (e,index) => {
    const { value } = e.target;

    const newImage = [...tempProduct.imagesUrl]

    newImage[index] = value;

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImage
    })
  }

  // 新增副圖
  const handleAddImage = () =>{
    const newImage = [...tempProduct.imagesUrl,'']

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImage
    })
  }

  // 刪除最後一筆副圖
  const handleRemoveImage = () =>{
    const newImage = [...tempProduct.imagesUrl]

    newImage.pop();

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImage
    })
  }

  // 戳新增產品api
  const createProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`,{
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      })      
    } catch (error) {
      alert('新增產品失敗')
    }
  }

  // 戳更新單一產品api
  const updateProduct = async () => {
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`,{
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      })      
    } catch (error) {
      alert('編輯產品失敗')
    }
  }

  // 戳刪除產品api
  const deleteProduct = async () => {
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`)      
    } catch (error) {
      alert('刪除產品失敗')
    }
  }

  // 判斷確認鍵要新增或更新，並重新取得產品列表，關閉產品modal
  const handleUpdateProduct = async () => {
    const apiCall = modalMode === 'create' ? createProduct : updateProduct ;
    try {
      await apiCall();

      getProducts();
      
      handleCloseProductModal();
    } catch (error) {
      alert('更新產品失敗')
    }
  }

  // 開啟並判斷modal模式來顯示內容
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    
    switch (mode) {
      case 'create':
        setTempProduct(defaultModalState);
        break;

      case 'edit':
        setTempProduct(product);
        break;
    
      default:
        break;
    }

  // 檢查這個 DOM 元素上是否已經有 Modal 實例，不會創建新的 Modal (有:取得該obj / 無:null)
  const modalInstance = Modal.getInstance(productModalRef.current);
  modalInstance.show();
}

  // 處理刪除，並重新取得產品列表，關閉刪除modal
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct();

      getProducts();

      handleCloseDelProductModal();

    } catch (error) {
      alert('刪除產品失敗')
    }
  }
  // 處理上傳檔案
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file-to-upload',file);

    // console.log(formData) // chrome顯示為空
    // console.log([...formData]); // 這樣才有顯示

    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`,formData);
      const uploadedImageUrl = res.data.imageUrl;
      console.log(uploadedImageUrl)
      setTempProduct({
        ...tempProduct,
        imageUrl: uploadedImageUrl
      })
    } catch (error) {
      alert('上傳圖片失敗')
    }
  }

  const  [pageInfo, setPageInfo] = useState({});

  // 處理切換分頁
  const handlePageChange = (page) => {
    getProducts(page);
  }

  return (<>
    <div className="container py-5">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between">
            <h2>產品列表</h2>
            <button type="button" className="btn btn-primary" onClick={()=>{handleOpenProductModal('create')}}>建立新的產品</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">查看細節</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.title}</th>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}</td>
                  <td>
                  <div className="btn-group">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>{handleOpenProductModal('edit', product)}}>編輯</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>{handleOpenDelProductModal(product)}}>刪除</button>
                  </div>                  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
                <a onClick={()=>{handlePageChange(pageInfo.current_page - 1)}} className="page-link" href="#">
                  上一頁
                </a>
              </li>

              {Array.from({length: pageInfo.total_pages}).map((_,index) =>{
                return (<li key={index} className={`page-item ${pageInfo.current_page === index + 1 && 'active'}`}>
                  <a onClick={()=>{handlePageChange(index + 1)}} className="page-link" href="#">
                    {index + 1}
                  </a>
                </li>)
              })}
              
              <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
                <a onClick={()=>{handlePageChange(pageInfo.current_page + 1)}} className="page-link" href="#">
                  下一頁
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    
    <div id="productModal" className="modal" ref={productModalRef} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">{modalMode === 'create'? "新增產品" : "編輯產品"}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseProductModal}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
              <div className="mb-5">
                <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                <input
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
                      value={tempProduct.imageUrl}
                      onChange={handleModalInputChange}
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={tempProduct.imageUrl}
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
                        value={image}  
                        onChange={(e)=> {handleImageChange(e,index)}}                    
                        id={`imagesUrl-${index + 1}`}
                        type="text"
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
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
                  tempProduct.imagesUrl[tempProduct.imagesUrl.length-1] !== '' &&
                  (<button className="btn btn-outline-primary btn-sm w-100" onClick={handleAddImage}>新增圖片</button>)}
                  {tempProduct.imagesUrl.length > 1 && 
                  (<button className="btn btn-outline-danger btn-sm w-100" onClick={handleRemoveImage}>取消圖片</button>)}
                </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    value={tempProduct.title}
                    onChange={handleModalInputChange}
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    value={tempProduct.category}
                    onChange={handleModalInputChange}
                    name="category"
                    id="category"
                    type="text"
                    className="form-control"
                    placeholder="請輸入分類"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    value={tempProduct.unit}
                    onChange={handleModalInputChange}
                    name="unit"
                    id="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入單位"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      value={tempProduct.origin_price}
                      onChange={handleModalInputChange}
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      value={tempProduct.price}
                      onChange={handleModalInputChange}
                      name="price"
                      id="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    value={tempProduct.description}
                    onChange={handleModalInputChange}
                    name="description"
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    value={tempProduct.content}
                    onChange={handleModalInputChange}
                    name="content"
                    id="content"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>

                <div className="form-check">
                  <input
                    checked={tempProduct.is_enabled}
                    onChange={handleModalInputChange}
                    name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button type="button" className="btn btn-secondary" onClick={handleCloseProductModal}>
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={handleUpdateProduct}>
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
    ref={delProductModalRef}
    className="modal fade"
    id="delProductModal"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
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
            <button type="button" className="btn btn-danger" onClick={handleDeleteProduct}>
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    </>)
}



export default ProductPage;