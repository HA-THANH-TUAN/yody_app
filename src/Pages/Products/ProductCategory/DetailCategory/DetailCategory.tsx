import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hook';
import {
  getCategories,
  getCategory,
  selectCategories,
  selectStatusGetCategories,
  selectStatusGetCategory,
  selectStatusUpdateCategory,
  updateCategory
} from '../../../../Features/categoryPageSlice';
import SpinModal from '../../../../Components/SpinModal';
import { FaRegPlusSquare } from 'react-icons/fa';
import { Breadcrumb, BreadcrumbItemProps, Button, Col, Row } from 'antd';
import CategoryCreationForm from '../CategoryCreationForm';
import { useForm } from 'antd/es/form/Form';
import { CategoryCreationPayload, CategoryUpdatingPayload } from '../../../../Models/request';
import CategoryEditorForm from './CategoryEditorForm';
import { ICategory } from '../../../../Models/category';
import { IShortCategory } from '../../../../Models/response';
import CategoryStructure from '../CategoryStructure/CategoryStructure';
import { BreadcrumbItemType, BreadcrumbProps, ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { genSlug } from '../../../../utils/common';

const DetailCategory = () => {
  const nav = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const statusGetCategory = useAppSelector(selectStatusGetCategory);
  const statusGetCategories = useAppSelector(selectStatusGetCategories);
  const statusUpdateCategory = useAppSelector(selectStatusUpdateCategory);
  const [permissionLeavePage, setPermissionLeavePage] = useState<boolean>(true);
  const categories = useAppSelector(selectCategories);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<IShortCategory[] | null>(null);

  const [categoryEditorFormData] = useForm<CategoryCreationPayload>();
  const fetchCategories = useCallback(() => {
    dispatch(getCategories()).then(() => {});
  }, []);
  const fetchDetailCategory = useCallback(
    (id: string) => {
      dispatch(getCategory(id))
        .unwrap()
        .then((dt) => {
          if (dt && dt.metadata?.category) {
            const category = dt.metadata.category;
            const breadcrumb = dt.metadata.breadcrumb;
            categoryEditorFormData.setFieldsValue({
              name: category.name,
              slug: category.slug,
              status: category.status,
              parentId: category.parentId ?? 'none'
            });
            category.categories = null;
            setCategory(category);
            setBreadcrumb(breadcrumb);
          }
        });
    },
    [params.id]
  );
  useEffect(() => {
    const id = params.id;
    if (id && id.length === 24) {
      fetchDetailCategory(id);
    }
    if (!categories) {
      fetchCategories();
    }
  }, [params.id]);
  const onReturnCategoryPage = () => {
    if (permissionLeavePage) {
      nav('/products/category');
    }
  };

  const onChangeEditorForm = (value: any) => {
    if (value.name !== undefined) {
      categoryEditorFormData.setFieldValue('slug', genSlug(value.name));
    }
  };
  const handleUpdateCategory = (values: CategoryCreationPayload) => {
    if (category) {
      const payloadUpdate: CategoryUpdatingPayload = { _id: category._id };
      if (values.name !== category.name) {
        payloadUpdate.name = values.name;
      }
      if (values.slug !== category.slug) {
        payloadUpdate.slug = values.slug;
      }
      if (values.status !== category.status) {
        payloadUpdate.status = values.status;
      }
      if (values.parentId === 'none' ? category.parentId !== null : values.parentId !== category.parentId) {
        payloadUpdate.parentId = values.parentId === 'none' ? null : values.parentId;
      }
      console.log('payloadUpdate:::: ', payloadUpdate);
      dispatch(updateCategory(payloadUpdate))
        .unwrap()
        .then(() => {
          fetchDetailCategory(params.id ?? '');
          fetchCategories();
        });
    }
  };
  const handleResetForm = () => {
    if (category) {
      categoryEditorFormData.setFieldsValue({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        status: category.status
      });
    }
  };
  const handleStatusToogle = (_id: string, statusPresent: ICategory['status']) => {
    dispatch(
      updateCategory({
        _id: _id,
        status: statusPresent === 'active' ? 'unactive' : 'active'
      })
    ).then(() => {
      fetchDetailCategory(params.id ?? '');
      fetchCategories();
    });
  };

  const handleNavToDetail = (_id: string) => {
    nav('/products/category/' + _id);
  };
  const convetItemsBreadcrumb = (breadcrumb: IShortCategory[]): BreadcrumbProps['items'] => {
    return breadcrumb.map((item) => ({
      onClick: (e) => {
        nav('/products/category/' + item._id);
      },
      title: item.name
    }));
  };
  const itemsBreadcrumb = convetItemsBreadcrumb(breadcrumb ?? []);
  return (
    <>
      {!(params && params.id?.length === 24) && <Navigate to={'/products/category'} />}
      <SpinModal
        isOpen={
          statusGetCategories === 'pending' || statusGetCategory === 'pending' || statusUpdateCategory === 'pending'
        }
      />
      <section className='bg-white '>
        <div className='mb-6 flex justify-center items-center'>
          <h1 className='text-center font-semibold text-4xl mr-4'>Detail Category</h1>
          <Button onClick={onReturnCategoryPage} type='primary' icon={<FaRegPlusSquare />}></Button>
        </div>
        <div>
          <Row gutter={[30, 50]}>
            <Col sm={{ span: 24 }} lg={{ span: 12 }}>
              <div>
                <h2 className='text-3xl text-center mb-4 '>Structure</h2>
                <div className='mb-4 flex'>
                  {itemsBreadcrumb && itemsBreadcrumb.length > 1 && (
                    <Breadcrumb separator=' > ' items={itemsBreadcrumb} />
                  )}
                </div>
                <CategoryStructure
                  onStatusToogle={handleStatusToogle}
                  onNavToDetail={handleNavToDetail}
                  categories={category == null ? [] : [category]}
                  disibledDetail={[params.id ?? '']}
                />
              </div>
            </Col>
            <Col sm={{ span: 24 }} lg={{ span: 12 }}>
              <div className=''>
                <CategoryEditorForm
                  form={categoryEditorFormData}
                  categories={categories ?? []}
                  category={
                    category === null
                      ? null
                      : {
                          name: category.name,
                          slug: category.slug,
                          parentId: category.parentId,
                          status: category.status
                        }
                  }
                  onChangeForm={onChangeEditorForm}
                  onFinish={handleUpdateCategory}
                  onReset={handleResetForm}
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default DetailCategory;
