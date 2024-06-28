// const { clientRedis } = require("../../configurations/redisConfig");
const CategoryModel = require('../../models/CategoryModel');

class CategoryServive {
    async getCategories() {
        const result = await CategoryModel.getCategoriesWeb();
        const gradeMin = result.reduce((min, pres) => {
            if (min > pres.grade) {
                min = pres.grade;
            }
            return min;
        }, result[0].grade);
        const categoriesHighGrade = result.filter(
            (cate) => cate.grade === gradeMin
        );
        const recursiveCategory = (data) => {
            return data.map((cate) => {
                const categories = result.filter(
                    (cat) => cate._id.toString() === cat.parentId?.toString()
                );
                if (categories.length > 0) {
                    cate.categories = recursiveCategory(categories);
                }
                return cate;
            });
        };
        const categories = recursiveCategory(categoriesHighGrade);
        // clientRedis.set("web/categories", JSON.stringify(categories)).then((data)=>{
        //     console.log("data:::",data)
        // })
        return categories;
    }
}

module.exports = new CategoryServive();
