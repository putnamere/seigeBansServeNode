import { Cluster } from "puppeteer-cluster"
import fs from "fs"
import puppeteer from "puppeteer"


export const getAccounts = async (nameArr) => {
    console.log(nameArr)
    let startTime = Date.now()
    let urls = []
    let returnArr = []
    nameArr.forEach(n => {
        urls.push(`https://r6.tracker.network/profile/${n[1] ? "xbox" : "psn"}/${n[0].split(" ").join("%20")}`)
    })


	const browser = await puppeteer.launch({
		headless: 'new' 
	})

	for await (const url of urls) {
		const info = await getSingleAccount(url, browser)
		returnArr.push(info)
	}
	await browser.close()

    // const cluster = await Cluster.launch({
    //     concurrency: Cluster.CONCURRENCY_PAGE,
    //     maxConcurrency: 6,
    //     //monitor: true,
    //     puppeteerOptions: {
    //         headless: 'new',
    //     }
    // })
    //
    // await cluster.task(async ({page, data: url}) => {
    //
    //     await page.setRequestInterception(true);
    //
    //     page.on('request', (req) => {
    //       if (req.resourceType() === 'image' || req.resourceType() == 'stylesheet') {
    //         req.abort();
    //       } else {
    //         req.continue();
    //       }
    //     })
    //
    //     const cookies = JSON.parse(fs.readFileSync('./cookies.json'))
    //     await page.setCookie(...cookies)
    //
    //     await page.goto(url, { waitUntil: "domcontentloaded" })
    //
    //     const errorTextHandle = await page.$('#hp-search > div > h1')
    //     if (errorTextHandle != null || (url.split("/")[url.split("/").length - 1].replaceAll("%20", " ")).length < 2) return returnArr.push(url.split("/")[url.split("/").length - 1].replaceAll("%20", " "))
    //
    //     const killDeathHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div:nth-child(3) > div > div:nth-child(4) > div.trn-defstat__value')
    //     const killDeath = killDeathHandle ? await page.evaluate(el => el.innerText, killDeathHandle) : null
    //
    //     const lifeTimeKillsHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div:nth-child(3) > div > div:nth-child(3) > div.trn-defstat__value')
    //     const lifeTimeKills = lifeTimeKillsHandle ? await page.evaluate(el => el.innerText, lifeTimeKillsHandle) : null
    //
    //     const headShotPercentHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div:nth-child(2) > div.trn-card__content > div.trn-defstats.trn-defstats--width4 > div:nth-child(1) > div.trn-defstat__value')
    //     const headShotPercent = headShotPercentHandle ? await page.evaluate(el => el.innerText, headShotPercentHandle) : null
    //
    //     const rankImageHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(1) > div.trn-card__content.trn-card--light.pt8.pb8 > div:nth-child(2) > div:nth-child(1) > img')
    //     const rankImage = rankImageHandle ? await page.evaluate(el => el.src, rankImageHandle) : null
    //
    //     const opOneHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div.trn-card__content.trn-card--light.trn-defstats-flex.pt8.pb8 > div > div.trn-defstat.mb0.top-operators > div.trn-defstat__value > img:nth-child(1)')
    //     const opOne = opOneHandle ? await page.evaluate(el => el.src, opOneHandle) : null
    //
    //     const opTwoHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div.trn-card__content.trn-card--light.trn-defstats-flex.pt8.pb8 > div > div.trn-defstat.mb0.top-operators > div.trn-defstat__value > img:nth-child(2)')
    //     const opTwo = opTwoHandle ? await page.evaluate(el => el.src, opTwoHandle) : null
    //
    //     const opThreeHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div.trn-card__content.trn-card--light.trn-defstats-flex.pt8.pb8 > div > div.trn-defstat.mb0.top-operators > div.trn-defstat__value > img:nth-child(3)')
    //     const opThree = opThreeHandle ? await page.evaluate(el => el.src, opThreeHandle) : null
    //
    //     const levelHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div.trn-card__content.trn-card--light.trn-defstats-flex.pt8.pb8 > div > div:nth-child(2) > div > div.trn-defstat__value-stylized')
    //     const levelStat = levelHandle ? await page.evaluate(el => el.innerText, levelHandle) : null
    //     //const cookies = await page.cookies()
    //     //fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2))
    //
    //     returnArr.push({
    //         kd: killDeath,
    //         ltk: lifeTimeKills,
    //         hsp: headShotPercent,
    //         rankImg: rankImage,
    //         op1: opOne,
    //         op2: opTwo,
    //         op3: opThree,
    //         level: levelStat,
    //         ign: url.split("/")[url.split("/").length - 1].replaceAll("%20", " ")
    //     })
    // })
    //
    // urls.forEach(async url => {
    //     await cluster.queue(url)
    // })
    //
    // await cluster.idle()
    // await cluster.close()
    //
    
    console.log(`Finished a query in: ${(Date.now() - startTime)/1000}s`)

    const pastData = JSON.parse(fs.readFileSync("./PlayerData.json", 'utf8'))

    returnArr.forEach(p => {
        let included = false
        if (typeof p != "string") {
            pastData.forEach(o => {
                if (o.ign.toLowerCase() == p.ign.toLowerCase()) included = true
            })
            if (!included) pastData.push(p)
        }
    })

    fs.writeFileSync("./PlayerData.json", JSON.stringify(pastData))
    return returnArr
}


