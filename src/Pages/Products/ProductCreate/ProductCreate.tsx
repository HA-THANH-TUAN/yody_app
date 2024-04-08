import React, { FC, useEffect, useState } from 'react';
import { Form, GetProp, message, Spin, UploadFile, UploadProps } from 'antd';
import FormUploadProductImage from './FormUploadProductImage';
import { IoMdAdd } from 'react-icons/io';
import { uid } from 'uid';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { getCategories, selectCategories, selectStatusGetCategories } from '../../../Features/categoryPageSlice';
import { recurtiveCat } from '../../../utils/common';
import { createProduct, selectStatusCreateProduct } from '../../../Features/createProductPageSlice';
import { PayloadCreateProduct } from '../../../Models/request';
import { ICommonResponse } from '../../../Models/response';
import ModelFormOptionProduct from '../../../Components/ModelFormOptionProduct';
import FormCreateProduct from '../../../Components/FormCreateProduct';
import { RcFile } from 'antd/es/upload';
import { Color } from 'antd/es/color-picker';

export interface IFormCreateProductData {
  name: string;
  detail: string;
  price: string;
  slug: string;
  categoryId: string;
  status: string;
  options: IProductColorData[];
}

export interface IInformationProductColor {
  id: string;
  name: string;
  codeProduct: string;
  sizeAmounts: { id: string; size: string; amount: number }[];
  codeColor: string;
}
export interface IProductColorData extends IInformationProductColor {
  data: UploadFile[];
}
export interface ITypeActionModalOption {
  type: 'add' | 'edit';
  optionId?: string;
}

