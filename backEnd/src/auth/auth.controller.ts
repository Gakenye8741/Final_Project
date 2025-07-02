import { UserLoginValidator, UserValidator } from "../validators/user.validator"
import { Response,Request } from "express";
import { createUserServices, getUserByEmailServices } from "./auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmails } from "../middleware/googleMailer";

interface ExistigUser {
    userId: number,
    fullName: string,
    email: string,
    userType: string,
    createdAt: Date,
    updatedAt:Date
}

export const createUser = async (req: Request, res: Response)=>{
    try {
        // Validate user input
        const parseResult = UserValidator.safeParse(req.body);
        if(!parseResult.success){
            res.status(400).json({error: parseResult.error.issues});
            return;
                
        }

        const User = parseResult.data;
        const UserEmail = User.email;


        // checking if the email provided if it exist in our Database
        const existingUser = await getUserByEmailServices(UserEmail);
        if(existingUser){
            res.status(400).json({error: "User with this email already exists 😬 Try another one!"})
            return;
        }

        // Generate a Hashed Password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(User.password,salt);
        User.password = hashedPassword;

        // Call the service to create the new user
        const newUser = await createUserServices(User);
        const results = await sendEmails(User.email,User.firstName,User.lastName,"Account Created Successfully! ✅ ","Welcome to Gakenye Events and Ticket Management Services! 🥳")

        res.status(200).json({message: newUser,emailNotification: results});



    } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to create user 🛠️ Something went wrong." });
    }
}

// Login User Logic
export const loginUser = async (req: Request, res: Response) => {
    try {
        const parseResult = UserLoginValidator.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({ error: parseResult.error.issues });
            return;
        }
        const { email, password } = parseResult.data;

        // Check if user exists
        const user = await getUserByEmailServices(email);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Compare passwords
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
             res.status(401).json({ error: "Invalid password" });
             return;
        }

        //Generate a token
        let payload ={
            userId: user.userId,
            email: user.email,
            userType: user.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // Token expires in 1 hour
        }

        let secret = process.env.JWT_SECRET as string;
        const token = jwt.sign(payload, secret);

        res.status(200).json({ token, userId: user.userId, email: user.email, role: user.role});
    } catch (error:any) {
        res.status(500).json({ error:error.message || "Failed to login user" });
    }
}