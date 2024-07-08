import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Layout, theme } from 'antd';
import SiderBarPage from './Containers/SiderBarPage';
import HeaderPage from './Containers/HeaderPage';
import Home from './Pages/Home';
import { useAppDispatch, useAppSelector, useChangeSreen } from './app/hook';
import Redirect from './Components/Redirect';
import { selectScreenWidth, sreenWidth } from './Features/setting';
import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';
import ProductCategory from './Pages/Products/ProductCategory/ProductCategory';
import DetailCategory from './Pages/Products/ProductCategory/DetailCategory/DetailCategory';
import Product from './Pages/Products/Product/Product';
import DetailProduct from './Pages/Products/Product/DetailProduct/DetailProduct';
import ProductCreation from './Pages/Products/Product/CreationProduct/ProductCreation';
import './reset.css';

export interface IAppContext {
  socketProduct: Socket;
}
export const AppContext = createContext<IAppContext | null>(null);

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
    <AppContext.Provider
      value={{
        socketProduct: io('http://localhost:3008/admin/product')
      }}
    >
      <div className='App relative' style={{ height: '100vh' }}>
        <Layout style={{ height: '100%' }} hasSider>
          <BrowserRouter>
            <SiderBarPage />
            <Layout style={{ height: '100vh' }} className='flex flex-col'>
              <HeaderPage />
              <section className='h-[calc(100%-64px)] overflow-y-auto'>
                <div className='font-bold p-6'>
                  <div className='bg-white p-6'>
                    <Routes>
                      <Route path='/' element={<Home />} />
                      <Route path='/products' element={<Redirect path='/products/category' />}>
                        <Route path='product' element={<Product />} />
                        <Route path='product/:id' element={<DetailProduct />} />
                        <Route path='product/create' element={<ProductCreation />} />
                        {/* 
                  <Route path='product/create' element={<ProductCreate />} />
                  <Route path='product/:id' element={<ProductDetail />} />
                  <Route path='product-option/:id' element={<OptionProductDetail />} /> */}
                        <Route path='category' element={<ProductCategory />} />
                        <Route path='category/:id' element={<DetailCategory />} />
                        <Route path='*' element={<>Error</>} />
                        {/* <Route path='seo' element={<ProductSeo />} />
                  <Route path='colection' element={<Home />} />
                  <Route path='seo-product/:id' element={<ProductSeo />} /> */}
                      </Route>
                    </Routes>
                  </div>
                </div>
              </section>
            </Layout>
          </BrowserRouter>
        </Layout>
      </div>
    </AppContext.Provider>
  );
};

export default App;
