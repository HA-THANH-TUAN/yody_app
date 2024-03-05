import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FooterPage from './Containers/FooterPage';
import { Layout, theme } from 'antd';
import SiderBarPage from './Containers/SiderBarPage';
import HeaderPage from './Containers/HeaderPage';
import Home from './Pages/Home';
import { useAppDispatch, useAppSelector, useChangeSreen } from './app/hook';
import Redirect from './Components/Redirect';
import Category from './Pages/Products/ProductCategory';
import { Product } from './Pages/Products/Product';
import ProductCategory from './Pages/Products/ProductCategory';
import { selectScreenWidth, sreenWidth } from './Features/setting';

function App() {
  useAppSelector(({setting})=>setting.flagReset);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useAppDispatch();
  const screenWidth =useAppSelector(selectScreenWidth);
  useChangeSreen(()=>{dispatch(sreenWidth())}); 
  return (
    <div className="App relative" style={{height:"100vh"}}>
        <Layout style={{height:"100%"}} hasSider>
          <BrowserRouter>
            <SiderBarPage />
            <Layout style={{height:"100vh"}} className=' '>
              <HeaderPage colorBgContainer = {colorBgContainer}/>  
              <Routes>
                <Route path='/' element={<Home colorBgContainer ={colorBgContainer} borderRadiusLG ={borderRadiusLG}/>}/>
                <Route path='/products' element={<Redirect path='/products/product'/>}>
                  <Route path='product' element={<Product/>} />
                  <Route path='category' element={<ProductCategory/>}/>
                  <Route path='seo' element={<Home colorBgContainer ={colorBgContainer} borderRadiusLG ={borderRadiusLG}/>}/>
                  <Route path='colection' element={<Home colorBgContainer ={colorBgContainer} borderRadiusLG ={borderRadiusLG}/>}/>
                </Route>
              </Routes>
            </Layout>
          </BrowserRouter>
        </Layout>
    </div>
  );
}

export default App;
