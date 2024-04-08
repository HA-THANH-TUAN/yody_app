import { Button, Divider, Dropdown, Slider, Space } from 'antd';
import Input from 'antd/es/input/Input';
import React, { FC } from 'react';
import { IFilterRangePrice } from '../Product';
import { formatMoney } from '../../../../utils/common';
import { SetURLSearchParams } from 'react-router-dom';

interface IRangeProduct {
  filterRangePrice: IFilterRangePrice;
  setFilterRangePrice: React.Dispatch<React.SetStateAction<IFilterRangePrice>>;
  toggleRangePriceFilter: boolean;
  setToggleRangePriceFilter: React.Dispatch<React.SetStateAction<boolean>>;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}
const RangeProduct: FC<IRangeProduct> = ({
  filterRangePrice,
  setFilterRangePrice,
  toggleRangePriceFilter,
  setToggleRangePriceFilter,
  searchParams,
  setSearchParams
}) => {
  const handleChangeMinRange = (value: number) => {
    if (value) {
      setFilterRangePrice((state) => {
        if (value >= filterRangePrice.min && value > filterRangePrice.current[1]) {
          const current = [...state.current];
          current[0] = value;
          return { ...state, current };
        }
        return state;
      });
    }
  };
  const handleChangeMaxRange = (value: number) => {
    if (value) {
      setFilterRangePrice((state) => {
        if (value <= filterRangePrice.max && value > filterRangePrice.current[0]) {
          const current = [...state.current];
          current[1] = value;
          return { ...state, current };
        }
        return state;
      });
    }
  };
  return (
    <span>
      <Space style={{ width: '100%' }} direction='vertical'>
        <Dropdown
          dropdownRender={() => {
            return (
              <div className=' bg-white rounded py-2 px-3 outline-slate-400 outline-double'>
                <div>
                  <div className='flex justify-between flex-wrap'>
                    <span>
                      <Input
                        onBlur={(e) => {
                          const covertNumber = Number(e.target.value.replaceAll('.', ''));
                          if (!isNaN(covertNumber)) {
                          }
                          handleChangeMinRange(covertNumber);
                        }}
                        onChange={() => {}}
                        placeholder='Min'
                        value={formatMoney(filterRangePrice.current[0])}
                      />
                    </span>
                    <span>
                      <Input
                        onBlur={(e) => {
                          const covertNumber = Number(e.target.value.replaceAll('.', ''));
                          if (!isNaN(covertNumber)) {
                          }
                          handleChangeMaxRange(covertNumber);
                        }}
                        onChange={() => {}}
                        placeholder='Max'
                        value={formatMoney(filterRangePrice.current[1])}
                      />
                    </span>
                  </div>
                  <div className='inline-block px-2'>
                    <Slider
                      className='min-w-72'
                      tooltip={{ placement: 'bottom', open: false }}
                      range
                      step={50000}
                      marks={{
                        [filterRangePrice.min]: {
                          label: <strong>0</strong>,
                          style: {
                            color: '#f50'
                          }
                        },
                        2000000: {
                          label: <strong>2M</strong>
                        },

                        [filterRangePrice.max]: {
                          style: {
                            color: '#f50'
                          },
                          label: <strong>5M</strong>
                        }
                      }}
                      value={filterRangePrice.current}
                      onChange={(value) => {
                        setFilterRangePrice((state) => ({
                          ...state,
                          current: value
                        }));
                      }}
                      max={filterRangePrice.max}
                      min={0}
                    />
                  </div>
                </div>
                <Divider style={{ margin: '10px 0' }}></Divider>
                <div className='flex justify-between px-2'>
                  <Button
                    onClick={() => {
                      searchParams.delete('minPrice');
                      searchParams.delete('maxPrice');
                      setSearchParams(searchParams);
                      setToggleRangePriceFilter(false);
                    }}
                    size='small'
                    type='primary'
                    className='text-xs'
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => {
                      searchParams.set('minPrice', filterRangePrice.current[0].toString());
                      searchParams.set('maxPrice', filterRangePrice.current[1].toString());
                      setSearchParams(searchParams);
                      setToggleRangePriceFilter(false);
                    }}
                    size='small'
                    className='text-xs'
                  >
                    OK
                  </Button>
                </div>
              </div>
            );
          }}
          trigger={['click']}
          placement='bottomRight'
          open={toggleRangePriceFilter}
        >
          <Button
            onClick={() => {
              setToggleRangePriceFilter((state) => !state);
            }}
          >
            {filterRangePrice.content}
          </Button>
        </Dropdown>
      </Space>
      {toggleRangePriceFilter && (
        <div
          onClick={() => {
            setToggleRangePriceFilter(false);
          }}
          className='w-screen fixed z-[1000] h-screen top-0 left-0'
        ></div>
      )}
    </span>
  );
};

export default RangeProduct;
