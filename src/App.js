import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './pages/Login'
import SignUp from './pages/Signup'
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Store from './pages/Store';
import Sells from './pages/Sells';
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/store' element={<Store />} />
          <Route path='/sells' element={<Sells />} />
          <Route path='/signup' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
