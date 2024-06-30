import { Col, Radio, Input, Form, Row, Button, TreeDataNode, Breadcrumb, Spin, message, Select, Skeleton } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  getCategories,
  getCategoryForId,
  selectCategories,
  selectStatusGetCategories,
  selectStatusGetCategory,
  selectStatusUpdateCategory,
  updateCategory
} from '../../Features/categoryPageSlice';
import ForwardDirectoryTree from 'antd/es/tree/DirectoryTree';
import { AntTreeNodeProps } from 'antd/es/tree';
import { TiArrowSortedDown } from 'react-icons/ti';
import { ICategoryResponse, IMetaDataResponseCategory } from '../../Models/response';
import { genSlug, recurtiveCat } from '../../utils/common';
import TiltleCategory from '../../Components/TitleCategory';
import { PayloadUpdateCategory } from '../../Models/request';
import { useForm } from 'antd/es/form/Form';
import { optionRender, tagRender } from '../../Components/FormCreateProduct';

interface ICategoryDetail {
  name?: string;
}

export interface IFormDataUpdateCategory extends Omit<PayloadUpdateCategory, 'id'> {
  name: string;
  slug: string;
  status: '0' | '1';
  parentId?: string;
}
interface IDataChange {
  name?: string;
  slug?: string;
  status?: '0' | '1';
  parentId?: string;
}

