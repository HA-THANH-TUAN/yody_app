import { Button, Table, TableColumnsType, TableProps, Tag } from 'antd';
import React, { FC, ReactNode } from 'react';
import { IProuductsMetaData } from '../../../Models/response';
import { BiExpand } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { GrCloudUpload } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { IoMdSave } from 'react-icons/io';
import { BaseButtonProps } from 'antd/es/button/button';
interface DataType {
  key: string;
  name: string;
  status: ReactNode;
  sale: string;
  typeSale: 'hard' | 'percent' | 'none';
  price: string;
  createdAt: string;
  action: ReactNode;
}
interface IProductStatusTag {
  status: 'published' | 'unPublished';
}

interface IProductAction {
  status: IProductStatusTag['status'];
  // activeEditButton: string;
  productId: string;
}
const tableProps: TableProps<DataType> = {
  bordered: true
};
const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'Jim', value: 'Jim' }
    ],
    sorter: (a, b) => a.name.length - b.name.length,
    ellipsis: true
  },
  {
    title: 'Status',
    className: 'w-28',
    dataIndex: 'status',
    key: 'status',
    ellipsis: true
  },
  {
    title: 'Price',
    className: 'w-40',
    dataIndex: 'price',
    key: 'price',
    ellipsis: true
  },
  {
    title: 'Sale',
    className: 'w-24',
    dataIndex: 'sale',
    key: 'sale',
    filters: [
      { text: 'London', value: 'London' },
      { text: 'New York', value: 'New York' }
    ],
    ellipsis: true
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    filters: [
      { text: 'London', value: 'London' },
      { text: 'New York', value: 'New York' }
    ],
    ellipsis: true
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    ellipsis: true
  }
];

const ProductStatusTag: FC<IProductStatusTag> = ({ status }) => {
  return <Tag color={status === 'published' ? 'blue' : 'red'}>{status}</Tag>;
};
const ProductAction: FC<IProductAction> = ({ status, productId }) => {
  const ButtonStatusProps: BaseButtonProps = {
    type: 'primary',
    icon: status === 'unPublished' ? <GrCloudUpload /> : <MdDelete />,
    danger: status === 'unPublished' ? false : true
  };
  const ButtonEditProps: BaseButtonProps = {
    type: 'primary',
    icon: status === 'unPublished' ? <IoMdSave /> : <MdDelete />
  };

  const nav = useNavigate();

  return (
    <div className='flex'>
      <Button
        icon={<BiExpand />}
        onClick={() => {
          nav('/products/product/' + productId);
        }}
      />
      <Button
        {...ButtonStatusProps}
        onClick={() => {
          console.log('===> PoweroffOutlined');
        }}
      />
      <Button
        {...ButtonEditProps}
        onClick={() => {
          console.log('===> FaRegEdit');
        }}
      />
    </div>
  );
};

const ProductTable: FC<{
  products: IProuductsMetaData[];
}> = ({ products }) => {
  console.log('ProductTable::: render');
  const dataProduct: DataType[] = products.map((p) => ({
    key: p._id,
    name: p.name,
    status: <ProductStatusTag status={p.status} />,
    sale: '-145',
    price: String(p.price) + ' VND',
    typeSale: p.typeSale,
    createdAt: p.createdAt,
    action: <ProductAction productId={p._id} status='unPublished' />
  }));

  return <Table className='' {...tableProps} columns={columns} pagination={false} dataSource={dataProduct} />;
};

export default React.memo(ProductTable);
