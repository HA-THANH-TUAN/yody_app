import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Layout, theme } from 'antd';
import SiderBarPage from './Containers/SiderBarPage';
import HeaderPage from './Containers/HeaderPage';
import Home from './Pages/Home';
import { useAppDispatch, useAppSelector, useChangeSreen } from './app/hook';
import Redirect from './Components/Redirect';
import Product from './Pages/Products/Product/Product';
import ProductCategory from './Pages/Products/ProductCategory';
import { selectScreenWidth, sreenWidth } from './Features/setting';
import CategoryDetail from './Pages/Products/CategoryDetail';
import ProductDetail from './Pages/Products/ProductDetail/ProductDetail';
import ProductCreate from './Pages/Products/ProductCreate/ProductCreate';
import React from 'react';
import ProductOptionDetail from './Pages/Products/Product/ProductOptionDetail';

const App = () => {
  useAppSelector(({ setting }) => setting.flagReset);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  const dispatch = useAppDispatch();
  const screenWidth = useAppSelector(selectScreenWidth);
  useChangeSreen(() => {
    dispatch(sreenWidth());
  });
  React.useEffect(() => {
    return () => {
      console.log('app unmount');
    };
  });
  return (
    <div className='App relative' style={{ height: '100vh' }}>
      <Layout style={{ height: '100%' }} hasSider>
        <BrowserRouter>
          <SiderBarPage />
          <Layout style={{ height: '100vh' }} className=' '>
            <HeaderPage />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/products' element={<Redirect path='/products/product' />}>
                <Route path='product' element={<Product />} />
                <Route path='product/create' element={<ProductCreate />} />
                <Route path='product/:id' element={<ProductDetail />} />
                <Route path='product/option/:id' element={<ProductOptionDetail />} />
                <Route path='category' element={<ProductCategory />} />
                <Route path='category/:id' element={<CategoryDetail />} />
                <Route path='seo' element={<Home />} />
                <Route path='colection' element={<Home />} />
              </Route>
            </Routes>
          </Layout>
        </BrowserRouter>
      </Layout>
    </div>
  );
};

export default App;
