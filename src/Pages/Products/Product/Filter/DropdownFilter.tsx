import { Button, Checkbox, Divider, Dropdown, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import React, { FC } from 'react';

export interface IDataCheckBox {
  value: string;
  title: string;
  childs?: IDataCheckBox[];
}

interface IDropdownFilter {
  isOpenDrowdown: boolean;
  buttonText: string;
  checkedList: string[];
  checkedChildList?: string[];
  dataCheckBox: IDataCheckBox[];
  isDisableButton?: boolean;
  onToogleDropdown: (status: boolean) => void;
  onClickButton: () => void;
  onChangeCheckBox: (e: CheckboxChangeEvent) => void;
  onChangeCheckBoxChild?: (parentId: string, e: CheckboxChangeEvent) => void;
  onComfirm: () => void;
  onReset: () => void;
}

const DropdownFilter: FC<IDropdownFilter> = ({
  onChangeCheckBox,
  onToogleDropdown,
  onComfirm,
  onReset,
  onClickButton,
  isOpenDrowdown,
  buttonText,
  checkedList,
  dataCheckBox,
  onChangeCheckBoxChild,
  checkedChildList,
  isDisableButton = false
}) => {
  return (
    <span>
      <Space style={{ width: '100%' }} direction='vertical'>
        <Dropdown
          dropdownRender={() => {
            return (
              <div className=' bg-white rounded py-2 outline-slate-400 outline-double'>
                <Space className='inline-block px-2'>
                  {dataCheckBox.map((checkBox, parentIndex) => (
                    <div key={parentIndex}>
                      <Checkbox
                        className='w-full'
                        value={checkBox.value}
                        onChange={onChangeCheckBox}
                        checked={checkedList.includes(checkBox.value)}
                      >
                        {checkBox.title}
                      </Checkbox>
                      {checkBox.childs && checkBox.childs.length && (
                        <div className='ml-6'>
                          {checkBox.childs.map((child) => {
                            const disibleChild = checkedList.includes(checkBox.value);
                            return (
                              <Checkbox
                                disabled={!disibleChild}
                                key={child.value}
                                className='w-full'
                                value={child.value}
                                onChange={(e) => {
                                  onChangeCheckBoxChild?.(checkBox.value, e);
                                }}
                                checked={disibleChild && checkedChildList?.includes(`${checkBox.value}/${child.value}`)}
                              >
                                {child.title}
                              </Checkbox>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </Space>
                <Divider style={{ margin: '10px 0' }}></Divider>
                <div className='flex justify-between px-2'>
                  <Button onClick={onReset} size='small' type='primary' className='text-xs'>
                    Reset
                  </Button>
                  <Button onClick={onComfirm} size='small' className='text-xs'>
                    OK
                  </Button>
                </div>
              </div>
            );
          }}
          trigger={['click']}
          placement='bottomRight'
          open={isOpenDrowdown}
          disabled={isDisableButton}
        >
          <Button type={isOpenDrowdown ? 'primary' : 'default'} onClick={onClickButton}>
            {buttonText}
          </Button>
        </Dropdown>
      </Space>
    </span>
  );
};

export default DropdownFilter;
