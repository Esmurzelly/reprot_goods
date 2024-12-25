import React from 'react'
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='mt-3'>
      <h1 className='text-center text-2xl text-red-500 font-medium'>Страница не найдена!</h1>
      <button className='p-2 w-28 text-center rounded-lg bg-red-600 text-sm text-white' onClick={() => navigate(-1)}>Назад</button>
    </div>
  )
}

export default NotFound