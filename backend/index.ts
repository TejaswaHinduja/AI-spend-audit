import express from "express"
import cors from "cors"

const app=express()
app.use(cors({origin:"http://localhost:3000",
    credentials:true,
}))
app.use("/store",credRoute)
app.use("/suggestion",suggestRoute)