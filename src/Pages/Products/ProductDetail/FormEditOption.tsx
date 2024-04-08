import {
  Button,
  Col,
  ColorPicker,
  Form,
  FormInstance,
  GetProp,
  Image,
  Input,
  InputNumber,
  Modal,
  Popover,
  Row,
  Skeleton,
  Space,
  Spin,
  Upload,
  UploadProps
} from 'antd';
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ItemRender, RcFile, UploadFile } from 'antd/es/upload/interface';
import { LoadingOutlined } from '@ant-design/icons';
import { BsEye } from 'react-icons/bs';
import { MdDelete, MdOutlineChangeCircle } from 'react-icons/md';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { MdDeleteForever } from 'react-icons/md';
import { FaRegEdit, FaRegFileImage, FaRegImage } from 'react-icons/fa';
import { LiaExchangeAltSolid } from 'react-icons/lia';
import { IProductColor } from '../../../Models/product';
import { IActionProduct } from './ProductDetail';
import { RxDotsVertical } from 'react-icons/rx';
import FormItem from 'antd/es/form/FormItem';
import { LuFileVideo } from 'react-icons/lu';
import { IInformationProductColor } from '../ProductCreate/ProductCreate';
import FormUploadProductImage from '../ProductCreate/FormUploadProductImage';
import ModalVerify from '../../../Components/ModalVerify';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import {
  changeOptionProduct,
  deleteOptionProduct,
  deleteUploadOptionProduct,
  getProduct,
  selectStatusChangeOptionProduct,
  selectStatusDeleteOptionProduct,
  selectStatusGetProduct
} from '../../../Features/productDetailPage';
import { useParams } from 'react-router-dom';
import { PayloadDeleteUploadOptionProduct } from '../../../Models/request';
import { useWatch } from 'antd/es/form/Form';
import ModelFormOptionProduct from '../../../Components/ModelFormOptionProduct';

export interface IFormEditOption {
  productColor: IProductColor;
  setActionProduct: React.Dispatch<React.SetStateAction<IActionProduct[]>>;
  //   productColor: IProductColorData;
  //   formProducColor: FormInstance<IInformationProductColor>;
  //   formCreateProduct: FormInstance<IFormCreateProduct>;
  //   setIsModalOptionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  //   setTypeModalOption: React.Dispatch<React.SetStateAction<ITypeActionModalOption>>;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IEditSizeAmounts {
  sizeAmountId: string;
  amount?: number;
  size?: string;
}

export interface IDataChange {
  uploads: {
    delete: string[];
    add: UploadFile[];
  };
  sizeAmounts: {
    delete: string[];
    add: IAddSizeAmounts[];
    edit: IEditSizeAmounts[];
  };
  name?: string;
  colorCode?: string;
}

interface IAddSizeAmounts {
  id: string;
  size: string;
  amount: number;
}

