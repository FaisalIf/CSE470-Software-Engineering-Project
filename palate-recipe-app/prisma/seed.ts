import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clean up existing data first
    await prisma.recentView.deleteMany();
    await prisma.collectionItem.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.nutritionInfo.deleteMany();
    await prisma.ingredient.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.user.deleteMany();

    console.log("🧹 Cleaned existing data...");

    // Create sample users
    const users = await Promise.all([
      prisma.user.create({
        data: {
          id: "user-1",
          email: "chef.maria@example.com",
          username: "chef_maria",
          name: "Maria Rodriguez",
          password: "password123",
          bio: "Professional chef with 15 years of experience in Italian and Mediterranean cuisine.",
          image:
            "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=150&h=150&fit=crop&crop=face",
        },
      }),
      prisma.user.create({
        data: {
          id: "user-2",
          email: "foodie.john@example.com",
          username: "foodie_john",
          name: "John Chen",
          password: "password123",
          bio: "Home cook and food blogger passionate about Asian fusion cuisine.",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
      }),
      prisma.user.create({
        data: {
          id: "user-3",
          email: "baker.sarah@example.com",
          username: "baker_sarah",
          name: "Sarah Williams",
          password: "password123",
          bio: "Pastry chef specializing in artisanal breads and desserts.",
          image:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        },
      }),
      prisma.user.create({
        data: {
          id: "user-4",
          email: "healthy.alex@example.com",
          username: "healthy_alex",
          name: "Alex Thompson",
          password: "password123",
          bio: "Nutritionist and fitness enthusiast sharing healthy, delicious recipes.",
          image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
      }),
    ]);

    console.log("✅ Created users:", users.length);

    // Create sample recipes with ingredients and nutrition info
    const recipes = await Promise.all([
      // Recipe 1: Spaghetti Carbonara by Maria
      prisma.recipe.create({
        data: {
          id: "recipe-1",
          title: "Classic Spaghetti Carbonara",
          description:
            "A traditional Italian pasta dish made with eggs, cheese, pancetta, and pepper. Simple yet incredibly flavorful.",
          instructions: [
            "Bring a large pot of salted water to boil and cook spaghetti according to package instructions.",
            "While pasta cooks, heat a large skillet over medium heat and cook pancetta until crispy.",
            "In a bowl, whisk together eggs, Parmesan cheese, and black pepper.",
            "Reserve 1 cup of pasta water, then drain the pasta.",
            "Add hot pasta to the skillet with pancetta and toss.",
            "Remove from heat and quickly stir in the egg mixture, adding pasta water as needed to create a creamy sauce.",
            "Serve immediately with extra Parmesan and black pepper.",
          ],
          prepTime: 15,
          cookTime: 20,
          servings: 4,
          difficulty: "Medium",
          cuisine: "Italian",
          category: "Dinner",
          imageUrl:
            "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_640.jpg",
          authorId: "user-1",
          viewCount: 342,
          ingredients: {
            create: [
              { name: "Spaghetti", amount: 1, unit: "lb" },
              { name: "Pancetta", amount: 6, unit: "oz" },
              { name: "Large eggs", amount: 4, unit: "whole" },
              { name: "Parmesan cheese", amount: 1, unit: "cup" },
              { name: "Black pepper", amount: 1, unit: "tsp" },
              { name: "Salt", amount: 1, unit: "tsp" },
            ],
          },
          nutritionInfo: {
            create: {
              calories: 520,
              protein: 24,
              fat: 18,
              carbs: 65,
              fiber: 3,
              sugar: 2,
              sodium: 680,
            },
          },
        },
      }),

      // Recipe 2: Kung Pao Chicken by John
      prisma.recipe.create({
        data: {
          id: "recipe-2",
          title: "Kung Pao Chicken",
          description:
            "A classic Sichuan dish with tender chicken, peanuts, and vegetables in a spicy, savory sauce.",
          instructions: [
            "Cut chicken into bite-sized pieces and marinate with soy sauce and cornstarch for 15 minutes.",
            "Heat oil in a wok or large skillet over high heat.",
            "Stir-fry chicken until golden brown, then remove and set aside.",
            "In the same pan, stir-fry dried chilies and Sichuan peppercorns until fragrant.",
            "Add garlic, ginger, and scallions, stir-fry for 30 seconds.",
            "Return chicken to pan, add bell peppers and peanuts.",
            "Pour in the sauce mixture and stir-fry until everything is well coated.",
            "Serve hot over steamed rice.",
          ],
          prepTime: 25,
          cookTime: 15,
          servings: 4,
          difficulty: "Medium",
          cuisine: "Asian",
          category: "Dinner",
          imageUrl:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
          authorId: "user-2",
          viewCount: 198,
          ingredients: {
            create: [
              { name: "Chicken breast", amount: 1, unit: "lb" },
              { name: "Roasted peanuts", amount: 0.5, unit: "cup" },
              { name: "Bell peppers", amount: 2, unit: "whole" },
              { name: "Dried red chilies", amount: 8, unit: "whole" },
              { name: "Garlic cloves", amount: 4, unit: "whole" },
              { name: "Fresh ginger", amount: 1, unit: "tbsp" },
              { name: "Soy sauce", amount: 3, unit: "tbsp" },
              { name: "Rice vinegar", amount: 2, unit: "tbsp" },
              { name: "Cornstarch", amount: 1, unit: "tbsp" },
            ],
          },
          nutritionInfo: {
            create: {
              calories: 380,
              protein: 28,
              fat: 22,
              carbs: 18,
              fiber: 4,
              sugar: 8,
              sodium: 720,
            },
          },
        },
      }),

      // Recipe 3: Chocolate Chip Cookies by Sarah
      prisma.recipe.create({
        data: {
          id: "recipe-3",
          title: "Perfect Chocolate Chip Cookies",
          description:
            "Soft, chewy chocolate chip cookies with crispy edges. The ultimate comfort food dessert.",
          instructions: [
            "Preheat oven to 375°F (190°C).",
            "Cream together butter and both sugars until light and fluffy.",
            "Beat in eggs one at a time, then add vanilla extract.",
            "In a separate bowl, whisk together flour, baking soda, and salt.",
            "Gradually mix dry ingredients into wet ingredients until just combined.",
            "Fold in chocolate chips.",
            "Drop rounded tablespoons of dough onto ungreased baking sheets.",
            "Bake for 9-11 minutes until edges are golden brown.",
            "Cool on baking sheet for 5 minutes before transferring to wire rack.",
          ],
          prepTime: 15,
          cookTime: 11,
          servings: 24,
          difficulty: "Easy",
          cuisine: "American",
          category: "Dessert",
          imageUrl:
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
          authorId: "user-3",
          viewCount: 567,
          ingredients: {
            create: [
              { name: "All-purpose flour", amount: 2.25, unit: "cup" },
              { name: "Butter", amount: 1, unit: "cup" },
              { name: "Brown sugar", amount: 0.75, unit: "cup" },
              { name: "White sugar", amount: 0.75, unit: "cup" },
              { name: "Large eggs", amount: 2, unit: "whole" },
              { name: "Vanilla extract", amount: 2, unit: "tsp" },
              { name: "Baking soda", amount: 1, unit: "tsp" },
              { name: "Salt", amount: 1, unit: "tsp" },
              { name: "Chocolate chips", amount: 2, unit: "cup" },
            ],
          },
          nutritionInfo: {
            create: {
              calories: 180,
              protein: 2,
              fat: 8,
              carbs: 26,
              fiber: 1,
              sugar: 18,
              sodium: 120,
            },
          },
        },
      }),

      // Recipe 4: Quinoa Buddha Bowl by Alex
      prisma.recipe.create({
        data: {
          id: "recipe-4",
          title: "Colorful Quinoa Buddha Bowl",
          description:
            "A nutritious and colorful bowl packed with quinoa, roasted vegetables, and a creamy tahini dressing.",
          instructions: [
            "Preheat oven to 425°F (220°C).",
            "Cook quinoa according to package instructions and set aside.",
            "Toss sweet potato and Brussels sprouts with olive oil, salt, and pepper.",
            "Roast vegetables for 20-25 minutes until tender and lightly caramelized.",
            "Meanwhile, massage kale with a little olive oil and lemon juice.",
            "Prepare tahini dressing by whisking tahini, lemon juice, maple syrup, and water.",
            "Assemble bowls with quinoa, roasted vegetables, massaged kale, and avocado.",
            "Drizzle with tahini dressing and sprinkle with pumpkin seeds.",
            "Serve immediately.",
          ],
          prepTime: 20,
          cookTime: 25,
          servings: 4,
          difficulty: "Easy",
          cuisine: "Mediterranean",
          category: "Lunch",
          imageUrl:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
          authorId: "user-4",
          viewCount: 234,
          ingredients: {
            create: [
              { name: "Quinoa", amount: 1, unit: "cup" },
              { name: "Sweet potato", amount: 2, unit: "whole" },
              { name: "Brussels sprouts", amount: 1, unit: "lb" },
              { name: "Kale", amount: 4, unit: "cup" },
              { name: "Avocado", amount: 2, unit: "whole" },
              { name: "Tahini", amount: 0.25, unit: "cup" },
              { name: "Lemon juice", amount: 3, unit: "tbsp" },
              { name: "Maple syrup", amount: 2, unit: "tbsp" },
              { name: "Pumpkin seeds", amount: 0.25, unit: "cup" },
            ],
          },
          nutritionInfo: {
            create: {
              calories: 420,
              protein: 14,
              fat: 18,
              carbs: 58,
              fiber: 12,
              sugar: 14,
              sodium: 180,
            },
          },
        },
      }),

      // Recipe 5: Beef Tacos by Maria
      prisma.recipe.create({
        data: {
          id: "recipe-5",
          title: "Authentic Street Tacos",
          description:
            "Simple, authentic Mexican street tacos with seasoned ground beef and fresh toppings.",
          instructions: [
            "Heat oil in a large skillet over medium-high heat.",
            "Add ground beef and cook, breaking it up, until browned.",
            "Add onion, garlic, cumin, chili powder, and paprika.",
            "Cook for 2-3 minutes until fragrant.",
            "Add tomato sauce, salt, and pepper. Simmer for 10 minutes.",
            "Warm tortillas in a dry skillet or over an open flame.",
            "Fill tortillas with beef mixture.",
            "Top with diced onion, cilantro, and lime juice.",
            "Serve with lime wedges and hot sauce.",
          ],
          prepTime: 10,
          cookTime: 20,
          servings: 8,
          difficulty: "Easy",
          cuisine: "Mexican",
          category: "Dinner",
          imageUrl:
            "https://cdn.pixabay.com/photo/2017/05/01/05/18/pastry-2274750_640.jpg",
          authorId: "user-1",
          viewCount: 421,
          ingredients: {
            create: [
              { name: "Ground beef", amount: 1, unit: "lb" },
              { name: "Corn tortillas", amount: 16, unit: "whole" },
              { name: "White onion", amount: 1, unit: "whole" },
              { name: "Garlic cloves", amount: 3, unit: "whole" },
              { name: "Ground cumin", amount: 1, unit: "tsp" },
              { name: "Chili powder", amount: 1, unit: "tsp" },
              { name: "Paprika", amount: 1, unit: "tsp" },
              { name: "Tomato sauce", amount: 0.5, unit: "cup" },
              { name: "Fresh cilantro", amount: 0.5, unit: "cup" },
              { name: "Lime", amount: 2, unit: "whole" },
            ],
          },
          nutritionInfo: {
            create: {
              calories: 320,
              protein: 22,
              fat: 14,
              carbs: 26,
              fiber: 4,
              sugar: 3,
              sodium: 420,
            },
          },
        },
      }),

      // Recipe 6: Green Smoothie by Alex
      prisma.recipe.create({
        data: {
          id: "recipe-6",
          title: "Energizing Green Smoothie",
          description:
            "A nutrient-packed green smoothie perfect for breakfast or post-workout fuel.",
          instructions: [
            "Add spinach and kale to blender first.",
            "Add frozen banana, mango, and pineapple.",
            "Pour in coconut water and almond milk.",
            "Add chia seeds, protein powder, and lemon juice.",
            "Blend on high speed for 60-90 seconds until smooth.",
            "Add more liquid if needed to reach desired consistency.",
            "Taste and adjust sweetness with dates or honey if needed.",
            "Pour into glasses and serve immediately.",
            "Garnish with coconut flakes if desired.",
          ],
          prepTime: 5,
          cookTime: 0,
          servings: 2,
          difficulty: "Easy",
          cuisine: "American",
          category: "Breakfast",
          imageUrl:
            "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop",
          authorId: "user-4",
          viewCount: 156,
          ingredients: {
            create: [
              { name: "Fresh spinach", amount: 2, unit: "cup" },
              { name: "Kale leaves", amount: 1, unit: "cup" },
              { name: "Frozen banana", amount: 1, unit: "whole" },
              { name: "Frozen mango", amount: 0.5, unit: "cup" },
              { name: "Frozen pineapple", amount: 0.5, unit: "cup" },
              { name: "Coconut water", amount: 1, unit: "cup" },
              { name: "Almond milk", amount: 0.5, unit: "cup" },
              { name: "Chia seeds", amount: 1, unit: "tbsp" },
              { name: "Protein powder", amount: 1, unit: "scoop" },
              { name: "Lemon juice", amount: 1, unit: "tbsp" },
            ],
          },
          nutritionInfo: {
            create: {
              calories: 240,
              protein: 18,
              fat: 4,
              carbs: 42,
              fiber: 8,
              sugar: 28,
              sodium: 85,
            },
          },
        },
      }),
    ]);

    console.log("✅ Created recipes:", recipes.length);

    // Create ratings for recipes
    const ratings = await Promise.all([
      // Ratings for Spaghetti Carbonara
      prisma.rating.create({
        data: {
          rating: 5,
          review:
            "Absolutely perfect! Just like my grandmother used to make in Rome.",
          userId: "user-2",
          recipeId: "recipe-1",
        },
      }),
      prisma.rating.create({
        data: {
          rating: 4,
          review:
            "Great recipe, very authentic. I added a bit more black pepper.",
          userId: "user-3",
          recipeId: "recipe-1",
        },
      }),
      prisma.rating.create({
        data: {
          rating: 5,
          review:
            "This is now my go-to carbonara recipe. Creamy and delicious!",
          userId: "user-4",
          recipeId: "recipe-1",
        },
      }),

      // Ratings for Kung Pao Chicken
      prisma.rating.create({
        data: {
          rating: 4,
          review: "Spicy and flavorful! I used less chilies for my family.",
          userId: "user-1",
          recipeId: "recipe-2",
        },
      }),
      prisma.rating.create({
        data: {
          rating: 5,
          review: "Better than takeout! The sauce is perfectly balanced.",
          userId: "user-3",
          recipeId: "recipe-2",
        },
      }),

      // Ratings for Chocolate Chip Cookies
      prisma.rating.create({
        data: {
          rating: 5,
          review: "These cookies are incredible! Soft center, crispy edges.",
          userId: "user-1",
          recipeId: "recipe-3",
        },
      }),
      prisma.rating.create({
        data: {
          rating: 5,
          review: "My kids love these! Perfect for bake sales.",
          userId: "user-2",
          recipeId: "recipe-3",
        },
      }),
      prisma.rating.create({
        data: {
          rating: 4,
          review:
            "Great recipe. I added some sea salt on top for extra flavor.",
          userId: "user-4",
          recipeId: "recipe-3",
        },
      }),

      // Ratings for Buddha Bowl
      prisma.rating.create({
        data: {
          rating: 5,
          review: "So healthy and satisfying! The tahini dressing is amazing.",
          userId: "user-1",
          recipeId: "recipe-4",
        },
      }),
      prisma.rating.create({
        data: {
          rating: 4,
          review: "Love this for meal prep. I make a batch every Sunday.",
          userId: "user-2",
          recipeId: "recipe-4",
        },
      }),
    ]);

    console.log("✅ Created ratings:", ratings.length);

    // Create favorites
    const favorites = await Promise.all([
      prisma.favorite.create({
        data: { userId: "user-1", recipeId: "recipe-3" },
      }),
      prisma.favorite.create({
        data: { userId: "user-1", recipeId: "recipe-4" },
      }),
      prisma.favorite.create({
        data: { userId: "user-2", recipeId: "recipe-1" },
      }),
      prisma.favorite.create({
        data: { userId: "user-2", recipeId: "recipe-3" },
      }),
      prisma.favorite.create({
        data: { userId: "user-3", recipeId: "recipe-1" },
      }),
      prisma.favorite.create({
        data: { userId: "user-3", recipeId: "recipe-2" },
      }),
      prisma.favorite.create({
        data: { userId: "user-4", recipeId: "recipe-1" },
      }),
      prisma.favorite.create({
        data: { userId: "user-4", recipeId: "recipe-5" },
      }),
    ]);

    console.log("✅ Created favorites:", favorites.length);

    // Create collections
    const collections = await Promise.all([
      prisma.collection.create({
        data: {
          name: "Weekend Dinners",
          description: "Special recipes for weekend family dinners",
          isPublic: true,
          userId: "user-1",
          items: {
            create: [{ recipeId: "recipe-1" }, { recipeId: "recipe-5" }],
          },
        },
      }),
      prisma.collection.create({
        data: {
          name: "Healthy Favorites",
          description: "My go-to healthy recipes for daily meals",
          isPublic: true,
          userId: "user-4",
          items: {
            create: [{ recipeId: "recipe-4" }, { recipeId: "recipe-6" }],
          },
        },
      }),
      prisma.collection.create({
        data: {
          name: "Quick & Easy",
          description: "Recipes that can be made in under 30 minutes",
          isPublic: false,
          userId: "user-2",
          items: {
            create: [{ recipeId: "recipe-5" }, { recipeId: "recipe-6" }],
          },
        },
      }),
    ]);

    console.log("✅ Created collections:", collections.length);

    // Create recent views
    const recentViews = await Promise.all([
      prisma.recentView.create({
        data: { userId: "user-1", recipeId: "recipe-2" },
      }),
      prisma.recentView.create({
        data: { userId: "user-1", recipeId: "recipe-3" },
      }),
      prisma.recentView.create({
        data: { userId: "user-2", recipeId: "recipe-1" },
      }),
      prisma.recentView.create({
        data: { userId: "user-2", recipeId: "recipe-4" },
      }),
      prisma.recentView.create({
        data: { userId: "user-3", recipeId: "recipe-5" },
      }),
      prisma.recentView.create({
        data: { userId: "user-4", recipeId: "recipe-1" },
      }),
    ]);

    console.log("✅ Created recent views:", recentViews.length);

    console.log("🎉 Database seeding completed successfully!");
    console.log(`
📊 Summary:
- Users: ${users.length}
- Recipes: ${recipes.length}
- Ratings: ${ratings.length}
- Favorites: ${favorites.length}
- Collections: ${collections.length}
- Recent Views: ${recentViews.length}
  `);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
