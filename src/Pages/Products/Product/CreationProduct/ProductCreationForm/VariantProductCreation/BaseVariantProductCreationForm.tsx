import { ColorPicker, Form, Input, InputNumber } from 'antd';
import React, { FC } from 'react';
import { IVariantProduct } from '../../../../../../Models/product';
interface IBaseVariantProductCreationForm {}
interface IVariantProductCreationFormData extends Omit<IVariantProduct, '_id |productId |mediaUrls |sizeAmounts '> {}
const BaseVariantProductCreationForm: FC<IBaseVariantProductCreationForm> = () => {
  return (
    <Form layout={'vertical'}>
      <Form.Item
        label={<span className='font-semibold'>Variant code</span>}
        name='variantProductCode'
        rules={[{ required: true }, { min: 1 }]}
      >
        <Input placeholder='Variant code' />
      </Form.Item>
      <Form.Item
        label={<span className='font-semibold'>Color name</span>}
        name='variantCode'
        rules={[{ required: true }, { min: 1 }]}
      >
        <Input placeholder='Color name' />
      </Form.Item>
      <Form.Item
        label={<span className='font-semibold'>Color code</span>}
        name='colorCode'
        rules={[{ required: true }, { min: 1 }]}
      >
        <ColorPicker className='font-medium' showText />
      </Form.Item>
      <Form.Item label={<span className='font-semibold'>Order</span>} name='order' rules={[{ required: true }]}>
        <InputNumber placeholder='order' />
      </Form.Item>
    </Form>
  );
};

export default BaseVariantProductCreationForm;
