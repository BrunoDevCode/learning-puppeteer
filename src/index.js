const puppet = require('puppeteer');

// Example 1

// (async () => {
//   const browser = await puppet.launch();

//   const page = await browser.newPage();
//   await page.goto('https://fiis.com.br/');
//   await page.screenshot({ path: 'example1.png' });

//   await browser.close();
// })();

// Example 2

const selectedFunds = [
  'MXRF11',
  // 'OIBR3',
  // 'ITSA4',
  // 'IRBR3',
  // 'KNRI11',
  // 'MORE11'
]

let scrape = async () => {
  const browser = await puppet.launch();
  const page = await browser.newPage();
  await page.goto('https://fiis.com.br/lista-de-fundos-imobiliarios/');

  const result = await page.evaluate(() => {
    const funds = [];

    const wrapperUL = document.querySelector('#items-wrapper');

    wrapperUL.querySelectorAll('.item').forEach(fund => {
      const fundName = fund.querySelector('.ticker').innerHTML;
      funds.push(fundName);
    });

    return funds;
  });

  const resultSeletedFunds = [];

  result.map(async fund => {
    if (!selectedFunds.includes(fund)) {
      return
    }

    

    const page = await browser.newPage();
    await page.goto(`https://fiis.com.br/${fund}/`);

    const result = await page.evaluate(() => {
      const informations = document.querySelector('#informations--indexes');

      const item = informations.querySelectorAll('.item');

      const lastRend = item[1].querySelector('.value').innerText;

      return lastRend;
    });
    

    resultSeletedFunds.push({ fund, result });
  });

  console.log(resultSeletedFunds);

  browser.close();
  return resultSeletedFunds;
}

scrape().then((value) => {
  console.log('> ' + value);
})