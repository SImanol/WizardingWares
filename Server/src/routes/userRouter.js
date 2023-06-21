const {Router} = require("express");
const userRouter = Router();
const { createUserRegister, updateUser, logicalUserDeletion } = require("../controllers/userControllers");

// Ruta Para Crear Un Usuario
userRouter.post("/user", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await createUserRegister(name, email);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(404).json({
      "Error": error.message
    });
  }
});

// Ruta Para Editar Un Usuario
userRouter.put("/user/:userId", async (req, res) => {
  const {name, email} = req.body;
  const { userId } = req.params;
  try {
    const result = await updateUser(name, email, userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(200).json({
      "Error": error.message
    });
  }
});

// Ruta Para Elimar Un Usuario ( Borrado Logico )
userRouter.put("/user_delete/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await logicalUserDeletion(userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({
      "Error": res.message
    });
  }
});

module.exports = userRouter;