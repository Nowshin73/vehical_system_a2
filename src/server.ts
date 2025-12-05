import express, { Request, Response } from "express"

const app = express()
const port = 5000;

app.use(express.json());

app.get('/', (req:Request, res:Response) => {
  res.send('hi')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
