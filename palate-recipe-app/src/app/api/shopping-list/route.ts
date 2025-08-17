import { ShoppingListController } from "@/controllers/ShoppingListController";

export async function POST(request: Request) {
  return ShoppingListController.generate(request as any);
}
