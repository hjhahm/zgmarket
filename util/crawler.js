const axios = require('axios')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')
// const controller = require('../controller/product')
const Product = require('../model/Product')
const getHtml = async name => {
  try {
    // 가상 브라우져를 실행, headless: false를 주면 벌어지는 일을 새로운 창을 열어 보여준다(default: true)
    const browser = await puppeteer.launch({ headless: false })
    //const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const productList = []

    // headless: false일때 브라우져 크기 지정해주는 코드
    await page.setViewport({
      width: 1366,
      height: 768,
    })

    // console.log 확인
    page.on('console', async msg => {
      const msgArgs = msg.args()
      for (let i = 0; i < msgArgs.length; ++i) {
        console.log(await msgArgs[i].jsonValue())
      }
    })

    await page.goto('https://smartstore.naver.com/' + name)
    const content = await page.content()
    const $ = cheerio.load(content)
    var categories = $(
      '#pc-categoryMenuWidget > div > div > div > div > div > div._1AJ8D2PjS4._3nO3wKj4-Z > div > ul._3AV7RVieRB li'
    )

    var shop = $('head > title').text()

    for (var i = 1; i <= categories.length; i++) {
      var category = $(
        '#pc-categoryMenuWidget > div > div > div > div > div > div._1AJ8D2PjS4._3nO3wKj4-Z > div > ul._3AV7RVieRB li:nth-child(' +
          i +
          ') > a._3HQCww4jR6'
      ).text()
      var lowerCategory = '' + category.toLocaleLowerCase()
      console.log('lowerCategory :', lowerCategory)
      console.log('lowerCategory :', lowerCategory.includes('all'))
      console.log('lowerCategory :', lowerCategory.length)
      if (
        lowerCategory.includes('all') ||
        lowerCategory.includes('best') ||
        lowerCategory.includes('전체') ||
        lowerCategory.includes('베스트') ||
        lowerCategory.length < 1
      ) {
        continue
      }
      const regexExp =
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi

      category = category.replace(regexExp, '')
      category = category.replace('하위 메뉴 있음', '')
      category = category.trim()

      await Promise.all([
        page.click(
          '#pc-categoryMenuWidget > div > div > div > div > div > div._1AJ8D2PjS4._3nO3wKj4-Z > div > ul._3AV7RVieRB li:nth-child(' +
            i +
            ') > a'
        ),
        page.waitForNavigation({
          waitUntil: 'networkidle2',
        }),
      ])
      const liList = await page.$$('#CategoryProducts > ul > li')
      console.log(liList.length)

      for (const li of liList) {
        var container = await li.$('div > a')
        var imgContainer = ''
        var isSwipeImg = false
        var title = ''
        var price = ''
        //var shop = $('#pc-storeNameWidget > div > div > a > span').text()

        if ((await container.$('div._2qTmf5nA5C')) !== null) {
          imgContainer = await container.$('div._2qTmf5nA5C')
        } else if ((await container.$('div._17nXMSr_Ma')) !== null) {
          imgContainer = await container.$('div._17nXMSr_Ma')
          isSwipeImg = true
        } else {
          console.log('another type')
          continue
        }

        var image = await imgContainer.$eval('div > div > div > img', e =>
          e.getAttribute('src')
        )

        var title = await li.$eval('div > a > strong', e => e.textContent)

        if (isSwipeImg) {
          price = await li.$eval(
            'div > a > div._2P2JGsAlZ9._1dAwNEcOik > strong._24X3qV1tN4 > span._3XLnd6iWP5',
            e => e.textContent
          )
        } else {
          price = await li.$eval(
            'div > a > div._23DThs7PLJ > strong._3a2YHGkedh > span',
            e => e.textContent
          )
        }

        price = price.replaceAll(',', '')

        console.log('category :', category)
        console.log('img:', image)
        console.log('title:', title)
        console.log('price:', price)
        console.log('shop:', shop)

        const product = new Product({
          title,
          price,
          image,
          category,
        })

        product.save((err, product) => {
          if (err) {
            console.log(err)
          } else {
            console.log(product)
          }
        })

        // const product = new Product(category, img, title, price)
        // product.save((err, product) => {
        //   if (err)
        //     return res.json({
        //       success: false,
        //       message: err,
        //     })
        //   return res.status(200).json({
        //     success: true,
        //   })
        // })
        // contorller.createdProduct()
      }
    }

    //브라우저 꺼라
    await browser.close()
  } catch (error) {
    console.log(error)
  }
}
module.exports.getHtml = getHtml
