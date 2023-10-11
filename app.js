import express from "express"
import cors from "cors"
import path from "path"
import fs from "fs"
// import { saveDataToXLSX } from "./excelManager.js"
import { getAccounts } from "./scrape.js"
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express()
const PORT = 1600

app.use(express.json({ "limit": "25mb"}))
app.use(cors())

app.get('/', (req, res) => {
    console.log('requested index.js')
    res.sendFile(path.join(__dirname, 'site/index.html'))
})
app.get('/css/style.css', (req, res) => res.sendFile(path.join(__dirname, 'site/css/style.css')))
app.get('/css/style.css.map', (req, res) => res.sendFile(path.join(__dirname, 'site/css/style.css.map')))
app.get('/index.js', (req, res) => res.sendFile(path.join(__dirname, 'site/index.js')))
app.get('/question-mark.png', (req, res) => res.sendFile(path.join(__dirname, 'site/question-mark.png')))
app.post('/getPlayers', async (req, res) => {
    console.log('requested players')
    res.json(await getAccounts(req.body.players))
})

app.listen({ host: '0.0.0.0', port: PORT }, () => console.log('LISTENING ON PORT ' + PORT))