import { Button, Col, Form, FormInstance, Input, Radio, Row, SelectProps } from 'antd';
import Select, { DefaultOptionType } from 'antd/es/select';
import React, { FC } from 'react';
import { EnumCommon } from '../../../Models/common';
import { RcFile } from 'antd/es/upload';
import { IOptionProductData } from './ProductCreate';
import { IoMdAdd } from 'react-icons/io';
import { formatMoney, genSlug } from '../../../utils/common';
import EditorDescription from './EditorDescription';

export interface IProductCreatorDataForm {
  id: string;
  name: string;
  detail: string;
  price: string;
  slug: string;
  categoryId: string;
  status: string;
  options: IOptionProductData[];
}

interface IProductCreatorForm {
  categories: DefaultOptionType[];
  statusGetCategories: EnumCommon['statusApiThunk'];
  productCreatorDataForm: FormInstance<IProductCreatorDataForm>;
  actionProductUploadMedia: (file: RcFile, optionId: string) => Promise<string>;
  actionReProductUploadMedia: (file: RcFile, optionId: string, mediaId: string) => Promise<string>;
  onDeleteOptionProduct: (optionId: string) => void;
  onEditOptionForm: (productOption: IOptionProductData, id: string) => void;
  onRemoveMedia: (optionId: string, uid: string) => void;
  onRemoveOptionProduct: (uid: string, optionId: string) => void;
  onCreateProduct: (values: IProductCreatorDataForm) => void;
  onAddOptionProduct: () => void;
  onChangeMediaOrder: () => void;
  onChangeOptionProductOrder: () => void;
}

type TagRender = SelectProps['tagRender'];
type OptionRender = SelectProps['optionRender'];
const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
export const tagRender: TagRender = (props) => {
  const { label, onClose } = props;

  let content = '';
  if (typeof label === 'string') {
    content = label.split('$')[1];
  }

  return <span className='ml-2'> {content}</span>;
};

export const optionRender: OptionRender = (props) => {
  if (typeof props.label === 'string') {
    const [prefix, mainText] = props.label.split('$');
    const grade = prefix.split('.').length;
    if (props.label === 'All' || props.label === 'None') {
      return <span className='font-medium'>{props.label}</span>;
    }
    return (
      <span style={{ marginLeft: `${grade * 1}rem` }}>
        <span className='mr-2'>{prefix}.</span>
        {mainText}
      </span>
    );
  }
};

const ProductCreatorForm: FC<IProductCreatorForm> = ({
  categories,
  statusGetCategories,
  productCreatorDataForm,
  actionProductUploadMedia,
  actionReProductUploadMedia,
  onDeleteOptionProduct,
  onEditOptionForm,
  onRemoveMedia,
  onRemoveOptionProduct,
  onCreateProduct,
  onAddOptionProduct,
  onChangeMediaOrder,
  onChangeOptionProductOrder
}) => {
  return (
    <Form className='mx-auto' onFinish={onCreateProduct} form={productCreatorDataForm} layout='vertical'>
      <Row gutter={[20, 20]}>
        <Col sm={{ span: 24 }} xl={{ span: 24 }}>
          <div className='bg-white px-5 pt-3 rounded-md'>
            <h2 className='text-center text-lg font-medium'>General Information</h2>
            <Row gutter={[20, 20]}>
              <Form.Item name='id' hidden></Form.Item>
              <Col sm={{ span: 12 }}>
                <Form.Item name='name' label={<span className='font-medium'>Name</span>}>
                  <Input
                    onBlur={(e) => {
                      const data = e.currentTarget.value;
                      productCreatorDataForm.setFieldValue('slug', genSlug(data));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item name='slug' label={<span className='font-medium'>Slug</span>}>
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item name='categoryId' label={<span className='font-medium'>Category</span>}>
                  <Select
                    disabled={statusGetCategories === 'pending'}
                    mode='multiple'
                    tagRender={tagRender}
                    optionRender={optionRender}
                    options={categories}
                    onSelect={(vl: string) => {
                      productCreatorDataForm.setFieldValue('categoryId', vl);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item name='price' label={<span className='font-medium'>Price</span>}>
                  <Input
                    onChange={(e) => {
                      const vl = e.target.value.replace(/\./g, '');
                      const price = Number(vl);
                      if (!isNaN(price) && !(price === Infinity)) {
                        productCreatorDataForm.setFieldValue('price', formatMoney(price));
                      } else {
                        productCreatorDataForm.setFieldValue('price', formatMoney(0));
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item name='status' label={<span className='font-medium'>Status</span>}>
                  <Radio.Group>
                    <Radio value='1'> Active </Radio>
                    <Radio value='0'> UnActive </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Form.Item name='detail' label={<span className='font-medium'>Description</span>}>
                  <EditorDescription
                    dataDescription={productCreatorDataForm.getFieldValue('detail')}
                    setDataDesciption={(vl: string) => {
                      productCreatorDataForm.setFieldValue('detail', vl);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={{ span: 24 }} xl={{ span: 24 }}>
          <div className='bg-white px-5 pt-3 rounded-md'>
            <h2 className='text-center text-lg font-medium'>
              <span>ProductOptions</span>{' '}
              <Button type='dashed' size='small' onClick={onAddOptionProduct}>
                <IoMdAdd />
              </Button>
            </h2>
            <Form.Item name={'options'} valuePropName='fileList' getValueFromEvent={normFile}>
              <Form.List name='options'>
                {(fields) => {
                  return (
                    <>
                      {fields.map((props, index) => {
                        return (
                          <div></div>
                          // <FormUploadProductImage
                          //   key={formCreateProduct.getFieldValue('options')?.[index].id}
                          //   onAddUploadNewMediaUrl={() => {}}
                          //   propCols={{ sm: 4 }}
                          //   onSortOption={onSortOption}
                          //   onSortOptionImage={onSortOptionImage}
                          //   onRemoveOptionImage={onRemoveOptionImage}
                          //   productColor={formCreateProduct.getFieldValue('options')[index]}
                          //   actionUpload={actionUpload}
                          //   actionReUpload={actionReUpload}
                          //   onDeleteOption={onDeleteOption}
                          //   onEditOption={onEditOption}
                          //   onRemoveMedia={onRemoveMedia}
                          // />
                        );
                      })}
                    </>
                  );
                }}
              </Form.List>
            </Form.Item>
          </div>
          {productCreatorDataForm.getFieldValue('options').length > 0 && (
            <Button type='dashed' size='small' onClick={onAddOptionProduct}>
              <IoMdAdd />
            </Button>
          )}
        </Col>
      </Row>

      <Form.Item className='mt-5 flex justify-center'>
        <Button
          onClick={() => {
            productCreatorDataForm.submit();
          }}
          type='primary'
        >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductCreatorForm;
