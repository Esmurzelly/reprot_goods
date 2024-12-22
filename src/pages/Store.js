import React, { useEffect, useState } from 'react'
import PopupComponent from '../components/PopupComponent'
import { collection, deleteDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Loader from '../components/Loader';

const Store = () => {
  const [storeItems, setStoreItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = ['Name', 'Type', 'Quantity', "Price", "Total price"]

  const fetchPost = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "store"));
      const newData = querySnapshot.docs.map((itemDoc) => ({
        ...itemDoc.data(),
        id: itemDoc.id,
      }));

      setStoreItems(newData);
      setLoading(false);

      console.log('Fetched data:', newData);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  }

  const deleteItem = async (id) => {
    console.log('id of item from DeleteFunc', id);
    try {
      setLoading(true);
      await deleteDoc(doc(db, "store", id));
      setStoreItems(prevItems => prevItems.filter(item => item.id !== id));
      console.log(`Item with ID ${id} deleted successfully.`);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  }


  useEffect(() => {
    console.log('storeItems from useEffect', storeItems)
  }, [storeItems]);

  useEffect(() => {
    fetchPost();
  }, []);

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-slate-300'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='relative'>
      <h1 className='text-3xl'>Store</h1>
      <PopupComponent />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {categories.map((categoryItem, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {categoryItem}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Delete</span>
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
                    {item.store.price}
                  </td>
                  <td className="px-6 py-4">
                    {item.store.quantity}
                  </td>
                  <td className="px-6 py-4">
                    {item.store.total_price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteItem(item.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default Store