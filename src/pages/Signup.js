import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success(`Новый пользователь ${user.email} создан!`)
        navigate('/login')
      })
      .catch(error => {
        toast.error(`Неверно введенные данные либо такой пользователь уже существует, ${error}`)
      })
  }

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col items-center max-w-5xl m-auto mt-2'>
        <h1> Регистрация </h1>

        <form className='mt-2 flex flex-col gap-3'>
          <div className='flex flex-row items-center justify-between gap-3'>
            <label htmlFor="email-address">Email</label>
            <input
              type="email"
              id='email-address'
              className='border px-2 py-1'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Введите email"
            />
          </div>

          <div className='flex flex-row items-center gap-3'>
            <label htmlFor="password">
              Пароль
            </label>
            <input
              type="password"
              label="Create password"
              value={password}
              className='border px-2 py-1'
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
            />
          </div>

          <button
            type="submit"
            className='text-green-800 font-bold'
            onClick={onSubmit}
          >
            Sign up
          </button>
        </form>

        <p className="text-sm mt-3 text-center">
          Уже зарегистрирован?{' '}
          <NavLink to="/login" className={"text-red-600 font-bold"}>
            Войти
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default SignUp