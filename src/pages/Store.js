import React, { useEffect, useState } from 'react'
import AddStoreItemPopup from '../components/AddStoreItemPopup'
import PopupComponentEdit from '../components/PopupComponentEdit'
import { collection, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

const Store = () => {
  const [storeItems, setStoreItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = ['Название', 'Категория', 'Количество', "Цена за единицу", "Общая стоимость"];
  const navigate = useNavigate();
  const authUser = getAuth();

  const fetchPost = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "store"));
      const newData = querySnapshot.docs.map((itemDoc) => ({
        ...itemDoc.data(),
        id: itemDoc.id,
      })).filter(item => item?.userId === authUser?.currentUser?.uid);

      setStoreItems(newData);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  }

  const deleteItem = async (id) => {
    try {
      setLoading(true);

      const sellsQuerySnapshot = await getDocs(collection(db, "sells"));
      const relatedSellsItems = sellsQuerySnapshot.docs.filter(doc => doc.data().storeItemId === id);

      if (relatedSellsItems) {
        for (const sellDoc of relatedSellsItems) {
          await deleteDoc(doc(db, "sells", sellDoc.id));
        }
      };

      await deleteDoc(doc(db, "store", id));
      setStoreItems(prevItems => prevItems.filter(item => item.id !== id));
      toast.success(`Item deleted successfully`);

      setLoading(false);
    } catch (error) {
      toast.error(`Error fetching documents, ${error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-slate-300'>
        <Loader />
      </div>
    )
  };

  return (
    <div className='relative'>
      <h1 className='text-3xl my-3'>Склад</h1>
      <AddStoreItemPopup loading={loading} setLoading={setLoading} setStoreItems={setStoreItems} />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {categories.map((categoryItem, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {categoryItem}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Изменить</span>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Удалить</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {storeItems
              .sort((a, b) => {
                const dateA = a.store.date_creating.toDate();
                const dateB = b.store.date_creating.toDate();
                return dateB - dateA;
              })
              .map((item) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {item.store.name}
                  </th>
                  <td className="px-6 py-4">
                    {item.store.type}
                  </td>
                  <td className="px-6 py-4">
                    {item.store.quantity}
                  </td>
                  <td className="px-6 py-4">
                    {item.store.price}
                  </td>
                  <td className="px-6 py-4">
                    {item.store.total_price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <PopupComponentEdit id={item.id} initialData={item.store} setStoreItems={setStoreItems} storeItems={storeItems} loading={loading} setLoading={setLoading} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteItem(item.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <button className='p-2 mt-5 w-28 text-center rounded-lg bg-red-600 text-sm text-white' onClick={() => navigate(-1)}>Назад</button>
    </div>
  )
}

export default Store