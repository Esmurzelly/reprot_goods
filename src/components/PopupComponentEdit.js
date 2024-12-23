import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import { db } from '../firebase';
import Loader from './Loader';
import { getAuth } from 'firebase/auth';

const PopupComponentEdit = ({ id, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [store, setStore] = useState({
        name: '',
        type: '',
        quantity: '',
        price: '',
    });
    const [sellsItem, setSellsItem] = useState([]);
    const [toSelling, setToSelling] = useState('');
    const authUser = getAuth();

    const handleChange = e => {
        const { name, value } = e.target;
        const newValue = name === 'price' || name === 'quantity' || name === 'total_price' ? Number(value) : value
        setStore((prev) => ({
            ...prev,
            [name]: newValue,
        }));
        console.log('store from HandleChange function', store)
    };

    const fetchSellsItems = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "sells"));
            const newData = querySnapshot.docs.map((itemDoc) => ({
                ...itemDoc.data(),
                id: itemDoc.id,
            })).filter(item => item?.userId === authUser?.currentUser?.uid);

            setSellsItem(newData);
            setLoading(false);

            console.log('Fetched data:', newData);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setLoading(false);
        }
    }

    const editItem = async () => {
        try {
            setLoading(true);
            const updateDocItem = await updateDoc(doc(db, "store", id), {
                'store.name': store.name,
                'store.type': store.type,
                'store.quantity': store.quantity,
                'store.price': store.price,
                'store.total_price': store.price * store.quantity,
            });
            console.log('updateDocItem from editItem function', updateDocItem);
            setLoading(false);
        } catch (error) {
            console.log('error of adding item', error);
            setLoading(false);
        }
    };

    const toSellingNumber = async (storeItemId) => {
        try {
            setLoading(true);

            const storeDocRef = doc(db, "store", storeItemId);
            const storeDocSnap = await getDoc(storeDocRef);

            if (!storeDocSnap.exists()) {
                console.error(`Store document with ID ${storeItemId} not found.`);
                setLoading(false);
                return;
            }

            const currentStoreData = storeDocSnap.data();

            const newQuantityInStore = currentStoreData.store.quantity - Number(toSelling);

            if (newQuantityInStore < 0) {
                console.error("Not enough items in store for selling.");
                setLoading(false);
                return;
            }

            const newTotalPrice = newQuantityInStore * currentStoreData.store.price;

            const updadeRefDocStoreItem = await updateDoc(storeDocRef, {
                'store.quantity': newQuantityInStore,
                'store.total_price': newTotalPrice,
            });

            console.log(`Updated store document: ${storeItemId} successfully.`);





            const existingItem = sellsItem.find(item => item.storeItemId === storeItemId);
            console.log('existingItem from sellingNum func', existingItem);
            const pricePerUnit = currentStoreData.store.price;

            if (existingItem) {
                const totalSoldUnits = existingItem.soldNumber + Number(toSelling);
                const newTotalPrice = totalSoldUnits * pricePerUnit;

                const initialTotalPrice = Number(toSelling) * pricePerUnit;

                const newQuantityInSells = currentStoreData.store.quantity - Number(toSelling); // Берем из store!

                const updatedocRef = await updateDoc(doc(db, "sells", existingItem.id), {
                    soldNumber: existingItem.soldNumber + Number(toSelling),
                    sells: {
                        ...existingItem.sells,
                        total_price: newTotalPrice,
                        quantity: newQuantityInSells
                    },
                });
                console.log('updatedocRef from toSellingNumber function', updatedocRef);
                console.log(`Item with storeItemId ${storeItemId} updated successfully.`);
            } else {
                const initialTotalPrice = Number(toSelling) * pricePerUnit;

                const docRef = await addDoc(collection(db, "sells"), {
                    sells: {
                        ...currentStoreData.store,
                        quantity: newQuantityInStore, // Создаем с новым количеством
                        total_price: initialTotalPrice,
                    },
                    soldNumber: Number(toSelling),
                    userId: authUser?.currentUser?.uid,
                    storeItemId,
                });

                console.log('docRef from toSellingNumber function', docRef);
            }

            console.log('storeItemId', storeItemId);


            setLoading(false);
        } catch (error) {
            console.log('error of adding item', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (initialData) {
            setStore({
                name: initialData.name || '',
                type: initialData.type || '',
                quantity: initialData.quantity || '',
                price: initialData.price || '',
            });
        };
    }, [initialData]);

    useEffect(() => {
        fetchSellsItems();
    }, []);

    console.log('sellsItem from editComponent', sellsItem);
    console.log('storeItem from editComponent', store);

    if (loading) return <div className='w-full min-h-screen bg-slate-300'><Loader /></div>

    return (
        <Popup
            trigger={<button className="button"> Edit item </button>}
            modal
            nested
            className='className="font-medium text-blue-600 dark:text-blue-500 hover:underline"'
        >
            {close => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="header"> Edit data </div>
                    <div className="content flex flex-col">
                        <div className='w-1/2 flex flex-col items-start gap-2'>
                            <div className='w-full flex flex-row justify-between'>
                                <label>Name</label>
                                <input value={store.name} name='name' className='border w-48' type='text' onChange={handleChange} />
                            </div>
                            <div className='w-full flex flex-row justify-between'>
                                <label>Type</label>
                                <input value={store.type} name='type' className='border w-48' type='text' onChange={handleChange} />
                            </div>
                            <div className='w-full flex flex-row justify-between'>
                                <label>Quantity</label>
                                <input value={store.quantity} name='quantity' className='border w-48' type='number' onChange={handleChange} />
                            </div>
                            <div className='w-full flex flex-row justify-between'>
                                <label>Price</label>
                                <input value={store.price} name='price' className='border w-48' type='number' onChange={handleChange} />
                            </div>

                            <hr className='w-full ' />

                            <div className='w-full flex flex-row justify-between'>
                                <div className='flex flex-row justify-between'>
                                    <label>To selling</label>
                                    <input value={toSelling} name='toSelling' className='border w-48' type='number' onChange={(e) => setToSelling(e.target.value)} />
                                </div>
                                <button onClick={() => toSellingNumber(id)}>Send</button>
                            </div>

                            {/* <div className='w-full flex flex-row justify-between'>
                                <label>Total price</label>
                                <input value={store.total_price} name='total_price' className='border w-48' type='number' onChange={handleChange} />
                            </div> */}
                            {/* <div className='w-full flex flex-row justify-between'>
                                <label>Date arriving</label>
                                <input name='date_arriving' className='border w-48' type='date' onChange={handleChange} />
                            </div> */}
                        </div>
                    </div>
                    <div className="actions">
                        <button type='submit' onClick={() => {
                            editItem();
                            close();
                        }}>
                            Edit item
                        </button>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default PopupComponentEdit