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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const authUser = getAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/store' element={<ProtectedRoute>
            <Store />
          </ProtectedRoute>} />
          <Route path='/sells' element={<ProtectedRoute>
            <Sells />
          </ProtectedRoute>} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
