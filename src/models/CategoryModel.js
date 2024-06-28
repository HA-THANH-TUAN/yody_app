const Joi = require('joi');
const { customObjectId } = require('../utils/customJoi');
const { mongDb } = require('../configurations/mongodbConfig');
const {
    escapeRegex,
    hanldeValidateSchema,
    recursiveCategories,
    recursiveCategoriesParent
} = require('../utils/common');
const { BadRequest } = require('../core/handleError');
const { ObjectId } = require('mongodb');

const categoriesCollection = mongDb().collection('categories');

const schemaCreateCategory = Joi.object({
    name: Joi.string(),
    slug: Joi.string(),
    parentId: customObjectId.objectId().allow(null),
    grade: Joi.number().integer().max(3),
    status: Joi.number().allow(1, 0).required(),
    urlImage: Joi.string().allow(null),
    createdAt: Joi.date().default(new Date()),
    updatedAt: Joi.date().default(new Date())
});
class CategoryModel {
    static async createCategory(data) {
        const value = hanldeValidateSchema(data, schemaCreateCategory);
        const result = await categoriesCollection.insertOne(value);
        value._id = result.insertedId;
        return value;
    }
    static async getDocCategories() {
        return await categoriesCollection.find().toArray();
    }
    static async getDocCategory(_id, slug, parentId, isMany = false) {
        const filter = {};
        if (_id) {
            filter._id = _id;
        }
        if (slug) {
            filter.slug = slug;
        }
        if (parentId) {
            filter.parentId = parentId;
        }
        let result = null;
        if (isMany === true) {
            result = await categoriesCollection.find(filter).toArray();
        } else {
            result = await categoriesCollection.findOne(filter);
        }
        return result;
    }
    static async searchCategories(data) {
        const { search, status, page, limit } = data;
        const filterMatch = {};
        switch (true) {
            case search.length > 0:
                {
                    const ecapText = escapeRegex(search);
                    filterMatch.name = { $regex: new RegExp(ecapText, 'gi') };
                }
                break;

            default:
                break;
        }
        const result = await mongDb()
            .collection('categories')
            .aggregate([
                {
                    $match: {}
                }
            ])
            .toArray();
        return result;
    }
    static async getCategory(_id) {
        const categoriesAll = await categoriesCollection.find().toArray();
        const categoryMain = categoriesAll.find(
            (cate) => cate._id.toString() === _id.toString()
        );
        let parentCategories = [];
        let categories = [];
        if (categoryMain) {
            parentCategories = recursiveCategoriesParent(
                categoriesAll,
                categoryMain.parentId,
                [
                    {
                        _id: categoryMain._id,
                        name: categoryMain.name,
                        slug: categoryMain.slug,
                        grade: categoryMain.grade
                    }
                ]
            );
            categories = recursiveCategories([categoryMain], categoriesAll);
        }
        return {
            categories: categories,
            breadCrum: parentCategories
        };
    }
    static async getCategories() {
        const categories = await categoriesCollection.find().toArray();
        return recursiveCategories(
            categories.filter(({ grade }) => grade === 1),
            categories
        );
    }

    static async updateCategory(_id, dataUpdate) {
        const {
            parentId,
            slug,
            name,
            grade,
            dataUpdateGrades: { detalGrade, listId }
        } = dataUpdate;
        const operatorUpdate = {};
        if (parentId !== undefined) {
            operatorUpdate.parentId =
                parentId === '' ? null : new ObjectId(parentId);
            if (grade) {
                operatorUpdate.grade = grade;
            }
        }
        if (slug) {
            operatorUpdate.slug = slug;
        }
        if (name) {
            operatorUpdate.name = name;
        }
        console.log('operatorUpdate:::', operatorUpdate);
        console.log('dataUpdate:::', dataUpdate);
        await categoriesCollection.updateOne({ _id }, { $set: operatorUpdate });
        if (listId.length) {
            await categoriesCollection.updateMany(
                { _id: { $in: listId } },
                { $set: { grade: { $add: ['$grade', detalGrade] } } }
            );
        }
        // if (parentId !== undefined) {
        //     const dataUpdateParent = []
        //     const categories = await categoriesCollection.find().toArray()
        //     if (parentId === '') {
        //         const parentCate = categories.find(
        //             (cate) => cate._id.toString() === _id.toString()
        //         )

        //     } else {
        //         const parentCate = categories.find(
        //             (cate) => cate._id.toString() === parentId
        //         )
        //         if (!parentCate) {
        //             throw new BadRequest('Parent Category does not exist')
        //         }
        //         const recursiveCategoryIdGradeChild = (
        //             categoriesAll = [],
        //             _id,
        //             result = []
        //         ) => {
        //             for (const category of categoriesAll) {
        //                 if (category._id.toString() === _id.toString()) {
        //                     result.push({
        //                         _id: category._id,
        //                         grade: category.grade,
        //                     })
        //                     recursiveCategoryIdGradeChild(
        //                         categoriesAll,
        //                         category._id,
        //                         result
        //                     )
        //                 }
        //             }
        //             return result
        //         }

        //         console.log(
        //             recursiveCategoryIdGradeChild(
        //                 categories,
        //                 parentCate._id,
        //                 []
        //             )
        //         )
        //     }
        // }
        // const update = {}
        // Object.keys(dataUpdateRest).forEach((key) => {
        //     update[key] = dataUpdateRest[key]
        // })
        // await categoriesCollection.updateOne({ _id }, { $set: update })
    }
    static async getCategoriesWeb() {
        return await categoriesCollection
            .find({
                status: 1
            })
            .toArray();
    }
    static async getStackCategory(slug, _id, status = 0) {
        const filterCategory = {};
        if (status === 1) {
            filterCategory.status = 1;
        }
        const c = await categoriesCollection.find(filterCategory).toArray();
        let isExit = null;
        if (slug) {
            isExit = c.find((cat) => cat.slug === slug);
        } else {
            isExit = c.find((cat) => cat._id.toString() === _id.toString());
        }
        if (!isExit) {
            return {
                listIdCategory: [],
                listParent: []
            };
        }
        const recursiveCategoryIdChild = (data, _id, result = []) => {
            for (const item of data) {
                if (item.parentId?.toString() === _id.toString()) {
                    result.push(item._id);
                    recursiveCategoryIdChild(data, item._id, result);
                }
            }
            return result;
        };
        const listIdCategory = recursiveCategoryIdChild(c, isExit._id, [
            isExit._id
        ]);
        const listParent = recursiveCategoriesParent(c, isExit.parentId, [
            {
                _id: isExit._id,
                name: isExit.name,
                slug: isExit.slug,
                grade: isExit.grade
            }
        ]);
        return {
            listIdCategory,
            listParent
        };
    }
    static async deleteCategory(listIdCategory) {
        await categoriesCollection.deleteMany({ _id: { $in: listIdCategory } });
    }
}

module.exports = CategoryModel;
