const { ObjectId } = require('mongodb');
const { ProductModel } = require('../../models/ProductModel');
const CategoryModel = require('../../models/CategoryModel');

class ProductService {
    async getProductForCategory(query) {
        const categorySlug = query.cs;
        if(categorySlug){
            const categoryInfor =  await CategoryModel.getStackCategory(categorySlug);
            query.listIdCategory = categoryInfor.listIdCategory;
        }
        const result = await ProductModel.getProductForCategoryWeb(query);
        return result;
    }
    // async getProductColors(){

    // }
}

module.exports = new ProductService();
