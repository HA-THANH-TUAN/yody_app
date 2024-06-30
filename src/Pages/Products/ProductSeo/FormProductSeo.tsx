import { Button, Form, FormInstance, Select, Skeleton } from 'antd';
import Input from 'antd/es/input/Input';
import React, { FC, ReactNode } from 'react';
import { IMetaSeoProduct } from '../../../Models/product';
import { DefaultOptionType } from 'antd/es/select';
export interface PayloadCreateMetaSeo extends Omit<IMetaSeoProduct, '_id'> {
  id: string;
}
interface IFormProductSeo {
  form: FormInstance<PayloadCreateMetaSeo>;
  loading: boolean;
  optionUrls: DefaultOptionType[];
  onSubmit: (values: PayloadCreateMetaSeo) => void;
}

const FormProductSeo: FC<IFormProductSeo> = ({ form, onSubmit, optionUrls, loading }) => {
  return (
    <Form
      name='wrap'
      onFinish={onSubmit}
      labelCol={{ flex: '80px' }}
      labelAlign='left'
      labelWrap
      wrapperCol={{ flex: 1 }}
      form={form}
    >
      <Form.Item hidden name='id'>
        <Input />
      </Form.Item>
      <Form.Item label='Description' name='description'>
        {loading ? (
          <Skeleton.Input block={true} active={true} size={'default'} />
        ) : (
          <Input placeholder='Description ...' />
        )}
      </Form.Item>
      <Form.Item label='Keywords' name='keywords'>
        {loading ? (
          <Skeleton.Input block={true} active={true} size={'default'} />
        ) : (
          <Input placeholder='Keywords ...' />
        )}
      </Form.Item>
      <Form.Item label='Web Url' name='url'>
        {loading ? (
          <Skeleton.Input block={true} active={true} size={'default'} />
        ) : (
          <Input placeholder='Link url web ...' />
        )}
      </Form.Item>
      <Form.Item label='Image Url' name='urlImage'>
        {loading ? (
          <Skeleton.Input block={true} active={true} size={'default'} />
        ) : (
          <Select className='h-20' options={optionUrls} placeholder='Image ...' />
        )}
      </Form.Item>
      <Form.Item className='flex justify-center'>
        {loading ? (
          <Skeleton.Button block={true} active={true} size={'default'} />
        ) : (
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default FormProductSeo;
