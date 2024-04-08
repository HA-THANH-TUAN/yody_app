import { Button, Form, Modal, Spin, Upload } from 'antd';
import React, { FC, useState } from 'react';
import { IProductColorData } from './ProductCreate';
import { ItemRender, RcFile, UploadFile } from 'antd/es/upload/interface';
import { LoadingOutlined } from '@ant-design/icons';
import { BsEye } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { PlusOutlined } from '@ant-design/icons';
import { MdDeleteForever } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { IFormCreateProduct } from '../../../Components/FormCreateProduct';

export interface IFormUploadProductImage {
  productColor: IProductColorData;
  handleEditOption: IFormCreateProduct['handleEditOption'];
  handleDeleteOption: IFormCreateProduct['handleDeleteOption'];
  handleRemoveMedia: IFormCreateProduct['handleRemoveMedia'];
  actionUpload: IFormCreateProduct['actionUpload'];
  onButtonSave?: () => void;
}

interface IPreviewUpload {
  url?: string;
  type?: string;
  name?: string;
}

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
const FormUploadProductImage: FC<IFormUploadProductImage> = ({
  productColor,
  handleRemoveMedia,
  handleEditOption,
  actionUpload,
  handleDeleteOption,
  onButtonSave
}) => {
  const [previewUpload, setPreviewUpload] = useState<IPreviewUpload>({});
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const handlePreview = async (file: UploadFile) => {
    if (file.url) {
      setPreviewUpload({ url: file.url, type: file.type, name: file.originFileObj?.name });
      setPreviewOpen(true);
    }
  };

  return (
    <div style={{ borderColor: `${productColor.codeColor}` }} className='p-2 border-dashed border rounded mb-3'>
      <div className='relative flex justify-center items-center mb-3'>
        <div className='flex items-center'>
          <span className='mx-2 px-2 text-xl font-semibold'>{productColor.name}</span>
          <span
            className='mx-1 inline-block w-6 h-6 rounded-[50%]'
            style={{ backgroundColor: `${productColor.codeColor}` }}
          ></span>
          <div className='ml-3'>
            {productColor.sizeAmounts.map(({ size, id }) => (
              <span key={id} className='font-bold mx-2'>
                {size}
              </span>
            ))}
          </div>
        </div>
        <div className='absolute flex top-0 right-0 '>
          <span
            onClick={() => {
              handleEditOption(productColor, productColor.id);
            }}
            className='hover:opacity-55  cursor-pointer mx-2 w-6 h-6 flex text-xl items-center'
          >
            <FaRegEdit />
          </span>
          <span
            onClick={() => {
              handleDeleteOption(productColor.id);
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
        <Upload
          accept='video/*, image/*'
          multiple={true}
          action={(file) => actionUpload(file, productColor.id)}
          itemRender={CustomItemRenderUpload}
          onPreview={handlePreview}
          onRemove={(file) => {
            handleRemoveMedia(file, productColor.id);
          }}
          fileList={productColor.data}
          listType='picture-card'
          maxCount={6}
        >
          {productColor.data.length < 6 && <ButtonUpload />}
        </Upload>
      </Form.Item>
      {onButtonSave && <Button onClick={onButtonSave}>Save</Button>}
    </div>
  );
};

export default FormUploadProductImage;
