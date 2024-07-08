import React, { useEffect } from 'react';
import ProductCreationForm from './ProductCreationForm/ProductCreationFom';
import { IBaseProduct } from '../../../../Models/product';
import { useForm } from 'antd/es/form/Form';
import { useAppDispatch, useAppSelector } from '../../../../app/hook';
import { getCategories, selectCategories } from '../../../../Features/categoryPageSlice';
import { formatMoney, genSlug } from '../../../../utils/common';
import { Button } from 'antd';
import SubmitButton from './SubmitButton';
import VariantProductCreationForm from './ProductCreationForm/VariantProductCreation/VariantProductCreation';
import VariantProductCreation from './ProductCreationForm/VariantProductCreation/VariantProductCreation';

export interface IBaseProductCreationForm
  extends Omit<IBaseProduct, '_id' | 'originPrice' | 'categoryId' | 'updatedAt' | 'createdAt'> {
  categoryId?: IBaseProduct['categoryId'];
  originPrice?: string;
}

const inintialBaseProductForm: IBaseProductCreationForm = {
  categoryId: undefined,
  description: 'Ha Thanh Tuan',
  gender: 'all',
  name: '',
  originPrice: formatMoney(300000),
  slug: '',
  status: 'active'
};
const ProductCreation = () => {
  const [baseProductCreationForm] = useForm<IBaseProductCreationForm>();
  const categories = useAppSelector(selectCategories);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!categories) {
      dispatch(getCategories());
    }
    baseProductCreationForm.setFieldsValue(inintialBaseProductForm);
  }, []);
  const handleChangeForm = (changedValues: any, values: IBaseProductCreationForm) => {
    const name = changedValues.name;
    console.log({
      changedValues,
      values
    });
    const priceStr: string | undefined = changedValues.originPrice;
    if (name) {
      const slug = genSlug(name);
      baseProductCreationForm.setFieldValue('slug', slug);
    }
    if (priceStr !== undefined) {
      const regex = new RegExp(/^[0-9.]+$/);
      const isRight = regex.test(priceStr);
      if (isRight) {
        const price = priceStr.replace(/^0+/, '').replaceAll('.', '');
        baseProductCreationForm.setFieldValue('originPrice', formatMoney(price));
      } else {
        const prevOriginPrice = values.originPrice;
        const isRight = regex.test(prevOriginPrice ?? '');
        if (isRight && prevOriginPrice) {
          baseProductCreationForm.setFieldValue(
            'originPrice',
            formatMoney(prevOriginPrice.replace(/^0+/, '').replaceAll('.', ''))
          );
        } else {
          baseProductCreationForm.setFieldValue('originPrice', formatMoney(0));
        }
      }
    }
  };
  const handleFinishForm = (values: IBaseProductCreationForm) => {
    console.log('handleFinishForm :::: values ', values);
  };
  const handleResetForm = () => {
    baseProductCreationForm.setFieldsValue(inintialBaseProductForm);
  };

  console.log('ProductCreation ::: ');
  return (
    <div>
      <ProductCreationForm
        onFinish={handleFinishForm}
        onReset={handleResetForm}
        categories={categories ?? []}
        form={baseProductCreationForm}
        onChangeForm={handleChangeForm}
      />
      <VariantProductCreation />
      <div className='flex justify-center'>
        <SubmitButton form={baseProductCreationForm}>Create</SubmitButton>
        <Button onClick={handleResetForm} type='default' className='ml-5'>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ProductCreation;
