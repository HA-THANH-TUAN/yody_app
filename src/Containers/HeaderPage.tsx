import { Header } from 'antd/es/layout/layout';
import React, { FC } from 'react';

import { Button, theme } from 'antd';
import { useAppDispatch, useAppSelector } from '../app/hook';
import {
  collapsedSiderBar,
  selectCollapsedSiderBar
} from '../Features/setting';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

interface IHeaderPage {}
const HeaderPage: FC<IHeaderPage> = () => {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  const dispatch = useAppDispatch();
  const isCollapsedSiderBar = useAppSelector(selectCollapsedSiderBar);
  const collapseSiderBar = () => {
    dispatch(collapsedSiderBar());
  };

  return (
    <Header className={`p-0 flex items-center px-5 bg-[${colorBgContainer}]`}>
      <div>
        <Button
          className='bg-blue-300'
          type='primary'
          shape='default'
          icon={
            isCollapsedSiderBar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
          onClick={collapseSiderBar}
        />
      </div>
      {/* <section className='flex-1'>
        <div className='w-full flex justify-between'>
          <div className='w-80'>
            <Space.Compact style={{ width: '100%' }}>
              <Input placeholder="Search for ..." />
              <Button icon={<SearchOutlined />} className='bg-blue-500' type="primary"></Button>
            </Space.Compact>
          </div>
          <div className='flex items-center'>
            <Badge className='mr-4' size='default' count={5} offset={[-5, 5]}>
              <span className='w-8 flex h-8 items-center text-3xl'>< BsBellFill className='text-zinc-400' /></span>
            </Badge>
            <Badge className='mr-8' size='default' count={5} offset={[-3, 5]}>
              <span className='w-8 flex h-8 items-center text-4xl'>< FaShoppingCart className='text-zinc-400' /></span>
            </Badge>
            <div className='flex items-center ml-10'><Avatar size={'large'} icon={<UserOutlined />}/> <span className='ml-1 font-medium text-lg'>Ha Thanh</span></div>
          </div>
        </div>
      </section> */}
    </Header>
  );
};

export default HeaderPage;
