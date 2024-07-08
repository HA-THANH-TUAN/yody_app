import { Button, Col, Row } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { FaRegPlusSquare } from 'react-icons/fa';
import CreateFormCategory from './CategoryCreationForm';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import {
  createCategory,
  getCategories,
  selectCategories,
  selectStatusCreateCategory,
  selectStatusGetCategories,
  selectStatusUpdateCategory,
  updateCategory
} from '../../../Features/categoryPageSlice';
import SpinModal from '../../../Components/SpinModal';
import { useForm } from 'antd/es/form/Form';
import { CategoryCreationPayload } from '../../../Models/request';
import CategoryCreationForm from './CategoryCreationForm';
import { genSlug } from '../../../utils/common';
import CategoryStructure from './CategoryStructure/CategoryStructure';
import { ICategory } from '../../../Models/category';
import { useNavigate } from 'react-router-dom';

const initialCreationForm: CategoryCreationPayload = { name: '', slug: '', parentId: 'none', status: 'active' };
const ProductCategory = () => {
  const categories = useAppSelector(selectCategories);
  const statusGetCategories = useAppSelector(selectStatusGetCategories);
  const statusCreateCategory = useAppSelector(selectStatusCreateCategory);
  const statusUpdateCategory = useAppSelector(selectStatusUpdateCategory);
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const [categoryCreationFormData] = useForm<CategoryCreationPayload>();

  const fetchCategories = useCallback(() => {
    dispatch(getCategories()).then(() => {
      categoryCreationFormData.setFieldsValue(initialCreationForm);
    });
  }, []);

  useEffect(fetchCategories, []);

  const onChangeCreationForm = (value: any) => {
    if (value.name !== undefined) {
      categoryCreationFormData.setFieldValue('slug', genSlug(value.name));
    }
  };

  const handleSubmitCreationForm = (values: CategoryCreationPayload) => {
    dispatch(createCategory(values)).then(fetchCategories);
  };

  const handleResetCreationForm = () => {
    categoryCreationFormData.setFieldsValue(initialCreationForm);
  };

  const handleStatusToogle = (_id: string, statusPresent: ICategory['status']) => {
    dispatch(
      updateCategory({
        _id: _id,
        status: statusPresent === 'active' ? 'unactive' : 'active'
      })
    ).then(fetchCategories);
  };

  const handleNavToDetail = (_id: string) => {
    nav('/products/category/' + _id);
  };
  return (
    <>
      <SpinModal
        isOpen={
          statusGetCategories === 'pending' || statusCreateCategory === 'pending' || statusUpdateCategory === 'pending'
        }
      />
      <section className='bg-white'>
        <div className='mb-6 flex justify-center items-center'>
          <h1 className='text-center font-semibold text-4xl'>Category</h1>
        </div>
        <div>
          <Row gutter={[30, 50]}>
            <Col sm={{ span: 24 }} lg={{ span: 12 }}>
              <div>
                <h2 className='text-3xl text-center mb-4 '>Structure</h2>
                <CategoryStructure
                  onStatusToogle={handleStatusToogle}
                  onNavToDetail={handleNavToDetail}
                  categories={categories ?? []}
                />
              </div>
            </Col>
            <Col sm={{ span: 24 }} lg={{ span: 12 }}>
              <div className=''>
                <CategoryCreationForm
                  form={categoryCreationFormData}
                  categories={categories ?? []}
                  onChangeForm={onChangeCreationForm}
                  onFinish={handleSubmitCreationForm}
                  onReset={handleResetCreationForm}
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default ProductCategory;
