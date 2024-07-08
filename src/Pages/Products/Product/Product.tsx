import React from 'react';
import SpinModal from '../../../Components/SpinModal';
import { Button, Col, Row } from 'antd';
import { FaRegPlusSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FilterProduct from './FilterProduct';
import TableProduct from './TableProduct';

const Product = () => {
  const nav = useNavigate();
  const toCreationProductPage = () => {
    nav('/products/product/create');
  };
  return (
    <>
      <SpinModal isOpen={false} />
      <section className='bg-white'>
        <div className='mb-6 flex justify-center items-center'>
          <h1 className='text-center font-semibold text-4xl mr-4'>Product</h1>
          <Button onClick={toCreationProductPage} type='primary' icon={<FaRegPlusSquare />}></Button>
        </div>
        <div>
          <FilterProduct />
          <TableProduct />
        </div>
      </section>
    </>
  );
};

export default Product;
