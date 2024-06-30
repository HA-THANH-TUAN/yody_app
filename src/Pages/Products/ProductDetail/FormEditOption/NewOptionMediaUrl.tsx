import { Button, Image, Input, Skeleton } from 'antd';
import React, { FC } from 'react';
import { MdDelete } from 'react-icons/md';
import { EyeOutlined } from '@ant-design/icons';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { IMediaUploadAddtion, IEdittingOptionForm } from './EdittingOptionForm';

interface INewOptionMediaUrl {
  productColor: IEdittingOptionForm['productColor'];
  uploadMediaOption: IMediaUploadAddtion;
  onRemoveNewMediaUrl: (mediaOptionId: string) => void;
  onChangeOrderNewMediaUrl: (mediaUrlId: string, value: string) => void;
  onReUploadAvailableMediaUrl: (optionId: string, mediaId: string) => void;
}

const NewOptionMediaUrl: FC<INewOptionMediaUrl> = ({
  productColor,
  uploadMediaOption,
  onRemoveNewMediaUrl,
  onChangeOrderNewMediaUrl,
  onReUploadAvailableMediaUrl
}) => {
  return (
    <div style={{ borderColor: `${productColor.colorCode}` }} className='p-2 border-dashed border rounded'>
      <div className='flex justify-center items-center mb-3'>
        <span className='inline-block mr-2 font-medium'>Order : </span>
        <Input
          value={isNaN(uploadMediaOption.order) ? '' : uploadMediaOption.order}
          onChange={(e) => {
            const value = e.target.value;
            onChangeOrderNewMediaUrl(uploadMediaOption.uid, value);
          }}
          className='w-10 text-center font-medium'
        />
      </div>
      <div className='relative w-full pt-[133.4%]'>
        <div className='absolute top-0 right-0 w-full h-full'>
          {uploadMediaOption.status === 'uploading' ? (
            <Skeleton.Image className='absolute !w-full !h-full top-0 right-0 left-0 bottom-0' active={true} />
          ) : uploadMediaOption.type?.includes('image') ? (
            <Image className='rounded-md object-cover overflow-hidden' src={uploadMediaOption.url} />
          ) : (
            <>
              <div className='absolute top-0 w-full h-full card-video'>
                <video className='rounded-md w-full h-full overflow-hidden' src={uploadMediaOption.url}></video>
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
            onReUploadAvailableMediaUrl(productColor._id, uploadMediaOption.uid);
          }}
          className='mx-1'
          type='primary'
          size='small'
          icon={<FaCloudUploadAlt />}
        ></Button>
        <Button
          onClick={() => {
            onRemoveNewMediaUrl(uploadMediaOption.uid);
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
  );
};

export default NewOptionMediaUrl;
