import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { FC } from 'react';
import FormUploadProductImage from '../ProductCreate/FormUploadProductImage';
import { RcFile, UploadFile } from 'antd/es/upload';
import { IProductColor } from '../../../Models/product';
import { IOptionProductData } from '../ProductCreate/ProductCreate';
import { Link, useParams } from 'react-router-dom';
import { TbChevronsLeft, TbChevronsRight } from 'react-icons/tb';
import EdittingOptionForm, { IDataUpdateOptionProduct } from '../ProductDetail/FormEditOption/EdittingOptionForm';

export interface IProductOptionTest {
  productOptions: IProductColor[];
  newProductOptions: IOptionProductData[];
  onAddNewOptionButton: () => void;
  onDeleteNewProductOption: (id: string) => void;
  onEditNewProductOption: (productColor: IOptionProductData, id: string) => void;
  onRemoveMedia: (file: UploadFile<any>, id: string) => void;
  onSaveAdditionOption: () => void;
  onActionAddingMediaUrlNewProductOption: (file: RcFile, id: string) => Promise<string>;
  actionReUploadNewOption: (file: RcFile, optionId: string, productImageId: string) => Promise<string>;
  onSortOptionImage: (optionId: string, productImageId: string, value: string) => void;
  onSortOption: (optionId: string, value: string) => void;
  onRemoveOptionImage: (optionId: string, productImageId: string) => void;
  dataUpdateOptionProduct: Record<string, IDataUpdateOptionProduct>;
  onChangeOrderAvaliableMediaUrl: () => void;
  onChangeOrderNewMediaUrl: () => void;
  onReUploadAvailableMediaUrl: (optionId: string, mediaUrlId: string) => void;
  onRemoveAvailableMediaUrl: (optionId: string, mediaUrlId: string) => void;
  onRemoveNewMediaUrl: (optionId: string, uid: string) => void;
  onRemoveAvailableProductOption: (optionId: string) => void;
  actionUploadAvailableMediaUrl: (file: RcFile, optionId: string, order: number) => Promise<string>;
  onResetProductOption: (optionId: string) => void;
  onSaveProductOption: (optionId: string) => void;
  onSaveAllProductOption: () => void;
  onEditAvailableOptionProduct: (optionId: string) => void;
}
export const initialDataUpdateOptionProduct: IDataUpdateOptionProduct = {
  uploads: {
    delete: [],
    add: [],
    edit: []
  },
  sizeAmounts: {
    delete: [],
    add: [],
    edit: []
  },
  name: undefined,
  colorCode: undefined,
  order: undefined
};
const ProductOptionTest: FC<IProductOptionTest> = ({
  productOptions,
  newProductOptions,
  onAddNewOptionButton,
  onDeleteNewProductOption,
  onEditNewProductOption,
  onRemoveMedia,
  onSaveAdditionOption,
  onActionAddingMediaUrlNewProductOption,
  actionReUploadNewOption,
  onSortOptionImage,
  onSortOption,
  onRemoveOptionImage,
  dataUpdateOptionProduct,
  onChangeOrderAvaliableMediaUrl,
  onChangeOrderNewMediaUrl,
  onReUploadAvailableMediaUrl,
  onRemoveAvailableMediaUrl,
  onRemoveNewMediaUrl,
  onRemoveAvailableProductOption,
  actionUploadAvailableMediaUrl,
  onResetProductOption,
  onSaveProductOption,
  onEditAvailableOptionProduct
}) => {
  const params = useParams();
  const checkExistMediaUrlsEmpty = newProductOptions.some((newOption) => newOption.productImages.length === 0);
  return (
    <div className='px-3 pb-5'>
      <div>
        <h2 className='font-bold flex items-center text-center justify-center text-2xl'>
          Option
          <Button onClick={onAddNewOptionButton} style={{ marginLeft: '20px' }} icon={<PlusOutlined />}></Button>{' '}
          <span className='text-lg font-normal ml-6'>{`( ${productOptions.length ?? 0} )`}</span>
        </h2>
        <div className='flex justify-between'>
          <Link
            to={'/products/product/' + params.id}
            className='text-center mb-6 font-normal leading-none hover:opacity-75 hover:cursor-pointer hover:font-medium flex items-center'
          >
            <span className='flex justify-center items-center mr-2 text-base'>
              <TbChevronsLeft />
            </span>
            Main detail product
          </Link>
          <Link
            to={'/products/product/create'}
            className='text-center mb-6  font-normal leading-none hover:opacity-75 hover:cursor-pointer hover:font-medium flex items-center'
          >
            Create new product
            <span className='flex justify-center items-center mr-2 text-base'>
              <TbChevronsRight />
            </span>
          </Link>
        </div>
        {productOptions.length > 0 &&
          productOptions.map((productOption) => {
            return (
              <EdittingOptionForm
                onResetProductOption={onResetProductOption}
                onSaveProductOption={onSaveProductOption}
                actionUploadAvailableMediaUrl={actionUploadAvailableMediaUrl}
                onReUploadAvailableMediaUrl={onReUploadAvailableMediaUrl}
                onRemoveAvailableProductOption={onRemoveAvailableProductOption}
                dataUpdateOptionProduct={dataUpdateOptionProduct[productOption._id] ?? initialDataUpdateOptionProduct}
                onChangeOrderAvaliableMediaUrl={onChangeOrderAvaliableMediaUrl}
                onChangeOrderNewMediaUrl={onChangeOrderNewMediaUrl}
                onRemoveAvailableMediaUrl={onRemoveAvailableMediaUrl}
                onRemoveNewMediaUrl={onRemoveNewMediaUrl}
                key={productOption._id}
                productColor={productOption}
                onEditAvailableOptionProduct={onEditAvailableOptionProduct}
              />
            );
          })}
      </div>

      {newProductOptions.length > 0 && (
        <section className='p-3 border-1 border-solid rounded-md border-blue-500 relative mb-6'>
          {newProductOptions.map((productOption) => {
            return (
              <React.Fragment key={productOption.id}>
                <FormUploadProductImage
                  onAddUploadNewMediaUrl={() => {}}
                  propCols={{ sm: { span: 4 } }}
                  onSortOptionImage={onSortOptionImage}
                  onRemoveOptionImage={onRemoveOptionImage}
                  actionReUpload={actionReUploadNewOption}
                  onSortOption={onSortOption}
                  productColor={productOption}
                  actionUpload={onActionAddingMediaUrlNewProductOption}
                  onDeleteOption={onDeleteNewProductOption}
                  onEditOption={onEditNewProductOption}
                  onRemoveMedia={onRemoveMedia}
                />
              </React.Fragment>
            );
          })}
          <div className='justify-center flex absolute -bottom-4 w-full'>
            {newProductOptions.length > 0 && (
              <Button
                type='primary'
                style={checkExistMediaUrlsEmpty ? { background: 'whitesmoke' } : undefined}
                disabled={checkExistMediaUrlsEmpty}
                onClick={onSaveAdditionOption}
              >
                Save
              </Button>
            )}
          </div>
        </section>
      )}
      <Button size='large' icon={<PlusOutlined />} onClick={onAddNewOptionButton}></Button>
    </div>
  );
};

export default ProductOptionTest;
