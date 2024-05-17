const date = new Date();
const fs = require('fs').promises;

const { DIRECTUS_ROOT_TOKEN } = process.env;

async function main() {
   try {
      const { data } = await fetch(`https://sos-rs-stock-qa.star-ai.app/schema/snapshot?access_token=${DIRECTUS_ROOT_TOKEN}`).then(res => res.json());
      await fs.writeFile(__dirname + `/schemas/${fileSuffix()}.json`, JSON.stringify(data, null, 2));
   } catch (err) {
      console.error(err);
   }
}

function fileSuffix() {
   return date.toISOString().replace(/ /g, '_').replace(/:/g, '-').split('.')[0];
}

(async () => {
   try {
      await main();
   } catch (error) {
      console.error(error);
   }
})();
