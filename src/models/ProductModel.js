const Joi = require('joi');
const { customObjectId } = require('../utils/customJoi');
const { BadRequest } = require('../core/handleError');
const { mongDb } = require('../configurations/mongodbConfig');
const { escapeRegex, hanldeValidateSchema } = require('../utils/common');
const cloudCloudinary = require('../configurations/cloudinaryConfig');
const { ObjectId } = require('mongodb');
const productColection = mongDb().collection('products');
const productColorColection = mongDb().collection('product_colors');
const productMetaSeoProduct = mongDb().collection('meta_seo_product');
const schemaMetaSeoProduct = Joi.object({
    _id: customObjectId.objectId(),
    url: Joi.string(),
    description: Joi.string(),
    keywords: Joi.string(),
    urlImage: Joi.string()
});
class ProductModel {
    static async createProduct(data) {
        const validateSchema = Joi.object({
            _id: customObjectId.objectId(),
            name: Joi.string(),
            slug: Joi.string(),
            price: Joi.number(),
            detail: Joi.string().min(0).allow(null).default(null),
            categoryId: customObjectId.objectId().allow(null),
            status: Joi.valid(0, 1),
            createdAt: Joi.date().default(new Date())
        });
        const resultVal = validateSchema.validate(data);
        if (resultVal.error) {
            console.log(resultVal.error);
            throw new BadRequest();
        }
        await productColection.insertOne(resultVal.value);
        return resultVal.value;
    }

    static async createProductColor(data) {
        const validateSchema = Joi.object({
            _id: customObjectId.objectId(),
            productId: customObjectId.objectId(),
            color: Joi.string(),
            size: Joi.string(),
            amount: Joi.number(),
            colorCode: Joi.string(),
            order:Joi.number(),
            status:Joi.number(),
            sizeAmounts: Joi.array().items(
                Joi.object({
                    _id: customObjectId.objectId(),
                    size: Joi.string(),
                    amount: Joi.number(),
                    order:Joi.number(),
                })
            ),
            mediaUrls: Joi.array().items(
                Joi.object({
                    _id: customObjectId.objectId(),
                    type: Joi.valid('image', 'video'),
                    status: Joi.valid('pending', 'success', 'fail'),
                    url: Joi.string().default(null).min(0).allow(null),
                    order: Joi.number(),
                    publicKey: Joi.string().default(null)
                })
            ),
            sold: Joi.number().default(0),
            createdAt: Joi.date().default(new Date())
        });
        const resultVal = hanldeValidateSchema(data ,validateSchema);

        const result = await productColorColection.insertOne(resultVal);
        return result;
    }

    static async createProductMetaSeo(dataInsert) {
        const value = hanldeValidateSchema(
            dataInsert,
            schemaMetaSeoProduct,
            400
        );
        await productMetaSeoProduct.insertOne(value);
    }
    static async getProductMetaSeo(_productId) {
        const result = await productColection
            .aggregate([
                { $match: { _id: _productId } },
                {
                    $lookup: {
                        from: 'product_colors',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'productColors'
                    }
                },
                {
                    $lookup: {
                        from: 'meta_seo_product',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'metaSeoProduct'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        price: 1,
                        status: 1,
                        slug: 1,
                        detail: 1,
                        metaSeoProduct: {
                            $cond: [
                                { eq: ['$metaSeoProduct', []] },
                                null,
                                { $arrayElemAt: ['$metaSeoProduct', 0] }
                            ]
                        },
                        productColors: 1,
                        createdAt: 1
                    }
                }
            ])
            .toArray();
        return result[0];
    }
    static async updateProductMetaSeo(_id, dataUpdate) {
        const value = hanldeValidateSchema(dataUpdate, schemaMetaSeoProduct);
        const update = {};
        for (const key in value) {
            update[key] = value[key];
        }
        await productMetaSeoProduct.updateOne({ _id }, { $set: update });
    }

