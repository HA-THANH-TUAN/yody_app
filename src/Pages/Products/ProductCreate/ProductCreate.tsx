import React, { useEffect, useRef, useState } from 'react';
import { Form, GetProp, message, Spin, UploadFile, UploadProps } from 'antd';

import { uid } from 'uid';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { getCategories, selectCategories, selectStatusGetCategories } from '../../../Features/categoryPageSlice';
import { recurtiveCat } from '../../../utils/common';
import { createProduct, selectStatusCreateProduct } from '../../../Features/createProductPageSlice';
import { PayloadCreateProduct } from '../../../Models/request';
import { ICommonResponse } from '../../../Models/response';
import FormCreateProduct from '../../../Components/FormCreateProduct';
import { RcFile } from 'antd/es/upload';
import { Color } from 'antd/es/color-picker';
import ModelFormCreateOptionProduct from './ModelFormCreateOptionProduct';
import { IProductCreatorDataForm } from './ProductCreatorForm';

export interface IFormCreateProductData {
  id: string;
  name: string;
  detail: string;
  price: string;
  slug: string;
  categoryId: string;
  status: string;
  options: IOptionProductData[];
}

export interface ISizeAmountData {
  id: string;
  size: string;
  amount: number;
  order: number;
}
export interface IProductImages extends UploadFile {
  order: number;
}
export interface IOptionProductData {
  id: string;
  colorName: string;
  colorCode: string;
  order: number;
  sizeAmounts: ISizeAmountData[];
  productImages: IProductImages[];
}

export interface ITypeActionModalOption {
  type: 'add' | 'edit';
  optionId?: string;
}

