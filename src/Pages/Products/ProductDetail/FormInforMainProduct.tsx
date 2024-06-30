import { Button, Col, FormInstance, Form, Input, Radio, Row, Spin, Select } from 'antd';
import React, { FC } from 'react';
import EditorDescription from '../ProductCreate/EditorDescription';
import { IProduct } from '../../../Models/product';
import { GrPowerReset } from 'react-icons/gr';
import { EnumCommon } from '../../../Models/common';
import { IFormDataEditProduct } from './ProductDetail';
import { optionRender, tagRender } from '../../../Components/FormCreateProduct';
import { DefaultOptionType } from 'antd/es/select';

interface IMainProductInforForm {
  formInforMain: FormInstance<IFormDataEditProduct>;
  statusGetProduct: EnumCommon['statusApiThunk'];
  statusGetCategories: EnumCommon['statusApiThunk'];
  categories: DefaultOptionType[];
  isActiveSubmit: boolean;
  onChangeNameProduct: () => void;
  onChangePrice: () => void;
  onResetForm: () => void;
  onBlurPrice: () => void;
  onSubmitForm: () => void;
}
const MainProductInforForm: FC<IMainProductInforForm> = ({
  formInforMain,
  statusGetProduct,
  statusGetCategories,
  categories,
  isActiveSubmit,
  onResetForm,
  onChangeNameProduct,
  onChangePrice,
  onSubmitForm,
  onBlurPrice
}) => {
  return (
    <Form form={formInforMain} layout='vertical' className='p-6'>
      <Row gutter={[20, 0]}>
        <Form.Item name='id' label='Id' hidden>
          <Input name='id'></Input>
        </Form.Item>
        <Col sm={24} md={12} xl={7}>
          <Form.Item name='name' label='Name'>
            <Input onChange={onChangeNameProduct} name='name'></Input>
          </Form.Item>
        </Col>
        <Col sm={24} md={12} xl={7}>
          <Form.Item name='slug' label='Slug'>
            <Input></Input>
          </Form.Item>
        </Col>
        <Col sm={24} md={12} xl={5}>
          <Form.Item name={'price'} label='Price'>
            <Input onChange={onChangePrice} onBlur={onBlurPrice}></Input>
          </Form.Item>
        </Col>
        <Col sm={24} md={12} xl={5}>
          <Form.Item name='categoryId' label='Category'>
            <Select
              disabled={statusGetCategories === 'pending'}
              mode='multiple'
              placeholder='Choose category'
              tagRender={tagRender}
              optionRender={optionRender}
              options={categories}
              onSelect={(vl: string) => {
                console.log('categoryId::::', vl);
              }}
              onChange={(vl) => {
                formInforMain.setFieldValue('categoryId', vl.length > 0 ? vl[vl.length - 1] : '');
              }}
            />
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
              dataDescription={formInforMain.getFieldValue('detail') ?? ''}
              setDataDesciption={(vl: string) => {
                formInforMain.setFieldValue('detail', vl);
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
              onClick={onSubmitForm}
            >
              Save
            </Button>
            <Button
              disabled={statusGetProduct === 'pending'}
              danger
              onClick={onResetForm}
              icon={<GrPowerReset />}
              type='text'
            ></Button>
          </div>
        </Col>
        <Col>
          {/* <Link to={`/products/product/option/${params.id}`} className='flex items-center'>
            <span className='mr-2 text-lg font-medium'>Option</span>{' '}
            <span className='text-xl'>
              <MdOutlineKeyboardDoubleArrowRight />
            </span>
          </Link> */}
        </Col>
      </Row>
    </Form>
  );
};

export default MainProductInforForm;
