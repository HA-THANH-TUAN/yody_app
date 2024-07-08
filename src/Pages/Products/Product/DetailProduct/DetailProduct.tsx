import { Button, Col, Row } from 'antd';
import React from 'react';
import SpinModal from '../../../../Components/SpinModal';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FaRegPlusSquare } from 'react-icons/fa';

const DetailProduct = () => {
  const nav = useNavigate();
  const params = useParams();
  return (
    <>
      {!(params && params.id?.length === 24) && <Navigate to={'/products/product'} />}
      <SpinModal isOpen={true} />
      <section className='bg-white'>
        <div className='mb-6 flex justify-center items-center'>
          <h1 className='text-center font-semibold text-4xl mr-4'>Detail Product</h1>
          <Button
            onClick={() => {
              nav('');
            }}
            type='primary'
            icon={<FaRegPlusSquare />}
          ></Button>
        </div>
        <div>
          <Row gutter={[30, 50]}>
            <Col sm={{ span: 24 }} lg={{ span: 12 }}>
              <div>
                <h2 className='text-3xl text-center mb-4 '>Structure</h2>
              </div>
            </Col>
            <Col sm={{ span: 24 }} lg={{ span: 12 }}>
              <div className=''></div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default DetailProduct;
