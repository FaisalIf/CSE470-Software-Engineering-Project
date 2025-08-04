import { RecipeModel } from '@/models/Recipe';
import type { ShoppingList, ShoppingListItem } from '@/types';

export class ShoppingListService {
  /**
   * Generate a consolidated shopping list from multiple recipes
   */
  static async generateShoppingList(recipeIds: string[], servingsMap?: Record<string, number>): Promise<ShoppingList> {
    const recipes = await Promise.all(
      recipeIds.map(id => RecipeModel.findById(id))
    );

    const validRecipes = recipes.filter(recipe => recipe !== null);
    const ingredientMap = new Map<string, ShoppingListItem>();

    for (const recipe of validRecipes) {
      if (!recipe) continue;

      // Get servings scaling factor
      const targetServings = servingsMap?.[recipe.id] || recipe.servings;
      const scaleFactor = targetServings / recipe.servings;

      for (const ingredient of recipe.ingredients) {
        const key = `${ingredient.name.toLowerCase()}-${ingredient.unit.toLowerCase()}`;
        const scaledAmount = ingredient.amount * scaleFactor;

        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.amount += scaledAmount;
          existing.recipes.push(recipe.title);
        } else {
          ingredientMap.set(key, {
            ingredient: ingredient.name,
            amount: scaledAmount,
            unit: ingredient.unit,
            recipes: [recipe.title]
          });
        }
      }
    }

    const items = Array.from(ingredientMap.values());

    return {
      items,
      recipeCount: validRecipes.length,
      totalItems: items.length
    };
  }

  /**
   * Calculate total nutrition for a shopping list
   */
  static async calculateNutritionTotals(recipeIds: string[], servingsMap?: Record<string, number>) {
    const recipes = await Promise.all(
      recipeIds.map(id => RecipeModel.findById(id))
    );

    const validRecipes = recipes.filter(recipe => recipe !== null && recipe.nutritionInfo);
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    let totalSodium = 0;

    for (const recipe of validRecipes) {
      if (!recipe?.nutritionInfo) continue;

      const targetServings = servingsMap?.[recipe.id] || recipe.servings;
      const scaleFactor = targetServings / recipe.servings;

      totalCalories += (recipe.nutritionInfo.calories || 0) * scaleFactor;
      totalProtein += (recipe.nutritionInfo.protein || 0) * scaleFactor;
      totalFat += (recipe.nutritionInfo.fat || 0) * scaleFactor;
      totalCarbs += (recipe.nutritionInfo.carbs || 0) * scaleFactor;
      totalFiber += (recipe.nutritionInfo.fiber || 0) * scaleFactor;
      totalSugar += (recipe.nutritionInfo.sugar || 0) * scaleFactor;
      totalSodium += (recipe.nutritionInfo.sodium || 0) * scaleFactor;
    }

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      fat: Math.round(totalFat * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      fiber: Math.round(totalFiber * 10) / 10,
      sugar: Math.round(totalSugar * 10) / 10,
      sodium: Math.round(totalSodium * 10) / 10
    };
  }

  /**
   * Export shopping list to different formats
   */
  static formatShoppingList(shoppingList: ShoppingList, format: 'text' | 'markdown' | 'json') {
    switch (format) {
      case 'text':
        return this.formatAsText(shoppingList);
      case 'markdown':
        return this.formatAsMarkdown(shoppingList);
      case 'json':
        return JSON.stringify(shoppingList, null, 2);
      default:
        return this.formatAsText(shoppingList);
    }
  }

  private static formatAsText(shoppingList: ShoppingList): string {
    let output = `Shopping List (${shoppingList.recipeCount} recipes, ${shoppingList.totalItems} items)\n\n`;
    
    for (const item of shoppingList.items) {
      output += `• ${item.amount} ${item.unit} ${item.ingredient}\n`;
      if (item.recipes.length > 1) {
        output += `  (for: ${item.recipes.join(', ')})\n`;
      }
    }

    return output;
  }

  private static formatAsMarkdown(shoppingList: ShoppingList): string {
    let output = `# Shopping List\n\n`;
    output += `**${shoppingList.recipeCount} recipes, ${shoppingList.totalItems} items**\n\n`;
    
    for (const item of shoppingList.items) {
      output += `- [ ] ${item.amount} ${item.unit} ${item.ingredient}\n`;
      if (item.recipes.length > 1) {
        output += `  *For: ${item.recipes.join(', ')}*\n`;
      }
    }

    return output;
  }
}
