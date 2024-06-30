import { FormInstance } from 'antd/es/form/Form';
import React, { FC, useEffect } from 'react';
import { Button, Form, Input, Radio, Select } from 'antd';
import { genSlug, recurtiveCat } from '../../../utils/common';
import { optionRender, tagRender } from '../../../Components/FormCreateProduct';
import { EnumCommon } from '../../../Models/common';
import { ICategoryResponse } from '../../../Models/response';
import { PayloadCreateCategory } from '../../../Models/request';

export interface IFormCreateCategory {
  dataDefaultForm: PayloadCreateCategory;
  statusGetCategories: EnumCommon['statusApiThunk'];
  categories: ICategoryResponse[];
  formCreateCategory: FormInstance<PayloadCreateCategory>;
  onCreateCategory: (payload: PayloadCreateCategory) => void;
}

const FormCreateCategory: FC<IFormCreateCategory> = ({
  dataDefaultForm,
  statusGetCategories,
  categories,
  formCreateCategory,
  onCreateCategory
}) => {
  useEffect(() => {
    formCreateCategory.setFieldsValue(dataDefaultForm);
  }, []);
  const options = recurtiveCat([], categories).filter(
    ({ label }) => (label as string).split('$')[0].split('.').length !== 3
  );
  return (
    <section className='overflow-hidden py-3 px-5 rounded-md bg-[white]'>
      <h2 className='text-center mb-4 text-2xl font-semibold'>Create Category</h2>
      <Form
        form={formCreateCategory}
        onFinish={onCreateCategory}
        layout='horizontal'
        labelCol={{ flex: '60px' }}
        labelAlign='left'
      >
        <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please name !' }]}>
          <Input
            placeholder='Name ....'
            onChange={(e) => {
              formCreateCategory.setFieldValue('slug', genSlug(e.target.value));
            }}
          />
        </Form.Item>
        <Form.Item name='slug' label='Slug' rules={[{ required: true, message: 'Please slug !' }]}>
          <Input placeholder='Slug ...' />
        </Form.Item>
        <Form.Item label='Parent' name='parentId'>
          <Select
            disabled={statusGetCategories === 'pending'}
            placeholder={'Select parent category ...'}
            mode='multiple'
            tagRender={tagRender}
            optionRender={optionRender}
            options={[{ label: '$Top level category', value: '' }, ...options]}
            value={[formCreateCategory.getFieldValue('parentId')]}
            onSelect={(vl: string) => {
              formCreateCategory.setFieldValue('parentId', vl);
            }}
          />
        </Form.Item>
        <Form.Item name='status' label='Status'>
          <Radio.Group>
            <Radio value={'1'}>Active</Radio>
            <Radio value={'0'}>Deleted</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className='flex justify-center mt-6'>
          <Button
            onClick={() => {
              formCreateCategory.submit();
            }}
            type='primary'
          >
            Create
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default FormCreateCategory;
