import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Input, Pagination, Row, Space, Spin } from 'antd';
import { IoSearch } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useSearchProduct } from '../../../app/hook';
import { getCategories, selectCategories, selectStatusGetCategories } from '../../../Features/categoryPageSlice';
import SelectCategory from './Filter/SelectCategory';
import { DefaultOptionType } from 'antd/es/select';
import {
  getProducts,
  selectProducts,
  selectProductsPanigation,
  selectStatusGetProducts
} from '../../../Features/productPageSlice';
import { FaPlus } from 'react-icons/fa6';
import { recurtiveCat } from '../../../utils/common';
import ProductTable from './ProductTable';
import DropdownFilter from './Filter/DropdownFilter';
import {
  dataFilterCategory,
  dataFilterCategoryStatus,
  dataFilterOptionStatus,
  dataFilterProductSeo,
  dataFilterProductStatus
} from './Filter/dataFilter';

export interface IFilterRangePrice {
  isOpen: boolean;
  min: number;
  current: number[];
  content: string;
  max: number;
}

const Product = () => {
  const [toggleSelectFilter, setToggleSelectFilter] = useState<boolean>(false);
  const categories = useAppSelector(selectCategories);
  const statusGetCategories = useAppSelector(selectStatusGetCategories);
  const [searchParams, setSearchParams] = useSearchProduct();
  const [categoryIds, setCategoryIds] = useState<string[]>(searchParams.get('categories')?.split(',') ?? []);
  const statusGetProducts = useAppSelector(selectStatusGetProducts);
  const products = useAppSelector(selectProducts);
  const productsPanigation = useAppSelector(selectProductsPanigation);
  const dispatch = useAppDispatch();
  const timeOutSearchId = useRef<NodeJS.Timeout>();

  const [filterRangePrice, setFilterRangePrice] = useState<IFilterRangePrice>({
    isOpen: true,
    current: [0, 5000000],
    min: 0,
    max: 5000000,
    content: 'Price'
  });

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    dispatch(getProducts(query));
  }, [searchParams.toString()]);

  const [statusProduct, setStatusProduct] = useState<string>(() => searchParams.get('status') ?? 'all');
  const [categoriesId, setCategoriesId] = useState<string[]>(() => searchParams.get('categories')?.split(',') ?? []);
  const [categoryStatus, setCategoryStatus] = useState<string>(() => searchParams.get('categoryStatus') ?? 'all');
  const [optionStatus, setOptionStatus] = useState(() => searchParams.get('option') ?? 'all');
  const [categoryExist, setcategoryExist] = useState(() => searchParams.get('category') ?? 'all');
  const [seoStatus, setSeoStatus] = useState(() => searchParams.get('seo') ?? 'all');
  const [soldOut, setSoldOut] = useState(() => searchParams.get('soldOut') ?? 'all');
  const [openFilterName, setOpenFilterName] = useState<
    'none' | 'status' | 'seoStatus' | 'optionStatus' | 'categoryExist'
  >('none');
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
  const handleCloseOverlayFilter = () => {
    setOpenFilterName('none');
    switch (openFilterName) {
      case 'categoryExist':
        setcategoryExist(searchParams.get('category') ?? 'all');
        break;
      case 'optionStatus':
        setOptionStatus(searchParams.get('option') ?? 'all');
        break;
      case 'seoStatus':
        setSeoStatus(searchParams.get('seoStatus') ?? 'all');
        break;
      case 'status':
        setStatusProduct(searchParams.get('status') ?? 'all');
        break;
      default:
        break;
    }
  };

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
      {openFilterName !== 'none' && (
        <div onClick={handleCloseOverlayFilter} className='fixed w-screen h-screen top-0 right-0 z-[1002]'></div>
      )}

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
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
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
                      searchParams.set('page', '1');
                      setSearchParams(searchParams);
                    }, 1000);
                  }}
                />

                <Button type='primary' icon={<IoSearch />}></Button>
              </Space.Compact>
            </Space>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
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
          <Col xs={{ span: 24 }}>
            <section className='flex flex-wrap flex-shrink-0'>
              <div className='my-2 mx-1'>
                <DropdownFilter
                  onClickButton={() => {
                    setOpenFilterName('status');
                  }}
                  buttonText='Status'
                  checkedList={[statusProduct]}
                  dataCheckBox={dataFilterProductStatus}
                  isOpenDrowdown={openFilterName === 'status'}
                  onChangeCheckBox={(e) => {
                    const value = e.target.value;
                    setStatusProduct(value);
                  }}
                  onComfirm={() => {
                    setOpenFilterName('none');
                    setSearchParams(() => {
                      searchParams.set('status', statusProduct);
                      searchParams.set('page', '1');
                      return searchParams;
                    });
                  }}
                  onReset={() => {
                    const value = searchParams.get('status') ?? 'all';
                    setStatusProduct(value);
                  }}
                  onToogleDropdown={() => {}}
                />
              </div>

              <div className='my-2 mx-1'>
                <DropdownFilter
                  onClickButton={() => {
                    setOpenFilterName('categoryExist');
                  }}
                  buttonText='Category'
                  checkedList={[categoryExist]}
                  dataCheckBox={dataFilterCategory}
                  isOpenDrowdown={openFilterName === 'categoryExist'}
                  onChangeCheckBoxChild={(pId, e) => {
                    const value = e.target.value;
                    setCategoryStatus(value);
                  }}
                  checkedChildList={[`${categoryExist}/${categoryStatus}`]}
                  onChangeCheckBox={(e) => {
                    const value = e.target.value;
                    setcategoryExist(value);
                  }}
                  onComfirm={() => {
                    setOpenFilterName('none');
                    setSearchParams(() => {
                      searchParams.set('category', categoryExist);
                      searchParams.set('page', '1');
                      return searchParams;
                    });
                  }}
                  onReset={() => {
                    const value = searchParams.get('category') ?? 'all';
                    setcategoryExist(value);
                  }}
                  onToogleDropdown={() => {}}
                />
              </div>
              <div className='my-2 mx-1'>
                <DropdownFilter
                  onClickButton={() => {
                    setOpenFilterName('seoStatus');
                  }}
                  buttonText='Seo'
                  checkedList={[seoStatus]}
                  dataCheckBox={dataFilterProductSeo}
                  isOpenDrowdown={openFilterName === 'seoStatus'}
                  onChangeCheckBox={(e) => {
                    const value = e.target.value;
                    setSeoStatus(value);
                  }}
                  onComfirm={() => {
                    setOpenFilterName('none');
                    setSearchParams(() => {
                      searchParams.set('seo', seoStatus);
                      searchParams.set('page', '1');
                      return searchParams;
                    });
                  }}
                  onReset={() => {
                    const value = searchParams.get('seo') ?? 'all';
                    setSeoStatus(value);
                  }}
                  onToogleDropdown={() => {}}
                />
              </div>
              <div className='my-2 mx-1'>
                <DropdownFilter
                  onClickButton={() => {
                    setOpenFilterName('optionStatus');
                  }}
                  buttonText='Option'
                  checkedList={[optionStatus]}
                  checkedChildList={[`${optionStatus}/${soldOut}`]}
                  dataCheckBox={dataFilterOptionStatus}
                  isOpenDrowdown={openFilterName === 'optionStatus'}
                  onChangeCheckBox={(e) => {
                    const value = e.target.value;
                    setOptionStatus(value);
                  }}
                  onChangeCheckBoxChild={(pId, e) => {
                    const value = e.target.value;
                    setSoldOut(value);
                  }}
                  onComfirm={() => {
                    setOpenFilterName('none');
                    setSearchParams(() => {
                      searchParams.set('option', optionStatus);
                      searchParams.set('page', '1');
                      return searchParams;
                    });
                  }}
                  onReset={() => {
                    const value = searchParams.get('option') ?? 'all';
                    setOptionStatus(value);
                  }}
                  onToogleDropdown={() => {}}
                />
              </div>
              {/* <RangeProduct
                toggleRangePriceFilter={toggleRangePriceFilter}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                setToggleRangePriceFilter={setToggleRangePriceFilter}
                filterRangePrice={filterRangePrice}
                setFilterRangePrice={setFilterRangePrice}
              />
              <StatusProduct
                filterStatusPseudo={filterStatusPseudo}
                toggleStatusFilter={toggleStatusFilter}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                handleOnchangeStatus={handleOnchangeStatus}
                setFilterStatusPseudo={setFilterStatusPseudo}
                setToggleStatusFilter={setToggleStatusFilter}
              /> */}
            </section>
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
    </section>
  );
};

export default Product;
