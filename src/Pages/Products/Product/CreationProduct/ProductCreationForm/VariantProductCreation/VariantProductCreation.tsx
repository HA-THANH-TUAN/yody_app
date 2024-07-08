import { Button, Collapse, Form, Modal } from 'antd';
import React, { FC, useState } from 'react';
import { FaRegPlusSquare } from 'react-icons/fa';
import SizeAmountProductForm from './SizeAmountProductCreation/SizeAmountProductForm';
import BaseVariantProductCreationForm from './BaseVariantProductCreationForm';
interface IVariantProductCreation {}
interface IVariantProductCreationForm {}

const VariantProductCreationForm: FC<IVariantProductCreationForm> = () => {
  console.log('render');

  return (
    <Form>
      <Form.Item></Form.Item>
    </Form>
  );
};
const VariantProductCreation: FC<IVariantProductCreation> = () => {
  const [isOpenCreationVariantModal, setIsOpenCreationVariantModal] = useState<boolean>(true);
  const handleCloseCreationVariantModal = () => {
    setIsOpenCreationVariantModal(false);
  };
  const handleCreateVariant = () => {};
  const handleOpenCreationVariantModal = () => {
    setIsOpenCreationVariantModal(true);
  };
  return (
    <>
      <Modal
        title={<p className='text-center text-2xl'>Create Base Variant</p>}
        open={isOpenCreationVariantModal}
        onCancel={handleCloseCreationVariantModal}
        onOk={handleCreateVariant}
      >
        <BaseVariantProductCreationForm />
      </Modal>
      <Collapse
        className='mb-6'
        size='small'
        items={[
          {
            key: '1',
            label: 'Variant Product',
            children: <VariantProductCreationForm />,
            extra: (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenCreationVariantModal();
                }}
                type='primary'
                size='small'
                icon={<FaRegPlusSquare />}
              ></Button>
            )
          }
        ]}
      />
    </>
  );
};

export default VariantProductCreation;
