import { Button, ColorPicker, Form, FormInstance, Input, InputNumber, Modal, Popover, Space } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React, { FC, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { RxDotsVertical } from 'react-icons/rx';
import { uid } from 'uid';
import { IOptionProductData } from '../../ProductCreate/ProductCreate';
import { PlusOutlined } from '@ant-design/icons';
import { Color } from 'antd/es/color-picker';

interface IProductOptionEdittingFormModal {
  isModalOpen: boolean;
  producOptionForm: FormInstance<IOptionProductData>;
  handleSubmitForm: (values: IOptionProductData) => void;
  handleOkModal: () => void;
  handleCancelOptionModal: () => void;
  handleSortOption: (optionId: string, value: string) => void;
  handleChangeCompleteColorPickup: (vl: Color) => void;
}

const ProductOptionEdittingFormModal: FC<IProductOptionEdittingFormModal> = ({
  isModalOpen,
  producOptionForm,
  handleSubmitForm,
  handleOkModal,
  handleCancelOptionModal,
  handleChangeCompleteColorPickup
}) => {
  const [isOpenPickColor, setIsOpenPickColor] = useState<boolean>(false);
  return (
    <>
      {isOpenPickColor && <div className='absolute z-[1001] left-0 bottom-0 top-0 right-0'></div>}
      <Modal
        title='Information Product Option'
        open={isModalOpen}
        onOk={handleOkModal}
        width={400}
        onCancel={handleCancelOptionModal}
      >
        <Form onFinish={handleSubmitForm} form={producOptionForm} style={{ marginTop: '30px' }}>
          <Form.Item name='id' hidden>
            <Input />
          </Form.Item>
          <Form.Item name='colorName' label='Color name'>
            <Input />
          </Form.Item>
          <Form.List name='sizeAmounts'>
            {(fields, { add, remove, move }) => {
              return (
                <>
                  {fields.map((props, index) => {
                    return (
                      <FormItem key={props.key} label={`Option ${props.name + 1}`}>
                        <Space className='flex justify-between items-start'>
                          <Space.Compact>
                            <FormItem name={[props.name, 'id']} hidden>
                              <Input />
                            </FormItem>
                            <FormItem name={[props.name, 'order']}>
                              <InputNumber
                                onBlur={() => {
                                  const options = (
                                    producOptionForm.getFieldValue('sizeAmounts') as IOptionProductData['sizeAmounts']
                                  ).sort((a, b) => a.order - b.order);
                                  producOptionForm.setFieldValue('sizeAmounts', options);
                                }}
                                className='w-14'
                              ></InputNumber>
                            </FormItem>
                            <FormItem
                              rules={[
                                {
                                  validator(rule, value) {
                                    if (value.length === 0) {
                                      return Promise.reject('This is a required field');
                                    }
                                    const data: IOptionProductData['sizeAmounts'] =
                                      producOptionForm.getFieldValue('sizeAmounts');

                                    const checkConfict = data.some(
                                      ({ size }, indexCheck) => index !== indexCheck && size === value
                                    );
                                    if (checkConfict) {
                                      return Promise.reject('Confict name');
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}
                              name={[props.name, 'size']}
                            >
                              <Input></Input>
                            </FormItem>
                            <FormItem name={[props.name, 'amount']}>
                              <InputNumber></InputNumber>
                            </FormItem>
                          </Space.Compact>
                          <Popover
                            placement='rightBottom'
                            content={
                              <>
                                <Button
                                  type='primary'
                                  className='mx-1'
                                  onClick={() => {
                                    const sizeAmountsData: IOptionProductData['sizeAmounts'] =
                                      producOptionForm.getFieldValue('sizeAmounts');
                                    const dataBeforeAndEqualIndex = sizeAmountsData.filter((item, i) => i <= index);
                                    const dataAffterIndex = sizeAmountsData
                                      .filter((_, i) => i > index)
                                      .map((sizeAmount) => {
                                        sizeAmount.order++;
                                        return sizeAmount;
                                      });
                                    producOptionForm.setFieldValue('sizeAmounts', [
                                      ...dataBeforeAndEqualIndex,
                                      { id: uid(24), size: 'M', order: index + 1, amount: 0 },
                                      ...dataAffterIndex
                                    ]);
                                  }}
                                  size='small'
                                >
                                  <PlusOutlined />
                                </Button>
                                <Button
                                  className='mx-1'
                                  danger
                                  onClick={() => {
                                    const dataOption: IOptionProductData['sizeAmounts'] =
                                      producOptionForm.getFieldValue('sizeAmounts');
                                    if (dataOption?.length > 1) {
                                      const dataSizeAmounts = dataOption
                                        .filter((item, i) => i !== index)
                                        .map((item, i) => {
                                          item.order = i;
                                          return item;
                                        });
                                      producOptionForm.setFieldValue('sizeAmounts', dataSizeAmounts);
                                    }
                                  }}
                                  size='small'
                                >
                                  <MdDeleteForever />
                                </Button>
                              </>
                            }
                          >
                            <Button
                              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                              shape='circle'
                            >
                              <RxDotsVertical />
                            </Button>
                          </Popover>
                        </Space>
                      </FormItem>
                    );
                  })}
                </>
              );
            }}
          </Form.List>
          <Form.Item label='Color' name={'colorCode'}>
            <ColorPicker
              open={isOpenPickColor}
              onOpenChange={() => {
                setIsOpenPickColor((state) => !state);
              }}
              onChangeComplete={handleChangeCompleteColorPickup}
              value={producOptionForm.getFieldValue('colorCode')}
              format='hex'
              showText
            />
          </Form.Item>
          <Form.Item label='Order' name={'order'}>
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductOptionEdittingFormModal;
