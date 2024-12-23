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
        console.log('user from Login', user);
        toast("You logged in successfully!");
      })
      .catch(error => {
        console.log('error from Login', error);
        toast("Error");
      });
  };

  return (
    <main className='w-full'>
      <div className='w-full flex flex-col items-center border max-w-5xl m-auto'>
        <p> FocusApp </p>

        <form>
          <div>
            <label htmlFor='email-address'>Email address</label>
            <input
              id='email-address'
              type='email'
              name='email'
              required
              value={email}
              placeholder='Email address'
              onChange={e => setEmail(e.target.value)} />
          </div>

          <div>
            <label htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              onClick={onLogin}
              className='text-green-800 font-bold'
            >
              Login
            </button>
          </div>
        </form>

        <p className="text-sm text-red-600 font-bold text-center">
          No account yet? {' '}
          <NavLink to="/signup">
            Sign up
          </NavLink>
        </p>
      </div>
    </main>
  )
}

export default LogIn