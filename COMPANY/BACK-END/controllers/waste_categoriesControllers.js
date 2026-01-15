const knex = require("../db/knex");
exports.getWasteCategories = async (req, res) => {
  try {
    const categories = await knex("Categories").select("*");
    for (let category of categories) {
      const subcategories = await knex("Sub_Categories")
        .where({ category_id: category.id })
        .select("*");
      category.subcategories = subcategories;
    }
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    // console.error("Error fetching waste categories:", error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};

exports.addWasteCategory = async (req, res) => {
  const { name, price, subcategory } = req.body;
  // console.log("addWasteCategory:: ", req.body);
  if (!name || !price) {
    return res.status(400).json({ error: "All Fields are required" });
  }
  if (name) {
    const existingCategory = await knex("Categories").where({ name }).first();
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }
  }
  try {
    const [categoryId] = await knex("Categories")
      .insert({ name, prize_per_kg: price })
      .returning("*");

    if (subcategory && Array.isArray(subcategory) && subcategory.length > 0) {
      const validSubcategories = subcategory.filter((sub) => sub.price != null);
      if (validSubcategories.length > 0) {
        const subCategoriesData = validSubcategories.map((sub) => ({
          name: sub.name,
          prize_per_kg: sub.price,
          category_id: categoryId.id,
        }));
        await knex("Sub_Categories").insert(subCategoriesData);
      }
    }
    return res
      .status(201)
      .json({ success: true, message: "Category added successfully" });
  } catch (error) {
    // console.error("Error adding waste category:", error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};
