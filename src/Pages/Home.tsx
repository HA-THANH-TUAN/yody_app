import { theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { FC } from 'react';
interface IHome {}

const Home: FC<IHome> = () => {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();
  return (
    <Content style={{ margin: '24px 16px 0' }}>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG
        }}
      >
        content
      </div>
    </Content>
  );
};

export default Home;
