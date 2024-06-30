import { useContext, useEffect, useRef, useState } from 'react';
import ProductOptionTest, { initialDataUpdateOptionProduct } from '../Product/ProductOptionTest';
import { FileType, getBase64, initialFormProductColor, IOptionProductData } from '../ProductCreate/ProductCreate';
import Upload, { RcFile } from 'antd/es/upload';
import { useForm } from 'antd/es/form/Form';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import {
  changeOptionProduct,
  deleteOptionProduct,
  getProduct,
  selectProduct,
  selectStatusChangeOptionProduct,
  selectStatusDeleteOptionProduct,
  selectStatusUpdateProduct,
  updateProduct,
  updateUploadFromSocket
} from '../../../Features/productDetailPage';
import { useParams } from 'react-router-dom';
import { IDataUpdateOptionProduct, IEditSizeAmounts } from '../ProductDetail/FormEditOption/EdittingOptionForm';
import ModalVerify from '../../../Components/ModalVerify';
import { Button, Spin } from 'antd';
import ProductOptionEdittingFormModal from '../ProductDetail/FormEditOption/ProductOptionEdittingFormModal';
import { uid } from 'uid';
import ModelFormCreateOptionProduct from '../ProductCreate/ModelFormCreateOptionProduct';
import { selectStatusUploadProduct, uploadProductImage } from '../../../Features/createProductPageSlice';
import { AppContext, IAppContext } from '../../../App';
import { IPromptUploadOptionSocket } from '../../../Models/promptSocket';

