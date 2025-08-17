import { NextRequest, NextResponse } from "next/server";
import { ShoppingListService } from "@/services/ShoppingListService";

export class ShoppingListController {
  // POST /api/shopping-list
  static async generate(request: NextRequest) {
    try {
      const body = await request.json().catch(() => ({}));
      const recipeIds: string[] = Array.isArray(body?.recipeIds)
        ? body.recipeIds
        : [];
      const servingsMap: Record<string, number> | undefined =
        body?.servingsMap || undefined;

      if (!recipeIds || recipeIds.length === 0) {
        return NextResponse.json(
          { success: true, data: { items: [], recipeCount: 0, totalItems: 0 } },
          { status: 200 }
        );
      }

      const [shoppingList, totals] = await Promise.all([
        ShoppingListService.generateShoppingList(recipeIds, servingsMap),
        ShoppingListService.calculateNutritionTotals(
          recipeIds,
          servingsMap
        ).catch(() => null),
      ]);

      return NextResponse.json({ success: true, data: shoppingList, totals });
    } catch (error) {
      console.error("Error generating shopping list:", error);
      return NextResponse.json(
        { success: false, error: "Failed to generate shopping list" },
        { status: 500 }
      );
    }
  }
}
