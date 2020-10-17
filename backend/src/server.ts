import express from 'express'
import path from 'path'
import cors from 'cors'

import 'express-async-errors'

import './database/connection'

import errorHandler from './errors/handle'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes) // sempre colocar nessa ordem a linha de codigo
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler)


app.listen(3333)