import { message, Spin } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getProduct,
  selectProduct,
  selectStatusGetProduct,
  selectStatusUpdateProduct,
  updateProduct,
  updateUploadFromSocket
} from '../../../Features/productDetailPage';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { useForm } from 'antd/es/form/Form';
import { IProduct } from '../../../Models/product';
import FormInforMainProduct from './FormInforMainProduct';
import { recurtiveCat } from '../../../utils/common';
import { getCategories, selectCategories } from '../../../Features/categoryPageSlice';
import { PayloadUpdateProduct } from '../../../Models/request';
import ProductOptionTest from '../Product/ProductOptionTest';
import { RcFile, UploadFile } from 'antd/es/upload';
import {
  FileType,
  getBase64,
  initialFormProductColor,
  IOptionProductData,
  ITypeActionModalOption
} from '../ProductCreate/ProductCreate';
import { AppContext, IAppContext } from '../../../App';
import { uploadProductImage } from '../../../Features/createProductPageSlice';
import { uid } from 'uid';
import { IPromptUploadOptionSocket } from '../../../Models/promptSocket';
import { TbChevronsRight } from 'react-icons/tb';

export interface IActionProduct {
  type: 'product' | 'upload-product-option' | 'sizeAmounts-product-option';
  action: 'edit' | 'delete';
}

export interface IFormDataEditProduct {
  id: IProduct['_id'];
  name: IProduct['name'];
  price: IProduct['price'];
  categoryId: IProduct['categoryId'];
  status: string;
  slug: IProduct['slug'];
  detail: IProduct['detail'];
}

