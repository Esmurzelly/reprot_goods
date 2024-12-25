import { getAuth } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase';
import Loader from '../components/Loader';

const Sells = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sellsItems, setSellsItems] = useState([]);
  const categories = ['Name', 'Type', 'Quantity', "Price", "Sold Number", "Total price"];
  const authUser = getAuth();

  const fetchPost = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(collection(db, "sells"));
      const newData = querySnapshot.docs.map((itemDoc) => ({
        ...itemDoc.data(),
        id: itemDoc.id,
      })).filter(item => item?.userId === authUser?.currentUser?.uid)

      setSellsItems(newData);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching sells items:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPost();
  }, []);

  // useEffect(() => {
  //   console.log('sellsItems from useEffect', sellsItems)
  // }, [sellsItems]);

  if (loading) {
    return (
      <div className='w-full min-h-screen bg-slate-300'>
        <Loader />
      </div>
    )
  }

  return (
    <div>
      Sells

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {categories.map((categoryItem, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {categoryItem}
                </th>
              ))}
              {/* <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th> */}
              {/* <th scope="col" className="px-6 py-3">
                <span className="sr-only">Delete</span>
              </th> */}
            </tr>
          </thead>
          <tbody>
            {sellsItems
              .sort((a, b) => {
                const dateA = a.sells.date_creating?.toDate();
                const dateB = b.sells.date_creating?.toDate();
                return dateB - dateA;
              })
              .map((item) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {item.sells.name}
                  </th>
                  <td className="px-6 py-4">
                    {item.sells.type}
                  </td>
                  <td className="px-6 py-4">
                    {item.sells.quantity}
                  </td>
                  <td className="px-6 py-4">
                    {item.sells.price}
                  </td>
                  <td className="px-6 py-4">
                    {item.soldNumber}
                  </td>
                  <td className="px-6 py-4">
                    {item.sells.total_price}
                  </td>
                  
                  {/* <td className="px-6 py-4 text-right">
                    <PopupComponentEdit id={item.id} initialData={item.store} />
                  </td> */}
                  {/* <td className="px-6 py-4 text-right">
                    <button className="font-medium text-red-600 dark:text-red-500 hover:underline">
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <button className='p-2 mt-5 w-28 text-center rounded-lg bg-red-600 text-sm text-white' onClick={() => navigate(-1)}>Назад</button>
    </div>
  )
}

export default Sells