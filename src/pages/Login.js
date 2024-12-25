import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('/');
        toast.success("Вы успешно вошли в приложение!");
      })
      .catch(error => {
        toast.error("Ошибка, проверьте данные", error);
      });
  };

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col items-center max-w-5xl m-auto mt-2'>
        <h1> Вход </h1>

        <form className='mt-2 flex flex-col gap-3'>
          <div className='flex flex-row items-center justify-between gap-3'>
            <label htmlFor='email-address'>Email</label>
            <input
              id='email-address'
              type='email'
              name='email'
              className='border px-2 py-1'
              required
              value={email}
              placeholder='Введите email'
              onChange={e => setEmail(e.target.value)} />
          </div>

          <div className='flex flex-row items-center gap-3'>
            <label htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className='border px-2 py-1'
              required
              placeholder="Введите пароль"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='text-center'>
            <button
              onClick={onLogin}
              className='text-green-800 font-bold'
            >
              Войти
            </button>
          </div>
        </form>

        <p className="text-sm mt-3 text-center">
          Нет аккаунта? {' '}
          <NavLink to="/signup" className={"text-red-600 font-bold"}>
            Зарегистрироваться
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default LogIn