const OptionProductDetail = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const statusChangeOptionProduct = useAppSelector(selectStatusChangeOptionProduct);
  const statusUploadProduct = useAppSelector(selectStatusUploadProduct);
  const statusDeleteUploadOptionProduct = useAppSelector(selectStatusDeleteOptionProduct);
  const statusStatusUpdateProduct = useAppSelector(selectStatusUpdateProduct);
  const [additionProductOptions, setAdditionProductOptions] = useState<IOptionProductData[]>([]);
  const [dataUpdateOptionProduct, setDataUpdateOptionProduct] = useState<Record<string, IDataUpdateOptionProduct>>({});
  const [isOpenNewProduductOptionModal, setIsOpenNewProduductOptionModal] = useState<boolean>(false);
  const [isOpenAvaibleProduductOptionModal, setIsOpenAvaibleProduductOptionModal] = useState<boolean>(false);
  const [isOpenVerify, setIsOpenVerify] = useState<boolean>(false);
  const [contentVerify, setContentVerify] = useState<{
    title: React.ReactNode;
    body: React.ReactNode;
    optionId: string | null;
  }>({
    title: <span className='text-red-600 font-bold text-lg'>Delete</span>,
    body: 'Are you sure delete this option ?',
    optionId: null
  });
  const mediaUrlIdReUploadRef = useRef<{ optionId: string; mediaId: string }>();
  const newMediaUrlIdReUploadRef = useRef<{ optionId: string; mediaId: string }>();
  const buttonReUploadRef = useRef<HTMLButtonElement>(null);
  const optionIdAvailableOptionRef = useRef<string>('');
  const [newProducOptionForm] = useForm<IOptionProductData>();
  const [availableProductOptionForm] = useForm<IOptionProductData>();
  const product = useAppSelector(selectProduct);
  const appContext = useContext<IAppContext | null>(AppContext);
  const actionReUpload = (file: RcFile, optionId: string, productImageId: string) => {
    return new Promise<string>(() => {});
  };
  const actionReUploadAvailableMediaUrl = (file: RcFile, optionId: string, productImageId: string) => {
    return new Promise<string>(() => {});
  };

  useEffect(() => {
    if (AppContext) {
      appContext?.socketProduct.on('uploadOption', (data: IPromptUploadOptionSocket) => {
        if (params.id === data.productId) {
          dispatch(updateUploadFromSocket(data));
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!product) {
      dispatch(getProduct(params.id ?? ''))
        .unwrap()
        .then((dt) => {
          const product = dt.metadata;
          if (product) {
            const dataUpdateOptionProduct = product.productColors.reduce<Record<string, IDataUpdateOptionProduct>>(
              (result, optionProduct) => {
                result[optionProduct._id] = initialDataUpdateOptionProduct;
                return result;
              },
              {}
            );
            setDataUpdateOptionProduct(dataUpdateOptionProduct);
          }
        });
    }
  }, [params.id]);

  const handleSortOption = () => {};
  const handleSortOptionImage = () => {};
  const handleRemoveOptionImage = () => {};
  const handleOkNewProductOptionModal = () => {
    const color = newProducOptionForm.getFieldValue('colorCode');
    if (typeof color !== 'string') {
      newProducOptionForm.setFieldValue('colorCode', color.toHexString());
    }
    newProducOptionForm.submit();
  };
  const handleOpenChangeCompleteColorPickup = () => {};
  const handleOnSubmitFormAddOptionModal = (values: IOptionProductData) => {
    setAdditionProductOptions((state) => [...state, { ...values, productImages: [] }]);
    setIsOpenNewProduductOptionModal(false);
  };
  const handleCancelNewProductOptionModal = () => {
    setIsOpenNewProduductOptionModal(false);
  };
  const handleAddNewOptionButton = () => {
    setIsOpenNewProduductOptionModal(true);
    newProducOptionForm.setFieldsValue({ ...initialFormProductColor, id: uid(24) });
  };
  const handleDeleteNewProductOption = (optionId: string) => {
    setAdditionProductOptions((state) => state.filter((item) => item.id !== optionId));
  };
  const handleEditNewProductOption = (productOption: IOptionProductData, optionId: string) => {
    newProducOptionForm.setFieldsValue(productOption);
    setIsOpenNewProduductOptionModal(true);
  };
  const handleRemoveMedia = () => {};
  const handleSaveAdditionOption = () => {
    const productId = params.id;
    if (productId) {
      dispatch(
        uploadProductImage({
          productId: productId,
          optionProductData: additionProductOptions
        })
      )
        .unwrap()
        .then((data) => {
          console.log('data:::', data);
          dispatch(getProduct(params.id ?? ''))
            .unwrap()
            .then((dt) => {
              const product = dt.metadata;
              if (product) {
                const dataUpdateOptionProduct = product.productColors.reduce<Record<string, IDataUpdateOptionProduct>>(
                  (result, optionProduct) => {
                    result[optionProduct._id] = initialDataUpdateOptionProduct;
                    return result;
                  },
                  {}
                );
                setDataUpdateOptionProduct(dataUpdateOptionProduct);
              }
            });
          setAdditionProductOptions([]);
        })
        .catch((error) => {
          console.log('error:::', error);
        });
    }
  };

  const handleChangeOrderAvaliableMediaUrl = () => {};
  const handleChangeOrderNewMediaUrl = () => {};
  const handleReUploadAvailableMediaUrl = (optionId: string, mediaUrlId: string) => {
    mediaUrlIdReUploadRef.current = {
      optionId,
      mediaId: mediaUrlId
    };
    buttonReUploadRef.current?.click();
  };
  const handleRemoveAvailableMediaUrl = (optionId: string, mediaUrlId: string) => {
    if (dataUpdateOptionProduct[optionId]) {
      const uploads = { ...dataUpdateOptionProduct[optionId].uploads };
      uploads.delete = [...uploads.delete, mediaUrlId];
      setDataUpdateOptionProduct((state) => ({
        ...state,
        [optionId]: {
          ...state[optionId],
          uploads: uploads
        }
      }));
    }
  };
  const handleRemoveNewMediaUrl = (optionId: string, uid: string) => {};
  const handleRemoveAvailableProductOption = (optionId: string) => {
    setContentVerify((state) => ({ ...state, optionId: optionId }));
    setIsOpenVerify(true);
  };

  const actionReUploadNewOption = (file: RcFile, optionId: string, productImageId: string) => {
    return new Promise<string>(() => {
      console.log({
        optionId,
        productImageId
      });
    });
  };
  const actionReUploadNewMediaUrl = (file: RcFile) => {
    return new Promise<string>(() => {
      if (mediaUrlIdReUploadRef.current) {
        const { optionId, mediaId } = mediaUrlIdReUploadRef.current;
        const updateData = dataUpdateOptionProduct[optionId];
        if (updateData) {
          const updateDataShadow = { ...updateData };
          const indexMedia = updateDataShadow.uploads.add.findIndex((item) => item.uid === mediaId);
          if (indexMedia >= 0) {
            const preItem = updateDataShadow.uploads.add[indexMedia];
            updateDataShadow.uploads.add[indexMedia] = { ...preItem, type: file.type, status: 'uploading' };
            setDataUpdateOptionProduct((state) => ({
              ...state,
              [optionId]: updateDataShadow
            }));
            getBase64(file as FileType).then((url) => {
              const updateDataShadow = { ...updateData };
              const indexMedia = updateDataShadow.uploads.add.findIndex((item) => item.uid === mediaId);
              if (indexMedia >= 0) {
                const preItem = updateDataShadow.uploads.add[indexMedia];
                updateDataShadow.uploads.add[indexMedia] = { ...preItem, type: file.type, status: 'done', url: url };
                setDataUpdateOptionProduct((state) => ({
                  ...state,
                  [optionId]: updateDataShadow
                }));
              }
            });
          }
        }
      }
    });
  };
  const actionUploadAvailableMediaUrl = (file: RcFile, optionId: string, order: number) => {
    return new Promise<string>(() => {
      return new Promise<string>((resolve, reject) => {
        const updateData = dataUpdateOptionProduct[optionId];
        if (updateData) {
          const uploadShadow = { ...updateData };
          uploadShadow.uploads.add = [
            ...updateData.uploads.add,
            {
              ...file,
              originFileObj: file,
              type: file.type,
              status: 'uploading',
              order: order
            }
          ];
          setDataUpdateOptionProduct((state) => ({
            ...state,
            [optionId]: updateData
          }));
        }
        const uid = file.uid;
        getBase64(file as FileType).then((url) => {
          const updateData = dataUpdateOptionProduct[optionId];

          const index = updateData.uploads.add.findIndex((vl) => vl.uid === uid);
          if (index >= 0) {
            updateData.uploads.add[index] = { ...updateData.uploads.add[index], url, status: 'done' };
            setDataUpdateOptionProduct((state) => ({
              ...state,
              [optionId]: updateData
            }));
          }
        });
      });
    });
  };
  const handleActionAddingMediaUrlNewProductOption = (file: RcFile, id: string) => {
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

  const handleCancelVerifyRemovedOption = () => {
    setIsOpenVerify(false);
    setContentVerify((state) => ({ ...state, optionId: null }));
  };
  const handleOkVerifyRemovedOption = () => {
    console.log('contentVerify.optionId:::', contentVerify.optionId);
    if (contentVerify.optionId) {
      dispatch(deleteOptionProduct(contentVerify.optionId))
        .unwrap()
        .then((data) => {
          dispatch(getProduct(params.id ?? ''))
            .unwrap()
            .then((dt) => {
              const product = dt.metadata;
              if (product) {
                const newDataUpdateOptionProduct = product.productColors.reduce<
                  Record<string, IDataUpdateOptionProduct>
                >((result, optionProduct) => {
                  let dataUpdateItem = initialDataUpdateOptionProduct;
                  const dataUpdateItemPrevious = dataUpdateOptionProduct[optionProduct._id];
                  if (
                    dataUpdateItemPrevious &&
                    Object.values(dataUpdateItemPrevious.uploads).some((item) => item.length > 0)
                  ) {
                    dataUpdateItem = { ...dataUpdateItemPrevious };
                  }
                  result[optionProduct._id] = dataUpdateItem;
                  return result;
                }, {});
                setDataUpdateOptionProduct(newDataUpdateOptionProduct);
              }
            });
        })
        .catch((error) => {
          console.log('error delete option::::', error);
        });
      handleCancelVerifyRemovedOption();
    }
  };

  const handleResetProductOption = (optionId: string) => {
    setDataUpdateOptionProduct((state) => ({ ...state, [optionId]: initialDataUpdateOptionProduct }));
  };

  // Modal edit available option product
  const handleEditAvailableOptionProduct = (optionId: string) => {
    if (optionId) {
      optionIdAvailableOptionRef.current = optionId;
      const productOption = productOptions.find((productOption) => productOption._id === optionId);
      if (productOption) {
        availableProductOptionForm.setFieldsValue({
          colorCode: productOption.colorCode,
          colorName: productOption.color,
          id: productOption._id,
          order: productOption.order,
          sizeAmounts: productOption.sizeAmounts
            .map((item) => ({
              id: item._id,
              amount: item.amount,
              order: item.order,
              size: item.size
            }))
            .sort((a, b) => a.order - b.order)
        });
        setIsOpenAvaibleProduductOptionModal(true);
      }
    }
  };
  const handleSubmitAvaibleProduductOptionModal = (values: IOptionProductData) => {
    const productOption = productOptions.find((productOption) => productOption._id === values.id);
    console.log('productOption::::', productOption);
    if (productOption) {
      const dataUpdatePart = {
        colorCode: values.colorCode === productOption.colorCode ? undefined : values.colorCode,
        name: values.colorName === productOption.color ? undefined : values.colorName,
        order: values.order === productOption.order ? undefined : values.order
      };
      const additionalSizeAmount: IDataUpdateOptionProduct['sizeAmounts']['add'] = [];
      const editedSizeAmount: IDataUpdateOptionProduct['sizeAmounts']['edit'] = [];
      const deletedSizeAmount: IDataUpdateOptionProduct['sizeAmounts']['delete'] = [];
      productOption.sizeAmounts.forEach((availableSizeAmount) => {
        const newListId = values.sizeAmounts.map(({ id }) => id);
        if (!newListId.includes(availableSizeAmount._id)) {
          deletedSizeAmount.push(availableSizeAmount._id);
        }
      });
      values.sizeAmounts.forEach((sizeAmountForm) => {
        // edited
        const availableSizeAmount = productOption.sizeAmounts.find((item) => item._id === sizeAmountForm.id);
        if (availableSizeAmount) {
          const dataEdit: IEditSizeAmounts = { sizeAmountId: sizeAmountForm.id };
          if (availableSizeAmount.amount !== sizeAmountForm.amount) {
            dataEdit.amount = sizeAmountForm.amount;
          }
          if (availableSizeAmount.order !== sizeAmountForm.order) {
            dataEdit.order = sizeAmountForm.order;
          }
          if (availableSizeAmount.size !== sizeAmountForm.size) {
            dataEdit.size = sizeAmountForm.size;
          }
          if (Object.keys(dataEdit).length > 1) {
            editedSizeAmount.push(dataEdit);
          }
        }
        // additional
        const availableListId = productOption.sizeAmounts.map(({ _id }) => _id);
        if (!availableListId.includes(sizeAmountForm.id)) {
          additionalSizeAmount.push(sizeAmountForm);
        }
      });
      const isAllowCallApi =
        additionalSizeAmount.length > 0 ||
        editedSizeAmount.length > 0 ||
        deletedSizeAmount.length > 0 ||
        dataUpdatePart.colorCode !== undefined ||
        dataUpdatePart.name !== undefined ||
        dataUpdatePart.order !== undefined;
      if (isAllowCallApi) {
        dispatch(
          changeOptionProduct({
            optionId: optionIdAvailableOptionRef.current,
            sizeAmounts: {
              add: additionalSizeAmount,
              edit: editedSizeAmount,
              delete: deletedSizeAmount
            },
            uploads: {
              add: [],
              edit: [],
              delete: []
            },
            ...dataUpdatePart
          })
        )
          .unwrap()
          .then(({ message }) => {
            if (message === 'ok') {
              dispatch(getProduct(params.id ?? ''));
            }
          })
          .finally(() => {
            setIsOpenAvaibleProduductOptionModal(false);
          });
      } else {
        setIsOpenAvaibleProduductOptionModal(false);
      }
    }
  };
  const handleSaveProductOption = (optionId: string) => {
    if (optionId) {
      const dataUpdateOption = dataUpdateOptionProduct[optionId];
      if (dataUpdateOption) {
        dispatch(
          changeOptionProduct({
            optionId: optionId,
            ...dataUpdateOption,
            sizeAmounts: {
              add: [],
              edit: [],
              delete: []
            }
          })
        )
          .unwrap()
          .then(({ message }) => {
            if (message === 'ok') {
              setDataUpdateOptionProduct((state) => ({
                ...state,
                [optionId]: {
                  ...dataUpdateOption,
                  uploads: {
                    add: [],
                    edit: [],
                    delete: []
                  }
                }
              }));
              dispatch(getProduct(params.id ?? ''));
            }
          })
          .finally(() => {
            setIsOpenAvaibleProduductOptionModal(false);
          });
      }
    }
  };
  const handleSaveAllProductOption = () => {};
  const handleOkAvaibleProduductOptionModal = () => {
    const color = availableProductOptionForm.getFieldValue('colorCode');
    if (typeof color !== 'string') {
      availableProductOptionForm.setFieldValue('colorCode', color.toHexString());
    }
    availableProductOptionForm.submit();
  };
  const handleCancelAvailableProductOptionModal = () => {
    optionIdAvailableOptionRef.current = '';
    setIsOpenAvaibleProduductOptionModal(false);
  };
  let productOptions = [...(product?.productColors ?? [])].sort((a, b) => {
    return a.order - b.order;
  });
  const isLoading =
    statusChangeOptionProduct === 'pending' ||
    statusUploadProduct === 'pending' ||
    statusDeleteUploadOptionProduct === 'pending' ||
    statusStatusUpdateProduct === 'pending';
  return (
    <div>
      {isLoading && <Spin spinning={true} style={{ zIndex: 1000000 }} fullscreen tip='Updating' size='large' />}
      <ProductOptionTest
        actionReUploadNewOption={actionReUploadNewOption}
        actionUploadAvailableMediaUrl={actionUploadAvailableMediaUrl}
        onRemoveAvailableProductOption={handleRemoveAvailableProductOption}
        onSortOption={handleSortOption}
        onSortOptionImage={handleSortOptionImage}
        onRemoveOptionImage={handleRemoveOptionImage}
        productOptions={productOptions}
        newProductOptions={additionProductOptions}
        onAddNewOptionButton={handleAddNewOptionButton}
        onActionAddingMediaUrlNewProductOption={handleActionAddingMediaUrlNewProductOption}
        onDeleteNewProductOption={handleDeleteNewProductOption}
        onEditNewProductOption={handleEditNewProductOption}
        onRemoveMedia={handleRemoveMedia}
        onSaveAdditionOption={handleSaveAdditionOption}
        dataUpdateOptionProduct={dataUpdateOptionProduct}
        onChangeOrderAvaliableMediaUrl={handleChangeOrderAvaliableMediaUrl}
        onChangeOrderNewMediaUrl={handleChangeOrderNewMediaUrl}
        onReUploadAvailableMediaUrl={handleReUploadAvailableMediaUrl}
        onRemoveAvailableMediaUrl={handleRemoveAvailableMediaUrl}
        onRemoveNewMediaUrl={handleRemoveNewMediaUrl}
        onResetProductOption={handleResetProductOption}
        onSaveProductOption={handleSaveProductOption}
        onSaveAllProductOption={handleSaveAllProductOption}
        onEditAvailableOptionProduct={handleEditAvailableOptionProduct}
      />
      <Upload
        className='mt-4 !hidden'
        accept='video/*, image/*'
        multiple={true}
        action={(file) => actionReUploadNewMediaUrl(file)}
        fileList={[]}
        listType='picture-card'
        maxCount={6}
      >
        <Button className='hidden' ref={buttonReUploadRef}></Button>
      </Upload>
      {
        <ProductOptionEdittingFormModal
          handleSortOption={() => {}}
          isModalOpen={isOpenAvaibleProduductOptionModal}
          producOptionForm={availableProductOptionForm}
          handleSubmitForm={handleSubmitAvaibleProduductOptionModal}
          handleOkModal={handleOkAvaibleProduductOptionModal}
          handleCancelOptionModal={handleCancelAvailableProductOptionModal}
          handleChangeCompleteColorPickup={(vl) => {}}
        />
      }
      <ProductOptionEdittingFormModal
        handleSortOption={() => {}}
        isModalOpen={isOpenNewProduductOptionModal}
        producOptionForm={newProducOptionForm}
        handleSubmitForm={handleOnSubmitFormAddOptionModal}
        handleOkModal={handleOkNewProductOptionModal}
        handleCancelOptionModal={handleCancelNewProductOptionModal}
        handleChangeCompleteColorPickup={handleOpenChangeCompleteColorPickup}
      />
      <ModalVerify
        width={300}
        open={isOpenVerify}
        onCancel={handleCancelVerifyRemovedOption}
        onOk={handleOkVerifyRemovedOption}
        title={contentVerify.title}
        content={contentVerify.body}
      />
    </div>
  );
};

export default OptionProductDetail;