interface IPreviewUpload {
  url?: string;
  type?: string;
  name?: string;
}
interface IPreviewUpload {
  url?: string;
  type?: string;
  name?: string;
}
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CustomItemRenderUpload: ItemRender<UploadFile<UploadFile>> = (node, file, listFile, action) => {
  return (
    <section>
      <div className='wraper-upload-ct overflow-hidden w-24 relative h-24 border-zinc-300 border border-dashed rounded-md border-separate flex justify-center items-center'>
        {file.status === 'uploading' ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : (
          <>
            {file.type?.includes('image') && (
              <img className='w-20 max-h-20 object-contain' src={file.url} alt={file.name}></img>
            )}
            {file.type?.includes('video') && <video className='w-20 max-h-20 object-contain' src={file.url}></video>}
            <div className='wraper-hover-upload-ct text-lg text-white hidden bg-transparent absolute top-0 right-0 left-0 bottom-0'>
              <span
                onClick={action.preview}
                className='mx-1 w-5 h-5 inline-flex items-center hover:cursor-pointer hover:opacity-60'
              >
                <BsEye />
              </span>
              <span
                onClick={action.remove}
                className='mx-1 w-5 h-5 inline-flex items-center hover:cursor-pointer hover:opacity-60'
              >
                <MdDelete />
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
export const ButtonUpload = () => {
  return (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
};

const initialDataChange = {
  uploads: {
    delete: [],
    add: []
  },
  sizeAmounts: {
    delete: [],
    add: [],
    edit: []
  },
  name: undefined,
  colorCode: undefined
};
const FormEditOption: FC<IFormEditOption> = ({ productColor }) => {
  const [productColorShadow, setProductColorShadow] = useState<IProductColor>(productColor);
  const params = useParams();
  const dispatch = useAppDispatch();
  const [formProducColor] = Form.useForm<IInformationProductColor>();
  const [uploadMediaOptions, setUploadMediaOptions] = useState<UploadFile[]>([]);

  const statusDeleteOptionProduct = useAppSelector(selectStatusDeleteOptionProduct);
  const statusChangeOptionProduct = useAppSelector(selectStatusChangeOptionProduct);
  const statusGetProduct = useAppSelector(selectStatusGetProduct);

  console.log('render FormEditOption:::');

  const createInitalFormProductColor = (productColor: IProductColor) => {
    return {
      id: productColor._id,
      name: productColor.color,
      sizeAmounts: productColor.sizeAmounts.map((sizeAmount) => ({
        id: sizeAmount._id,
        amount: sizeAmount.amount,
        size: sizeAmount.size
      })),
      codeColor: productColor.colorCode
    };
  };

  useEffect(() => {
    if (statusGetProduct === 'fulfilled') {
      setProductColorShadow(productColor);
      formProducColor.setFieldsValue(createInitalFormProductColor(productColor));
    }
  }, [statusGetProduct]);

  useEffect(() => {
    setProductColorShadow(productColor);
    formProducColor.setFieldsValue(createInitalFormProductColor(productColor));
    return () => {
      console.log('-----------------------------');
    };
  }, []);

  const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
  const [isOpenPickColor, setIsOpenPickColor] = useState<boolean>(false);
  const [isOpenVerify, setIsOpenVerify] = useState<boolean>(false);
  const [contentVerify, setContentVerify] = useState<{
    title: React.ReactNode;
    body: React.ReactNode;
    uploadId: string | null;
  }>({
    title: <span className='text-red-600 font-bold text-lg'>Delete</span>,
    body: 'Are you sure delete this option ?',
    uploadId: null
  });
  const [dataChange, setDataChange] = useState<IDataChange>(initialDataChange);

  const handleCancelVerify = () => {
    setIsOpenVerify(false);
  };
  const handleOkVerify = () => {
    handleDeleteOption(productColor._id);
    setIsOpenVerify(false);
  };

  const handleSubmitModal = (values: IInformationProductColor) => {
    const idSizeAmountInitial = productColor.sizeAmounts.map((vl) => vl._id);
    const idSizeAmountForm = values.sizeAmounts.map((vl) => vl.id);
    let deleteSizeAmounts: string[] = productColor.sizeAmounts
      .filter((vl) => !idSizeAmountForm.includes(vl._id))
      .map((vl) => vl._id);
    let addSizeAmounts = values.sizeAmounts.filter((vl) => !idSizeAmountInitial.includes(vl.id));
    let editSizeAmounts = productColor.sizeAmounts.reduce<IEditSizeAmounts[]>((result, sizeAmountsOrign) => {
      const sizeAmountsForm = values.sizeAmounts.find((value) => value.id === sizeAmountsOrign._id);
      let data: IEditSizeAmounts = { sizeAmountId: sizeAmountsOrign._id };
      if (sizeAmountsForm) {
        if (sizeAmountsForm.amount !== sizeAmountsOrign.amount) {
          data['amount'] = sizeAmountsForm.amount;
        }
        if (sizeAmountsForm.size !== sizeAmountsOrign.size) {
          data['size'] = sizeAmountsForm.size;
        }
      }
      return Object.keys(data).length === 1 ? result : [...result, data];
    }, []);

    console.log('values:::', values);
    setDataChange((state) => ({
      ...state,
      sizeAmounts: {
        delete: deleteSizeAmounts,
        add: addSizeAmounts,
        edit: editSizeAmounts
      },
      colorCode: values.codeColor !== productColor.colorCode ? values.codeColor : undefined,
      name: values.name !== productColor.color ? values.name : undefined
    }));
    setIsOpenModalEdit(false);
  };

  const handleDeleteOption = (optionId: string) => {
    dispatch(deleteOptionProduct(optionId))
      .unwrap()
      .then(() => {
        dispatch(getProduct(params.id ?? ''));
      });
  };
  const handleEditOption = () => {};

  const handleRemoveMedia = () => {};

  const actionUpload = (file: RcFile) => {
    return new Promise<string>((resolve, reject) => {
      const newState = [
        ...uploadMediaOptions,
        { ...file, originFileObj: file, type: file.type, status: 'uploading' }
      ] as UploadFile[];
      setUploadMediaOptions(newState);
      const uid = file.uid;
      getBase64(file as FileType).then((url) => {
        const shawdow = [...newState];
        const index = shawdow.findIndex((vl) => vl.uid === uid);
        if (index >= 0) {
          shawdow[index] = { ...shawdow[index], url, status: 'done' };
          setDataChange((state) => ({
            ...state,
            uploads: {
              ...state.uploads,
              add: [...state.uploads.add, shawdow[index]]
            }
          }));
          setUploadMediaOptions(shawdow);
        }
      });
    });
  };

  const handleRemoveJustUpload = (uid: string) => {
    const data: UploadFile[] = uploadMediaOptions;
    const newData = data.filter((upload) => upload.uid !== uid);
    setDataChange((state) => ({
      ...state,
      uploads: {
        ...state.uploads,
        add: state.uploads.add.filter((upload) => upload.uid !== uid)
      }
    }));
    setUploadMediaOptions(newData);
  };
  const handleRemoveUploaded = (id: string) => {
    setProductColorShadow((state) => {
      const newState = state.mediaUrls.filter((media) => media._id !== id);
      return { ...state, mediaUrls: newState };
    });
    setDataChange((state) => ({
      ...state,
      uploads: {
        ...state.uploads,
        delete: [...state.uploads.delete, id]
      }
    }));
  };

  const handleSaveOptionProduct = () => {
    dispatch(changeOptionProduct({ ...dataChange, optionId: productColor._id }))
      .unwrap()
      .then((data) => {
        setDataChange(initialDataChange);
        setUploadMediaOptions([]);
        dispatch(getProduct(params.id ?? ''));
      });
  };

  const checkIsChangeData = () => {
    const isSizeAmountChange = Object.values(dataChange.sizeAmounts).some((value) => value.length > 0);
    const isUploadChange = Object.values(dataChange.uploads).some((value) => value.length > 0);
    return isSizeAmountChange || isUploadChange;
  };

  console.log('dataChange:::', dataChange);

  const productColorFiltered = productColor.mediaUrls.filter(
    (mediaUrl) => !dataChange['uploads']['delete'].includes(mediaUrl._id)
  );

  return (
    <div style={{ borderColor: `${productColor.colorCode}` }} className='mb-8 p-2 border-dashed border rounded'>
      {
        <Spin
          style={{ zIndex: 200000 }}
          spinning={statusDeleteOptionProduct === 'pending' || statusChangeOptionProduct === 'pending'}
          fullscreen
          tip='Updating'
          size='large'
        />
      }
      <div className='relative flex justify-center mb-3 items-center'>
        <div className='flex items-center'>
          <span className='mx-2 px-2 text-xl font-semibold'>{dataChange.name ?? productColor.color}</span>
          <span
            className='mx-1 inline-block w-6 h-6 rounded-[50%]'
            style={{ backgroundColor: `${dataChange.colorCode ?? productColor.colorCode}` }}
          ></span>
          <div className='ml-3'>
            {productColor.sizeAmounts.map(({ size, _id, amount }) => {
              const isDeleted = dataChange.sizeAmounts.delete.some((id) => id === _id);
              let isEditSize = false;
              let isEditAmount = false;
              const editValue = dataChange.sizeAmounts.edit.find((edit) => edit.sizeAmountId === _id);
              if (editValue) {
                isEditSize = editValue['size'] !== undefined;
                isEditAmount = editValue['amount'] !== undefined;
              }
              return (
                <span key={_id} className='font-bold mx-2'>
                  {isDeleted ? (
                    <span className={`text-red-600`}>
                      {size} - {amount}
                    </span>
                  ) : editValue ? (
                    <span>
                      {editValue ? (
                        <>
                          <span className={`${isEditSize ? 'text-orange-600' : ''}`}>{editValue.size ?? size}</span> -
                          <span className={`${isEditAmount ? 'text-orange-600' : ''} ml-1`}>
                            {editValue.amount ?? amount}
                          </span>
                        </>
                      ) : (
                        <>
                          {size} - {amount}
                        </>
                      )}
                    </span>
                  ) : (
                    <span>
                      {size} - {amount}
                    </span>
                  )}
                </span>
              );
            })}
            {dataChange.sizeAmounts.add.map((sizeAmount) => (
              <span key={sizeAmount.id} className='font-bold mx-2'>
                <span key={sizeAmount.id} className='text-blue-600'>
                  {sizeAmount.size} - {sizeAmount.amount}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className='absolute flex top-0 right-0 '>
          <span
            onClick={() => {
              setIsOpenModalEdit(true);
              formProducColor.setFieldsValue(
                createInitalFormProductColor({
                  ...productColor,
                  color: dataChange.name ?? productColor.color,
                  colorCode: dataChange.colorCode ?? productColor.colorCode
                })
              );
            }}
            className='hover:opacity-55  cursor-pointer mx-2 w-6 h-6 flex text-xl items-center'
          >
            <FaRegEdit />
          </span>
          <span
            onClick={() => {
              setIsOpenVerify(true);
            }}
            className='hover:opacity-55  cursor-pointer mx-2 w-6 h-6 flex text-2xl text-red-600 items-center'
          >
            <MdDeleteForever />
          </span>
        </div>
      </div>
      <Row gutter={[20, 15]}>
        {productColorFiltered.map((mediaUrl) => (
          <Col key={mediaUrl._id} sm={12} md={8} lg={4}>
            <div>
              <div className='relative w-full pt-[133.4%]'>
                <div className='absolute top-0 right-0 w-full h-full'>
                  {mediaUrl.type.includes('image') ? (
                    <>
                      {mediaUrl.status === 'pending' ? (
                        <Skeleton.Node style={{ width: '100%', height: '100%' }} active={true}>
                          <FaRegFileImage style={{ fontSize: 40, color: '#bfbfbf' }} />
                        </Skeleton.Node>
                      ) : (
                        <Image className='rounded-md object-cover overflow-hidden' src={mediaUrl.url} />
                      )}
                    </>
                  ) : mediaUrl.status === 'pending' ? (
                    <Skeleton.Node style={{ width: '100%', height: '100%' }} active={true}>
                      <LuFileVideo style={{ fontSize: 40, color: '#bfbfbf' }} />
                    </Skeleton.Node>
                  ) : (
                    <video className='rounded-md w-full h-full overflow-hidden' src={mediaUrl.url}></video>
                  )}
                </div>
              </div>
              <div className='flex justify-center mt-4'>
                <Button
                  onClick={() => {}}
                  className='mx-1'
                  type='primary'
                  size='small'
                  icon={<LiaExchangeAltSolid />}
                ></Button>
                <Button
                  className='mx-1'
                  type='primary'
                  danger
                  size='small'
                  icon={<MdDelete />}
                  onClick={() => {
                    handleRemoveUploaded(mediaUrl._id);
                  }}
                ></Button>
              </div>
            </div>
          </Col>
        ))}

        {uploadMediaOptions.map((uploadMediaOption) => {
          return (
            <Col key={uploadMediaOption.uid} sm={12} md={8} lg={4}>
              <div style={{ borderColor: `${productColor.colorCode}` }} className='p-2 border-dashed border rounded'>
                {/* <Image className='rounded-md overflow-hidden' src={uploadMediaOption.url} /> */}
                <div className='relative w-full pt-[133.4%]'>
                  <div className='absolute top-0 right-0 w-full h-full'>
                    {uploadMediaOption.type?.includes('image') ? (
                      <Image className='rounded-md object-cover overflow-hidden' src={uploadMediaOption.url} />
                    ) : (
                      <>
                        <div className='absolute top-0 w-full h-full card-video'>
                          <video
                            className='rounded-md w-full h-full overflow-hidden'
                            src={uploadMediaOption.url}
                          ></video>
                          <div className='hover-block absolute hidden items-center justify-center top-0 w-full h-full '>
                            <span className='text-base text-white cursor-pointer'>
                              <EyeOutlined />
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className='flex justify-center mt-4'>
                  <Button
                    onClick={() => {
                      handleRemoveJustUpload(uploadMediaOption.uid);
                    }}
                    disabled={uploadMediaOption.status === undefined && uploadMediaOption.status === 'pending'}
                    className='mx-1'
                    type='primary'
                    danger
                    size='small'
                    icon={<MdDelete />}
                  ></Button>
                </div>
              </div>
            </Col>
          );
        })}
        <Col className='flex items-center'>
          {productColorFiltered.length + uploadMediaOptions.length < 6 && (
            <Upload accept='video/*, image/*' action={actionUpload} fileList={undefined} listType='picture-card'>
              {<ButtonUpload />}
            </Upload>
          )}
        </Col>
        <Col span={24} className='flex justify-center'>
          {checkIsChangeData() && (
            <Button onClick={handleSaveOptionProduct} type='primary'>
              Save
            </Button>
          )}
        </Col>
      </Row>

      {
        <ModelFormOptionProduct
          isModalOpen={isOpenModalEdit}
          formProducColor={formProducColor}
          handleOnSubmitForm={handleSubmitModal}
          handleOnOkModalOption={() => {
            const color = formProducColor.getFieldValue('codeColor');
            if (typeof color !== 'string') {
              formProducColor.setFieldValue('codeColor', color.toHexString());
            }
            formProducColor.submit();
          }}
          handleOnCancelModalOption={() => {
            setIsOpenModalEdit(false);
          }}
          handleOpenChangeCompleteColorPickup={(vl) => {}}
        />
      }
      <ModalVerify
        width={300}
        open={isOpenVerify}
        onCancel={handleCancelVerify}
        onOk={handleOkVerify}
        title={contentVerify.title}
        content={contentVerify.body}
      />
    </div>
  );
};

export default FormEditOption;
