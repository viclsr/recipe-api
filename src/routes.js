import { Router } from "express";

import { check, validationResult } from "express-validator";

let recipes = [];

const validateRecipePostRequest = [
  check("id").isInt(),
  check("name").isString(),
  check("prepTime").isString(),
  check("ingredients").isArray(),
  check("instructions").isString(),
  check("category").isString(),
  check("image").optional().isString(),
];

const routes = new Router();

routes.get("/recipes", (req, res) => {
  res.json(recipes);
});

routes.get("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const recipe = recipes.find((r) => r.id === id);

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).send("Receita não encontrada");
  }
});

routes.post("/recipes", validateRecipePostRequest, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const allowedFields = [
    "id",
    "name",
    "prepTime",
    "ingredients",
    "instructions",
    "category",
    "image",
  ];

  const sentFields = Object.keys(req.body);
  const invalidFields = sentFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      errors: [
        {
          msg: "Campos inválidos enviados no corpo da solicitação.",
          invalidFields,
        },
      ],
    });
  }

  const newRecipe = req.body;
  newRecipe.id = recipes.length + 1;
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

routes.put("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const recipeIndex = recipes.findIndex((r) => r.id === id);

  if (recipeIndex !== -1) {
    recipes[recipeIndex] = { ...recipes[recipeIndex], ...req.body };
    res.json(recipes[recipeIndex]);
  } else {
    res.status(404).send("Receita não encontrada");
  }
});

routes.delete("/recipes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  recipes = recipes.filter((r) => r.id !== id);
  res.send("Receita excluída com sucesso");
});

export default routes;
