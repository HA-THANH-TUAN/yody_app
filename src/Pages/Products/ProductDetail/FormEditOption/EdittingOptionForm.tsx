import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, GetProp, Row, Upload, UploadProps } from 'antd';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import { FC } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { MdDeleteForever, MdDriveFolderUpload } from 'react-icons/md';
import { IMediaUrlsProductColor, IProductColor } from '../../../../Models/product';
import AvailableOptionMediaUrl from './AvailableOptionMediaUrl';
import NewOptionMediaUrl from './NewOptionMediaUrl';
import { BsPlusLg } from 'react-icons/bs';

export interface IMediaUploadAddtion extends UploadFile {
  order: number;
}
export interface IEdittingOptionForm {
  productColor: IProductColor;
  dataUpdateOptionProduct: IDataUpdateOptionProduct;
  onRemoveNewMediaUrl: (optionId: string, uid: string) => void;
  onChangeOrderNewMediaUrl: () => void;
  onRemoveAvailableMediaUrl: (optionId: string, mediaUrlId: string) => void;
  onRemoveAvailableProductOption: (optionId: string) => void;
  onResetProductOption: (optionId: string) => void;
  onSaveProductOption: (optionId: string) => void;
  onChangeOrderAvaliableMediaUrl: () => void;
  actionUploadAvailableMediaUrl: (file: RcFile, optionId: string, order: number) => Promise<string>;
  onReUploadAvailableMediaUrl: (optionId: string, mediaId: string) => void;
  onEditAvailableOptionProduct: (optionId: string) => void;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export interface IEditSizeAmounts {
  sizeAmountId: string;
  amount?: number;
  size?: string;
  order?: number;
}

export interface IDataUpdateOptionProduct {
  uploads: {
    delete: string[];
    add: IMediaUploadAddtion[];
    edit: { _id: string; order: number }[];
  };
  sizeAmounts: {
    delete: string[];
    add: IAddSizeAmounts[];
    edit: IEditSizeAmounts[];
  };
  name?: string;
  colorCode?: string;
  order?: number;
}

interface IAddSizeAmounts {
  id: string;
  size: string;
  amount: number;
  order: number;
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

export const ButtonUpload = () => {
  return (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
};

const EdittingOptionForm: FC<IEdittingOptionForm> = ({
  productColor,
  dataUpdateOptionProduct,
  onRemoveNewMediaUrl,
  onChangeOrderNewMediaUrl,
  onRemoveAvailableMediaUrl,
  onChangeOrderAvaliableMediaUrl,
  onRemoveAvailableProductOption,
  actionUploadAvailableMediaUrl,
  onResetProductOption,
  onSaveProductOption,
  onReUploadAvailableMediaUrl,
  onEditAvailableOptionProduct
}) => {
  const checkIsChangeData = () => {
    const isSizeAmountChange = Object.values(dataUpdateOptionProduct.sizeAmounts).some((value) => value.length > 0);
    const isUploadChange = Object.values(dataUpdateOptionProduct.uploads).some((value) => value.length > 0);
    return (
      isSizeAmountChange ||
      isUploadChange ||
      dataUpdateOptionProduct['colorCode'] !== undefined ||
      dataUpdateOptionProduct['name'] !== undefined ||
      dataUpdateOptionProduct['order'] !== undefined
    );
  };

  const productColorFiltered: (IMediaUrlsProductColor | IMediaUploadAddtion)[] = [
    ...productColor.mediaUrls,
    ...dataUpdateOptionProduct.uploads.add
  ]
    .filter((mediaUrl) => {
      if ((mediaUrl as IMediaUploadAddtion)?.uid) {
        return true;
      } else {
        const result = !dataUpdateOptionProduct['uploads']['delete'].includes((mediaUrl as IMediaUrlsProductColor)._id);
        return result;
      }
    })
    .sort((a, b) => {
      let orderA = 0;
      let orderB = 0;
      if ((a as IMediaUploadAddtion).uid) {
        orderA = a.order;
      } else {
        const dataEdit = dataUpdateOptionProduct.uploads.edit;
        const itemA = dataEdit.find((item) => item._id === (a as IMediaUrlsProductColor)._id);
        orderA = itemA ? itemA.order : (a as IMediaUrlsProductColor).order;
      }
      if ((b as IMediaUploadAddtion).uid) {
        orderB = b.order;
      } else {
        const dataEdit = dataUpdateOptionProduct.uploads.edit;
        const itemB = dataEdit.find((item) => item._id === (b as IMediaUrlsProductColor)._id);
        orderB = itemB ? itemB.order : (b as IMediaUrlsProductColor).order;
      }
      return orderA - orderB;
    });
  return (
    <div style={{ borderColor: `${productColor.colorCode}` }} className='mb-8 p-2 border-dashed border rounded'>
      <div className='relative flex justify-center mb-3 items-center'>
        <div className='flex items-center'>
          <span className='mx-2 px-2 text-xl font-semibold'>{dataUpdateOptionProduct.name ?? productColor.color}</span>
          <span
            className='mx-1 inline-block w-6 h-6 rounded-[50%]'
            style={{ backgroundColor: `${dataUpdateOptionProduct.colorCode ?? productColor.colorCode}` }}
          ></span>
          <div className='ml-3'>
            {productColor.sizeAmounts.map(({ size, _id, amount }) => {
              const isDeleted = dataUpdateOptionProduct.sizeAmounts.delete.some((id) => id === _id);
              let isEditSize = false;
              let isEditAmount = false;
              const editValue = dataUpdateOptionProduct.sizeAmounts.edit.find((edit) => edit.sizeAmountId === _id);
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
            {dataUpdateOptionProduct.sizeAmounts.add.map((sizeAmount) => (
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
            className='hover:opacity-55  cursor-pointer mx-2 w-6 h-6 flex text-2xl items-center'
            onClick={() => onEditAvailableOptionProduct(productColor._id)}
          >
            <FaRegEdit />
          </span>
          <span
            onClick={() => {
              onRemoveAvailableProductOption(productColor._id);
            }}
            className='hover:opacity-55  cursor-pointer mx-2 w-6 h-6 flex text-2xl text-red-600 items-center'
          >
            <MdDeleteForever />
          </span>
        </div>
      </div>
      <Row gutter={[20, 15]}>
        {productColorFiltered.map((mediaUrl) => {
          if ((mediaUrl as IMediaUploadAddtion).uid) {
            return (
              <Col key={(mediaUrl as IMediaUploadAddtion).uid} sm={12} md={8} lg={4}>
                <NewOptionMediaUrl
                  onRemoveNewMediaUrl={() => {
                    onRemoveNewMediaUrl(productColor._id, (mediaUrl as IMediaUploadAddtion).uid);
                  }}
                  productColor={productColor}
                  uploadMediaOption={mediaUrl as IMediaUploadAddtion}
                  onChangeOrderNewMediaUrl={onChangeOrderNewMediaUrl}
                  onReUploadAvailableMediaUrl={onReUploadAvailableMediaUrl}
                />
              </Col>
            );
          } else {
            const dataEditOrder = dataUpdateOptionProduct.uploads.edit.find(
              ({ _id }) => (mediaUrl as IMediaUrlsProductColor)._id === _id
            );
            return (
              <Col key={(mediaUrl as IMediaUrlsProductColor)._id} sm={12} md={8} lg={4}>
                <AvailableOptionMediaUrl
                  dataEditOrder={dataEditOrder}
                  onRemoveAvailableMediaUrl={() => {
                    onRemoveAvailableMediaUrl(productColor._id, (mediaUrl as IMediaUrlsProductColor)._id);
                  }}
                  onChangeOrderAvaliableMediaUrl={onChangeOrderAvaliableMediaUrl}
                  mediaUrl={mediaUrl as IMediaUrlsProductColor}
                />
              </Col>
            );
          }
        })}
        <Col className='flex items-center'>
          {productColorFiltered.length < 6 && (
            <div className='flex justify-center items-center border border-zinc-400 rounded border-dashed'>
              <span className='flex text-2xl justify-center opacity-90 items-center p-5'>
                <BsPlusLg />
              </span>
            </div>
          )}
          {productColorFiltered.length < 6 && (
            <Upload
              accept='video/*, image/*'
              action={(file) => {
                const order = Math.max(...productColorFiltered.map((item) => item.order)) + 1;
                return actionUploadAvailableMediaUrl(file, productColor._id, order);
              }}
              fileList={[]}
              listType='picture-card'
            >
              {<ButtonUpload />}
            </Upload>
          )}
        </Col>
        <Col span={24} className='flex justify-center'>
          {checkIsChangeData() && (
            <>
              <Button
                className='mx-3'
                onClick={() => {
                  onResetProductOption(productColor._id);
                }}
                type='primary'
              >
                Reset
              </Button>
              <Button
                className='mx-3'
                onClick={() => {
                  onSaveProductOption(productColor._id);
                }}
                type='primary'
              >
                Save
              </Button>
            </>
          )}
        </Col>
      </Row>

      {/* {
        <ModelFormCreateOptionProduct
          handleSortOption={() => {}}
          isModalOpen={isOpenModalEdit}
          formProducColor={formProducColor}
          handleOnSubmitForm={handleSubmitModal}
          handleOnOkModalOption={handleOkModalOption}
          handleOnCancelModalOption={() => {
            setIsOpenModalEdit(false);
          }}
          handleOpenChangeCompleteColorPickup={(vl) => {}}
        />
      } */}
    </div>
  );
};

export default EdittingOptionForm;
