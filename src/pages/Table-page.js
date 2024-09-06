/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import TableComponent from '../components/Table-component';
import Modal from '../components/modal-component';
import Header from '../components/Header-component';
import Footer from '../components/Footer-component';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCars, createCar, updateCar } from '../Redux/actions/carActions';
import { RiAddCircleFill } from "react-icons/ri";
import { MdOutlineDownloadDone } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import notify from '../notification/notify';

const TablePage = () => {
  const dispatch = useDispatch();
  const carResponse = useSelector((state) => state.carReducer.cars);
  const createdCarResponse = useSelector((state) => state.carReducer.createdCar);
  const updatedCarResponse = useSelector((state) => state.carReducer.updatedCar);
  const [data, setData] = useState([]);
  const [editedItems, setEditedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const item_per_page = 5;
  const lastEditedRef = useRef(null);

  const getCars = async () => {
    if (totalPages === 1 && !localStorage.getItem('totalPages')) {
      localStorage.setItem('totalPages', totalPages);
    }
  
    // Adjusted to start from carDataPg1
    const localStorageData = localStorage.getItem(`carDataPg${currentPage}`);
    const localStorageTotalPages = localStorage.getItem(`totalPages`);
  
    const parsedTotalPages = localStorageTotalPages ? JSON.parse(localStorageTotalPages) : 1;
  
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      setData(parsedData);
      setTotalPages(parsedTotalPages); 
    } else {
      await dispatch(getAllCars(item_per_page, currentPage));
    }
  };
  
  
  useEffect(() => {
    getCars();
  }, [currentPage]);

  useEffect(() => {
    const localStorageTotalPages = localStorage.getItem(`totalPages`);
    if (carResponse?.data && carResponse.currentPage === currentPage) {
      if(localStorageTotalPages){
        setTotalPages(JSON.parse(localStorageTotalPages));
        localStorage.setItem('totalPages', JSON.parse(localStorageTotalPages));
      } else {
        localStorage.setItem('totalPages', JSON.stringify(carResponse.totalPages));
      }
  
      const localStorageData = localStorage.getItem(`carDataPg${currentPage}`);
      let mergedData;
  
      if (localStorageData) {
        const parsedLocalStorageData = JSON.parse(localStorageData);
        mergedData = [...parsedLocalStorageData, ...carResponse.data];
        mergedData = mergedData.reduce((unique, car) => {
          return unique.some((item) => item.id === car.id) ? unique : [...unique, car];
        }, []);
      } else {
        mergedData = carResponse.data;
      }
  
      localStorage.setItem(`carDataPg${currentPage}`, JSON.stringify(mergedData));
      setData(mergedData);
      setTotalPages(carResponse.totalPages);
    }
  }, [carResponse, currentPage]);
  
  

  const columns = [
    { key: 'name', header: 'Item Name' },
    { key: 'color', header: 'Color' },
    { key: 'model', header: 'Model' },
    { key: 'code', header: 'Code' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', color: '', model: '', code: '' });
  const [errors, setErrors] = useState({});

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  

  const handleAddItem = async () => {
  const validationErrors = {};
  if (!newItem.name) validationErrors.name = 'Item Name is required';
  if (!newItem.color) validationErrors.color = 'Color is required';
  if (!newItem.model) validationErrors.model = 'Model is required';
  if (!newItem.code) validationErrors.code = 'Code is required';

  if (Object.keys(validationErrors).length) {
    setErrors(validationErrors);
    return;
  }

  await dispatch(createCar(newItem));
};


useEffect(() => {
  if (createdCarResponse.name) {
    const currentData = JSON.parse(localStorage.getItem(`carDataPg${totalPages}`)) || [];
    const allData = [...currentData, { ...newItem, id: createdCarResponse.id }];

    if (allData.length > item_per_page) {
      const newPageNumber = totalPages + 1;

      localStorage.setItem(`carDataPg${newPageNumber}`, JSON.stringify(allData.slice(item_per_page)));
      localStorage.setItem('totalPages', JSON.stringify(newPageNumber));

      setTotalPages(newPageNumber);
      setCurrentPage(newPageNumber);
      setData(allData.slice(item_per_page));
      setTimeout(()=>window.location.reload('false'),2000)
    } else {
      localStorage.setItem(`carDataPg${totalPages}`, JSON.stringify(allData));
      setData(allData);
    }

    setNewItem({ name: '', color: '', model: '', code: '' });
    setErrors({});
    setIsModalOpen(false);
    notify("Data Added Successfully", "success");
  }
}, [createdCarResponse]);



const handleInputChange = (rowIndex, key, value) => {
  const updatedData = data.map((row) =>
    row.id === rowIndex ? { ...row, [key]: value } : row
  );
  localStorage.setItem(`carDataPg${currentPage}`, JSON.stringify(updatedData));
  localStorage.setItem('lastEdited', JSON.stringify({ page: currentPage, rowIndex, key }));
  setData(updatedData);
  const updatedEditedItems = [...editedItems];
  const editedItem = updatedData.find((row) => row.id === rowIndex);

  if (!updatedEditedItems.some((item) => item.id === rowIndex)) {
    updatedEditedItems.push(editedItem);
  } else {
    const index = updatedEditedItems.findIndex((item) => item.id === rowIndex);
    updatedEditedItems[index] = { ...updatedEditedItems[index], [key]: value };
  }

  setEditedItems(updatedEditedItems);
  console.log(editedItem)
  console.log(data)
};

  useEffect(() => {
    const lastEdited = localStorage.getItem('lastEdited');
    if (lastEdited) {
      const { page, rowIndex, key } = JSON.parse(lastEdited);
      if (page === currentPage) {
        lastEditedRef.current = { rowIndex, key };
        setTimeout(() => {
          const input = document.querySelector(`#input-${rowIndex}-${key}`);
          if (input) input.focus();
        }, 0);
      }
    }
  }, [currentPage]);

  const handleSubmitChanges = async() => {
    await dispatch(updateCar(editedItems));
    console.log(editedItems);
  };
  useEffect(()=>{
    if (updatedCarResponse.message){
      notify("data updated Successfully","success" )
    }
  },[updatedCarResponse])

  return (
    <>
      <div className="flex flex-col min-h-screen bg-cover">
        <Header />
        <div className="flex-grow py-6 px-6 text-center">
          <TableComponent
            columns={columns}
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            handleInputChange={handleInputChange}
          />
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded m-1"
              onClick={() => setIsModalOpen(true)}
            >
              Add New Item <RiAddCircleFill style={{ display: "inline" }} />
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded m-1 "
              onClick={handleSubmitChanges}
            >
              Submit Changes <MdOutlineDownloadDone style={{ display: "inline" }} />
            </button>
          </div>

          {isModalOpen && (
            <Modal >
              <h2 className="text-lg font-bold mb-4">Add New Item</h2>
              <div className="animate-modal-in p-3 text-left">
                <div className="mb-4">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="border w-full px-2 py-1"
                    placeholder="Enter Car name"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="mb-4">
                  <label>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={newItem.color}
                    onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                    className="border w-full px-2 py-1"
                    placeholder="Enter color"
                  />
                  {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}
                </div>
                <div className="mb-4">
                  <label>Model</label>
                  <input
                    type="text"
                    name="model"
                    value={newItem.model}
                    onChange={(e) => setNewItem({ ...newItem, model: e.target.value })}
                    className="border w-full px-2 py-1"
                    placeholder="Enter model"
                  />
                  {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
                </div>
                <div className="mb-4">
                  <label>Code</label>
                  <input
                    type="text"
                    name="code"
                    value={newItem.code}
                    onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                    className="border w-full px-2 py-1"
                    placeholder="Enter code"
                  />
                  {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                </div>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleAddItem}
                >
                  Add Item
                </button>
                <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={() => setIsModalOpen(false)}>
          Close
        </button>
              </div>
            </Modal>
          )}
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
};

export default TablePage;
