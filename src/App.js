import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './pages/Login'
import SignUp from './pages/Signup'
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Store from './pages/Store';
import Sells from './pages/Sells';
import Layout from './components/Layout'
import { getAuth } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';

function App() {
  // const [userData, setUserData] = useState();
  const authUser = getAuth();
  console.log('auth', authUser.currentUser);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUserData(user)
  //     } else {
  //       console.log('user is logged out')
  //     }
  //   })
  // }, []);

  // console.log('user data from App.js', userData)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          {authUser 
            ? <Route index element={<Home />} /> 
            :  <Route index element={<LogIn />} /> 
          }
          <Route index element={<Home />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/store' element={<Store />} />
          <Route path='/sells' element={<Sells />} />
          <Route path='/signup' element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
