const { uid } = require('uid');
const { ObjectId } = require('mongodb');

const { BadRequest } = require('../../core/handleError');
const { ProductModel } = require('../../models/ProductModel');
const { open } = require('node:fs/promises');
const { unlink } = require('node:fs');
const cloudCloudinary = require('../../configurations/cloudinaryConfig');
const {
    genSlug,
    recursiveCategories,
    recursiveCategoryIdGradeChild
} = require('../../utils/common');
const CategoryModel = require('../../models/CategoryModel');
const { mongDb } = require('../../configurations/mongodbConfig');
class ProductService {
    async createProduct(data) {
        const _id = new ObjectId(uid(24));
        const slug = data.slug;
        const categoryId = new ObjectId(data.categoryId);
        const checkCategory = await CategoryModel.getCategory(categoryId);
        if (!checkCategory) {
            throw new BadRequest('category not exist !');
        }
        const productWithSlug = await ProductModel.getProduct(undefined, slug);
        if (productWithSlug) {
            throw new BadRequest('slug exist');
        }
        data._id = _id;
        data.slug = slug;
        data.categoryId = categoryId;
        const resultInsert = await ProductModel.createProduct(data);
        return resultInsert;
    }

    async createColorProduct(data, files, socketProduct) {
        const _idProductColor = new ObjectId(uid(24));
        const _productId = new ObjectId(data.productId);
        const product = await ProductModel.getProduct(_productId);
        const _sizeAmounts = data.sizeAmounts.map((sizeAmount) => {
            const { id, ...rest } = sizeAmount;
            return {
                _id: new ObjectId(id),
                ...rest
            };
        });
        if (!product) {
            files.forEach((file) => {
                unlink(file.path, () => {
                    console.log('===>Del:::');
                });
            });
            throw new BadRequest('product not exist !');
        }

        const mediaUrls = files.map((file, index) => ({
            _id: new ObjectId(uid(24)),
            url: null,
            status: 'pending',
            type: file.mimetype.split('/').shift(),
            order : data.orderFiles[index]
        }));
        delete data.orderFiles;
        data.mediaUrls = mediaUrls;
        data._id = _idProductColor;
        data.productId = _productId;
        data.sizeAmounts = _sizeAmounts;
        
        await ProductModel.createProductColor(data);
        for (const index in mediaUrls) {
            const path = files[index].path;
            const name = files[index].fieldname;
            const _idMediaUrl = mediaUrls[index]._id;
            open(path).then((data) => {
                const uploadStream =
                    cloudCloudinary.uploader.upload_chunked_stream(
                        {
                            resource_type: mediaUrls[index].type,
                            chunk_size: 5500000,
                            filename_override: name
                        },
                        (error, result) => {
                            data.close();
                            let status = 'success';
                            let url = null;
                            if (error) {
                                console.error(
                                    'Failed to upload stream:',
                                    error
                                );
                                status = 'fail';
                            } else {
                                console.log(
                                    'Stream uploaded successfully:',
                                    _idMediaUrl
                                );
                                url = result.secure_url;
                            }
                            unlink(path, () => {
                                console.log('===>Del:::', path);
                            });
                            const publicId = result.public_id;
                            ProductModel.setUrlImageProduct(
                                _idProductColor,
                                _idMediaUrl,
                                url,
                                status,
                                publicId
                            ).then((res) => {
                                socketProduct.emit('uploadOption', {
                                    _id: _idProductColor,
                                    productId: _productId,
                                    mediaUrl: {
                                        ...mediaUrls[index],

                                        url,
                                        status,
                                        publicKey: publicId
                                    }
                                });
                            });
                        }
                    );
                const stream = data.createReadStream();
                stream.pipe(uploadStream);
            });
        }
        return {
            name: product.name
        };
    }
    async getProductForId(id) {
        const result = await ProductModel.getProduct(new ObjectId(id));
        return result;
    }
    async getProductForAdmin(query) {
        for (const key of Object.keys(query)) {
            if(query[key] === "all"){
                delete query[key]
            }
        }
        const categoriesIdParams = query.categoriesId;
        if (categoriesIdParams) {
            const categories = await CategoryModel.getDocCategories();
            const categoryIdParams = categories
                .filter(({ _id }) =>
                    categoriesIdParams.includes(_id.toString())
                )
                .map(({ _id }) => _id);
            query.categoryIds = categoryIdParams.reduce((result, _id) => {
                const cateChildId = recursiveCategoryIdGradeChild(
                    categories,
                    _id,
                    []
                ).map(({ _id }) => _id);
                result.push(...cateChildId);
                return result;
            }, []);
        }
        const result = await ProductModel.getProductForAdmin(query);
        return result;
    }
    async deleteOptionProduct(optionId) {
        return await ProductModel.deleteOptionProduct(new ObjectId(optionId));
    }
    async deleteUploadOptionProduct({ optionId, uploadId }) {
        return await ProductModel.deleteUploadOptionProduct(
            new ObjectId(optionId),
            new ObjectId(uploadId)
        );
    }
    async updateSizeAmountOptionProduct({
        optionId,
        sizeAmounts : _sizeAmounts,
        
    }) {
        const _optionId = new ObjectId(optionId);
        _sizeAmounts.forEach((sizeAmount)=>{
            sizeAmount._id= new ObjectId(sizeAmount.id);
            delete sizeAmount.id
        })
        await ProductModel.updateSizeAmountOptionProduct(
            _optionId,
            _sizeAmounts
        );
    }
    async updateOptionProduct({ optionId, updateData }) {
        const _optionId = new ObjectId(optionId);
        await ProductModel.updateOptionProduct(_optionId, updateData);
    }
    async addUploadOptionProduct(optionId, {files, orders}, socketProduct) {
        const _optionId = new ObjectId(optionId);
        const productColor = await ProductModel.getProductColor(_optionId);
        if (!productColor) {
            throw new BadRequest('Option not exist');
        }
        const _mediaUrlIdPush = files.map((file, index) => ({
            _id: new ObjectId(24),
            url: null,
            status: 'pending',
            type: file.mimetype.split('/').shift(),
            publicKey: null,
            order: orders[index]
        }));
        await ProductModel.addUploadOptionProduct(_optionId, _mediaUrlIdPush);
        for (const index in _mediaUrlIdPush) {
            const path = files[index].path;
            const name = files[index].fieldname;
            const _idMediaUrl = _mediaUrlIdPush[index]._id;
            open(path).then((data) => {
                const uploadStream =
                    cloudCloudinary.uploader.upload_chunked_stream(
                        {
                            resource_type: _mediaUrlIdPush[index].type,
                            chunk_size: 5500000,
                            filename_override: name
                        },
                        (error, result) => {
                            data.close();
                            let status = 'success';
                            let url = null;
                            if (error) {
                                console.error(
                                    'Failed to upload stream:',
                                    error
                                );
                                status = 'fail';
                            } else {
                                console.log(
                                    'Stream uploaded successfully:',
                                    _idMediaUrl
                                );
                                url = result.secure_url;
                            }
                            unlink(path, () => {
                                console.log('===>Del:::', path);
                            });
                            const publicId = result.public_id;
                            ProductModel.setUrlImageProduct(
                                _optionId,
                                _idMediaUrl,
                                url,
                                status,
                                publicId
                            ).then((res) => {
                                console.log('ne::::', productColor);
                                socketProduct.emit('uploadOption', {
                                    _id: _optionId,
                                    productId: productColor.productId,
                                    mediaUrl: {
                                        ..._mediaUrlIdPush[index],
                                        url,
                                        status,
                                        publicKey: publicId
                                    }
                                });
                            });
                        }
                    );
                const stream = data.createReadStream();
                stream.pipe(uploadStream);
            });
        }
    }
    async deleteSizeAmountOption({ optionId, sizeAmountIds }) {
        const _optionId = new ObjectId(optionId);
        const _sizeAmountIds = sizeAmountIds.map((sizeAmountId)=>new ObjectId(sizeAmountId))
        await ProductModel.deleteSizeAmountOption(_optionId, _sizeAmountIds);
    }
    async addSizeAmountOption({ optionId,sizeAmounts : _sizeAmounts }) {
        const _optionId = new ObjectId(optionId);
        _sizeAmounts.forEach((data) => {
            data._id = new ObjectId(24)
        });
        await ProductModel.addSizeAmountOption(_optionId, _sizeAmounts);
    }
    async updateProduct(data) {
        const { id, ..._updateDatas } = data;
        const _id = new ObjectId(id);
        if(_updateDatas.categoryId !==undefined){
            if(_updateDatas.categoryId !== null){
                _updateDatas.categoryId = new ObjectId(_updateDatas.categoryId) 
            }
        }
        await ProductModel.updateProduct(_id, _updateDatas);
    }