    static async getProduct(_id, slug, status) {
        const filter = {};
        if (_id !== undefined) {
            filter._id = _id;
        }
        if (slug !== undefined) {
            filter.slug = slug;
        }
        if (status !== undefined) {
            filter.status = status;
        }
        const result = await productColection
            .aggregate([
                { $match: filter },
                { $limit: 1 },
                {
                    $lookup: {
                        from: 'product_colors',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'productColors'
                    }
                }
            ])
            .toArray();
        return result[0];
    }
    static async getProductForIds(_listId) {
        const result = await productColection
            .find({
                _id: {
                    $in: _listId
                },
                status: 1
            })
            .toArray();
        return result;
    }
    static async getProductColor(_id) {
        return await productColorColection.findOne({ _id: _id });
    }
    static async setUrlImageProduct(
        _colorId,
        _mediaUrlId,
        url,
        status,
        publicId
    ) {
        const result = await productColorColection.updateOne(
            { _id: _colorId, 'mediaUrls._id': _mediaUrlId },
            {
                $set: {
                    'mediaUrls.$.url': url,
                    'mediaUrls.$.status': status,
                    'mediaUrls.$.publicKey': publicId
                }
            }
        );
    }
    static async getProductForAdmin(query) {
        const {
            page,
            limit,
            search,
            minPrice,
            maxPrice,
            categoryIds,
            category,
            status,
            description,
            categoryStatus,
            option,
            soldOut,
            seo,
            rating
        } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const aggregationPipeline = [];
        const filterFirst = {
            $match: {}
        };
        if (search !== undefined) {
            const textConvert = escapeRegex(search);
            filterFirst['$match']['name'] = {
                $regex: new RegExp(textConvert, 'gi')
            };
        }
        if (status !== undefined) {
            filterFirst['$match']['status'] = Number(status);
        }
        if (categoryIds !== undefined && categoryIds?.length > 0) {
            filterFirst['$match']['categoryId'] = { $in: categoryIds };
        }
        if (description !== undefined) {
            filterFirst['$match']['$expr'] =
                description === 'has'
                    ? {
                          $or: [
                              { detail: { $ne: null } },
                              { detail: { $ne: '' } }
                          ]
                      }
                    : {
                          $or: [
                              { detail: { $eq: null } },
                              { detail: { $eq: '' } }
                          ]
                      };
        }
        if (minPrice !== undefined) {
            filterFirst['$match']['price'] = {
                ...(filterFirst['$match']['price'] ?? {}),
                $gte: Number(minPrice)
            };
        }
        if (maxPrice !== undefined) {
            filterFirst['$match']['price'] = {
                ...(filterFirst['$match']['price'] ?? {}),
                $lte: Number(maxPrice)
            };
        }
        if (rating !== undefined) {
        }
        aggregationPipeline.push(filterFirst);
        aggregationPipeline.push(
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'product_colors',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'productColors'
                }
            },
            {
                $lookup: {
                    from: 'meta_seo_product',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'metaSeoProduct'
                }
            }
        );

        if (category !== undefined) {
            const filterCategory = { $match: {} };
            filterCategory['$match'] = {
                category:
                    category === 'has'
                        ? {
                              $not: {
                                  $eq: []
                              }
                          }
                        : {
                              $eq: []
                          }
            };
            aggregationPipeline.push(filterCategory);
        }

        if (categoryStatus !== undefined && category === 'has') {
            const filterCategoryStatus = { $match: {} };
            filterCategoryStatus['$match'] = {
                'category.status': Number(categoryStatus)
            };
            aggregationPipeline.push(filterCategoryStatus);
        }
        if (option !== undefined) {
            const filterOption = { $match: {} };
            filterOption['$match'] = {
                productColors:
                    option === 'none' ? { $eq: [] } : { $not: { $eq: [] } }
            };
            aggregationPipeline.push(filterOption);
        }
        if (soldOut !== undefined || option === 'has') {
            const filterSoldOut = { $match: {} };
            filterSoldOut['$match'] = {
                'productColors.sizeAmounts.amount':
                    soldOut === 'has' ? { $gt: 0 } : { $lte: 0 }
            };
            aggregationPipeline.push(filterSoldOut);
        }
        if (seo !== undefined) {
            const filterSeo = { $match: {} };
            filterSeo['$match'] = {
                metaSeoProduct:
                    seo === 'none' ? { $eq: [] } : { $not: { $eq: [] } }
            };
            aggregationPipeline.push(filterSeo);
        }
        const aggregationPipelineAllProduct = [
            ...aggregationPipeline,
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ];
        const aggregationPipelineProducts = [
            ...aggregationPipeline,
            {
                $skip: skip
            },
            {
                $limit: Number(limit)
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    price: 1,
                    status: 1,
                    slug: 1,
                    detail: 1,
                    category: {
                        $cond: [
                            { $eq: ['$category', []] },
                            null,
                            { $arrayElemAt: ['$category', 0] }
                        ]
                    },
                    metaSeoProduct: {
                        $cond: [
                            { $eq: ['$metaSeoProduct', []] },
                            null,
                            { $arrayElemAt: ['$metaSeoProduct', 0] }
                        ]
                    },
                    productColors: 1,
                    createdAt: 1
                }
            }
        ];
        const totalProductLength =
            (
                await productColection
                    .aggregate(aggregationPipelineAllProduct)
                    .toArray()
            )[0]?.count ?? 0;
        const totalPage = Math.ceil(totalProductLength / Number(limit));
        const products = await productColection
            .aggregate(aggregationPipelineProducts)
            .toArray();
        console.log('totalProductLength::::', totalProductLength);

        const panigation = {
            page: Number(page),
            limit: Number(limit),
            total: totalPage
        };
        return { products, panigation };
    }
    static async deleteOptionProduct(_optionId) {
        const data = await productColorColection.findOneAndDelete({
            _id: _optionId
        });
        const listPublickey = data.mediaUrls.map((value) => value.publicKey);
        for (const pId of listPublickey) {
            cloudCloudinary.uploader.destroy(pId, (error,result)=>{
                console.log("result:::",result)
            });
        }
    }
    static async deleteUploadOptionProduct(_optionId, _uploadId) {
        const data = await productColorColection.findOneAndUpdate(
            { _id: _optionId },
            { $pull: { mediaUrls: { _id: _uploadId } } }
        );

        const publicKey = data.mediaUrls.find((value) => value._id.toString() === _uploadId.toString())?.publicKey;
        console.log("publicKey:::",publicKey)

        if(publicKey){
            cloudCloudinary.uploader.destroy(publicKey, (error,result)=>{
                console.log("result:::",result)
            });
        }
    }
    static async updateSizeAmountOptionProduct(
        _optionId,
        _sizeAmounts
    ) {
        const updatePromise = _sizeAmounts.map((_sizeAmount)=>{
            const update = Object.keys(_sizeAmount).reduce((prev, key) => {
                prev[`sizeAmounts.$.${key}`] = _sizeAmount[key];
                return prev;
            }, {});
            const updateOperator = { $set: update };
            return productColorColection.updateOne(
                { _id: _optionId, 'sizeAmounts._id': _sizeAmount._id },
                updateOperator
            );
        })
        await Promise.all(updatePromise);
    }
    static async updateOptionProduct(_optionId, updateData) {
        const update = Object.keys(updateData).reduce((prev, key) => {
            prev[key] = updateData[key];
            return prev;
        }, {});
        const updateOperator = { $set: update };
        await productColorColection.updateOne(
            { _id: _optionId },
            updateOperator
        );
    }
    static async deleteSizeAmountOption(_optionId, _sizeAmountIds) {
        await productColorColection.updateOne(
            { _id: _optionId },
            { $pull: { sizeAmounts: { _id: {$in: _sizeAmountIds} } } }
        );
    }
    static async addSizeAmountOption(_optionId, _addDatas) {
        await productColorColection.updateOne(
            { _id: _optionId },
            { $push: { sizeAmounts: { $each: _addDatas } } }
        );
    }
    static async updateProduct(_productId, _updateDatas) {
        console.log('_updateDatas:::', _updateDatas);
        const dataUpdate = Object.keys(_updateDatas).reduce((prev, pres) => {
            return { ...prev, [pres]: _updateDatas[pres] };
        }, {});
        const operatorUpdate = { $set: dataUpdate };
        await productColection.updateOne({ _id: _productId }, operatorUpdate);
    }
    static async addUploadOptionProduct(_optionId, _addDatas) {
        await productColorColection.updateOne(
            { _id: _optionId },
            { $push: { mediaUrls: { $each: _addDatas } } }
        );
    }
    static async updateMediaUrlOption(_optionId, _mediaUrls) {
        const updates = _mediaUrls.map((_mediaUrl)=>(
            productColorColection.updateOne(
                { _id: _optionId, "mediaUrls._id" : _mediaUrl._id  },
                { $set: { "mediaUrls.$.order" : _mediaUrl.order } }
            )
        ))
        await Promise.all(updates);
    }

    // ------------------------ web ----------------------
    static async getProductForCategoryWeb(data) {
        const limit = 20;
        const { listIdCategory, srt, mnp, mxp, page } = data;

        const pipelineCommon = [
            {
                $lookup: {
                    from: 'product_colors',
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'productColors'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    price: 1,
                    status: 1,
                    slug: 1,
                    detail: 1,
                    createdAt: 1,
                    productColors: 1,
                    quanlitySold: {
                        $cond: [
                            { $or: [{ $eq: ['$productColors', []] }] },
                            0,
                            { $sum: '$productColors.sold' }
                        ]
                    },
                    category: {
                        $cond: [
                            { $or: [{ $eq: ['$category', []] }] },
                            null,
                            { $arrayElemAt: ['$category', 0] }
                        ]
                    }
                }
            }
        ];
        const pipelineMatchCommon = {
            $match: {
                'category.status': 1,
                status: 1
            }
        };
        if (listIdCategory) {
            pipelineMatchCommon['$match']['category._id'] = {
                $in: listIdCategory
            };
        }
        if (mnp || mxp) {
            pipelineMatchCommon['$match']['price'] = {};
        }
        if (mnp) {
            pipelineMatchCommon['$match']['price']['$gte'] = mnp;
        }
        if (mxp) {
            pipelineMatchCommon['$match']['price']['$lte'] = mxp;
        }

        const pipelineSort = [];
        switch (srt) {
            case 'newest':
                pipelineSort.push({
                    $sort: {
                        createAt: -1
                    }
                });
                break;
            case 'bestSeller':
                pipelineSort.push({
                    $sort: {
                        quanlitySold: -1,
                    }
                });
                break;
            case 'nAsc':
                pipelineSort.push({
                    $sort: {
                        name: 1,
                    }
                });
                break;
            case 'nDesc':
                pipelineSort.push({
                    $sort: {
                        name: -1,
                    }
                });
                break;
            case 'prAsc':
                pipelineSort.push({
                    $sort: {
                        price :1,
                    }
                });
                break;
            case 'prDesc':
                pipelineSort.push({
                    $sort: {
                        price :-1,
                    }
                });
                break;
            default:
                break;
        }

        const promiseTotalDoc = productColection
            .aggregate([
                ...pipelineCommon,
                pipelineMatchCommon,
                {
                    $count: 'total'
                }
            ])
            .toArray();
        const promiseProducts = productColection
            .aggregate([...pipelineCommon, pipelineMatchCommon, ...pipelineSort , {$skip:(page-1)*limit},{$limit:20}])
            .toArray();
        const result = await Promise.all([promiseTotalDoc, promiseProducts]);
        const totalPage = result[0]?.[0].total ?? 0;
        const resultModel = {
            products: result[1],
            panigation: {
                page: page,
                limit: limit,
                total: Math.ceil(totalPage / limit)
            }
        };
        return resultModel;
    }
    static async searchProductsWeb(query) {
        console.log('query::::', query);
    }
}

module.exports = {
    ProductModel,
    productColection,
    productColorColection,
    schemaMetaSeoProduct
};
