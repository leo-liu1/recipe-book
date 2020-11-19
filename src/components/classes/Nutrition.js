/*
 Nutrients class to hold nutrition values of recipes

 nutritionScore: Integer
 nutritionInfo: JSON object
 unhealthyIngredients: String[]
 healthyIngredients: String[]
 */

export default class Nutrition {
    constructor(nutritionScore, nutritionInfo, unhealthyIngredients = null, healthyIngredients = null) {
        this.nutritionScore = nutritionScore;
        this.nutritionInfo = nutritionInfo;
        this.unhealthyIngredients = unhealthyIngredients;
        this.healthyIngredients = healthyIngredients;
    }
}