const ProductDetail = () => {
  const params = useParams();
  const product = useAppSelector(selectProduct);
  const dispatch = useAppDispatch();
  const statusGetProduct = useAppSelector(selectStatusGetProduct);
  const statusUpdateProduct = useAppSelector(selectStatusUpdateProduct);
  const [initiaProduct, setInitialProduct] = useState<IFormDataEditProduct | null>(null);
  const [additionProductOptions, setAdditionProductOptions] = useState<IOptionProductData[]>([]);
  const [isOpenAddtionProduductOptionModal, setisOpenAddtionProduductOptionModal] = useState<boolean>(false);
  const categories = useAppSelector(selectCategories);
  const [formInforMain] = useForm<IFormDataEditProduct>();
  const [producOptionForm] = useForm<IOptionProductData>();
  const appContext = useContext<IAppContext | null>(AppContext);
  const [typeModalOption, setTypeModalOption] = useState<ITypeActionModalOption>({ type: 'add' });
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
    producOptionForm.setFieldsValue(initialFormProductColor);
  }, []);
  useEffect(() => {
    if (appContext) {
      appContext.socketProduct.on('uploadOption', (data: IPromptUploadOptionSocket) => {
        if (params.id === data.productId) {
          dispatch(updateUploadFromSocket(data));
        }
      });
    }
  }, []);
  useEffect(() => {
    fecthDataProduct();
  }, [params.id]);
  const categoriesOptions = [{ label: 'None', value: '' }, ...recurtiveCat([], categories)];

  const fecthDataProduct = () => {
    dispatch(getProduct(params.id ?? ''))
      .unwrap()
      .then((data) => {
        const product = data.metadata;
        if (product) {
          const initialValue = {
            id: product._id,
            name: product.name,
            price: product.price,
            categoryId: product.categoryId,
            status: String(product.status),
            detail: product.detail,
            slug: product.slug
          };
          setInitialProduct(initialValue);
          formInforMain.setFieldsValue(initialValue);
        }
      });
  };

  const handleOnChangeNameProduct = () => {};
  const handleOnChangePrice = () => {};
  const handleOnBlurPrice = () => {};
  const handleResetForm = () => {
    if (initiaProduct) {
      formInforMain.setFieldsValue(initiaProduct);
    }
  };
  const getDataChangeInforMainProduct = (
    init: IFormDataEditProduct | null,
    present: IFormDataEditProduct
  ): PayloadUpdateProduct | null => {
    if (init !== null) {
      const dataChange: PayloadUpdateProduct = {
        id: init.id
      };
      if (init.name !== present.name) {
        dataChange.name = present.name;
      }
      if (init.categoryId !== present.categoryId) {
        dataChange.categoryId = present.categoryId;
      }
      if (init.price !== present.price) {
        dataChange.price = String(present.price);
      }
      if (init.slug !== present.slug) {
        dataChange.slug = present.slug;
      }
      if (init.status !== present.status) {
        dataChange.status = present.status as PayloadUpdateProduct['status'];
      }
      if (present.detail && init.detail !== present.detail) {
        dataChange.detail = present.detail;
      }
      return Object.keys(dataChange).length > 1 ? dataChange : null;
    }
    return null;
  };

  const handleSubmitMainInforProduct = () => {
    const dataChangeInforMainProduct = getDataChangeInforMainProduct(initiaProduct, formInforMain.getFieldsValue());
    if (dataChangeInforMainProduct) {
      dispatch(updateProduct(dataChangeInforMainProduct))
        .unwrap()
        .then(() => {
          fecthDataProduct();
        });
    }
  };
  const handleAddOptionButton = () => {
    setisOpenAddtionProduductOptionModal(true);
    setTypeModalOption({
      type: 'add'
    });
  };
  const handleActionUploadProductAvailable = () => {};
  const handleActionAddUpload = (file: RcFile, id: string) => {
    return new Promise<string>(() => {
      const options: IOptionProductData[] = [...additionProductOptions];
      const indexProductImage = options.findIndex((vl) => vl.id === id);
      if (indexProductImage >= 0) {
        options[indexProductImage].productImages = [
          ...options[indexProductImage].productImages,
          {
            ...file,
            originFileObj: file,
            type: file.type,
            status: 'uploading',
            order: options[indexProductImage].productImages.length
          }
        ].slice(0, 6) as IOptionProductData['productImages'];
        setAdditionProductOptions(options);
      }

      getBase64(file as FileType).then((url) => {
        const options: IOptionProductData[] = [...additionProductOptions];
        const indexProductImage = options.findIndex((vl) => vl.id === id);
        if (indexProductImage >= 0) {
          for (const upload of options[indexProductImage].productImages) {
            if (upload.uid === file.uid) {
              upload.originFileObj = file;
              upload.type = file.type;
              upload.url = url;
              upload.status = 'done';
              break;
            }
          }
          setAdditionProductOptions(options);
        }
      });
    });
  };
  const handleDeleteOption = (id: string) => {
    const data: IOptionProductData[] = additionProductOptions;
    const dataAfterRemove = data.filter((vl) => vl.id !== id);
    setAdditionProductOptions(dataAfterRemove);
  };
  const handleEditOption = (productColor: IOptionProductData, id: string) => {
    producOptionForm.setFieldsValue(productColor);
    setisOpenAddtionProduductOptionModal((state) => !state);
    setTypeModalOption({
      type: 'edit',
      optionId: id
    });
  };
  const handleRemoveMedia = (file: UploadFile<any>, id: string) => {
    const fileId = file.uid;
    const data: IOptionProductData[] = additionProductOptions;
    const optionsShadow = [...data];
    for (const optionShadow of optionsShadow) {
      if (optionShadow.id === id) {
        const dataNew = optionShadow.productImages.filter((file) => file.uid !== fileId);
        optionShadow.productImages = dataNew;
        break;
      }
    }
    setAdditionProductOptions(optionsShadow);
  };
  const handleSaveAdditionOption = () => {
    if (params.id) {
      const payloadThunk = { productId: params.id, optionProductData: additionProductOptions };
      dispatch(uploadProductImage(payloadThunk))
        .unwrap()
        .then((data) => {
          messageApi.success('Adding product successfully');
          setAdditionProductOptions([]);
          fecthDataProduct();
        })
        .catch(() => {
          messageApi.error('Adding product failed');
        });
    }
  };
  const handleCancelEdittingOptionModal = () => {
    setisOpenAddtionProduductOptionModal(false);
  };
  const handleOkEdittingOptionModal = () => {
    const color = producOptionForm.getFieldValue('colorCode');
    if (typeof color !== 'string') {
      producOptionForm.setFieldValue('colorCode', color.toHexString());
    }
    producOptionForm.submit();
  };
  const handleOpenChangeCompleteColorPickup = () => {};
  const handleOnSubmitFormAddOptionModal = (values: IOptionProductData) => {
    if (typeModalOption.type === 'add') {
      const presLengthOption = (product?.productColors ?? []).length + 1;
      setAdditionProductOptions((state) => {
        return [...state, { ...values, id: uid(24), productImages: [], order: presLengthOption }];
      });
      producOptionForm.setFieldsValue(initialFormProductColor);
      setisOpenAddtionProduductOptionModal(false);
    } else if (typeModalOption.type === 'edit') {
      const optionId = typeModalOption.optionId;
      if (optionId) {
        const options: IOptionProductData[] = additionProductOptions;
        const shadowOptions = [...options];
        const indexEdit = shadowOptions.findIndex((option) => option.id === typeModalOption.optionId);
        if (indexEdit >= 0) {
          shadowOptions[indexEdit] = { ...shadowOptions[indexEdit], ...values };
          setAdditionProductOptions(shadowOptions);
        }
      }
      setisOpenAddtionProduductOptionModal(false);
      producOptionForm.setFieldsValue(initialFormProductColor);
    }
  };
  const actionReUpload = (file: RcFile, optionId: string, productImageId: string) => {
    return new Promise<string>(() => {});
  };
  const handleSortOptionImage = (optionId: string, productImageId: string, value: string) => {};
  const handleRemoveOptionImage = (optionId: string, productImageId: string) => {};
  const handleSortOption = (optionId: string, value: string) => {};
  console.log('render:::: Product Detail');
  return (
    <div>
      {
        <Spin
          style={{ zIndex: 200000 }}
          spinning={statusGetProduct === 'pending' || statusUpdateProduct === 'pending'}
          fullscreen
          tip='Updating'
          size='large'
        />
      }
      {contextHolder}
      <h2 className='text-center text-2xl'>Product Detail</h2>
      <Link
        to={'/products/product-option/' + params.id}
        className='text-center ml-6 font-normal leading-none hover:opacity-75 hover:cursor-pointer hover:font-medium flex items-center'
      >
        Option product
        <span className='flex justify-center items-center ml-2 text-base'>
          <TbChevronsRight />
        </span>
      </Link>

      <FormInforMainProduct
        isActiveSubmit={true}
        categories={categoriesOptions}
        formInforMain={formInforMain}
        statusGetProduct={statusGetProduct}
        statusGetCategories={statusGetProduct}
        onChangeNameProduct={handleOnChangeNameProduct}
        onChangePrice={handleOnChangePrice}
        onBlurPrice={handleOnBlurPrice}
        onResetForm={handleResetForm}
        onSubmitForm={handleSubmitMainInforProduct}
      />
    </div>
  );
};

export default ProductDetail;
