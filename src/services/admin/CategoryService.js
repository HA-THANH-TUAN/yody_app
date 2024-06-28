const { ObjectId } = require('mongodb');
const CategoryModel = require('../../models/CategoryModel');
const { BadRequest } = require('../../core/handleError');
const { clientRedis } = require('../../configurations/redisConfig');
const { recursiveCategoryIdGradeChild } = require('../../utils/common');

class CategoryService {
    async createCategory(data) {
        const parentId = data.parentId;
        const name = data.name;
        const slug = data.slug;
        const dataInsert = {
            name: name,
            slug: slug,
            status: Number(data.status),
            parentId: parentId ? new ObjectId(parentId) : null,
            urlImage: null
        };
        const categoryCheckSlug = await CategoryModel.getDocCategory(
            undefined,
            slug
        );
        if (categoryCheckSlug) {
            throw new BadRequest('slug exist');
        }
        let resultInsert = null;
        if (parentId) {
            const categoryCheckId = await CategoryModel.getDocCategory(
                new ObjectId(parentId)
            );
            if (!categoryCheckId) {
                throw new BadRequest('category parent not exist');
            }
            dataInsert.grade = Number(categoryCheckId.grade) + 1;
            resultInsert = await CategoryModel.createCategory(dataInsert);
        } else {
            dataInsert.grade = 1;
            resultInsert = await CategoryModel.createCategory(dataInsert);
        }
        return resultInsert;
    }
    async updateCategory(data) {
        const { id, ...dataUpdate } = data;
        const _id = new ObjectId(data.id);
        const categories = await CategoryModel.getDocCategories();
        const category = categories.find((cate) => cate._id.toString() === id);
        let detalGrade = 1;
        if (data.parentId !== undefined) {
            if (data.parentId === '') {
                dataUpdate.grade = 1;
                detalGrade = 1 - category.grade;
            } else {
                const parentCate = categories.find(
                    (cate) => cate._id.toString() === data.parentId
                );
                if (!parentCate) {
                    throw new BadRequest('Parent Category does not exist');
                }
                dataUpdate.grade = parentCate.grade + 1;
                detalGrade = parentCate.grade - category.grade + 1;
            }
        }

        if (!category) {
            throw new BadRequest('category does not exist');
        }
        if (data.slug) {
            const isExitSlug = categories.some(
                (cate) => cate.slug === data.slug
            );
            if (isExitSlug) {
                throw new BadRequest('slug of category exist');
            }
        }

        const categoryIdChild = recursiveCategoryIdGradeChild(
            categories,
            _id,
            []
        ).map(({ _id }) => _id);
        dataUpdate.dataUpdateGrades = {
            detalGrade: detalGrade,
            listId: categoryIdChild
        };
        await CategoryModel.updateCategory(_id, dataUpdate);
    }
    async getCategory(id) {
        return await CategoryModel.getCategory(new ObjectId(id));
    }
    async getCategories() {
        return await CategoryModel.getCategories();
    }

    async deleteService(deleteId) {
        const categoryInfor = await CategoryModel.getStackCategory(
            undefined,
            new ObjectId(deleteId)
        );
        await CategoryModel.deleteCategory(categoryInfor.listIdCategory);
    }
}

module.exports = new CategoryService();
