import { Modal, Spin } from 'antd';
import React, { FC } from 'react';

interface ISpinModal {
  isOpen: boolean;
}
const SpinModal: FC<ISpinModal> = ({ isOpen }) => {
  return (
    <>
      {isOpen && (
        <section className='w-screen h-screen flex justify-center items-center fixed top-0 bg-[#0000002e] right-0 z-[1000]'>
          <Spin size='large'></Spin>
        </section>
      )}
    </>
  );
};

export default SpinModal;