export const initialFormProductColor: IInformationProductColor = {
  id: uid(24),
  codeProduct: 'AYJBUHH',
  codeColor: '#1677ff',
  sizeAmounts: [{ id: uid(24), size: 'M', amount: 0 }],
  name: 'Xanh'
};
const initialFormCreateProduct: IFormCreateProductData = {
  categoryId: '',
  detail: '',
  name: 'Áo Polo Nữ Tay Ngắn',
  price: '400.000',
  slug: 'ao-polo-nu-tay-ngan',
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
  // productMain
  // redux varible
  const categories = useAppSelector(selectCategories);
  const statusGetCategories = useAppSelector(selectStatusGetCategories);
  const statusCreateProduct = useAppSelector(selectStatusCreateProduct);
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, []);
  const options = recurtiveCat([], categories);
  const isLoading = statusCreateProduct === 'pending';
  const [formProducColor] = Form.useForm<IInformationProductColor>();
  const [formCreateProduct] = Form.useForm<IFormCreateProductData>();
  const [typeModalOption, setTypeModalOption] = useState<ITypeActionModalOption>(() => {
    formProducColor.setFieldsValue(initialFormProductColor);
    formCreateProduct.setFieldsValue(initialFormCreateProduct);
    return { type: 'add' };
  });
  const handleCreateProduct = (values: IFormCreateProductData) => {
    console.log('handleCreateProduct:::', values);
    const productInfor: PayloadCreateProduct = {
      name: values.name,
      slug: values.slug,
      price: values.price.replace(/\./g, ''),
      detail: values.detail,
      categoryId: values.categoryId,
      status: values.status === '1' ? 'published' : 'unPublished'
    };
    const listUpload = values.options.map((option) => {
      const formData = new FormData();
      formData.append('color', option.name.trim());
      formData.append('colorCode', option.codeColor);
      formData.append('sizeAmounts', JSON.stringify(option.sizeAmounts));
      option.data.forEach((dataUpload) => {
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
  const handleOnSubmitFormOptionModal = (values: IInformationProductColor) => {
    if (typeModalOption.type === 'add') {
      formCreateProduct.setFieldValue('options', [
        ...formCreateProduct.getFieldValue('options'),
        { ...values, id: uid(24), data: [] }
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
    formProducColor.setFieldsValue(initialFormProductColor);
  };

  const handleEditOption = (productColor: IProductColorData, id: string) => {
    formProducColor.setFieldsValue(productColor);
    setIsModalOpen((state) => !state);
    setTypeModalOption({
      type: 'edit',
      optionId: id
    });
  };
  const handleDeleteOption = (id: string) => {
    const data: IFormCreateProductData['options'] = formCreateProduct.getFieldValue('options');
    const dataAfterRemove = data.filter((vl) => vl.id !== id);
    formCreateProduct.setFieldValue('options', dataAfterRemove);
  };
  const handleRemoveMedia = (file: UploadFile<any>, id: string) => {
    const fileId = file.uid;
    const data: IProductColorData[] = formCreateProduct.getFieldValue('options');
    const optionsShadow = [...data];
    for (const optionShadow of optionsShadow) {
      if (optionShadow.id === id) {
        const dataNew = optionShadow.data.filter((file) => file.uid !== fileId);
        optionShadow.data = dataNew;
        break;
      }
    }
    formCreateProduct.setFieldValue('options', optionsShadow);
  };

  const actionUpload = (file: RcFile, id: string) => {
    return new Promise<string>((resolve, reject) => {
      const data: IProductColorData[] = formCreateProduct.getFieldValue('options');
      const shawdow = [...data];
      const index = data.findIndex((vl) => vl.id === id);
      if (index >= 0) {
        shawdow[index].data = [
          ...shawdow[index].data,
          { ...file, originFileObj: file, type: file.type, status: 'uploading' }
        ];
        formCreateProduct.setFieldValue('options', shawdow);
      }

      getBase64(file as FileType).then((url) => {
        const data: IProductColorData[] = formCreateProduct.getFieldValue('options');
        const shawdow = [...data];
        const index = data.findIndex((vl) => vl.id === id);
        if (index >= 0) {
          for (const upload of shawdow[index].data) {
            if (upload.uid === file.uid) {
              upload.originFileObj = file;
              upload.type = file.type;
              upload.url = url;
              upload.status = 'done';
              resolve('OK');
              break;
            }
          }
          formCreateProduct.setFieldValue('options', shawdow);
        }
      });
    });
  };
  const handleOnOkModalOption = () => {
    let codeColor = formProducColor.getFieldValue('codeColor');
    if (typeof codeColor !== 'string') {
      codeColor = codeColor.metaColor.originalInput;
    }
    formProducColor.setFieldValue('codeColor', codeColor);
    formProducColor.submit();
  };
  const handleOnCancelModalOption = () => {
    setIsModalOpen(false);
  };
  const handleOpenChangeCompleteColorPickup = (vl: Color) => {
    console.log('change color', '#' + vl.toHex());
    formProducColor.setFieldValue('codeColor', '#' + vl.toHex() ?? '');
  };
  return (
    <div className='p-5 overflow-y-auto h-full'>
      {contextHolder}
      {isLoading && <Spin spinning={isLoading} fullscreen tip='Updating' size='large' />}
      <h2 className='text-center mb-5'>CREATE PRODUCT</h2>
      <FormCreateProduct
        handleAddOption={handleAddOption}
        statusGetCategories={statusGetCategories}
        formCreateProduct={formCreateProduct}
        handleSubmitForm={handleCreateProduct}
        options={options}
        actionUpload={actionUpload}
        handleDeleteOption={handleDeleteOption}
        handleEditOption={handleEditOption}
        handleRemoveMedia={handleRemoveMedia}
      />

      <ModelFormOptionProduct
        isModalOpen={isModalOpen}
        formProducColor={formProducColor}
        handleOnSubmitForm={handleOnSubmitFormOptionModal}
        handleOnOkModalOption={handleOnOkModalOption}
        handleOnCancelModalOption={handleOnCancelModalOption}
        handleOpenChangeCompleteColorPickup={handleOpenChangeCompleteColorPickup}
      />
    </div>
  );
};

export default ProductCreate;
