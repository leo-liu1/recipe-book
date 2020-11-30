/*
 Nutrients class to hold nutrition values of recipes

 nutritionScore: Integer
 nutritionInfo: JSON object
 unhealthyIngredients: String[]
 healthyIngredients: String[]
 */

export default class Nutrition {
    /**
     * @constructor
     * @param {Object} nutrition
     * @param {Number} nutrition.nutritionScore
     * @param {Object} nutrition.nutritionInfo
     * @param {string[]} nutrition.unhealthyIngredients
     * @param {string[]} nutrition.healthyIngredients
     */
    constructor(nutritionScore, nutritionInfo, unhealthyIngredients, healthyIngredients) {
        this.nutritionScore = nutritionScore;
        this.nutritionInfo = nutritionInfo;
        this.unhealthyIngredients = unhealthyIngredients ? unhealthyIngredients : null;
        this.healthyIngredients = healthyIngredients ? healthyIngredients : null;
    }
}
