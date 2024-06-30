import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, ColProps, Form, Input, Modal, Row, Skeleton, Upload } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import { FC, useRef, useState } from 'react';
import { FaCloudUploadAlt, FaRegEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { IFormCreateProduct } from '../../../Components/FormCreateProduct';
import { IOptionProductData } from './ProductCreate';
import { IFormCreateProductData } from '../Pages/Products/ProductCreate/ProductCreate';

export interface IFormUploadProductImage {
  productColor: IOptionProductData;
  onEditOption: IFormCreateProductData['onEditOption'];
  onDeleteOption: IFormCreateProduct['onDeleteOption'];
  onSortOptionImage: IFormCreateProduct['onSortOptionImage'];
  onSortOption: IFormCreateProduct['onSortOption'];
  onRemoveOptionImage: IFormCreateProduct['onRemoveOptionImage'];
  onRemoveMedia: IFormCreateProduct['onRemoveMedia'];
  actionUpload: IFormCreateProduct['actionUpload'];
  actionReUpload: IFormCreateProduct['actionReUpload'];
  onButtonSave?: () => void;
  onChangeOrder?: () => void;
  onAddUploadNewMediaUrl: (optionId: string) => void;
  propCols?: ColProps;
}

interface IPreviewUpload {
  url?: string;
  type?: string;
  name?: string;
}

export const ButtonUpload = () => {
  return (
    <button style={{ border: 0, background: 'none' }} type='button'>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
};
const UploadProductMediaList: FC<IFormUploadProductImage> = ({
  productColor,
  propCols = { sm: { span: 8 } },
  onRemoveMedia,
  onEditOption,
  actionUpload,
  actionReUpload,
  onDeleteOption,
  onChangeOrder,
  onRemoveOptionImage,
  onSortOptionImage,
  onSortOption,
  onButtonSave,
  onAddUploadNewMediaUrl
}) => {
  const buttonReUpload = useRef<HTMLButtonElement>(null);
  const positionProductImageChange = useRef<string>('');
  const [previewUpload, setPreviewUpload] = useState<IPreviewUpload>({});
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const handlePreview = async (file: UploadFile) => {
    if (file.url) {
      setPreviewUpload({ url: file.url, type: file.type, name: file.originFileObj?.name });
      setPreviewOpen(true);
    }
  };

  console.log('productColor::::', productColor);

  return (
    <div style={{ borderColor: `${productColor.colorCode}` }} className='p-2 border-dashed border rounded mb-3'>
      <div className='flex justify-center items-center mb-3'>
        <span className='inline-block mr-2 font-medium'>Order : </span>
        <Input
          value={isNaN(productColor.order) ? '' : productColor.order}
          onChange={(e) => {
            const value = e.target.value;
            onSortOption(productColor.id, value);
          }}
          className='w-10 text-center font-medium'
        />
      </div>
      <div className='relative flex justify-center items-center mb-3'>
        <div className='flex items-center'>
          <span className='mx-2 px-2 text-xl font-semibold'>{productColor.colorName}</span>
          <span
            className='mx-1 inline-block w-6 h-6 rounded-[50%]'
            style={{ backgroundColor: `${productColor.colorCode}` }}
          ></span>
          <div className='ml-3'>
            {productColor.sizeAmounts.map(({ size, amount, id }) => (
              <span key={id} className='font-bold mx-2'>
                {size} - {amount}
              </span>
            ))}
          </div>
        </div>
        <div className='absolute flex top-0 right-0 '>
          <span
            onClick={() => {
              onEditOption(productColor, productColor.id);
            }}
            className='hover:opacity-55  cursor-pointer mx-2 w-6 h-6 flex text-xl items-center'
          >
            <FaRegEdit />
          </span>
          <span
            onClick={() => {
              onDeleteOption(productColor.id);
            }}
            className='hover:opacity-55  cursor-pointer mx-2 w-6 h-6 flex text-2xl text-red-600 items-center'
          >
            <MdDeleteForever />
          </span>
        </div>
      </div>
      <Form.Item>
        <Modal
          open={previewOpen}
          title={previewUpload.name}
          footer={null}
          onCancel={() => {
            setPreviewOpen(false);
          }}
        >
          {previewUpload.type?.includes('image') && (
            <img
              alt={`preview-${previewUpload.name}`}
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              src={previewUpload.url}
            />
          )}
          {previewUpload.type?.includes('video') && (
            <video
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              controls
              src={previewUpload.url}
            />
          )}
        </Modal>
        <Row gutter={[10, 30]}>
          {productColor.productImages
            .sort((a, b) => a.order - b.order)
            .map((option) => (
              <>
                <Col key={option.uid} {...propCols}>
                  <section>
                    <div className='flex items-center justify-center mb-2'>
                      <span className='font-medium'>Order :</span>{' '}
                      <Input
                        value={isNaN(option.order) ? '' : option.order}
                        onChange={(e) => {
                          const value = e.target.value;
                          onSortOptionImage(productColor.id, option.uid, value);
                        }}
                        className='mx-1 w-7 h-7 px-[2px] text-center'
                      />
                    </div>
                    <div className='flex justify-center items-center'>
                      <div className='relative w-full pt-[133%] overflow-hidden'>
                        {option.status === 'uploading' ? (
                          <Skeleton.Image
                            className='absolute !w-full !h-full top-0 right-0 left-0 bottom-0'
                            active={true}
                          />
                        ) : option.type?.includes('video') ? (
                          <video className='w-20 max-h-20 object-contain' src={option.url}></video>
                        ) : (
                          <img
                            className='object-contain rounded-sm absolute top-0 w-full h-full'
                            src={option.url}
                            alt=''
                          />
                        )}
                      </div>
                    </div>
                    <div className='flex justify-center mt-3'>
                      <Button
                        className='mx-1'
                        type='primary'
                        danger
                        size='small'
                        icon={<MdDeleteForever />}
                        onClick={() => {
                          onRemoveOptionImage(productColor.id, option.uid);
                        }}
                      />
                      <Button
                        className='mx-1'
                        type='primary'
                        size='small'
                        icon={<FaCloudUploadAlt />}
                        onClick={() => {
                          positionProductImageChange.current = option.uid;
                          buttonReUpload.current?.click();
                        }}
                      />
                    </div>
                  </section>
                </Col>
              </>
            ))}
          <Col key={6}>
            <Upload
              name='avatar'
              listType='picture-card'
              showUploadList={false}
              action={(file) =>
                new Promise((ok, err) => {
                  console.log('file:::', file);
                })
              }
            >
              <button style={{ border: 0, background: 'none' }} type='button'>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Col>
        </Row>
      </Form.Item>
      {onButtonSave && productColor.productImages.length > 0 && <Button onClick={onButtonSave}>Save</Button>}
    </div>
  );
};

export default UploadProductMediaList;
