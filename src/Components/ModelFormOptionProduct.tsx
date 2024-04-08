import { Button, ColorPicker, Form, FormInstance, Input, InputNumber, Modal, Popover, Space } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React, { FC, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { RxDotsVertical } from 'react-icons/rx';
import { uid } from 'uid';
import { IInformationProductColor, IProductColorData } from '../Pages/Products/ProductCreate/ProductCreate';
import { PlusOutlined } from '@ant-design/icons';
import { Color } from 'antd/es/color-picker';

interface IModelFormOptionProduct {
  isModalOpen: boolean;
  formProducColor: FormInstance<IInformationProductColor>;
  handleOnSubmitForm: (values: IInformationProductColor) => void;
  handleOnOkModalOption: () => void;
  handleOnCancelModalOption: () => void;
  handleOpenChangeCompleteColorPickup: (vl: Color) => void;
}

const ModelFormOptionProduct: FC<IModelFormOptionProduct> = ({
  isModalOpen,
  formProducColor,
  handleOnSubmitForm,
  handleOnOkModalOption,
  handleOnCancelModalOption,
  handleOpenChangeCompleteColorPickup
}) => {
  const [isOpenPickColor, setIsOpenPickColor] = useState<boolean>(false);
  return (
    <>
      {isOpenPickColor && <div className='absolute z-[1001] left-0 bottom-0 top-0 right-0'></div>}
      <Modal
        title='Informattion Product Color'
        open={isModalOpen}
        onOk={handleOnOkModalOption}
        width={400}
        onCancel={handleOnCancelModalOption}
      >
        <Form onFinish={handleOnSubmitForm} form={formProducColor} style={{ marginTop: '30px' }}>
          <Form.Item name='id' hidden>
            <Input />
          </Form.Item>
          <Form.Item name='name' label='Color name'>
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
                            <FormItem
                              rules={[
                                {
                                  validator(rule, value) {
                                    if (value.length === 0) {
                                      return Promise.reject('This is a required field');
                                    }
                                    const data: IProductColorData['sizeAmounts'] =
                                      formProducColor.getFieldValue('sizeAmounts');

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
                                    add({ id: uid(24), size: 'M', amount: 0 });
                                  }}
                                  size='small'
                                >
                                  <PlusOutlined />
                                </Button>
                                <Button
                                  className='mx-1'
                                  danger
                                  onClick={() => {
                                    const dataOption = formProducColor.getFieldValue('sizeAmounts');
                                    if (dataOption?.length > 1) {
                                      remove(props.name);
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
          <Form.Item label='Color' name={'codeColor'}>
            <ColorPicker
              open={isOpenPickColor}
              onOpenChange={() => {
                setIsOpenPickColor((state) => !state);
              }}
              onChangeComplete={handleOpenChangeCompleteColorPickup}
              value={formProducColor.getFieldValue('codeColor')}
              format='hex'
              showText
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModelFormOptionProduct;
