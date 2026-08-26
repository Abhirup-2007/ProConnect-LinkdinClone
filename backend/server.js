import express from "express"
import cors from "cors"
import connectDB from "./src/utils/db.js"
import userRouter from "./src/routers/user.router.js"
import PostsRouter from "./src/routers/posts.router.js"

connectDB()

const app = express()
const PORT = 5050

app.use(cors())

app.use(express.json())

app.use(express.static("public"))
app.use(userRouter)
app.use(PostsRouter)

app.listen(PORT)