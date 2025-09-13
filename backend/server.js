import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import recordRoutes from "./routes/recordRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

const app = express();
dotenv.config({path:"./.env"});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

const PORT = process.env.PORT;

app.use("/api/", recordRoutes);

app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested : 1});
        console.log(decision);

        if(decision.isDenied()){
            if(decision.reason.isBot()){
                return res.status(403).json({ error: "Access denied: Bot activity detected." });
            }
            else if(decision.reason.isRateLimit()){
                return res.status(429).json({error : "Too many requests"});
            }
            else {
                return res.status(403).json({ error: "Access denied." });
            }
            return;
        }
        else if (decision.results.some(result => result.reason.isBot() && result.reason.spoofed)){
            return res.status(403).json({ error: "Access denied: Spoofed bot detected." });
        }
        next();
    } catch (error) {
        console.log("Arcjet Error : " + error);
        next(error);
    }
});

async function initDB(){
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS customers (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                phone TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS measurements (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
                type TEXT NOT NULL,
                data JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                type TEXT NOT NULL,
                quantity SMALLINT NOT NULL DEFAULT 1,
                status TEXT DEFAULT 'in_progress',
                order_date TIMESTAMP DEFAULT now(),
                notes TEXT,
                tag INTEGER DEFAULT 0
            );
        `;

        // Add tag column if it doesn't exist (for existing tables)
        try {
            await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tag INTEGER DEFAULT 0;`;
        } catch (error) {
            // Column might already exist, ignore error
            console.log("Tag column might already exist:", error.message);
        }
        console.log("Database Initialized Successfully");
        
    } catch (error) {
        console.log("Error initDB", error);
    }
}

initDB().then(() => {
    app.listen(PORT, ()=>{
        console.log("Server is running on port " + PORT);
    })
});