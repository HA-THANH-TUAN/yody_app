import React, { useState } from 'react';
import { Button, Form, Input, Radio, Select, TreeSelect } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { FormInstance } from 'antd/es/form';
import { ICategory } from '../../../../Models/category';
import { CategoryCreationPayload } from '../../../../Models/request';
interface ICategoryEditorForm {
  categories: ICategory[];
  category: CategoryCreationPayload | null;
  form: FormInstance<CategoryCreationPayload>;
  onChangeForm: (changedValues: any, values: CategoryCreationPayload) => void;
  onFinish: (values: CategoryCreationPayload) => void;
  onReset: () => void;
}

interface SubmitButtonProps {
  form: FormInstance;
  children: string;
  category: CategoryCreationPayload | null;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ form, children, category }) => {
  const [submittable, setSubmittable] = React.useState<boolean>(false);
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then((values: CategoryCreationPayload) => {
        if (category) {
          const isChange =
            values.name !== category.name ||
            values.slug !== category.slug ||
            values.status !== category.status ||
            values.parentId === 'none'
              ? category.parentId !== null
              : values.parentId !== category.parentId;
          setSubmittable(isChange);
        }
      })
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type='primary' htmlType='submit' disabled={!submittable}>
      {children}
    </Button>
  );
};

const CategoryEditorForm: React.FC<ICategoryEditorForm> = ({
  categories,
  form,
  onChangeForm,
  onFinish,
  onReset,
  category
}) => {
  const categoriesTreeData = (categories: ICategory[]): DefaultOptionType[] => {
    return categories.map((cate) => ({
      label: <p className='p-1'>{cate.name}</p>,
      value: cate._id,
      disabled: cate.grade > 1,
      children: cate.categories === null ? [] : categoriesTreeData(cate.categories)
    }));
  };

  const treeCategoriesData = categoriesTreeData(categories);
  treeCategoriesData.unshift({
    label: <p className='p-1'>None</p>,
    value: 'none'
  });
  return (
    <>
      <h2 className='text-3xl text-center mb-4'>Detail</h2>
      <Form layout={'vertical'} form={form} onFinish={onFinish} onValuesChange={onChangeForm}>
        <Form.Item label='Name' name='name' rules={[{ required: true }, { min: 1 }]}>
          <Input placeholder='input placeholder' />
        </Form.Item>
        <Form.Item label='Slug' name='slug' rules={[{ required: true }, { min: 1 }]}>
          <Input placeholder='input placeholder' />
        </Form.Item>
        <Form.Item label='Parent category' name='parentId' rules={[{ required: true }, { min: 1 }]}>
          <TreeSelect treeData={treeCategoriesData} placeholder='Select parent category' treeDefaultExpandAll />
        </Form.Item>
        <Form.Item label='Status' name='status' rules={[{ required: true }, { min: 1 }]}>
          <Radio.Group>
            <Radio.Button value='active'>Active</Radio.Button>
            <Radio.Button value='unactive'>UnActive</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <div className='flex justify-center'>
            <SubmitButton category={category} form={form}>
              Update
            </SubmitButton>
            <Button onClick={onReset} type='default' className='ml-5'>
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default CategoryEditorForm;
