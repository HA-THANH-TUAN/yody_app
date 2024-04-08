import {
  Button,
  ColorPicker,
  ColorPickerProps,
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  ModalProps,
  Popover,
  Space
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { PlusOutlined } from '@ant-design/icons';
import { MdDeleteForever } from 'react-icons/md';
import { RxDotsVertical } from 'react-icons/rx';

import React, { FC } from 'react';
import { uid } from 'uid';

interface IModalProductColor {
  openModal: ModalProps['open'];
  onOkModal: ModalProps['onOk'];
  onCancelModal: ModalProps['onCancel'];
  openPickUp?: ColorPickerProps['open'];
}

interface IInformationProductColor {
  id: string;
  name: string;
  codeProduct: string;
  sizeAmounts: { id: string; size: string; amount: number }[];
  codeColor: string;
}
const ModalProductColor: FC<IModalProductColor> = (props) => {
  const [form] = Form.useForm<IInformationProductColor>();
  return (
    <Modal
      title='Informattion Product Color'
      open={props.openModal}
      onOk={props.onOkModal}
      width={400}
      onCancel={props.onCancelModal}
    >
      <Form
        onFinish={(values) => {
          //   formCreateProduct.setFieldValue('options', [
          //     ...formCreateProduct.getFieldValue('options'),
          //     { ...values, id: uid(24), data: [] }
          //   ]);
          //   form.setFieldsValue(initialFormProductColor);
          //   setIsModalOpen(false);
        }}
        form={form}
        style={{ marginTop: '30px' }}
      >
        <Form.Item name='name' label='Color name'>
          <Input />
        </Form.Item>
        <Form.List name='sizeAmounts'>
          {(fields, { add, remove, move }) => {
            return (
              <>
                {fields.map((props, index) => {
                  return (
                    <FormItem key={props.key} label={`Option ${props.key + 1}`}>
                      <Space className='flex justify-between items-start'>
                        <Space.Compact key={props.key}>
                          <FormItem
                            rules={[
                              {
                                validator(rule, value) {
                                  //   if (value.length === 0) {
                                  //     return Promise.reject('This is a required field');
                                  //   }
                                  //   const data: IProductColorData['sizeAmounts'] = form.getFieldValue('sizeAmounts');
                                  //   const checkConfict = data.some(
                                  //     ({ size }, indexCheck) => index !== indexCheck && size === value
                                  //   );
                                  //   if (checkConfict) {
                                  //     return Promise.reject('Confict name');
                                  //   }
                                  //   return Promise.resolve();
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
                                  const dataOption = form.getFieldValue('sizeAmounts');
                                  if (dataOption?.length > 1) {
                                    remove(props.key);
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
        {/* <Form.Item label='Amount'></Form.Item> */}
        <Form.Item label='Color' name={'codeColor'}>
          <ColorPicker
            open={props.openPickUp}
            onOpenChange={() => {
              //   setIsOpenPickColor((state) => !state);
            }}
            onChangeComplete={(vl) => {
              form.setFieldValue('codeColor', '#' + vl.toHex() ?? '');
            }}
            format='hex'
            value={form.getFieldValue('codeColor')}
            showText
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalProductColor;
