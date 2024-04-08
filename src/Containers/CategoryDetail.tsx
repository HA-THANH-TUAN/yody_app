import React, { useState } from 'react';
import { Button, Col, Form, Drawer, Input, Radio, Space, Row } from 'antd';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { genSlug } from '../utils/common';
import { GrPowerReset } from 'react-icons/gr';
import { ICategory } from '../Models/category';
interface ICategoryDetail {
  detailData: ICategory;
  setOpenDraw: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenDraw: boolean;
}

interface IValueFieldState<T> {
  value: T;
  isChange: boolean;
}

interface IFormDetailCategory {
  name: IValueFieldState<string>;
  isDeleted: IValueFieldState<boolean>;
}

const CategoryDetail: React.FC<ICategoryDetail> = ({
  detailData,
  setOpenDraw,
  isOpenDraw
}) => {
  const initStateForm = (detailData: ICategory): IFormDetailCategory => ({
    name: {
      value: detailData.name,
      isChange: false
    },
    isDeleted: {
      value: detailData.isDeleted,
      isChange: false
    }
  });
  const [dataForm, setDataForm] = useState<IFormDetailCategory>(() =>
    initStateForm(detailData)
  );

  const isChange = Object.values(dataForm).some(
    (value: IValueFieldState<any>) => value.isChange
  );

  const onClose = () => {
    setOpenDraw(false);
  };
  return (
    <>
      <Drawer
        title='Drawer with extra actions'
        placement={'right'}
        width={576}
        onClose={onClose}
        open={isOpenDraw}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type='primary' onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
        <section className='overflow-hidden py-3 px-2 rounded-md bg-[white]'>
          <h2 className='text-center mb-4 text-2xl font-semibold'>
            Detail of category
          </h2>
          <Form layout='vertical'>
            <Row gutter={10}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label='Name'
                  required
                  tooltip='This is a required field'
                >
                  <Input
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === detailData.name) {
                        setDataForm((state) => ({
                          ...state,
                          name: { ...state.name, value: value, isChange: false }
                        }));
                      } else {
                        setDataForm((state) => ({
                          ...state,
                          name: { ...state.name, value: value, isChange: true }
                        }));
                      }
                    }}
                    placeholder='input placeholder'
                    value={dataForm.name.value}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item label='Slug'>
                  <Input
                    placeholder='input placeholder'
                    value={genSlug(dataForm.name.value)}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label='Status'
                  tooltip={{ title: 'Tooltip with customize icon' }}
                >
                  <Radio.Group
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === detailData.isDeleted) {
                        setDataForm((state) => ({
                          ...state,
                          isDeleted: {
                            ...state.isDeleted,
                            value: value,
                            isChange: false
                          }
                        }));
                      } else {
                        setDataForm((state) => ({
                          ...state,
                          isDeleted: {
                            ...state.isDeleted,
                            value: value,
                            isChange: true
                          }
                        }));
                      }
                    }}
                    value={dataForm.isDeleted.value}
                  >
                    <Radio value={false}>Active</Radio>
                    <Radio value={true}>Deleted</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={24} lg={12} xl={8}>
                <Form.Item
                  label='Field B'
                  tooltip={{ title: 'Tooltip with customize icon' }}
                >
                  <Input placeholder='input placeholder' />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item>
                  <Button
                    disabled={!isChange}
                    type='primary'
                    style={{ marginRight: '30px' }}
                  >
                    Save
                  </Button>
                  <Button
                    disabled={!isChange}
                    danger
                    onClick={() => {
                      setDataForm((state) => ({
                        ...state,
                        ...initStateForm(detailData)
                      }));
                    }}
                    icon={<GrPowerReset />}
                    type='text'
                  ></Button>
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
