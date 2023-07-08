const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const getClothesAjio = async (URL) => {
  try {
    const data = [];
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
  
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
    await page.setUserAgent(ua);
    await page.waitForSelector(
      ".item.rilrtl-products-list__item.item"
    );
    const elements = await page.$$(".item.rilrtl-products-list__item.item");

    let minLength = 6;
    if (minLength > elements.length) minLength = elements.length;
    for (let i = 0; i < minLength; i++) {
      const image = await page.evaluate(
        (el) =>
          el.querySelector("a > div > div > div > img").getAttribute("src"),
        elements[i]
      );
      if (!image) continue;

      const li = await page.evaluate(
        (el) => el.querySelector("a").getAttribute("href"),
        elements[i]
      );
      const link = `https://www.ajio.com${li}`;

      const brand = await page.evaluate(
        (el) => el.querySelector("a > div > .contentHolder > div").textContent,
        elements[i]
      );

      const title =
        brand +
        " - " +
        (await page.evaluate(
          (el) =>
            el.querySelector("a > div > .contentHolder > .nameCls").textContent,
          elements[i]
        ));

      const discountPrice = await page.evaluate(
        (el) =>
          el.querySelector("a > div > .contentHolder > div > span").textContent,
        elements[i]
      );

      const price = await page.evaluate(
        (el) =>
          el.querySelector("a > div > .contentHolder > div > div > span")
            .textContent,
        elements[i]
      );

      const discount = await page.evaluate(
        (el) =>
          el.querySelector("a > div > .contentHolder > div > div > .discount")
            .textContent,
        elements[i]
      );
      const scrapFrom = "Ajio";

      // const pordArr = prodInfo.split("₹");
      // const title = prod

      data.push({ link, image, title, price, discountPrice, discount, scrapFrom });
    }

    await browser.close();
    console.log(data.length);
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
const URL = "https://www.ajio.com/search/?text=jeans";
module.exports = getClothesAjio;
