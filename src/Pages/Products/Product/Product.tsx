import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { InputRef, TableColumnsType, TableProps } from 'antd';
import { Button, Col, Input, Pagination, Row, Space, Spin, Table, Tag } from 'antd';
import { MdDelete } from 'react-icons/md';
import { GrCloudUpload } from 'react-icons/gr';
import { BaseButtonProps } from 'antd/es/button/button';
import { IoMdSave } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { getCategories, selectCategories, selectStatusGetCategories } from '../../../Features/categoryPageSlice';
import SelectCategory from './Filter/SelectCategory';
import { DefaultOptionType } from 'antd/es/select';
import StatusProduct from './Filter/StatusProduct';
import {
  getProducts,
  selectProducts,
  selectProductsPanigation,
  selectStatusGetProducts
} from '../../../Features/productPageSlice';
import { BiExpand } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa6';
import { recurtiveCat } from '../../../utils/common';
import RangeProduct from './Filter/RangeProduct';
import ProductTable from './ProductTable';
interface IProductStatusTag {
  status: 'published' | 'unPublished';
}

interface IProductAction {
  status: IProductStatusTag['status'];
  activeEditButton: string;
  productId: string;
}
export interface IFilterRangePrice {
  isOpen: boolean;
  min: number;
  current: number[];
  content: string;
  max: number;
}

