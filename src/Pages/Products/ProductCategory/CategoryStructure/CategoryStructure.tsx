import React, { FC } from 'react';
import { ICategory } from '../../../../Models/category';
import { Button, Tag, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import './CategoryStructure.css';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md';

interface ICategoryStructure {
  categories: ICategory[];
  onStatusToogle: (_id: string, statusPresent: ICategory['status']) => void;
  onNavToDetail: (_id: string) => void;
  disibledDetail?: string[];
}
interface ICategoryItemAction {
  status: ICategory['status'];
  _id: string;
  onStatusToogle: (_id: string, statusPresent: ICategory['status']) => void;
  onNavToDetail: (_id: string) => void;
  disibledDetail?: string[];
}
const CategoryItemAction: FC<ICategoryItemAction> = ({
  status,
  _id,
  onStatusToogle,
  onNavToDetail,
  disibledDetail
}) => {
  return (
    <div className='flex flex-1 items-center justify-between category-item-action-component-category-structure'>
      <Tag color={`${status === 'active' ? 'blue' : 'red'}`} className='font-thin ml-2'>
        {status}
      </Tag>
      <div className='flex items-center'>
        <Button
          onClick={() => {
            onNavToDetail(_id);
          }}
          type='primary'
          ghost
          icon={<BiMessageSquareDetail />}
          disabled={disibledDetail === undefined ? false : disibledDetail.includes(_id)}
        ></Button>
        <Button
          onClick={() => {
            onStatusToogle(_id, status);
          }}
          title={`Change to status ${status === 'active' ? 'UNACTIVE' : 'ACTIVE'}`}
          icon={status === 'active' ? <MdOutlineRadioButtonUnchecked /> : <MdOutlineRadioButtonChecked />}
          type={'primary'}
          danger={status === 'active'}
        ></Button>
      </div>
    </div>
  );
};

const CategoryStructure: FC<ICategoryStructure> = ({ categories, onStatusToogle, onNavToDetail, disibledDetail }) => {
  const categoriesTreeData = (categories: ICategory[]): DataNode[] => {
    return categories.map((cate) => ({
      title: (
        <div className='w-full flex justify-between'>
          <p className='px-2 py-1 '>{cate.name}</p>
          <CategoryItemAction
            disibledDetail={disibledDetail}
            _id={cate._id}
            onStatusToogle={onStatusToogle}
            onNavToDetail={onNavToDetail}
            status={cate.status}
          />
        </div>
      ),
      key: cate._id,
      children: cate.categories === null ? undefined : categoriesTreeData(cate.categories)
    }));
  };
  const treeData = categoriesTreeData(categories);
  return (
      <Tree className='category-structure-component-category-page' defaultExpandParent treeData={treeData} />
  );
};

export default CategoryStructure;
