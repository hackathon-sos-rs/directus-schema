const date = new Date();
const fs = require('fs').promises;

const { DIRECTUS_DEST_ROOT_TOKEN } = process.env;

async function main() {
   const { schemaId, remoteInstallation } = getParams();

   if (!schemaId || !remoteInstallation) {
      throw new Error('Missing required parameters: --schemaId, --remoteInstallation');
   }

   console.log('Pushing Directus schema...');

   const diff = await getDiff();

   if (diff) {
      const result = await fetch(`${remoteInstallation}/schema/apply?access_token=${DIRECTUS_DEST_ROOT_TOKEN}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(diff)
      }).then(res => res.json());

      console.log('Pushed Directus');
   }
}

async function getDiff() {
   const { schemaId, remoteInstallation } = getParams();

   if (!schemaId || !remoteInstallation) {
      throw new Error('Missing required parameters: --schemaId, --remoteInstallation');
   }

   console.log('Getting Directus schema diff...');

   const response = await fetch(`${remoteInstallation}/schema/diff?access_token=${DIRECTUS_DEST_ROOT_TOKEN}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: await fs.readFile(__dirname + `/schemas/${schemaId}.json`, 'utf8')
   });

   if (response.status === 204) {
      console.warn("Directus updated");
      return null;
   }

   const diff = await response.json();

   return diff.data;
}


function getParams() {
   const args = process.argv.slice(2);
   const params = {};

   for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const next = args[i + 1];
      if (arg.startsWith('--')) {
         params[arg.slice(2)] = next;
      }
   }

   return params;
}

(async () => {
   try {
      await main();
   } catch (error) {
      console.error(error);
   }
})();
