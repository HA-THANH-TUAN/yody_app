import { Form, Input, TreeSelect } from 'antd';
import React from 'react';

const SizeAmountProductForm = () => {
  return (
    <Form layout={'vertical'} className='font-semibold'>
      <Form.Item label='Size name' name='' rules={[{ required: true }, { min: 1 }]}>
        <Input placeholder='product name' />
      </Form.Item>
      <Form.Item label='Slug' name='slug' rules={[{ required: true }, { min: 1 }]}>
        <Input placeholder='slug product' />
      </Form.Item>
      <Form.Item label='Category' name='categoryId' rules={[{ required: true }, { min: 1 }]}></Form.Item>
      <Form.Item label='Price' name='originPrice' rules={[{ required: true }, { min: 1 }]}>
        <Input placeholder='Price' />
      </Form.Item>
    </Form>
  );
};

export default SizeAmountProductForm;
