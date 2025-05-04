import express from "express";
import cors from "cors";

export default async function CreateServer(){

    const app = express();
    app.use(cors());                         
    app.use(express.json());

    app.use("/api/v1/uptime-keeper", (req, res) =>  res.status(200).json({ message: "Uptime keeper is working!" }));
    app.use("/api/v1/test", (req, res) => res.status(200).json({"Test":"Testing"}));

    return app
}