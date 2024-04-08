import { Button, Checkbox, Divider, Dropdown, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import React, { FC } from 'react';
import { SetURLSearchParams } from 'react-router-dom';

interface IStatusProduct {
  filterStatusPseudo: string[];
  toggleStatusFilter: boolean;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  handleOnchangeStatus: (e: CheckboxChangeEvent) => void;
  setFilterStatusPseudo: React.Dispatch<React.SetStateAction<string[]>>;
  setToggleStatusFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const StatusProduct: FC<IStatusProduct> = ({
  filterStatusPseudo,
  toggleStatusFilter,
  searchParams,
  setSearchParams,
  handleOnchangeStatus,
  setFilterStatusPseudo,
  setToggleStatusFilter
}) => {
  return (
    <span>
      <Space style={{ width: '100%' }} direction='vertical'>
        <Dropdown
          // menu={{ items: bodyDropdown }}
          dropdownRender={() => {
            return (
              <div className=' bg-white rounded py-2 outline-slate-400 outline-double'>
                <Space className='inline-block px-2'>
                  <Checkbox value={'0'} onChange={handleOnchangeStatus} checked={filterStatusPseudo.includes('0')}>
                    unPublished
                  </Checkbox>
                  <Checkbox value={'1'} onChange={handleOnchangeStatus} checked={filterStatusPseudo.includes('1')}>
                    published
                  </Checkbox>
                </Space>
                <Divider style={{ margin: '10px 0' }}></Divider>
                <div className='flex justify-between px-2'>
                  <Button
                    onClick={() => {
                      setToggleStatusFilter(false);
                      setFilterStatusPseudo([]);
                      setSearchParams((pre) => {
                        searchParams.delete('status');
                        return searchParams;
                      });
                    }}
                    size='small'
                    type='primary'
                    className='text-xs'
                    disabled={filterStatusPseudo.length === 0}
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => {
                      if (filterStatusPseudo.length > 0) {
                        searchParams.set('status', filterStatusPseudo.join(','));
                      } else {
                        searchParams.delete('status');
                      }
                      searchParams.set('page', '1');
                      setSearchParams(searchParams);
                      setToggleStatusFilter(false);
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
          open={toggleStatusFilter}
        >
          <Button
            onClick={() => {
              setToggleStatusFilter(true);
            }}
          >
            Status
          </Button>
        </Dropdown>
      </Space>
    </span>
  );
};

export default StatusProduct;
