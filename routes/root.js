import { Router } from "express"
import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const router = Router()
const __dirname = dirname(fileURLToPath(import.meta.url))

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"))
})

export default router