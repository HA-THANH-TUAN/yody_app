import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;
const FooterPage: React.FC = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
    </Footer>
    // <Layout hasSider>
      
    //   <Layout style={{ marginLeft: 200 }}>
  
    //     <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
    //       <div
    //         style={{
    //           padding: 24,
    //           textAlign: 'center',
    //           background: colorBgContainer,
    //           borderRadius: borderRadiusLG,
    //         }}
    //       >
    //         <p>long content</p>
    //         {
    //           // indicates very long content
    //           Array.from({ length: 100 }, (_, index) => (
    //             <React.Fragment key={index}>
    //               {index % 20 === 0 && index ? 'more' : '...'}
    //               <br />
    //             </React.Fragment>
    //           ))
    //         }
    //       </div>
    //     </Content>
        
    //   </Layout>
    // </Layout>
  );
};

export default FooterPage;