export const initialFormProductColor: IOptionProductData = {
  id: uid(24),
  colorName: 'Xanh',
  colorCode: '#1677ff',
  order: 0,
  sizeAmounts: [{ id: uid(24), size: 'M', amount: 0, order: 0 }],
  productImages: []
};
const initialFormCreateProduct: IFormCreateProductData = {
  id: uid(24),
  categoryId: '',
  detail: '',
  name: '',
  price: '',
  slug: '',
  status: '1',
  options: []
};
export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const ProductCreate: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const categories = useAppSelector(selectCategories);
  const statusGetCategories = useAppSelector(selectStatusGetCategories);
  const statusCreateProduct = useAppSelector(selectStatusCreateProduct);
  const timerIdSetOrder = useRef<{
    option: NodeJS.Timeout | null;
    optionImage: NodeJS.Timeout | null;
  }>({
    option: null,
    optionImage: null
  });
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, []);
  const nestedCategories = recurtiveCat([], categories);
  const isLoading = statusCreateProduct === 'pending';
  const [formProducColor] = Form.useForm<IOptionProductData>();
  const [formCreateProduct] = Form.useForm<IFormCreateProductData>();
  const [typeModalOption, setTypeModalOption] = useState<ITypeActionModalOption>(() => {
    formProducColor.setFieldsValue(initialFormProductColor);
    formCreateProduct.setFieldsValue(initialFormCreateProduct);
    return { type: 'add' };
  });
  const handleCreateProduct = (values: IFormCreateProductData) => {
    const productInfor: PayloadCreateProduct = {
      name: values.name,
      slug: values.slug,
      price: values.price.replace(/\./g, ''),
      detail: values.detail,
      categoryId: values.categoryId,
      status: values.status === '1' ? 1 : 0
    };
    const listUpload = values.options.map((option) => {
      const formData = new FormData();
      formData.append('color', option.colorName.trim());
      formData.append('colorCode', option.colorCode);
      formData.append('order', String(option.order));
      formData.append('sizeAmounts', JSON.stringify(option.sizeAmounts));
      option.productImages.forEach((dataUpload) => {
        formData.append('orderFiles', String(dataUpload.order));
        formData.append('files', dataUpload.originFileObj as File);
      });
      return formData;
    });
    const dataSend = {
      ...productInfor,
      uploads: listUpload
    };
    dispatch(createProduct(dataSend))
      .unwrap()
      .then(() => {
        messageApi.success({
          content: 'Successfully creating'
        });
        formCreateProduct.setFieldsValue(initialFormCreateProduct);
      })
      .catch((error: ICommonResponse) => {
        if (error.message === 'slug exist') {
          messageApi.error({
            content: "Can't create product because slug exist"
          });
        } else {
          messageApi.error({
            content: "Can't create product"
          });
        }
      });
  };
  const handleOnSubmitFormOptionModal = (values: IOptionProductData) => {
    if (typeModalOption.type === 'add') {
      formCreateProduct.setFieldValue('options', [
        ...formCreateProduct.getFieldValue('options'),
        { ...values, productImages: [] }
      ]);
      formProducColor.setFieldsValue(initialFormProductColor);
      setIsModalOpen(false);
    } else {
      const optionId = typeModalOption.optionId;
      if (optionId) {
        const options: IFormCreateProductData['options'] = formCreateProduct.getFieldValue('options');
        const shadowOptions = [...options];
        const indexEdit = shadowOptions.findIndex((option) => option.id === typeModalOption.optionId);
        if (indexEdit >= 0) {
          shadowOptions[indexEdit] = { ...shadowOptions[indexEdit], ...values };
          formCreateProduct.setFieldValue('options', shadowOptions);
        }
      }
      setIsModalOpen(false);
      formProducColor.setFieldsValue(initialFormProductColor);
    }
  };

  const handleAddOption = () => {
    setIsModalOpen(true);
    setTypeModalOption({ type: 'add' });
    formProducColor.setFieldsValue({
      ...initialFormProductColor,
      id: uid(24),
      order: formCreateProduct.getFieldValue('options').length
    });
  };

  const handleEditOption = (productColor: IOptionProductData, id: string) => {
    formProducColor.setFieldsValue(productColor);
    setIsModalOpen((state) => !state);
    setTypeModalOption({
      type: 'edit',
      optionId: id
    });
  };
  const handleSortOption = (optionId: string, value: string) => {
    clearTimeout(timerIdSetOrder.current.option ?? '');
    timerIdSetOrder.current.option = setTimeout(() => {
      const options: IOptionProductData[] = [...formCreateProduct.getFieldValue('options')];
      const indexOption = options.findIndex((value) => value.id === optionId);
      if (indexOption >= 0) {
        options[indexOption].order = value === '' ? NaN : Number(value);
        formCreateProduct.setFieldValue(
          'options',
          options.sort((a, b) => a.order - b.order)
        );
      }
    }, 150);
  };

  const handleRemoveOptionImage = (optionId: string, productImageId: string) => {
    const options: IOptionProductData[] = [...formCreateProduct.getFieldValue('options')];
    const indexOption = options.findIndex((option) => option.id === optionId);
    if (indexOption !== -1) {
      const optionItem = options[indexOption];
      optionItem.productImages = optionItem.productImages.filter((productImage) => productImage.uid !== productImageId);
      formCreateProduct.setFieldValue('options', options);
    }
  };

  const handleSortOptionImage = (optionId: string, productImageId: string, value: string) => {
    clearTimeout(timerIdSetOrder.current.optionImage ?? '');
    timerIdSetOrder.current.optionImage = setTimeout(() => {
      const options: IOptionProductData[] = [...formCreateProduct.getFieldValue('options')];
      const indexOption = options.findIndex((option) => option.id === optionId);
      if (indexOption !== -1) {
        const optionItem = options[indexOption];
        const indexProductImage = optionItem.productImages.findIndex(
          (productImage) => productImage.uid === productImageId
        );
        if (indexProductImage !== -1) {
          optionItem.productImages[indexProductImage].order = value === '' ? NaN : Number(value);
          formCreateProduct.setFieldValue('options', options);
        }
      }
    }, 200);
  };
  const handleDeleteOption = (id: string) => {
    const data: IFormCreateProductData['options'] = formCreateProduct.getFieldValue('options');
    const dataAfterRemove = data.filter((vl) => vl.id !== id);
    formCreateProduct.setFieldValue('options', dataAfterRemove);
  };
  const handleRemoveMedia = (file: UploadFile<any>, id: string) => {
    const fileId = file.uid;
    const data: IOptionProductData[] = formCreateProduct.getFieldValue('options');
    const optionsShadow = [...data];
    for (const optionShadow of optionsShadow) {
      if (optionShadow.id === id) {
        const dataNew = optionShadow.productImages.filter((file) => file.uid !== fileId);
        optionShadow.productImages = dataNew;
        break;
      }
    }
    formCreateProduct.setFieldValue('options', optionsShadow);
  };

  const actionUpload = (file: RcFile, id: string) => {
    return new Promise<string>((resolve, reject) => {
      const data: IOptionProductData[] = formCreateProduct.getFieldValue('options');
      const shawdow = [...data];
      const index = data.findIndex((vl) => vl.id === id);
      if (index >= 0) {
        if (shawdow[index].productImages.length < 6) {
          shawdow[index].productImages = [
            ...shawdow[index].productImages,
            { ...file, originFileObj: file, type: file.type, status: 'uploading', order: data.length }
          ];
          formCreateProduct.setFieldValue('options', shawdow);
          getBase64(file as FileType).then((url) => {
            const data: IOptionProductData[] = formCreateProduct.getFieldValue('options');
            const shawdow = [...data];
            const index = data.findIndex((vl) => vl.id === id);
            if (index >= 0) {
              const productImages = shawdow[index].productImages;
              productImages.find((upload, index) => {
                if (upload.uid === file.uid) {
                  upload.originFileObj = file;
                  upload.type = file.type;
                  upload.url = url;
                  upload.status = 'done';
                  upload.order = index;
                  return true;
                }
              });
              formCreateProduct.setFieldValue('options', shawdow);
            }
          });
        }
      }
    });
  };
  const actionReUpload = (file: RcFile, optionId: string, productImageId: string) => {
    return new Promise<string>((resolve, reject) => {
      const options: IOptionProductData[] = [...formCreateProduct.getFieldValue('options')];
      const indexOption = options.findIndex((vl) => vl.id === optionId);
      if (indexOption >= 0) {
        const optionItem = options[indexOption];
        const indexProductImage = optionItem.productImages.findIndex(
          (productImage) => productImage.uid === productImageId
        );
        if (indexProductImage >= 0) {
          let productImageItem = options[indexOption].productImages[indexProductImage];
          options[indexOption].productImages[indexProductImage] = {
            ...productImageItem,
            originFileObj: file,
            type: file.type,
            status: 'uploading',
            order: productImageItem.order
          };
          formCreateProduct.setFieldValue('options', options);
          getBase64(file as FileType).then((url) => {
            const options: IOptionProductData[] = [...formCreateProduct.getFieldValue('options')];
            const indexOption = options.findIndex((vl) => vl.id === optionId);
            if (indexOption >= 0) {
              const optionItem = options[indexOption];
              const indexProductImage = optionItem.productImages.findIndex(
                (productImage) => productImage.uid === productImageId
              );
              if (indexProductImage >= 0) {
                let productImageItem = options[indexOption].productImages[indexProductImage];
                options[indexOption].productImages[indexProductImage] = {
                  ...file,
                  originFileObj: file,
                  type: file.type,
                  url: url,
                  status: 'done',
                  order: productImageItem.order
                };
                formCreateProduct.setFieldValue('options', options);
              }
            }
          });
        }
      }
    });
  };
  const handleOnOkModalOption = () => {
    let codeColor = formProducColor.getFieldValue('colorCode');
    if (typeof codeColor !== 'string') {
      codeColor = '#' + codeColor.metaColor.originalInput;
    }
    formProducColor.setFieldValue('colorCode', codeColor);
    formProducColor.submit();
  };
  const handleOnCancelModalOption = () => {
    setIsModalOpen(false);
  };
  const handleOpenChangeCompleteColorPickup = (vl: Color) => {
    formProducColor.setFieldValue('colorCode', '#' + vl.toHex() ?? '');
  };

  // new

  const [productCreatorDataForm] = Form.useForm<IProductCreatorDataForm>();
  const actionProductUploadMedia = (file: RcFile, optionId: string) => {};
  const actionReProductUploadMedia = (file: RcFile, optionId: string, mediaId: string) => {};
  const onDeleteOptionProduct = (optionId: string) => {};
  const onEditOptionForm = (productOption: IOptionProductData, id: string) => {};
  const onRemoveMedia = (optionId: string, uid: string) => {};
  const onRemoveOptionProduct = (uid: string, optionId: string) => {};
  const onCreateProduct = (values: IProductCreatorDataForm) => {};
  const onAddOptionProduct = () => {};
  const onChangeMediaOrder = () => {};
  const onChangeOptionProductOrder = () => {};

  return (
    <div className='p-5 overflow-y-auto h-full'>
      {contextHolder}
      {isLoading && <Spin spinning={isLoading} fullscreen tip='Updating' size='large' />}
      <h2 className='text-center mb-5'>Create a new product</h2>
      <ProductCreatorForm
        categories={nestedCategories}
        statusGetCategories={statusGetCategories}
        productCreatorDataForm={}
        actionProductUploadMedia={actionProductUploadMedia}
        actionReProductUploadMedia={actionReProductUploadMedia}
        onDeleteOptionProduct={onDeleteOptionProduct}
        onEditOptionForm={onEditOptionForm}
        onRemoveMedia={onRemoveMedia}
        onRemoveOptionProduct={onRemoveOptionProduct}
        onCreateProduct={onCreateProduct}
        onAddOptionProduct={onAddOptionProduct}
        onChangeMediaOrder={onChangeMediaOrder}
        onChangeOptionProductOrder={onChangeOptionProductOrder}
      />
      {/* <FormCreateProduct
        statusGetCategories={statusGetCategories}
        formCreateProduct={formCreateProduct}
        options={options}
        onSortOption={handleSortOption}
        onAddOption={handleAddOption}
        onSubmitForm={handleCreateProduct}
        onSortOptionImage={handleSortOptionImage}
        onRemoveOptionImage={handleRemoveOptionImage}
        actionUpload={actionUpload}
        actionReUpload={actionReUpload}
        onDeleteOption={handleDeleteOption}
        onEditOption={handleEditOption}
        onRemoveMedia={handleRemoveMedia}
      /> */}

      <ModelFormCreateOptionProduct
        isModalOpen={isModalOpen}
        formProducColor={formProducColor}
        handleOnSubmitForm={handleOnSubmitFormOptionModal}
        handleSortOption={handleSortOption}
        handleOnOkModalOption={handleOnOkModalOption}
        handleOnCancelModalOption={handleOnCancelModalOption}
        handleOpenChangeCompleteColorPickup={handleOpenChangeCompleteColorPickup}
      />
    </div>
  );
};

export default ProductCreate;
