import {
  Col,
  Radio,
  Input,
  Form,
  Row,
  Button,
  Menu,
  TreeDataNode,
  Breadcrumb,
  RadioChangeEvent,
  Spin,
  message
} from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { FaArrowRightLong } from 'react-icons/fa6';
import {
  getCategoryForId,
  selectCategoryDetail,
  selectStatusGetCategories,
  selectStatusUpdateCategory,
  updateCategory
} from '../../Features/categoryPageSlice';
import ForwardDirectoryTree from 'antd/es/tree/DirectoryTree';
import { AntTreeNodeProps } from 'antd/es/tree';
import { TiArrowSortedDown } from 'react-icons/ti';
import { ICategory } from '../../Models/response';
import TiltleCategory from '../../Components/TitleCategory';
import { PayloadUpdateCategory } from '../../apis/category';
import { genSlug } from '../../utils/common';

interface ICategoryDetail {
  name?: string;
}

interface IValueOfKeyFormForm<T> {
  isChange: boolean;
  value: T;
}
interface IFormEditCategory {
  name: IValueOfKeyFormForm<string>;
  status: IValueOfKeyFormForm<string>;
}

const initialMountForm = (data: ICategory | undefined): IFormEditCategory => {
  return {
    name: { value: data?.name ?? '', isChange: false },
    status: { value: Boolean(data?.isDeleted) ? '1' : '0', isChange: false }
  };
};

