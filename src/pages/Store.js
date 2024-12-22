import React, { useEffect, useState } from 'react'
import PopupComponent from '../components/PopupComponent'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Store = () => {
  const [storeItems, setStoreItems] = useState([]);

  const fetchPost = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "store"));
      const newData = querySnapshot.docs.map((itemDoc) => ({
        ...itemDoc.data(),
        id: itemDoc.id,
      }));

      setStoreItems(newData);

      console.log('Fetched data:', newData);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }


  useEffect(() => {
    console.log('storeItems from useEffect', storeItems)
  }, [storeItems]);

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className='relative'>
      <h1>Store</h1>
      <PopupComponent />

      <ul className='flex flex-col gap-3'>
        {storeItems.map((item) => (
          <li key={item.id} className='border'>
            <div className=''>
              <h2>Name: {item.store.name}</h2>
              <h2>Type: {item.store.type}</h2>
              <h2>Price for one: {item.store.price}</h2>
              <h2>Quantity: {item.store.quantity}</h2>
              <h2>Total price: {item.store.total_price}</h2>
            </div>
          </li>
        ))}
      </ul>
    </div>

  )
}

export default Store