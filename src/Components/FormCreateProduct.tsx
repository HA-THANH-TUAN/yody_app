import { Button, Form, FormInstance, Input, Radio, Select, SelectProps } from 'antd';
import React, { FC } from 'react';
import { IFormCreateProductData, IProductColorData } from '../Pages/Products/ProductCreate/ProductCreate';
import { formatMoney, genSlug } from '../utils/common';
import EditorDescription from '../Pages/Products/ProductCreate/EditorDescription';
import FormUploadProductImage from '../Pages/Products/ProductCreate/FormUploadProductImage';
import { IoMdAdd } from 'react-icons/io';
import { DefaultOptionType } from 'antd/es/select';
import { RcFile, UploadFile } from 'antd/es/upload';

type TagRender = SelectProps['tagRender'];
type OptionRender = SelectProps['optionRender'];
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const tagRender: TagRender = (props) => {
  const { label, onClose } = props;

  let content = '';
  if (typeof label === 'string') {
    content = label.split('$')[1];
  }

  return <span className='ml-2'> {content}</span>;
};

const optionRender: OptionRender = (props) => {
  if (typeof props.label === 'string') {
    const [prefix, mainText] = props.label.split('$');
    const grade = prefix.split('.').length;
    if (props.label === 'All') {
      return <span className='font-medium'>All</span>;
    }
    return (
      <span style={{ marginLeft: `${grade * 1}rem` }}>
        <span className='mr-2'>{prefix}.</span>
        {mainText}
      </span>
    );
  }
};
export interface IFormCreateProduct {
  formCreateProduct: FormInstance<IFormCreateProductData>;
  handleSubmitForm: (values: IFormCreateProductData) => void;
  handleAddOption: () => void;
  options: DefaultOptionType[];
  statusGetCategories: 'pending' | 'rejected' | 'fulfilled' | 'idle';
  actionUpload: (file: RcFile, id: string) => Promise<string>;
  handleDeleteOption: (id: string) => void;
  handleEditOption: (productColor: IProductColorData, id: string) => void;
  handleRemoveMedia: (file: UploadFile<any>, id: string) => void;
}
const FormCreateProduct: FC<IFormCreateProduct> = ({
  formCreateProduct,
  options,
  handleSubmitForm,
  handleAddOption,
  statusGetCategories,
  actionUpload,
  handleDeleteOption,
  handleEditOption,
  handleRemoveMedia
}) => {
  return (
    <Form
      className='mx-auto'
      onFinish={handleSubmitForm}
      form={formCreateProduct}
      labelCol={{ span: 3 }}
      labelAlign={'left'}
      layout='horizontal'
    >
      <Form.Item name='name' label='Name'>
        <Input
          onBlur={(e) => {
            const data = e.currentTarget.value;
            formCreateProduct.setFieldValue('slug', genSlug(data));
          }}
        />
      </Form.Item>
      <Form.Item name='slug' label='Slug'>
        <Input />
      </Form.Item>
      <Form.Item name='categoryId' label='Category'>
        <Select
          disabled={statusGetCategories === 'pending'}
          mode='multiple'
          tagRender={tagRender}
          optionRender={optionRender}
          options={options}
          onSelect={(vl: string) => {
            formCreateProduct.setFieldValue('categoryId', vl);
          }}
        />
      </Form.Item>
      <Form.Item name='price' label='Price'>
        <Input
          onChange={(e) => {
            const vl = e.target.value.replace(/\./g, '');
            const price = Number(vl);
            if (!isNaN(price) && !(price === Infinity)) {
              formCreateProduct.setFieldValue('price', formatMoney(price));
            } else {
              formCreateProduct.setFieldValue('price', formatMoney(0));
            }
          }}
        />
      </Form.Item>
      <Form.Item name='status' label='Status'>
        <Radio.Group>
          <Radio value='1'> Active </Radio>
          <Radio value='0'> UnActive </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name='detail' label='Description'>
        <EditorDescription
          dataDescription={formCreateProduct.getFieldValue('detail')}
          setDataDesciption={(vl: string) => {
            formCreateProduct.setFieldValue('detail', vl);
          }}
        />
      </Form.Item>
      <Form.Item name={'options'} label='Color' valuePropName='fileList' getValueFromEvent={normFile}>
        <Form.List name='options'>
          {(fields, { add, remove, move }) => {
            return (
              <>
                {fields.map((props, index) => {
                  return (
                    <FormUploadProductImage
                      productColor={formCreateProduct.getFieldValue('options')[index]}
                      key={props.key}
                      actionUpload={actionUpload}
                      handleDeleteOption={handleDeleteOption}
                      handleEditOption={handleEditOption}
                      handleRemoveMedia={handleRemoveMedia}
                    />
                  );
                })}
              </>
            );
          }}
        </Form.List>
        <Button type='dashed' size='small' onClick={handleAddOption}>
          <IoMdAdd />
        </Button>
      </Form.Item>
      <Form.Item>
        <Button
          onClick={() => {
            formCreateProduct.submit();
          }}
          type='primary'
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormCreateProduct;
