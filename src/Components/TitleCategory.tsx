import { Dispatch } from '@reduxjs/toolkit';
import { Button, Popover } from 'antd';
import { SetStateAction } from 'react';
import { BiDetail } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { IoCreateSharp } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface ITiltleCategory {
  title: string;
  onClickTitle: () => void;
  setDetailCategory?: () => void;
  openToolKey: string;
  id: string;
  handleClickTool: () => void;
}

const TiltleCategory: React.FC<ITiltleCategory> = ({
  title,
  onClickTitle,
  setDetailCategory,
  id,
  openToolKey,
  handleClickTool
}) => {
  const nav = useNavigate();
  return (
    <div className='flex justify-between'>
      <span onClick={onClickTitle} className='flex items-center flex-1'>
        {title}
      </span>
      <Popover
        placement='bottomRight'
        open={openToolKey === id}
        onOpenChange={handleClickTool}
        content={
          <div>
            <Button
              onClick={(e) => {
                nav(`/products/category/${id}`);
              }}
              type='dashed'
              icon={<BiDetail />}
              style={{ marginRight: '10px' }}
            />
            <Button
              onClick={(e) => {
                handleClickTool();
                setDetailCategory?.();
              }}
              type='primary'
              style={{ marginRight: '10px' }}
              icon={<CiEdit />}
            />
            <Button
              onClick={(e) => {
                handleClickTool();
              }}
              type='primary'
              style={{ marginRight: '10px' }}
              icon={<IoCreateSharp />}
            />
            <Button
              onClick={(e) => {
                handleClickTool();
              }}
              danger
              type='primary'
              icon={<MdDelete />}
            />
          </div>
        }
        trigger='click'
      >
        <Button type='link' size='small'>
          <BsThreeDotsVertical />
        </Button>
      </Popover>
    </div>
  );
};

export default TiltleCategory;
