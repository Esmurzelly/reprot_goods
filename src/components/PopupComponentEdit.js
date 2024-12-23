import { collection, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import { db } from '../firebase';
import Loader from './Loader';

const PopupComponentEdit = ({ id, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [store, setStore] = useState({
        name: '',
        type: '',
        quantity: '',
        price: '',
    });
    const [toSelling, setToSelling] = useState();

    const multipleQuantityToPrice = () => {
        setStore((prev) => ({
            ...prev,
            total_price: store.price * store.quantity
        }))
    }

    const handleChange = e => {
        const { name, value } = e.target;
        const newValue = name === 'price' || name === 'quantity' || name === 'total_price' ? Number(value) : value
        setStore((prev) => ({
            ...prev,
            [name]: newValue,
        }));
        console.log('store from HandleChange function', store)
    };

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

    // useEffect(() => {
    //     multipleQuantityToPrice();
    // }, [store.price, store.quantity, store.total_price]);

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
                                <button>Send</button>
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