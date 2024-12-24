import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const AddStoreItemPopup = ({ loading, setLoading }) => {
    const authUser = getAuth();
    const [store, setStore] = useState({
        name: '',
        type: '',
        quantity: '',
        price: '',
        total_price: '',
        date_creating: new Date()
    });

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

    const addItem = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const docRef = await addDoc(collection(db, "store"), {
                store: store,
                userId: authUser?.currentUser?.uid
            });

            console.log('docRef from addItem function', docRef);
            setLoading(false);
        } catch (error) {
            console.log('error of adding item', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        multipleQuantityToPrice();
    }, [store.price, store.quantity, store.total_price]);

    return (
        <Popup
            trigger={<button className="button"> Add item </button>}
            modal
            nested
        >
            {close => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="header"> Modal Title </div>
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
                            <div className='w-full flex flex-row justify-between'>
                                <label>Total price</label>
                                <input value={store.total_price} name='total_price' className='border w-48' type='number' onChange={handleChange} />
                            </div>
                            {/* <div className='w-full flex flex-row justify-between'>
                                <label>Date arriving</label>
                                <input name='date_arriving' className='border w-48' type='date' onChange={handleChange} />
                            </div> */}
                        </div>
                    </div>
                    <div className="actions">
                        {/* <Popup
                            trigger={<button className="button"> Trigger </button>}
                            position="top center"
                            nested
                        >
                            <span>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
                                magni omnis delectus nemo, maxime molestiae dolorem numquam
                                mollitia, voluptate ea, accusamus excepturi deleniti ratione
                                sapiente! Laudantium, aperiam doloribus. Odit, aut.
                            </span>
                        </Popup> */}

                        {/* <button
                            className="button"
                            onClick={() => {
                                console.log('modal closed ');
                                close();
                            }}
                        >
                            close modal
                        </button> */}

                        <button type='submit' onClick={(e) => {
                            addItem(e);
                            close();
                        }}>
                            Add item
                        </button>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default AddStoreItemPopup