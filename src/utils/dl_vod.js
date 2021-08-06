const fs = require('fs');
const fetch = require('node-fetch');

async function dl_stream(url) {
  let retry_limit = 20;
  for (let i = 0; i < 9999; i++) {
    let cur_retries = 0;
    while (true) {
      if (cur_retries < retry_limit) {
        let fix_url = url.substring(0, url.length - 14) + `${i}.ts`;
        const res = await fetch(fix_url);
        if (res.status === 200) {
          const fileStream = fs.createWriteStream(`${i}.ts`);
          res.body.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
          });
          console.log(`${i}`);
          await sleep(2000);
          break;
        } else {
          cur_retries += 1;
          console.log(`${cur_retries}: retrying ${i}`);
          await sleep(3000);
          continue;
        }
      } else {
        return;
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  dl_stream,
};
