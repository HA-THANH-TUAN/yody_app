import React, { useEffect, useState } from 'react';
import { Col, Row, Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import CategoryDetail from '../../Containers/CategoryDetail';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import {
  getCategories,
  selectCategories
} from '../../Features/categoryPageSlice';
import { ICategory } from '../../Models/response';
import { TiArrowSortedDown } from 'react-icons/ti';
import { AntTreeNodeProps } from 'antd/es/tree';
import TiltleCategory from '../../Components/TitleCategory';
type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
const { DirectoryTree } = Tree;

const ProductCategory: React.FC = () => {
  const [detailCategory, setDetailCategory] = useState<ICategory>();
  const [openDetailDraw, setOpenDetailDraw] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [openToolKey, setOpenToolKey] = useState('');
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCategories(123));
  }, []);

  const categories = useAppSelector(selectCategories);
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
      setDetailCategory(value);
    }
  };
  function recursiveConvert(data: ICategory[]): TreeDataNode[] {
    if (data.length > 0) {
      return data.map((value) => {
        const vlc = {
          title: (
            <TiltleCategory
              title={value.name}
              openToolKey={openToolKey}
              setDetailCategory={() => {
                setDetailCategory(value);
              }}
              id={value._id}
              onClickTitle={() => {
                handleToggleMenuItem(value._id);
                setDetailCategory(value);
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
  const data = recursiveConvert(categories);
  console.log('openDetailDraw:::', openDetailDraw);
  return (
    <Row gutter={[10, 10]}>
      <Col xs={24} lg={12} xl={10}>
        <section className='overflow-hidden py-3 px-2 rounded-md bg-[white]'>
          <h2 className='text-center mb-4 text-2xl font-semibold'>
            Structure of category
          </h2>
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
        </section>
      </Col>
      {detailCategory && openDetailDraw && (
        <CategoryDetail
          detailData={detailCategory}
          isOpenDraw={openDetailDraw}
          setOpenDraw={setOpenDetailDraw}
        />
      )}
    </Row>
  );
};

export default ProductCategory;
