

import React, { useState } from 'react';
import { Button, Col, Form,Drawer, Input, Radio, Space, Row } from 'antd';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { ICategory } from '../Models/response';

interface ICategoryDetail {
  detailData: ICategory | any,
  setOpenDraw: React.Dispatch<React.SetStateAction<boolean>>,
  isOpenDraw: boolean

}

const CategoryDetail: React.FC<ICategoryDetail> = ({detailData,setOpenDraw,isOpenDraw}) => {
  console.log("render::")
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right');
  const onChange = (e: RadioChangeEvent) => {
    setPlacement(e.target.value);
  };

  const onClose = () => {
    setOpenDraw(false)
  };

  return (
    <>
      <Drawer
        title="Drawer with extra actions"
        placement={placement}
        width={576}
        onClose={onClose}
        open={isOpenDraw}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
          <section className='overflow-hidden py-3 px-2 rounded-md bg-[white]'>
        <h2 className='text-center mb-4 text-2xl font-semibold'>Detail of category</h2>
        <Form layout="vertical">
          <Row gutter={10}>
            <Col xs={24} lg={12} xl={8}>
              <Form.Item label="Name" required tooltip="This is a required field">
                <Input placeholder="input placeholder" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12} xl={8}>
              <Form.Item
                label="Field B"
                tooltip={{ title: 'Tooltip with customize icon' }}
                >
                <Input placeholder="input placeholder" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12} xl={8}>
              <Form.Item
                label="Field B"
                tooltip={{ title: 'Tooltip with customize icon' }}
                >
                <Input placeholder="input placeholder" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12} xl={8}>
              <Form.Item
                label="Field B"
                tooltip={{ title: 'Tooltip with customize icon' }}
                >
                <Input placeholder="input placeholder" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12} xl={8}>
              <Form.Item
                label="Field B"
                tooltip={{ title: 'Tooltip with customize icon' }}
                >
                <Input placeholder="input placeholder" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12} xl={8}>
              <Form.Item
                label="Field B"
                tooltip={{ title: 'Tooltip with customize icon' }}
                >
                <Input placeholder="input placeholder" />
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item>
                <Button className='bg-blue-500' type="primary">Submit</Button>
              </Form.Item>
            </Col>
           
          </Row>
        </Form>
        </section>
      </Drawer>
    </>
  );
};

export default CategoryDetail;