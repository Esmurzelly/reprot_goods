import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import { db } from '../firebase';
import Loader from './Loader';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';

const PopupComponentEdit = ({ id, initialData, setStoreItems, setLoading }) => {
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
    };

    const fetchSellsItems = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "sells"));
            const newData = querySnapshot.docs.map((itemDoc) => ({
                ...itemDoc.data(),
                id: itemDoc.id,
            })).filter(item => item?.userId === authUser?.currentUser?.uid);

            setSellsItem(newData);

            console.log('Fetched data:', newData);
        } catch (error) {
            console.error('Error fetching documents:', error);
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

            setStoreItems(prevItems => prevItems.map(item =>
                item.id === id ? {
                    ...item,
                    store: {
                        ...item.store,
                        name: store.name,
                        type: store.type,
                        quantity: store.quantity,
                        price: store.price,
                        total_price: store.price * store.quantity,
                    }
                } : item
            ));

            // Находим элементы из коллекции Sells, связанные с этим Store item
            const sellsQuerySnapshot = await getDocs(collection(db, "sells"));
            const relatedSellsItems = sellsQuerySnapshot.docs.filter(doc => doc.data().storeItemId === id);

            // Обновляем все связанные элементы в коллекции Sells
            for (const sellDoc of relatedSellsItems) {
                const sellData = sellDoc.data();

                const updatedSellsData = {
                    ...sellData.sells,
                    name: store.name,
                    type: store.type,
                    price: store.price,
                    quantity: store.quantity, // Обновляем только если требуется
                    total_price: store.price * sellData.soldNumber, // Пересчитываем итоговую цену на основе новой цены
                };

                await updateDoc(doc(db, "sells", sellDoc.id), {
                    sells: updatedSellsData,
                });
            };

            toast.success('Store and related Sells items updated successfully');
            setLoading(false);
        } catch (error) {
            toast.error(`error of adding item: ${error}`)
            setLoading(false);
        }
    };

    const toSellingNumber = async (storeItemId) => {
        try {
            setLoading(true);

            const storeDocRef = doc(db, "store", storeItemId);
            const storeDocSnap = await getDoc(storeDocRef); // fetch from Store

            if (!storeDocSnap.exists()) {
                console.error(`Store document with ID ${storeItemId} not found.`);
                setLoading(false);
                return;
            }

            const currentStoreData = storeDocSnap.data(); // getting data from Store

            const newQuantityInStore = currentStoreData.store.quantity - Number(toSelling); // changed Quantity In Store

            if (newQuantityInStore < 0) {
                console.error("Not enough items in store for selling.");
                setLoading(false);
                return;
            }

            const newTotalPrice = newQuantityInStore * currentStoreData.store.price;

            const updadeRefDocStoreItem = await updateDoc(storeDocRef, { // update of Quantity and Total_price
                'store.quantity': newQuantityInStore,
                'store.total_price': newTotalPrice,
            });


            const existingItem = sellsItem.find(item => item.storeItemId === storeItemId); // в sells элементах находим те, которые соответствуют store (sells.storeItemId === store.id)
            const pricePerUnit = currentStoreData.store.price; // отдельная цена за конкретный товар

            if (existingItem) { // если товар уже был ранее списан
                const totalSoldUnits = existingItem.soldNumber + Number(toSelling); // общее кол-во проданных
                const newTotalPrice = totalSoldUnits * pricePerUnit; // обновлённое значение total_price

                // const initialTotalPrice = Number(toSelling) * pricePerUnit;

                const newQuantityInSells = currentStoreData.store.quantity - Number(toSelling); // Берем из store!

                const updatedocRef = await updateDoc(doc(db, "sells", existingItem.id), { // вызов обновления soldNumber, total_price, quantity 
                    soldNumber: existingItem.soldNumber + Number(toSelling),
                    sells: {
                        ...existingItem.sells,
                        total_price: newTotalPrice,
                        quantity: newQuantityInSells
                    },
                });
            } else { // если товар не был ранее списан
                const initialTotalPrice = Number(toSelling) * pricePerUnit; // обновлённое значение total_price (кол-во проданных * цену)

                const docRef = await addDoc(collection(db, "sells"), {
                    sells: {
                        ...currentStoreData.store,
                        quantity: newQuantityInStore, // обновлённое кол-во товаров
                        total_price: initialTotalPrice, // обновленный total price
                    },
                    soldNumber: Number(toSelling), // кол-во проданных
                    userId: authUser?.currentUser?.uid, // привязка к юзеру
                    storeItemId, // привязка к Store
                });
            }

            setStoreItems(prevItems => prevItems.map(item => // динамичное обвноление данных из Store
                item.id === storeItemId ? {
                    ...item,
                    store: {
                        ...item.store,
                        quantity: newQuantityInStore,
                        total_price: newTotalPrice,
                    }
                } : item
            ));

            setLoading(false);
            toast.success('Товар успешно списан');
        } catch (error) {
            toast.error(`error of changing item, ${error}`)
            setLoading(false);
        }
    }

    const handleToSellingItemChange = e => {
        const value = Number(e.target.value);
        if (value <= store.quantity) {
            setToSelling(value)
        } else {
            setToSelling(store.quantity)
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

    return (
        <Popup
            trigger={<button className="button"> Изменить </button>}
            modal
            nested
            className='className="font-medium text-blue-600 dark:text-blue-500 hover:underline"'
        >
            {close => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        <IoMdClose />
                    </button>
                    <div className="header"> Изменить </div>
                    <div className="content">
                        <div className='flex flex-row gap-5'>
                            <div className='w-1/2 flex flex-col items-start gap-2'>
                                <div className='w-full flex flex-row justify-between'>
                                    <label>Название</label>
                                    <input value={store.name} name='name' className='border w-48 p-1' type='text' onChange={handleChange} />
                                </div>
                                <div className='w-full flex flex-row justify-between'>
                                    <label>Категория</label>
                                    <input value={store.type} name='type' className='border w-48 p-1' type='text' onChange={handleChange} />
                                </div>
                                <div className='w-full flex flex-row justify-between'>
                                    <label>Количество</label>
                                    <input value={store.quantity} name='quantity' className='border w-48 p-1' type='number' onChange={handleChange} />
                                </div>
                                <div className='w-full flex flex-row justify-between'>
                                    <label>Цена</label>
                                    <input value={store.price} name='price' className='border w-48 p-1' type='number' onChange={handleChange} />
                                </div>
                                <div className="actions mt-7">
                                        <button className='p-2 rounded-lg bg-green-600 text-white' type='submit' onClick={() => {
                                            editItem();
                                            close();
                                        }}>
                                            Изменить
                                        </button>

                                </div>
                            </div>

                            <div className='w-1/2 flex flex-col justify-between items-start border border-l-2 border-t-0 border-r-0 border-b-0 pl-4'>
                                <div className='flex flex-row justify-between w-full'>
                                    <label>На продажу</label>
                                    <input value={toSelling} max={store.quantity} name='toSelling' className='border w-48 p-1' type='number' onChange={handleToSellingItemChange} />
                                </div>
                                    <button className='p-2 rounded-lg bg-green-600 text-white' disabled={toSelling.length === 0} onClick={() => toSellingNumber(id)}>Отправить</button>
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

                </div>
            )}
        </Popup>
    )
}

export default PopupComponentEdit