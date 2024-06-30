import React, { useEffect, useState } from 'react';
import { Col, Row, Spin, Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import {
  createCategory,
  deleteCategory,
  getCategories,
  selectCategories,
  selectStatusCreateCategory,
  selectStatusDeleteCategory,
  selectStatusGetCategories
} from '../../../Features/categoryPageSlice';
import { TiArrowSortedDown } from 'react-icons/ti';
import { AntTreeNodeProps } from 'antd/es/tree';
import TiltleCategory from '../../../Components/TitleCategory';
import { ICategoryResponse } from '../../../Models/response';
import FormCreateCategory from './FormCreateCategory';
import { useForm } from 'antd/es/form/Form';
import { PayloadCreateCategory } from '../../../Models/request';
const { DirectoryTree } = Tree;

const ProductCategory: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [openToolKey, setOpenToolKey] = useState('');
  const statusDeleteCategory = useAppSelector(selectStatusDeleteCategory);
  const statusGetCategories = useAppSelector(selectStatusGetCategories);
  const statusCreateCategory = useAppSelector(selectStatusCreateCategory);
  const [formCreateCategory] = useForm<PayloadCreateCategory>();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const categories = useAppSelector(selectCategories);
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
  const handleDeleteCategory = (id: string) => {
    dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        dispatch(getCategories());
      });
  };

  function recursiveConvert(data: ICategoryResponse[]): TreeDataNode[] {
    if (data.length > 0) {
      return data.map((value) => {
        const vlc = {
          title: (
            <TiltleCategory
              title={value.name}
              openToolKey={openToolKey}
              setDetailCategory={() => {}}
              id={value._id}
              onClickTitle={() => {
                handleToggleMenuItem(value._id);
              }}
              handleClickTool={() => {
                handleClickTool(value._id, value);
              }}
              onDeleteCategory={handleDeleteCategory}
            />
          ),
          key: `${value._id}`,

          children:
            value.categories !== undefined && value.categories.length > 0
              ? recursiveConvert(value?.categories)
              : undefined,
          isLeaf: value.categories !== undefined && value.categories.length > 0 ? false : true
        };
        return vlc;
      });
    }
    return [];
  }
  const data = recursiveConvert(categories);
  const handleCreateCategory = (values: PayloadCreateCategory) => {
    dispatch(createCategory(values))
      .unwrap()
      .then(() => {
        formCreateCategory.setFieldsValue(dataDefaultForm);
        dispatch(getCategories());
      })
      .catch(() => {});
  };
  const dataDefaultForm: PayloadCreateCategory = {
    name: '',
    slug: '',
    parentId: '',
    status: '1'
  };
  return (
    <div className='p-3'>
      {
        <Spin
          spinning={
            statusDeleteCategory === 'pending' ||
            statusCreateCategory === 'pending' ||
            statusGetCategories === 'pending'
          }
          fullscreen
          tip='Updating'
          size='large'
          style={{ zIndex: 10000 }}
        />
      }
      <Row gutter={[10, 10]}>
        <Col xs={24} lg={12}>
          <section className='overflow-hidden py-3 px-2 rounded-md bg-[white]'>
            <h2 className='text-center mb-4 text-2xl font-semibold'>Structure of category</h2>
            {data.length > 0 ? (
              <DirectoryTree
                multiple={true}
                defaultExpandAll={true}
                expandedKeys={expandedKeys}
                switcherIcon={(props: AntTreeNodeProps) => {
                  return (
                    <span
                      className='w-full'
                      onClick={() => {
                        const key = props.eventKey;
                        if (key) {
                          handleToggleMenuItem(key);
                        }
                      }}
                    >
                      <TiArrowSortedDown />
                    </span>
                  );
                }}
                allowDrop={() => false}
                treeData={data}
              />
            ) : (
              <p className='text-center text-base'>Being not having category. </p>
            )}
          </section>
        </Col>
        <Col xs={24} lg={12}>
          <FormCreateCategory
            dataDefaultForm={dataDefaultForm}
            onCreateCategory={handleCreateCategory}
            statusGetCategories={statusGetCategories}
            categories={categories}
            formCreateCategory={formCreateCategory}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProductCategory;
