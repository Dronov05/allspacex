import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import UserPage from "./pages/UserPage";
import AdsListPage from "./pages/AdsListPage";
import AdPage from "./pages/AdPage";
import CreateEditAdPage from "./pages/CreateEditAdPage";
import OrdersPage from "./pages/OrdersPage";

function App() {

    const server_host = process.env.NODE_ENV === 'development' ? 'http://localhost:9001' : 'https://api.allspacex.ru'
    // const server_host = process.env.NODE_ENV === 'development' ? 'https://api.allspacex.ru'  : 'http://localhost:9001'

  return (
    <Routes>
        <Route path='/' element={<Layout server_host={server_host} />} >
            <Route index element={<Home />} />
            <Route path='/login' element={<Login server_host={server_host} />} />
            <Route path='/signup' element={<Signup server_host={server_host} />} />
            <Route path='/users' element={<Users server_host={server_host} />} />
            <Route path='/users/:id' element={<UserPage server_host={server_host} />} />
            <Route path='/dashboard' element={<Dashboard server_host={server_host} />} />
            <Route path='/admin' element={<Admin server_host={server_host} />} />
            <Route path='/ads/' element={<AdsListPage server_host={server_host} />} />
            <Route path='/ads/category/:category' element={<AdsListPage server_host={server_host} />} />
            <Route path='/ads/:id' element={<AdPage server_host={server_host} />} />
            <Route path='/ads/create' element={<CreateEditAdPage server_host={server_host} />} />
            <Route path='/ads/edit/:id' element={<CreateEditAdPage server_host={server_host} />} />
            <Route path='/orders' element={<OrdersPage server_host={server_host} />} />
        </Route>

    </Routes>
  );
}

export default App;
