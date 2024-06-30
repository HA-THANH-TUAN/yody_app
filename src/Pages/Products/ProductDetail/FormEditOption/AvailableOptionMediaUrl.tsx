import { Button, Image, Input, Skeleton } from 'antd';
import React, { FC } from 'react';
import { FaRegFileImage } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IMediaUrlsProductColor } from '../../../../Models/product';
import { LuFileVideo } from 'react-icons/lu';

interface IAvailableOptionMediaUrl {
  onRemoveAvailableMediaUrl: (mediaUrlId: string) => void;
  onChangeOrderAvaliableMediaUrl: (mediaUrlId: string, value: string) => void;
  mediaUrl: IMediaUrlsProductColor;
  dataEditOrder:
    | {
        _id: string;
        order: number;
      }
    | undefined;
}
const AvailableOptionMediaUrl: FC<IAvailableOptionMediaUrl> = ({
  onRemoveAvailableMediaUrl,
  onChangeOrderAvaliableMediaUrl,
  mediaUrl,
  dataEditOrder
}) => {
  return (
    <div>
      <div className='flex justify-center items-center mb-3'>
        <span className='inline-block mr-2 font-medium'>Order : </span>
        <Input
          value={dataEditOrder ? dataEditOrder.order : mediaUrl.order}
          onChange={(e) => {
            const value = e.target.value;
            onChangeOrderAvaliableMediaUrl(mediaUrl._id, value);
          }}
          className='w-10 text-center font-medium'
        />
      </div>
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
          className='mx-1'
          type='primary'
          disabled={mediaUrl.status === 'pending'}
          danger
          size='small'
          icon={<MdDelete />}
          onClick={() => {
            onRemoveAvailableMediaUrl(mediaUrl._id);
          }}
        ></Button>
      </div>
    </div>
  );
};

export default AvailableOptionMediaUrl;