const CategoryDetail: FC<ICategoryDetail> = (props) => {
  const idCategory = useParams().id;
  const dispatch = useAppDispatch();
  const categoryDetail = useAppSelector(selectCategoryDetail);
  const statusUpdateCategory = useAppSelector(selectStatusUpdateCategory);
  const statusGetCategories = useAppSelector(selectStatusGetCategories);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [openToolKey, setOpenToolKey] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();
  const [dataForm, setDataForm] = useState<IFormEditCategory>(() =>
    initialMountForm(categoryDetail?.categories[0])
  );
  const openMessage = () => {
    messageApi.open({
      key: Date().valueOf(),
      type: 'loading',
      content: 'Loading...'
    });
  };

  useEffect(() => {
    if (idCategory) {
      dispatch(getCategoryForId(idCategory))
        .unwrap()
        .then((data) => {
          console.log('forId in component::: first');
          setDataForm(initialMountForm(data.metadata?.categories[0]));
        });
    }
  }, [idCategory]);
  const handleUpdateCategory = () => {
    if (idCategory) {
      const result: Omit<PayloadUpdateCategory, 'id'> = {};
      (Object.keys(dataForm) as Array<keyof typeof dataForm>).forEach((key) => {
        if (dataForm[key].isChange) {
          switch (key) {
            case 'name':
              result.name = dataForm[key].value;
              break;
            case 'status':
              result.isDeleted = Number(dataForm[key].value);
              break;
          }
        }
        return result;
      });
      const payloadUpdate: PayloadUpdateCategory = {
        id: idCategory,
        ...result
      };
      console.log('payloadUpdate:::', payloadUpdate);
      dispatch(updateCategory(payloadUpdate))
        .unwrap()
        .then((data) => {
          console.log('dataUdate', data);
          dispatch(getCategoryForId(idCategory))
            .unwrap()
            .then((data) => {
              console.log('forId in component');
              setDataForm(initialMountForm(data.metadata?.categories[0]));
            });
        });
    }
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDataForm((state) => {
      return {
        ...state,
        name: {
          value: value,
          isChange: value.trim() !== categoryDetail?.categories[0].name
        }
      };
    });
  };

  const handleChangeRadio = (e: RadioChangeEvent) => {
    const value: string = e.target.value;
    setDataForm((state) => {
      return {
        ...state,
        status: {
          value: value,
          isChange:
            value !==
            (categoryDetail?.categories[0].isDeleted === true ? '1' : '0')
        }
      };
    });
  };

  const handleResetForm = () => {
    setDataForm((state) => ({
      ...state,
      ...initialMountForm(categoryDetail?.categories[0])
    }));
  };

  const handleToggleMenuItem = (_id: string) => {
    if (expandedKeys.includes(_id)) {
      setExpandedKeys((state) => state.filter((k) => _id !== k));
    } else {
      setExpandedKeys((state) => [...state, _id]);
    }
  };

  const handleClickTool = (key: string, value: ICategory) => {
    if (openToolKey.length > 0) {
      if (key === openToolKey) {
        setOpenToolKey('');
      }
    } else {
      setOpenToolKey(key);
    }
  };

  const isChangedForm = (
    Object.keys(dataForm) as Array<keyof typeof dataForm>
  ).some((field) => {
    return dataForm[field].isChange && dataForm[field].value.length > 0;
  });

  function recursiveConvert(data: ICategory[]): TreeDataNode[] {
    if (data.length > 0) {
      return data.map((value) => {
        const vlc = {
          title: (
            <TiltleCategory
              title={value.name}
              openToolKey={openToolKey}
              id={value._id}
              onClickTitle={() => {
                handleToggleMenuItem(value._id);
              }}
              handleClickTool={() => {
                handleClickTool(value._id, value);
              }}
            />
          ),
          key: `${value._id}`,

          children:
            value.categories?.length > 0
              ? recursiveConvert(value.categories)
              : undefined,
          isLeaf: value.categories?.length > 0 ? false : true
        };
        return vlc;
      });
    }
    return [];
  }
  const dataTree = recursiveConvert(categoryDetail?.categories ?? []);
  const itemsBreadCrumb =
    categoryDetail?.breadCrum.map((value) => ({
      title: (
        <span className={value._id === idCategory ? 'pointer-events-none' : ''}>
          <Link to={`/products/category/${value._id}`}>{value.name}</Link>
        </span>
      )
    })) ?? [];
  return (
    <div>
      {contextHolder}
      {
        <Spin
          spinning={statusUpdateCategory === 'pending'}
          fullscreen
          tip='Updating'
          size='large'
        />
      }
      <section className='overflow-hidden py-3 px-2 rounded-md bg-[white]'>
        <h2 className='text-center mb-4 text-2xl font-semibold'>
          {`${categoryDetail?.categories[0].name}`}
        </h2>
        <Form layout='vertical'>
          <Row gutter={10}>
            <Col xs={24} lg={12}>
              <Form.Item
                label={
                  <span className='flex items-center'>
                    <span className='font-medium mr-3'>Structure</span>
                    <Breadcrumb items={itemsBreadCrumb} />
                  </span>
                }
              >
                <ForwardDirectoryTree
                  multiple={true}
                  expandedKeys={expandedKeys}
                  switcherIcon={(props: AntTreeNodeProps) => {
                    return (
                      <span
                        className='w-full'
                        onClick={() => {
                          const key = props.eventKey;
                          if (key) {
                            // handleToggleMenuItem(key);
                          }
                        }}
                      >
                        <TiArrowSortedDown />
                      </span>
                    );
                  }}
                  allowDrop={() => false}
                  treeData={dataTree}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                label='Name'
                required
                tooltip='This is a required field'
              >
                <Input
                  name='name'
                  onChange={handleChangeName}
                  value={dataForm.name.value}
                  placeholder='input placeholder'
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label='Slug'>
                <Input
                  value={genSlug(dataForm.name.value)}
                  placeholder='input placeholder'
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
                  name='status'
                  onChange={handleChangeRadio}
                  value={dataForm.status.value}
                >
                  <Radio value={'0'}>Active</Radio>
                  <Radio value={'1'}>Deleted</Radio>
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
                  disabled={
                    !isChangedForm ||
                    statusUpdateCategory === 'pending' ||
                    statusGetCategories === 'pending'
                  }
                  type='primary'
                  style={{ marginRight: '30px' }}
                  onClick={handleUpdateCategory}
                >
                  Save
                </Button>
                <Button
                  disabled={
                    !isChangedForm ||
                    statusUpdateCategory === 'pending' ||
                    statusGetCategories === 'pending'
                  }
                  danger
                  onClick={handleResetForm}
                  icon={<GrPowerReset />}
                  type='text'
                ></Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </section>
    </div>
  );
};

export default CategoryDetail;
