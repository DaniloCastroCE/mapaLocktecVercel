require('dotenv').config()
const express  = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 4000
const router = require('./src/router/router.js')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(router)

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rondando na porta ${PORT}`)
})