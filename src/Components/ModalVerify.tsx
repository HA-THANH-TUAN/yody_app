import { Modal } from 'antd';
import React, { FC } from 'react';
interface IModalVerify {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  content?: React.ReactNode;
  width?: number;
  title?: React.ReactNode;
}
const ModalVerify: FC<IModalVerify> = ({ open, onOk, width, onCancel, title, content }) => {
  return (
    <Modal title={title ?? 'Basic Modal'} width={width ?? 500} open={open} onOk={onOk} onCancel={onCancel}>
      <div className='my-6'>{content}</div>
    </Modal>
  );
};

export default ModalVerify;
