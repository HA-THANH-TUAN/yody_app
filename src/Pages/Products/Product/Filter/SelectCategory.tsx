import { Select, Space, Tag } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import React, { FC, useState } from 'react';
import { SetURLSearchParams } from 'react-router-dom';
import slugify from 'slugify';

interface ISelectCategory {
  options: DefaultOptionType[] | undefined;
  categoryIds: string[];
  searchParams: URLSearchParams;
  toggleSelectFilter: boolean;
  setSearchParams: SetURLSearchParams;
  setCategoryIds: React.Dispatch<React.SetStateAction<string[]>>;
  setToggleSelectFilter: React.Dispatch<React.SetStateAction<boolean>>;
}
type TagRender = SelectProps['tagRender'];
type OptionRender = SelectProps['optionRender'];

const tagRender: TagRender = (props) => {
  const { label, closable, onClose } = props;

  let content = '';
  if (typeof label === 'string') {
    content = label.split('$')[1];
  }

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      onClose={onClose}
      closable={label === 'All' ? false : true}
      style={{ marginInlineEnd: 4 }}
    >
      {label === 'All' ? 'All' : content}
    </Tag>
  );
};
const optionRender: OptionRender = (props) => {
  if (typeof props.label === 'string') {
    const [prefix, mainText] = props.label.split('$');
    const grade = prefix.split('.').length;
    if (props.label === 'All') {
      return <span className='font-medium'>All</span>;
    }
    return (
      <span style={{ marginLeft: `${grade * 1}rem` }}>
        <span className='mr-2'>{prefix}.</span>
        {mainText}
      </span>
    );
  }
};
const SelectCategory: FC<ISelectCategory> = ({
  options,
  categoryIds,
  searchParams,
  toggleSelectFilter,
  setSearchParams,
  setToggleSelectFilter,
  setCategoryIds
}) => {
  console.log('SelectCategory:::render');
  return (
    <div>
      <Space style={{ width: '100%' }} direction='vertical'>
        <Select
          mode='multiple'
          allowClear
          style={{ width: '100%', zIndex: 1000 }}
          placeholder='Please select category'
          open={toggleSelectFilter}
          tagRender={(props) => {
            return tagRender({
              ...props,
              onClose: () => {
                const newState = categoryIds.filter((id) => id !== props.value);
                searchParams.set('categories', newState.length === 0 ? 'all' : newState.join(','));
                setSearchParams(searchParams);
                searchParams.set('page', '1');
                setCategoryIds(newState.length === 0 ? ['all'] : newState);
              }
            });
          }}
          value={categoryIds}
          filterOption={(search, data) => {
            if (typeof data?.label === 'string') {
              const check = slugify(data.label, '').includes(search);
              return check;
            }
            return false;
          }}
          optionRender={optionRender}
          onSelect={(key) => {
            if (key === 'all') {
              setCategoryIds(['all']);
            } else {
              setCategoryIds((state) => {
                const newState = state.filter((vl) => vl !== 'all');
                newState.push(key);
                return newState;
              });
            }
          }}
          onDeselect={(vl) => {
            setCategoryIds((state) => {
              if (state.length === 1) {
                return ['all'];
              }
              const newState = state.filter((key) => key !== vl);
              return newState;
            });
          }}
          onDropdownVisibleChange={() => {
            setToggleSelectFilter((state) => {
              if (state === true) {
                searchParams.set('categories', categoryIds.join(','));
                searchParams.set('page', '1');
                setSearchParams(searchParams);
              }
              return !state;
            });
          }}
          onClear={() => {
            setCategoryIds(['all']);
            searchParams.set('categories', 'all');
            setSearchParams(searchParams);
          }}
          options={options}
          showSearch={true}
        ></Select>
      </Space>
    </div>
  );
};

// export default SelectCategory;
export default React.memo(SelectCategory);