    async updateMediaUrlOption(data) {
        const { optionId, mediaUrls:_mediaUrls } = data;
        _mediaUrls.forEach((item)=>{
            item._id = new ObjectId(item.id);
        })
        const _optionId = new ObjectId(optionId);
        await ProductModel.updateMediaUrlOption(_optionId,_mediaUrls);
    }

    async createMetaSeoProduct(dataBody) {
        const _produtId = new ObjectId(dataBody.productId);
        const productCheck = await ProductModel.getProduct(_produtId);
        const productMetaSeoCheck =
            await ProductModel.getProductMetaSeo(_produtId);
        if (!productCheck) {
            throw new BadRequest('Product not exist');
        }
        if (productMetaSeoCheck) {
            throw new BadRequest('Meta seo of product exist');
        }
        delete dataBody['productId'];
        const dataInsert = { ...dataBody, _id: _produtId };
        await ProductModel.createProductMetaSeo(dataInsert);
    }
    async getMetaSeoProduct(productId) {
        return await ProductModel.getProductMetaSeo(new ObjectId(productId));
    }
    async updateMetaSeoProduct(dataBody) {
        const { id, ...dataUpdate } = dataBody;
        const _id = new ObjectId(id);
        const productMetaSeoCheck = await ProductModel.getProductMetaSeo(_id);
        if (!productMetaSeoCheck) {
            throw new BadRequest("Product meta seo does't exist");
        }
        await ProductModel.updateProductMetaSeo(_id, dataUpdate);
    }
}

module.exports = new ProductService();