const getSingleAccount = async (url, browser) => {
	// const browser = await puppeteer.launch({
	// 	headless: 'new'
	// })

	const page = await browser.newPage()
        await page.setRequestInterception(true);

        page.on('request', (req) => {
          if (req.resourceType() === 'image' || req.resourceType() == 'stylesheet') {
            req.abort();
          } else {
            req.continue();
          }
        })

        const cookies = JSON.parse(fs.readFileSync('./cookies.json'))
        await page.setCookie(...cookies)

        await page.goto(url, { waitUntil: "domcontentloaded" })

        const errorTextHandle = await page.$('#hp-search > div > h1')
        if (errorTextHandle != null || (url.split("/")[url.split("/").length - 1].replaceAll("%20", " ")).length < 2) return url.split("/")[url.split("/").length - 1].replaceAll("%20", " ")

        const killDeathHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div:nth-child(3) > div > div:nth-child(4) > div.trn-defstat__value')
        const killDeath = killDeathHandle ? await page.evaluate(el => el.innerText, killDeathHandle) : null

        const lifeTimeKillsHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div:nth-child(3) > div > div:nth-child(3) > div.trn-defstat__value')
        const lifeTimeKills = lifeTimeKillsHandle ? await page.evaluate(el => el.innerText, lifeTimeKillsHandle) : null

        const headShotPercentHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div:nth-child(2) > div.trn-card__content > div.trn-defstats.trn-defstats--width4 > div:nth-child(1) > div.trn-defstat__value')
        const headShotPercent = headShotPercentHandle ? await page.evaluate(el => el.innerText, headShotPercentHandle) : null

        const rankImageHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__aside > div:nth-child(1) > div.trn-card__content.trn-card--light.pt8.pb8 > div:nth-child(2) > div:nth-child(1) > img')
        const rankImage = rankImageHandle ? await page.evaluate(el => el.src, rankImageHandle) : null

        const opOneHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div.trn-card__content.trn-card--light.trn-defstats-flex.pt8.pb8 > div > div.trn-defstat.mb0.top-operators > div.trn-defstat__value > img:nth-child(1)')
        const opOne = opOneHandle ? await page.evaluate(el => el.src, opOneHandle) : null

        const opTwoHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div.trn-card__content.trn-card--light.trn-defstats-flex.pt8.pb8 > div > div.trn-defstat.mb0.top-operators > div.trn-defstat__value > img:nth-child(2)')
        const opTwo = opTwoHandle ? await page.evaluate(el => el.src, opTwoHandle) : null

        const opThreeHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div.trn-card__content.trn-card--light.trn-defstats-flex.pt8.pb8 > div > div.trn-defstat.mb0.top-operators > div.trn-defstat__value > img:nth-child(3)')
        const opThree = opThreeHandle ? await page.evaluate(el => el.src, opThreeHandle) : null

        const levelHandle = await page.$('#profile > div.trn-scont.trn-scont--swap > div.trn-scont__content > div.trn-scont__content.trn-card > div.trn-card__content.trn-card--light.trn-defstats-flex.pt8.pb8 > div > div:nth-child(2) > div > div.trn-defstat__value-stylized')
        const levelStat = levelHandle ? await page.evaluate(el => el.innerText, levelHandle) : null

        return {
            kd: killDeath,
            ltk: lifeTimeKills,
            hsp: headShotPercent,
            rankImg: rankImage,
            op1: opOne,
            op2: opTwo,
            op3: opThree,
            level: levelStat,
            ign: url.split("/")[url.split("/").length - 1].replaceAll("%20", " ")
        }
}

