import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './pages/Login'
import SignUp from './pages/Signup'
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signup' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
