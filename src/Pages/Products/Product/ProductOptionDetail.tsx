import React, { useEffect, useLayoutEffect, useState } from 'react';
import FormUploadProductImage from '../ProductCreate/FormUploadProductImage';
import { Button, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';

import {
  FileType,
  getBase64,
  IInformationProductColor,
  initialFormProductColor,
  IProductColorData,
  ITypeActionModalOption
} from '../ProductCreate/ProductCreate';
import { IProuductsMetaData, IResponse } from '../../../Models/response';
import { RcFile, UploadFile } from 'antd/es/upload';
import ModelFormOptionProduct from '../../../Components/ModelFormOptionProduct';
import FormEditOption from '../ProductDetail/FormEditOption';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import {
  getProduct,
  selectProduct,
  selectStatusChangeOptionProduct,
  selectStatusGetProduct
} from '../../../Features/productDetailPage';
import { useParams } from 'react-router-dom';
import { IActionProduct } from '../ProductDetail/ProductDetail';
import { IProductColor } from '../../../Models/product';
import { uid } from 'uid';

const ProductOptionDetail = () => {
  const [addOptionProducts, setAddOptionProducts] = useState<IProductColorData[]>([]);
  const [formOptionProductModal] = useForm<IInformationProductColor>();
  const [isModalOption, setIsModalOption] = useState<boolean>(false);
  const [actionProduct, setActionProduct] = useState<IActionProduct[]>([]);
  const [optionProductShadow, setOptionProductShadow] = useState<IProductColor[]>([]);

  const [typeModalOption, setTypeModalOption] = useState<ITypeActionModalOption>({ type: 'add' });
  const dispatch = useAppDispatch();
  const params = useParams();
  const statusGetProduct = useAppSelector(selectStatusGetProduct);
  const product = useAppSelector(selectProduct);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    dispatch(getProduct(params.id ?? ''))
      .unwrap()
      .then((data) => {
        const options = data.metadata?.productColors;
        if (options) {
          setOptionProductShadow(options);
        }
      });
    formOptionProductModal.setFieldsValue(initialFormProductColor);
    setAddOptionProducts([]);
  }, []);

  useLayoutEffect(() => {
    if (statusGetProduct === 'fulfilled') {
      setOptionProductShadow(product?.productColors ?? []);
      formOptionProductModal.setFieldsValue(initialFormProductColor);
      setAddOptionProducts([]);
    }
  }, [statusGetProduct]);

  const actionAddUpload = (file: RcFile, id: string) => {
    return new Promise<string>(() => {
      const data: IProductColorData[] = addOptionProducts;
      const shawdow = [...data];
      const index = data.findIndex((vl) => vl.id === id);
      if (index >= 0) {
        shawdow[index].data = [
          ...shawdow[index].data,
          { ...file, originFileObj: file, type: file.type, status: 'uploading' }
        ].slice(0, 6) as IProductColorData['data'];
        setAddOptionProducts(shawdow);
      }

      getBase64(file as FileType).then((url) => {
        const data: IProductColorData[] = addOptionProducts;
        const shawdow = [...data];
        const index = data.findIndex((vl) => vl.id === id);
        if (index >= 0) {
          for (const upload of shawdow[index].data) {
            if (upload.uid === file.uid) {
              upload.originFileObj = file;
              upload.type = file.type;
              upload.url = url;
              upload.status = 'done';
              break;
            }
          }
          setAddOptionProducts(shawdow);
        }
      });
    });
  };
  const handleDeleteOption = (id: string) => {
    const data: IProductColorData[] = addOptionProducts;
    const dataAfterRemove = data.filter((vl) => vl.id !== id);
    setAddOptionProducts(dataAfterRemove);
  };
  const handleEditOption = (productColor: IProductColorData, id: string) => {
    formOptionProductModal.setFieldsValue(productColor);
    setIsModalOption((state) => !state);
    setTypeModalOption({
      type: 'edit',
      optionId: id
    });
  };
  const handleRemoveMedia = (file: UploadFile<any>, id: string) => {
    const fileId = file.uid;
    const data: IProductColorData[] = addOptionProducts;
    const optionsShadow = [...data];
    for (const optionShadow of optionsShadow) {
      if (optionShadow.id === id) {
        const dataNew = optionShadow.data.filter((file) => file.uid !== fileId);
        optionShadow.data = dataNew;
        break;
      }
    }
    setAddOptionProducts(optionsShadow);
  };

  const handleOnOkModalOption = () => {
    formOptionProductModal.submit();
  };
  const handleOnCancelModalOption = () => {
    setIsModalOption(false);
  };
  const handleOpenChangeCompleteColorPickup = () => {};

  const handleOnSubmitFormOptionModal = (values: IInformationProductColor) => {
    if (typeModalOption.type === 'add') {
      setAddOptionProducts((state) => {
        return [...state, { ...values, id: uid(24), data: [] }];
      });
      formOptionProductModal.setFieldsValue(initialFormProductColor);
      setIsModalOption(false);
    } else if (typeModalOption.type === 'edit') {
      const optionId = typeModalOption.optionId;
      if (optionId) {
        const options: IProductColorData[] = addOptionProducts;
        const shadowOptions = [...options];
        const indexEdit = shadowOptions.findIndex((option) => option.id === typeModalOption.optionId);
        if (indexEdit >= 0) {
          shadowOptions[indexEdit] = { ...shadowOptions[indexEdit], ...values };
          setAddOptionProducts(shadowOptions);
        }
      }
      setIsModalOption(false);
      formOptionProductModal.setFieldsValue(initialFormProductColor);
    }
  };
  const handleAddOptionButton = () => {
    setIsModalOption(true);
    setTypeModalOption({
      type: 'add'
    });
  };
  console.log('productOptionRender');
  return (
    <div className='px-3 pb-5'>
      {contextHolder}
      <div>
        <h3 className='font-medium flex items-center text-center justify-center text-2xl'>
          Option
          <Button onClick={handleAddOptionButton} style={{ marginLeft: '20px' }} icon={<PlusOutlined />}></Button>{' '}
          <span className='text-lg font-normal ml-6'>{`( ${product?.productColors.length ?? 0} )`}</span>
        </h3>
        {optionProductShadow?.length > 0 &&
          optionProductShadow.map((productColor) => {
            return (
              <FormEditOption key={productColor._id} setActionProduct={setActionProduct} productColor={productColor} />
            );
          })}
      </div>

      {addOptionProducts.map((addOptionProduct, index) => {
        return (
          <React.Fragment key={addOptionProduct.id}>
            <FormUploadProductImage
              productColor={addOptionProduct}
              actionUpload={actionAddUpload}
              handleDeleteOption={handleDeleteOption}
              handleEditOption={handleEditOption}
              handleRemoveMedia={handleRemoveMedia}
              onButtonSave={() => {
                console.log('.....');
              }}
            />
          </React.Fragment>
        );
      })}
      <Button size='large' icon={<PlusOutlined />} onClick={handleAddOptionButton}></Button>

      <ModelFormOptionProduct
        isModalOpen={isModalOption}
        formProducColor={formOptionProductModal}
        handleOnSubmitForm={handleOnSubmitFormOptionModal}
        handleOnOkModalOption={handleOnOkModalOption}
        handleOnCancelModalOption={handleOnCancelModalOption}
        handleOpenChangeCompleteColorPickup={handleOpenChangeCompleteColorPickup}
      />
    </div>
  );
};

export default ProductOptionDetail;
