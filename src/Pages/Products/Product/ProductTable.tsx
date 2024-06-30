import { Button, Table, TableColumnsType, TableProps, Tag } from 'antd';
import React, { FC, ReactNode } from 'react';
import { IProuductsMetaData } from '../../../Models/response';
import { BiExpand } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { GrCloudUpload } from 'react-icons/gr';
import { MdCreditScore, MdDelete, MdOutlineCreate } from 'react-icons/md';
import { IoMdSave } from 'react-icons/io';
import { BaseButtonProps } from 'antd/es/button/button';
import { IProduct } from '../../../Models/product';
import { formatMoney } from '../../../utils/common';
import { FaRegEdit } from 'react-icons/fa';
interface DataType {
  key: string;
  name: string;
  status: ReactNode;
  sale: ReactNode;
  seo: ReactNode;
  price: string;
  action: ReactNode;
}

interface IProductAction {
  status: IProduct['status'];
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
    key: 'name'
    // ellipsis: true
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
    ellipsis: true
  },
  {
    title: 'Seo',
    className: 'w-24',
    dataIndex: 'seo',
    key: 'seo',
    ellipsis: true
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    ellipsis: true
  }
];

const ProductStatusTag: FC<{ status: IProduct['status'] }> = ({ status }) => {
  return <Tag color={status === 1 ? 'blue' : 'red'}>{status === 0 ? 'unPublish' : 'Publish'}</Tag>;
};
const ProductAction: FC<IProductAction> = ({ status, productId }) => {
  const ButtonStatusProps: BaseButtonProps = {
    type: 'primary',
    icon: status === 0 ? <GrCloudUpload /> : <MdDelete />,
    danger: status === 0 ? false : true
  };
  const nav = useNavigate();

  return (
    <div className='flex flex-shrink-0 flex-wrap -mx-1 '>
      <Button
        className='mx-2'
        icon={<BiExpand />}
        onClick={() => {
          nav('/products/product/' + productId);
        }}
      />
      <Button
        className='mx-2'
        {...ButtonStatusProps}
        onClick={() => {
          console.log('===> PoweroffOutlined');
        }}
      />
    </div>
  );
};

const ProductTable: FC<{
  products: IProuductsMetaData[];
}> = ({ products }) => {
  const nav = useNavigate();
  const dataProduct: DataType[] = products.map((p) => ({
    key: p._id,
    name: p.name,
    status: <ProductStatusTag status={p.status} />,
    sale: <Tag color='green'>{'150%'}</Tag>,
    price: formatMoney(String(p.price)) + ' VND',
    seo:
      p.metaSeoProduct === null ? (
        <Button
          onClick={() => {
            nav(`/products/seo-product/${p._id}`);
          }}
          icon={<FaRegEdit />}
        ></Button>
      ) : (
        <Button icon={<MdCreditScore />}></Button>
      ),
    action: <ProductAction productId={p._id} status={p.status} />
  }));

  return <Table className='' {...tableProps} columns={columns} pagination={false} dataSource={dataProduct} />;
};

export default React.memo(ProductTable);
