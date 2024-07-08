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
import logoMini from '../Assets/images/logo-mini.png';
import logo from '../Assets/images/yody-logo.svg';
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
  console.log('colorBgContainer::: ', colorBgContainer);
  return (
    <div className={`hidden-scrollbar bg-[#001529] overflow-y-auto`}>
      <div className='flex h-16 items-center justify-center border-r border-b border-l-0 border-t-0 border-white border-solid'>
        <span className={`block`}>
          {!collapsed && screenWidth > 768 ? (
            <img className='h-full block object-contain' src={logo} alt='' />
          ) : (
            <img className='max-h-8 max-w-10 object-contain block' src={logoMini} alt='logo-mini' />
          )}
        </span>
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
