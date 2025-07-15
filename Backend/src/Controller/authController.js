import UserModel from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔐 Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Utilisateur introuvable" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Mot de passe incorrect" });
    }

    // ✅ Create JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send({ message: "Erreur serveur lors de la connexion" });
  }
};

// 📝 Register Controller
export const register = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Vérification si l'email existe déjà
    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      return res.status(400).send({ message: "Utilisateur déjà existant" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send({ message: "Erreur serveur lors de l'inscription" });
  }
};
