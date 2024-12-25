import { addDoc, collection, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { IoMdClose } from "react-icons/io";

const AddStoreItemPopup = ({ setLoading, setStoreItems }) => {
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

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const newItem = {
                    id: docRef.id, // ID документа
                    ...docSnap.data() // Данные из документа
                };

                // Динамическое обновление списка storeItems
                setStoreItems(prevItems => [newItem, ...prevItems]);
                toast.success('Товар успешно добавлен!')
                setLoading(false);
            }
        } catch (error) {
            toast.error('Ошибка добавления товара:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        multipleQuantityToPrice();
    }, [store.price, store.quantity, store.total_price]);

    return (
        <Popup
            trigger={<button className="button p-2 text-center rounded-lg bg-green-600 text-sm text-white"> Добавить товар </button>}
            modal
            nested
        >
            {close => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        <IoMdClose />
                    </button>
                    <div className="header"> Добавление товара </div>
                    <div className="content flex flex-col">
                        <div className='w-1/2 flex flex-col items-start gap-2'>
                            <div className='w-full flex flex-row justify-between'>
                                <label>Название</label>
                                <input required value={store.name} name='name' className='border w-48 p-1' type='text' onChange={handleChange} />
                            </div>
                            <div className='w-full flex flex-row justify-between'>
                                <label>Категория</label>
                                <input required value={store.type} name='type' className='border w-48 p-1' type='text' onChange={handleChange} />
                            </div>
                            <div className='w-full flex flex-row justify-between'>
                                <label>Количество</label>
                                <input required value={store.quantity} name='quantity' className='border w-48 p-1' type='number' onChange={handleChange} />
                            </div>
                            <div className='w-full flex flex-row justify-between'>
                                <label>Цена</label>
                                <input required value={store.price} name='price' className='border w-48 p-1' type='number' onChange={handleChange} />
                            </div>
                            <div className='w-full flex flex-row justify-between'>
                                <label>Общая стоимость</label>
                                <input required value={store.total_price} name='total_price' className='border w-48 p-1' type='number' onChange={handleChange} />
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

                        <div className='w-1/2 flex justify-end'>
                            <button className='p-2 rounded-lg bg-green-600 text-white' type='submit' onClick={(e) => {
                                addItem(e);
                                close();
                            }}>
                                Добавить товар
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    )
}

export default AddStoreItemPopup