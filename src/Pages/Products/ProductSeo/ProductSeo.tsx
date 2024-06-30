import React, { useEffect, useState } from 'react';
import FormProductSeo, { PayloadCreateMetaSeo } from './FormProductSeo';
import { useForm } from 'antd/es/form/Form';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { getMetaSeoProduct, selectStatusGetMetaSeoProduct } from '../../../Features/productSeoSlice';
import { IMetaDataResponseGetSeoProduct } from '../../../Models/response';
import { Drawer, Image, Tag } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { AiTwotoneSetting } from 'react-icons/ai';
import DrawerSettingPrefixValueSeo from './DrawerSettingPrefixValueSeo';
const ProductSeo = () => {
  const [formMetaSeo] = useForm<PayloadCreateMetaSeo>();
  const params = useParams();
  const statusGetMetaSeoProduct = useAppSelector(selectStatusGetMetaSeoProduct);
  const dispatch = useAppDispatch();
  const [dataProduct, setDataProduct] = useState<null | IMetaDataResponseGetSeoProduct>(null);
  useEffect(() => {
    const id = params.id;
    if (id) {
      dispatch(getMetaSeoProduct(id))
        .unwrap()
        .then((data) => {
          const metaSeoProduct = data.metadata?.metaSeoProduct;
          formMetaSeo.setFieldsValue({
            id: data.metadata?._id ?? '',
            description: metaSeoProduct?.description ?? '',
            keywords: metaSeoProduct?.keywords ?? '',
            url: metaSeoProduct?.url ?? '',
            urlImage: metaSeoProduct?.urlImage ?? ''
          });
          setDataProduct(data.metadata ?? null);
        });
    }
  }, [params.id]);

  const optionUrls: DefaultOptionType[] = (dataProduct?.productColors ?? []).map((pc) => {
    return {
      label: (
        <div className='flex justify-center'>
          <Tag color={pc.colorCode} children={pc.color} />
        </div>
      ),
      title: pc.color,
      options: pc.mediaUrls.map((m, im) => ({
        value: m.url,
        label: <Image width={50} src={m.url} />
      }))
    };
  });

  const handleSubmitForm = (values: PayloadCreateMetaSeo) => {
    console.log('values::::', values);
  };

  const [isOpenDrawerSetting, setIsOpenDrawerSetting] = useState<boolean>(false);
  const handleOnCloseDrawerSetting = () => {
    setIsOpenDrawerSetting(false);
  };
  return (
    <div className='p-3 overflow-hidden h-full'>
      <DrawerSettingPrefixValueSeo isOpen={isOpenDrawerSetting} onCloseDrawerSetting={handleOnCloseDrawerSetting} />

      <section
        className='overflow-hidden h-full
       py-3 px-2 rounded-md'
      >
        <div className='max-w-xl mx-auto px-6 py-2  bg-white rounded-md'>
          <h3 className='mb-4 flex justify-center text-2xl  font-semibold'>
            Meta Seo
            <span
              onClick={() => {
                setIsOpenDrawerSetting(true);
              }}
              className='flex items-center ml-3 hover:opacity-70 hover:cursor-pointer'
            >
              <AiTwotoneSetting />
            </span>
          </h3>
          <FormProductSeo
            onSubmit={handleSubmitForm}
            loading={dataProduct === null}
            optionUrls={optionUrls}
            form={formMetaSeo}
          />
        </div>
      </section>
    </div>
  );
};

export default ProductSeo;
