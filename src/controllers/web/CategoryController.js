const { OK } = require('../../core/handleSuccess');
const { getCategories } = require('../../services/web/CategoryService');

class CategoryController {
    async getCategories(req, res) {
        const result = await getCategories();
        new OK(result).send(res);
    }
}

module.exports = new CategoryController();
