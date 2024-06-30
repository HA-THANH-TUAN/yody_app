import { Button, Drawer, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { FC, useEffect, useState } from 'react';
import { parseJsonData } from '../../../utils/common';
export interface IDrawerSettingPrefixValueSeo {
  onCloseDrawerSetting: () => void;
  isOpen: boolean;
}
export interface IPrefixValueSeo {
  descriptionPrefix: string;
  keywordsPrefix: string;
  urlPrefix: string;
}
const DrawerSettingPrefixValueSeo: FC<IDrawerSettingPrefixValueSeo> = ({ onCloseDrawerSetting, isOpen }) => {
  const handleOnSubmit = (values: IPrefixValueSeo) => {
    console.log('IPrefixValueSeo::::', values);
  };
  useEffect(() => {
    const dataLocalStorage = localStorage.getItem('defaultSettingPrefixSeoProduct');
    const valueJson: any = parseJsonData(dataLocalStorage ?? '');
    formSettingPrefix.setFieldsValue({
      descriptionPrefix: valueJson?.description ?? '',
      keywordsPrefix: valueJson?.keywords ?? '',
      urlPrefix: valueJson?.url ?? ''
    });
  }, []);
  const [formSettingPrefix] = useForm<IPrefixValueSeo>();
  return (
    <div>
      <Drawer
        title={<p className='text-center'>SETTING PREFIX VALUE SEO</p>}
        onClose={onCloseDrawerSetting}
        open={isOpen}
      >
        <Form
          onFinish={handleOnSubmit}
          labelCol={{ flex: '80px' }}
          labelAlign='left'
          labelWrap
          wrapperCol={{ flex: 1 }}
          form={formSettingPrefix}
        >
          <Form.Item label='Description' name='descriptionPrefix'>
            <Input placeholder='Description ...' />
          </Form.Item>
          <Form.Item label='Keywords' name='keywordsPrefix'>
            <Input placeholder='Keywords ...' />
          </Form.Item>
          <Form.Item label='Url' name='urlPrefix'>
            <Input placeholder='Keywords ...' />
          </Form.Item>
          <Form.Item className='flex justify-center'>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default DrawerSettingPrefixValueSeo;
