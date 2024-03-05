import { Content } from 'antd/es/layout/layout'
import React, { FC } from 'react'
interface IHome {
  colorBgContainer: string,
borderRadiusLG: number,
}

const Home :FC<IHome> = ({colorBgContainer, borderRadiusLG}) => {
  return (
    <Content style={{ margin: '24px 16px 0' }}>
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        content
      </div>
    </Content>
  )
}

export default Home