import xlsx from "xlsx"
import fs from "fs"
import { fileURLToPath } from "url";
import path from "path"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const workSheetColumnName = ["Rank", "Name", "HSP", "LTK", "KD", "LEVEL"]

export const saveDataToXLSX = async () => {
    if (fs.existsSync("./PlayerData.xlsx")) {
        console.log(path.join(__dirname, "PlayerData.xlsx"))
        fs.unlinkSync(path.join(__dirname, "PlayerData.xlsx"))
        console.log('deleted?')
    }
    let data = JSON.parse(fs.readFileSync("./PlayerData.json", 'utf-8'))
    let totalData = []
    data.forEach(o => {
        let arr = new Array(6)
        for (let key of Object.keys(o)) {
            if (key == "ign") arr[1] = o[key]
            else if (key == "rankImg") {
                if (o[key] == null) arr.push(null)
                else {
                    let splitted = o[key].split('/')
                    console.log(splitted[splitted.length-1])
                    arr[0] = splitted[splitted.length-1].replace('.png', '')
                }
            }
            else if (key == "hsp") arr[2] = o[key]
            else if (key == "ltk") arr[3] = o[key]
            else if (key == "kd") arr[4] = o[key]
            else if (key == "level") arr[5] = o[key]
        }
        totalData.push(arr)
    }) 
    const workSheetData = [ workSheetColumnName, ...totalData]
    const ws = xlsx.utils.aoa_to_sheet(workSheetData)
    const wb = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, ws, "Player_Stats")
    xlsx.writeFileXLSX(wb, "PlayerData.xlsx")
}

saveDataToXLSX()