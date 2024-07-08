import { Button, Collapse, Form, FormInstance, Input, Radio, TreeSelect } from 'antd';
import { ICategory } from '../../../../../Models/category';
import { DefaultOptionType } from 'antd/es/select';
import { IBaseProductCreationForm } from '../ProductCreation';
import { useEffect, useRef, useState } from 'react';
import './ProductCreationForm.css';
import EditorDescription from '../EditorDescription';
import { formatMoney } from '../../../../../utils/common';

interface IProductCreationForm {
  categories: ICategory[];
  form: FormInstance<IBaseProductCreationForm>;
  onChangeForm: (changedValues: any, values: IBaseProductCreationForm) => void;
  onFinish: (values: IBaseProductCreationForm) => void;
  onReset: () => void;
}

const ProductCreationForm: React.FC<IProductCreationForm> = ({ categories, form, onChangeForm, onFinish, onReset }) => {
  const categoriesTreeData = (categories: ICategory[]): DefaultOptionType[] => {
    return categories.map((cate) => ({
      label: <p className='p-1'>{cate.name}</p>,
      value: cate._id,
      children: cate.categories === null ? [] : categoriesTreeData(cate.categories)
    }));
  };
  const treeCategoriesData = categoriesTreeData(categories);
  return (
    <section className='productCreationForm-component'>
      <h2 className='text-3xl text-center mb-4'>Create Product</h2>
      <Form layout={'vertical'} className='font-semibold' form={form} onFinish={onFinish} onValuesChange={onChangeForm}>
        <Form.Item label='Name' name='name' rules={[{ required: true }, { min: 1 }]}>
          <Input placeholder='product name' />
        </Form.Item>
        <Form.Item label='Slug' name='slug' rules={[{ required: true }, { min: 1 }]}>
          <Input placeholder='slug product' />
        </Form.Item>
        <Form.Item label='Category' name='categoryId' rules={[{ required: true }, { min: 1 }]}>
          <TreeSelect treeData={treeCategoriesData} placeholder='Select parent category' treeDefaultExpandAll />
        </Form.Item>
        <Form.Item label='Price' name='originPrice' rules={[{ required: true }, { min: 1 }]}>
          <Input placeholder='Price' />
        </Form.Item>
        <Form.Item label='Gender' name='gender' rules={[{ required: true }, { min: 1 }]}>
          <Radio.Group className='font-normal'>
            <Radio value='male'>Male</Radio>
            <Radio value='female'>Female</Radio>
            <Radio value='all'>All</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='Status' name='status' rules={[{ required: true }, { min: 1 }]}>
          <Radio.Group className='font-normal'>
            <Radio value='active'>Active</Radio>
            <Radio value='unactive'>UnActive</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='Description' name={'description'} rules={[{ required: true }, { min: 1 }]}>
          <EditorDescription initial={''} />
        </Form.Item>
      </Form>
    </section>
  );
};

export default ProductCreationForm;