const CategoryDetail: FC<ICategoryDetail> = (props) => {
  const categoryId = useParams().id;
  const dispatch = useAppDispatch();
  const [categoryDetail, setCategoryDetail] = useState<IMetaDataResponseCategory | null>(null);
  const statusUpdateCategory = useAppSelector(selectStatusUpdateCategory);
  const statusGetCategories = useAppSelector(selectStatusGetCategories);
  const statusGetCategory = useAppSelector(selectStatusGetCategory);
  const refTimeOut = useRef<NodeJS.Timeout>();
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [openToolKey, setOpenToolKey] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();
  const [formInforCategory] = useForm<IFormDataUpdateCategory>();
  const [changeData, setChangeData] = useState<IDataChange>({});
  const categories = useAppSelector(selectCategories);
  const [defaultValueForm, setDefaultValueForm] = useState<IFormDataUpdateCategory>({
    name: '',
    slug: '',
    status: '' as IFormDataUpdateCategory['status'],
    parentId: undefined
  });
  const createInitalForm = (category: ICategoryResponse): IFormDataUpdateCategory => ({
    name: category.name,
    slug: category.slug,
    status: String(category.status) as IFormDataUpdateCategory['status'],
    parentId: category.parentId ?? undefined
  });

  const checkChangeData = (intialvalue: IFormDataUpdateCategory) => {
    const dataChange: IDataChange = {};
    const valueForm = formInforCategory.getFieldsValue();
    const isNameChange = intialvalue.name.trim() !== valueForm.name.trim();
    const isSlugChange = intialvalue.slug.trim() !== valueForm.slug.trim();
    const isStatusChange = String(intialvalue.status) !== valueForm.status;
    const isStatusParent = intialvalue.parentId !== valueForm.parentId;
    if (isNameChange) {
      dataChange.name = valueForm.name.trim();
    }
    if (isSlugChange) {
      dataChange.slug = valueForm.slug.trim();
    }
    if (isStatusChange) {
      dataChange.status = valueForm.status;
    }
    if (isStatusParent) {
      dataChange.parentId = valueForm.parentId;
    }
    return dataChange;
  };
  const getCategoryForIdApi = (categoryId: string) => {
    dispatch(getCategoryForId(categoryId))
      .unwrap()
      .then((data) => {
        if (data.metadata) {
          const category = data.metadata.categories[0] ?? {};
          const breadCrum = data.metadata.breadCrum;
          setCategoryDetail(data.metadata);
          const parentCate = breadCrum.find((cat) => cat._id === category?.parentId);
          const parentId = parentCate?._id ?? '';
          const valueDefault = { ...createInitalForm(category), parentId };
          formInforCategory.setFieldsValue(valueDefault);
          setDefaultValueForm(valueDefault);
        }
      });
  };
  useEffect(() => {
    if (categoryId) {
      getCategoryForIdApi(categoryId);
    }
    dispatch(getCategories());
  }, [categoryId]);

  const handleUpdateCategory = (values: IFormDataUpdateCategory) => {
    dispatch(
      updateCategory({
        id: categoryId ?? '',
        ...(changeData as IFormDataUpdateCategory)
      })
    )
      .unwrap()
      .then((data) => {
        getCategoryForIdApi(categoryId ?? '');
        setChangeData({});
      });
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = genSlug(value);
    formInforCategory.setFieldValue('slug', slug);
    handleSetActiveButton();
  };

  const handleSetActiveButton = () => {
    clearTimeout(refTimeOut.current);
    refTimeOut.current = setTimeout(() => {
      if (categoryDetail) {
        setChangeData(checkChangeData(createInitalForm(categoryDetail.categories[0])));
      }
    }, 150);
  };

  const handleResetForm = () => {
    if (categoryDetail) {
      setChangeData({});
      formInforCategory.setFieldsValue(defaultValueForm);
    }
  };

  const handleToggleMenuItem = (_id: string) => {
    if (expandedKeys.includes(_id)) {
      setExpandedKeys((state) => state.filter((k) => _id !== k));
    } else {
      setExpandedKeys((state) => [...state, _id]);
    }
  };

  const handleClickTool = (key: string, value: ICategoryResponse) => {
    if (openToolKey.length > 0) {
      if (key === openToolKey) {
        setOpenToolKey('');
      }
    } else {
      setOpenToolKey(key);
    }
  };

  function recursiveConvert(data: ICategoryResponse[]): TreeDataNode[] {
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
              onDeleteCategory={() => {
                console.log('====> delete');
              }}
            />
          ),
          key: `${value._id}`,

          children:
            value.categories !== undefined && value.categories.length > 0
              ? recursiveConvert(value.categories)
              : undefined,
          isLeaf: value.categories !== undefined && value.categories.length > 0 ? false : true
        };
        return vlc;
      });
    }
    return [];
  }
  const dataTree = recursiveConvert(categoryDetail?.categories ?? []);
  const itemsBreadCrumb =
    categoryDetail?.breadCrum.map(
      (value: {
        _id: string | undefined;
        name:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined;
      }) => ({
        title: (
          <span className={value._id === categoryId ? 'pointer-events-none' : ''}>
            <Link to={`/products/category/${value._id}`}>{value.name}</Link>
          </span>
        )
      })
    ) ?? [];
  const options = recurtiveCat([], categories).filter(
    ({ label }) => (label as string).split('$')[0].split('.').length !== 3
  );
  const isLoadingData = statusUpdateCategory === 'pending' || statusGetCategories === 'pending';
  const isActiveButton = isLoadingData || Object.keys(changeData).length === 0;
  const isActiveSkeleton = isLoadingData && categoryDetail === null;
  console.log('----->:::', categoryDetail?.categories?.length === 0);

  return (
    <div className='p-3'>
      {contextHolder}
      {<Spin spinning={isLoadingData} fullscreen tip='Updating' size='large' />}
      {categoryDetail?.categories?.length === 0 ? (
        <p>Category do not exist</p>
      ) : (
        <section className='overflow-hidden py-3 px-2 rounded-md bg-[white]'>
          <h2 className='text-center mb-4 text-2xl font-semibold'>
            {isActiveSkeleton ? <Skeleton.Input size={'default'} block={false} /> : categoryDetail?.categories[0].name}
          </h2>
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={10}>
              <p className='flex mb-1 items-center'>
                {isActiveSkeleton ? (
                  <Skeleton.Input active={isActiveSkeleton} />
                ) : (
                  <>
                    <span className='font-medium text-lg mr-3'>Structure :</span>
                    <Breadcrumb className='text-base' items={itemsBreadCrumb} />
                  </>
                )}
              </p>
              {isActiveSkeleton ? (
                <Skeleton.Input active={isActiveSkeleton} block={true} />
              ) : (
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
              )}
            </Col>
            <Col xs={24} lg={14}>
              <Form<IFormDataUpdateCategory>
                form={formInforCategory}
                onFinish={handleUpdateCategory}
                layout='vertical'
                className=''
              >
                <Row gutter={10}>
                  <Col xs={24} lg={12}>
                    <Form.Item label='Name' name='name' required tooltip='This is a required field'>
                      {isActiveSkeleton ? (
                        <Skeleton.Input active={isActiveSkeleton} block={true} />
                      ) : (
                        <Input onChange={handleChangeName} placeholder='Name ...' />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item name='slug' label='Slug'>
                      {isActiveSkeleton ? (
                        <Skeleton.Input active={isActiveSkeleton} block={true} />
                      ) : (
                        <Input onChange={handleSetActiveButton} placeholder='Slug ....' />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item label='Parent' name='parentId'>
                      {isActiveSkeleton ? (
                        <Skeleton.Input active={isActiveSkeleton} block={true} />
                      ) : (
                        <Select
                          placeholder={'Select parent category ...'}
                          mode='multiple'
                          tagRender={tagRender}
                          optionRender={optionRender}
                          options={[{ label: '$Top level category', value: '' }, ...options]}
                          value={[formInforCategory.getFieldValue('parentId')]}
                          onSelect={(vl: string) => {
                            if (vl !== defaultValueForm.parentId || vl !== categoryId) {
                              formInforCategory.setFieldValue('parentId', vl);
                              handleSetActiveButton();
                            } else {
                              formInforCategory.setFieldValue('parentId', defaultValueForm.parentId);
                            }
                          }}
                          onDeselect={(vl) => {
                            formInforCategory.setFieldValue('parentId', vl);
                          }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item name='status' label='Status' tooltip={{ title: 'Tooltip with customize icon' }}>
                      {isActiveSkeleton ? (
                        <Skeleton.Input active={isActiveSkeleton} block={true} />
                      ) : (
                        <Radio.Group onChange={handleSetActiveButton}>
                          <Radio value={'1'}>Active</Radio>
                          <Radio value={'0'}>Deleted</Radio>
                        </Radio.Group>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item>
                      <div className='flex text-center justify-center mt-10'>
                        {isActiveSkeleton ? (
                          <Skeleton.Input active={isActiveSkeleton} />
                        ) : (
                          <>
                            <Button
                              disabled={isActiveButton}
                              type='primary'
                              style={{ marginRight: '30px' }}
                              onClick={() => {
                                formInforCategory.submit();
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              disabled={isActiveButton}
                              danger
                              onClick={handleResetForm}
                              icon={<GrPowerReset />}
                              type='text'
                            ></Button>
                          </>
                        )}
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </section>
      )}
    </div>
  );
};

export default CategoryDetail;
