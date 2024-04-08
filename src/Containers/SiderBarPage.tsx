import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu, theme } from 'antd';
import Layout from 'antd/es/layout/layout';
import { useAppSelector } from '../app/hook';
import { selectCollapsedSiderBar, selectScreenWidth } from '../Features/setting';
import logo from '../Assets/images/logo_y.png';
import { MdDashboard } from 'react-icons/md';
import { GrProductHunt } from 'react-icons/gr';
import { CgWebsite } from 'react-icons/cg';
import { BiSolidBookContent } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '1', <MdDashboard />),
  getItem('Pages', 'pages', <CgWebsite />, [getItem('Banner', 'banner')]),
  getItem('Products', 'products', <GrProductHunt />, [
    getItem('Category', 'products/category'),
    getItem('Product', 'products/product'),
    getItem('SEO', 'products/seo'),
    getItem('Collection', 'products/collection')
  ]),
  getItem('Blogs', 'blogs', <BiSolidBookContent />, [
    getItem('Category', 'blogs/category'),
    getItem('Blog', 'blogs/blog'),
    getItem('SEO', 'blogs/seo')
  ])
];

const SiderBarPage: React.FC = () => {
  const collapsed = useAppSelector(selectCollapsedSiderBar);
  const nav = useNavigate();
  const screenWidth = useAppSelector(selectScreenWidth);
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  return (
    <div className={`hidden-scrollbar bg-[${colorBgContainer}] overflow-y-auto border-r`}>
      <div className='flex h-16 items-center justify-center border-b'>
        <span className='inline-block w-10 h-10 rounded-[50%] bg-blue-500 '>
          <img className='w-full h-full block p-[10px] object-contain' src={logo} alt='' />
        </span>
        {!collapsed && screenWidth > 768 && <span className='font-semibold text-xl ml-2'>ADMIN</span>}
      </div>
      <Menu
        style={{
          height: '100%',
          paddingBottom: '2rem',
          borderInlineEnd: 'none'
        }}
        defaultSelectedKeys={['5']}
        defaultOpenKeys={['sub2-5']}
        onClick={(infor) => {
          const key = infor.key;
          nav(key);
        }}
        mode={'inline'}
        theme='dark'
        inlineCollapsed={screenWidth > 768 ? collapsed : true}
        items={items}
      />
    </div>
  );
};

export default SiderBarPage;
