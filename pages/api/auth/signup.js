import connectMongo from "@/db/dbConnect";

import UserDB from "@/db/models/userModel";
import { hashPassword } from "@/helper/encrypt/hashPassword";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { username, email, password, image } = req.body;
    const client = await connectMongo();

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 6
    ) {
      res
        .status(422)
        .json({ msg: "Email is not valid or Password is too short" });
      return;
    }

    // const hashPass = await hashPassword(password);
    // const existingUser = await UserDB.findOne({ email: email });

    const [hashPass, existingUser] = await Promise.all([
      hashPassword(password),
      UserDB.findOne({ email: email }),
    ]);

    if (existingUser) {
      res.status(422).json({ msg: "User already exist. Please log in." });

      return;
    }

    const data = {
      username,
      email,
      password: hashPass,
    };

    if (image) {
      data.image = image;
    }

    const result = await UserDB.create(data);

    res.status(201).json({ msg: "Sign Up Successful", result });
  }
}