const Product = () => {
  const [toggleStatusFilter, setToggleStatusFilter] = useState<boolean>(false);
  const [toggleRangePriceFilter, setToggleRangePriceFilter] = useState<boolean>(false);
  const [toggleSelectFilter, setToggleSelectFilter] = useState<boolean>(false);
  const location = useLocation();
  const categories = useAppSelector(selectCategories);
  const statusGetCategories = useAppSelector(selectStatusGetCategories);
  const [searchParams, setSearchParams] = useSearchParams(
    (() => {
      const urlSearch = new URLSearchParams(location.search);
      if (urlSearch.get('page') === null || urlSearch.get('page') === '') {
        urlSearch.set('page', '1');
      }
      if (urlSearch.get('limit') === null || urlSearch.get('limit') === '') {
        urlSearch.set('limit', '20');
      }
      if (urlSearch.get('categories') === null || urlSearch.get('categories') === '') {
        urlSearch.set('categories', 'all');
      }
      return urlSearch;
    })()
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(searchParams.get('categories')?.split(',') ?? []);
  const statusGetProducts = useAppSelector(selectStatusGetProducts);
  const products = useAppSelector(selectProducts);
  const productsPanigation = useAppSelector(selectProductsPanigation);
  const dispatch = useAppDispatch();
  const [activeEditButton, setActiveEditButton] = useState<string>('');
  const timeOutSearchId = useRef<NodeJS.Timeout>();
  const [nameSearch, setNameSearch] = useState<string>(searchParams.get('search') ?? '');
  const [filterStatus, setFilterStatus] = useState<string[]>(() => {
    return searchParams.get('status')?.split(',') ?? [];
  });
  const [filterStatusPseudo, setFilterStatusPseudo] = useState<string[]>(() => {
    return searchParams.get('status')?.split(',') ?? [];
  });
  const [filterRangePrice, setFilterRangePrice] = useState<IFilterRangePrice>({
    isOpen: true,
    current: [0, 5000000],
    min: 0,
    max: 5000000,
    content: 'Price'
  });
  const handleOnchangeStatus = (e: CheckboxChangeEvent) => {
    const vl = e.target.value;
    if (filterStatusPseudo.includes(vl)) {
      setFilterStatusPseudo((state) => [...state.filter((item) => item !== vl)]);
    } else {
      setFilterStatusPseudo((state) => [...state, vl]);
    }
  };
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
    return () => {
      console.log('unMount');
    };
  }, []);
  useEffect(() => {
    const query = searchParams.toString();
    dispatch(getProducts(query));
  }, [searchParams.toString()]);

  // memorize:::
  const setToggleSelectFilterMemo = useCallback(setToggleSelectFilter, []);
  const setCategoryIdsMemo = useCallback(setCategoryIds, []);
  const setSearchParamsMemo = useCallback(setSearchParams, []);

  const options = useMemo<DefaultOptionType[]>(
    () => [{ label: 'All', value: 'all' }, ...recurtiveCat([], categories)],
    [statusGetCategories, categories.length]
  );
  const categoryIdsMemo = useMemo<string[]>(() => categoryIds, [statusGetCategories, categoryIds.join('')]);
  const searchParamsMemo = useMemo<URLSearchParams>(() => searchParams, [searchParams.toString()]);

  const productsMemo = useMemo(() => products, [statusGetProducts]);
  const PaginationMemo = React.memo(Pagination);
  return (
    <section className='product-page h-full p-3 overflow-y-auto'>
      {
        <Spin
          spinning={statusGetProducts === 'pending'}
          fullscreen
          tip='Updating'
          size='large'
          style={{ zIndex: 10000 }}
        />
      }
      <div className='flex items-center justify-center'>
        <span className='mx-3 inline-block text-3xl font-bold'>Product List</span>
        <Link to={'/products/product/create'}>
          <Button className='mx-3' type='dashed'>
            <FaPlus />
          </Button>
        </Link>
      </div>
      <div className='filter-product w- my-5'>
        <Row gutter={[20, 20]}>
          <Col xs={{ span: 24 }} xl={{ span: 6 }}>
            <Space style={{ width: '100%' }} direction='vertical'>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder='Product name'
                  defaultValue={searchParams.get('search') ?? ''}
                  onChange={(e) => {
                    clearTimeout(timeOutSearchId.current);
                    timeOutSearchId.current = setTimeout(() => {
                      const value = e.target.value;
                      if (value === '') {
                        searchParams.delete('search');
                      } else {
                        searchParams.set('search', value);
                      }
                      setSearchParams(searchParams);
                    }, 1000);
                  }}

                  // onKeyUp={(e) => {
                  //   const typeName = e.key;
                  //   if (typeName.toLowerCase() === 'enter') {
                  //     const value = e.currentTarget.value;
                  //     console.log('value:::', value === '');
                  //     if (value === '') {
                  //       searchParams.delete('search');
                  //     } else {
                  //       searchParams.set('search', value);
                  //       setSearchParams(searchParams);
                  //     }
                  //   }
                  // }}
                />

                <Button type='primary' icon={<IoSearch />}></Button>
              </Space.Compact>
            </Space>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 6 }}>
            <SelectCategory
              categoryIds={categoryIdsMemo}
              toggleSelectFilter={toggleSelectFilter}
              setToggleSelectFilter={setToggleSelectFilterMemo}
              setCategoryIds={setCategoryIdsMemo}
              options={options}
              searchParams={searchParamsMemo}
              setSearchParams={setSearchParamsMemo}
            />
          </Col>
          <Col sm={{ span: 12 }} xl={{ span: 6 }}>
            <RangeProduct
              toggleRangePriceFilter={toggleRangePriceFilter}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              setToggleRangePriceFilter={setToggleRangePriceFilter}
              filterRangePrice={filterRangePrice}
              setFilterRangePrice={setFilterRangePrice}
            />
          </Col>
          <Col sm={{ span: 12 }} xl={{ span: 6 }}>
            <StatusProduct
              filterStatusPseudo={filterStatusPseudo}
              toggleStatusFilter={toggleStatusFilter}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              handleOnchangeStatus={handleOnchangeStatus}
              setFilterStatusPseudo={setFilterStatusPseudo}
              setToggleStatusFilter={setToggleStatusFilter}
            />
          </Col>
        </Row>
      </div>
      <ProductTable products={productsMemo} />
      <div className='flex justify-center'>
        {productsPanigation && (
          <PaginationMemo
            className='my-3'
            current={Number(searchParams.get('page')) ?? 0}
            total={productsPanigation.total * Number(searchParams.get('limit'))}
            pageSize={Number(searchParams.get('limit'))}
            onChange={(page, pageSize) => {
              searchParams.set('page', page.toString());
              searchParams.set('limit', pageSize.toString());
              setSearchParams(searchParams);
            }}
          />
        )}
      </div>
      {(toggleStatusFilter || toggleSelectFilter) && (
        <div
          onClick={() => {
            setFilterStatusPseudo(searchParams.get('status')?.split(',') ?? []);
            setCategoryIds(searchParams.get('categories')?.split(',') ?? []);
            if (toggleSelectFilter) {
              const str = categoryIds.join(',');
              searchParams.set('categories', str);
              setSearchParams(searchParams);
            }
            setToggleStatusFilter(false);
            setToggleSelectFilter(false);
          }}
          className='modal-page w-full h-full absolute top-0 right-0'
        ></div>
      )}
    </section>
  );
};

export default Product;
