import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format time duration
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

// Calculate total time
export function calculateTotalTime(prepTime: number, cookTime: number): string {
  return formatTime(prepTime + cookTime)
}

// Format serving size
export function formatServings(servings: number): string {
  return `${servings} serving${servings !== 1 ? 's' : ''}`
}

// Scale ingredient amounts
export function scaleIngredientAmount(amount: number, originalServings: number, newServings: number): number {
  return (amount * newServings) / originalServings
}

// Generate shopping list from multiple recipes
export function generateShoppingList(recipes: Array<{
  ingredients: Array<{ name: string; amount: number; unit: string }>
  servings: number
}>, targetServings: number[]): Array<{ name: string; amount: number; unit: string }> {
  const consolidatedIngredients = new Map<string, { amount: number; unit: string }>()
  
  recipes.forEach((recipe, index) => {
    const scaleFactor = targetServings[index] / recipe.servings
    
    recipe.ingredients.forEach(ingredient => {
      const key = `${ingredient.name}_${ingredient.unit}`
      const scaledAmount = ingredient.amount * scaleFactor
      
      if (consolidatedIngredients.has(key)) {
        const existing = consolidatedIngredients.get(key)!
        existing.amount += scaledAmount
      } else {
        consolidatedIngredients.set(key, {
          amount: scaledAmount,
          unit: ingredient.unit
        })
      }
    })
  })
  
  return Array.from(consolidatedIngredients.entries()).map(([key, value]) => ({
    name: key.split('_')[0],
    amount: Math.round(value.amount * 100) / 100, // Round to 2 decimal places
    unit: value.unit
  }))
}
