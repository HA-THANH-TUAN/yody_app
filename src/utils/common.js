const slugify = require('slugify');
const { BadRequest, Unprocessable } = require('../core/handleError');

function genSlug(data) {
    return slugify(data, { lower: true });
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function hanldeValidateSchema(data, schemaJoi, statusError = 422, cb) {
    const { value, error } = schemaJoi.validate(data);
    console.log("error:::",error)
    if (error) {
        cb?.();
        switch (statusError) {
            case 422:
                throw new Unprocessable();
                break;
            case 404:
                throw new BadRequest();
                break;
            default:
                throw new Unprocessable();
                break;
        }
    }
    return value;
}

const recursiveCategories = (categoriesStart = [], categories = []) => {
    for (const category of categoriesStart) {
        const categoriesChild = categories.filter(
            (cate) => cate.parentId?.toString() === category._id.toString()
        );
        category.categories =
            categoriesChild.length > 0
                ? recursiveCategories(categoriesChild, categories)
                : [];
    }
    return categoriesStart;
};
const recursiveCategoriesParent = (data, _parentId, result = []) => {
    for (const item of data) {
        if (item._id.toString() === _parentId?.toString()) {
            result.unshift({
                _id: item._id,
                name: item.name,
                slug: item.slug,
                grade: item.grade
            });
            recursiveCategoriesParent(data, item.parentId, result);
        }
    }
    return result;
};
const recursiveCategoryIdGradeChild = (
    categoriesAll = [],
    _id,
    result = []
) => {
    for (const category of categoriesAll) {
        if (category.parentId?.toString() === _id.toString()) {
            result.push({
                _id: category._id,
                grade: category.grade
            });
            recursiveCategoryIdGradeChild(categoriesAll, category._id, result);
        }
    }
    return result;
};

const generatePipeLineSortProduct = (valueSrt)=>{
    let opearatorSort =null;
    switch (valueSrt) {
        case "newest":
            opearatorSort = {
                $sort: {
                    createdAt : -1
                }
            }
            break;
        case "bestSeller":
            opearatorSort = {
                $sort: {
                    createdAt : -1
                }
            }
            break;
        case "nAsc":
            opearatorSort = {
                $sort: {
                    createdAt : -1
                }
            }
            break;
        case "nDesc":
            opearatorSort = {
                $sort: {
                    createdAt : -1
                }
            }
            break;
        case "prAsc":
            opearatorSort = {
                $sort: {
                    createdAt : -1
                }
            }
            break;
        case "prDesc":
            opearatorSort = {
                $sort: {
                    createdAt : -1
                }
            }
            break;
    
        default:
            break;
    }
    return opearatorSort

}


module.exports = {
    genSlug,
    escapeRegex,
    hanldeValidateSchema,
    recursiveCategories,
    recursiveCategoriesParent,
    recursiveCategoryIdGradeChild,
    generatePipeLineSortProduct
};
