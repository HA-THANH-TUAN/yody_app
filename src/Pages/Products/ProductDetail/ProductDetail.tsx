import { Button, Col, Form, Input, Modal, Radio, RadioChangeEvent, Row, Spin, Upload, UploadFile } from 'antd';
import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, selectProduct, selectStatusGetProduct } from '../../../Features/productDetailPage';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { GrPowerReset } from 'react-icons/gr';
import { IProuductsMetaData } from '../../../Models/response';
import UploadImageProductDetail from './UploadImageProductDetail';
import FormUploadProductImage, { ButtonUpload } from '../ProductCreate/FormUploadProductImage';
import FormEditOption, { IFormEditOption } from './FormEditOption';
import { useForm } from 'antd/es/form/Form';
import { genSlug } from '../../../utils/common';
import {
  FileType,
  getBase64,
  IInformationProductColor,
  initialFormProductColor,
  IProductColorData,
  ITypeActionModalOption
} from '../ProductCreate/ProductCreate';
import ModelFormOptionProduct from '../../../Components/ModelFormOptionProduct';
import { RcFile } from 'antd/es/upload';
import EditorDescription from '../ProductCreate/EditorDescription';
import { uid } from 'uid';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';

interface IStateProduct {
  name: string;
  slug: string;
  price: string;
  status: '0' | '1' | '';
}

export interface IActionProduct {
  type: 'product' | 'upload-product-option' | 'sizeAmounts-product-option';
  action: 'edit' | 'delete';
}

interface IFormInforPartProduct {
  name: string;
  slug: string;
  price: string;
  status: '0' | '1';
  detail: string;
  addOptionData: IProductColorData[];
}
const ProductDetail = () => {
  const prams = useParams();
  const statusGetProduct = useAppSelector(selectStatusGetProduct);
  const product = useAppSelector(selectProduct);
  const [productShadow, setProductShadow] = useState<IProuductsMetaData | null>(null);
  const dispatch = useAppDispatch();
  const initialFieldProduct = (product?: IProuductsMetaData): IStateProduct => {
    return {
      name: product === null || product === undefined ? '' : product.name,
      slug: product === null || product === undefined ? '' : product.slug,
      price:
        product === null || product === undefined ? '' : product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
      status: product === null || product === undefined ? '' : product.status === 'published' ? '1' : '0'
    };
  };
  // const [formProduct, setFormProduct] = useState<IStateProduct>(initialFieldProduct());

  const [formInforPartProduct] = useForm<IFormInforPartProduct>();
  const [formProducColor] = useForm<IInformationProductColor>();
  useEffect(() => {
    if (statusGetProduct === 'fulfilled' && product) {
      formInforPartProduct.setFieldsValue({
        name: product.name,
        slug: product.slug,
        price: product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        status: product.status === 'published' ? '1' : '0',
        detail: product.detail ?? '',
        addOptionData: []
      });
      formProducColor.setFieldsValue(initialFormProductColor);
    }
  }, [statusGetProduct]);
  useEffect(() => {
    dispatch(getProduct(prams.id ?? ''))
      .unwrap()
      .then((data) => {
        const product = data.metadata;
        if (product) {
          // setFormProduct(initialFieldProduct(product));
          setProductShadow(product);
        }
      })
      .catch((err) => {
        console.log('....');
      });
  }, [prams.id]);
  useEffect(() => {
    if (statusGetProduct === 'fulfilled') {
      setProductShadow(product);
    }
  }, [statusGetProduct]);

  const handleOnchangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const vl = e.target.value;
    const vlMoney = vl
      .replace(/\./g, '')
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    formInforPartProduct.setFieldValue('price', vlMoney);
  };
  const handleOnBlurPrice = (e: FocusEvent<HTMLInputElement>) => {
    const vl = e.currentTarget.value;
    if (vl === '') {
      formInforPartProduct.setFieldValue('price', 0);
    } else {
      const removeDotVl = vl.replace(/\./g, '');
      const covertNumber = Number(removeDotVl);
      if (!(covertNumber > 0 && covertNumber !== Infinity)) {
        formInforPartProduct.setFieldValue('price', 0);
      }
    }
  };
  const handleOnchangeNameProduct = (e: ChangeEvent<HTMLInputElement>) => {
    formInforPartProduct.setFieldValue('slug', genSlug(e.target.value));
  };

  return (
    <div>
      {
        <Spin
          style={{ zIndex: 200000 }}
          spinning={product === null && statusGetProduct === 'pending'}
          fullscreen
          tip='Updating'
          size='large'
        />
      }
      <h2 className='text-center'>Product Detail</h2>
      <Form form={formInforPartProduct} layout='vertical' className='p-6'>
        <Row gutter={[20, 0]}>
          <Col sm={24} md={12} xl={7}>
            <Form.Item name='name' label='Name'>
              <Input onChange={handleOnchangeNameProduct} name='name'></Input>
            </Form.Item>
          </Col>
          <Col sm={24} md={12} xl={7}>
            <Form.Item name='slug' label='Slug'>
              <Input></Input>
            </Form.Item>
          </Col>
          <Col sm={24} md={12} xl={5}>
            <Form.Item name={'price'} label='Price'>
              <Input onChange={handleOnchangePrice} onBlur={handleOnBlurPrice}></Input>
            </Form.Item>
          </Col>
          <Col sm={24} md={12} xl={5}>
            <Form.Item name='status' label='Status' tooltip={{ title: 'Tooltip with customize icon' }}>
              <Radio.Group>
                <Radio value={'1'}>Active</Radio>
                <Radio value={'0'}>UnActive</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col sm={24} md={24}>
            <Form.Item name='detail' label='Description'>
              <EditorDescription
                dataDescription={formInforPartProduct.getFieldValue('detail')}
                setDataDesciption={(vl: string) => {
                  formInforPartProduct.setFieldValue('detail', vl);
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <div className='flex justify-center'>
              <Button
                disabled={statusGetProduct === 'pending'}
                type='primary'
                style={{ marginRight: '30px' }}
                //   onClick={handleUpdateCategory}
              >
                Save
              </Button>
              <Button
                disabled={statusGetProduct === 'pending'}
                danger
                onClick={() => {
                  if (product) {
                    // setFormProduct(initialFieldProduct(product));
                  }
                }}
                icon={<GrPowerReset />}
                type='text'
              ></Button>
            </div>
          </Col>
          <Col>
            <Link to={`/products/product/option/${prams.id}`} className='flex items-center'>
              <span className='mr-2 text-lg font-medium'>Option</span>{' '}
              <span className='text-xl'>
                <MdOutlineKeyboardDoubleArrowRight />
              </span>
            </Link>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProductDetail;
