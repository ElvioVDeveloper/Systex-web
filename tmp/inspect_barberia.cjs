const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

async function run() {
  const html = await fetch('https://barberia-demo-gilt-two.vercel.app/');
  console.log('HTML title & meta extracted:');
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="(.*?)"/);
  console.log('Title:', titleMatch ? titleMatch[1] : '');
  console.log('Desc:', descMatch ? descMatch[1] : '');

  const jsMatch = html.match(/\/assets\/[a-zA-Z0-9_\-]+\.js/);
  if (jsMatch) {
    const jsUrl = 'https://barberia-demo-gilt-two.vercel.app' + jsMatch[0];
    const js = await fetch(jsUrl);
    console.log('JS fetched, length:', js.length);

    const assetMatches = js.match(/\/assets\/[a-zA-Z0-9_\-]+\.(?:png|jpg|jpeg|webp|svg)/gi) || [];
    console.log('Asset matches:', Array.from(new Set(assetMatches)));

    const externalMatches = js.match(/https:\/\/[^"'\s\)]+\.(?:png|jpg|jpeg|webp)/gi) || [];
    console.log('External matches:', Array.from(new Set(externalMatches)).slice(0, 10));

    const stringLiterals = js.match(/"([^"]{15,120})"/g) || [];
    const relevant = stringLiterals.filter(s => /barber|corte|afeit|turno|reserva|agenda|atelier|tradicional|caballero/i.test(s));
    console.log('Relevant copy strings:');
    for (const r of Array.from(new Set(relevant)).slice(0, 20)) {
      console.log(' - ', r);
    }
  }
}

run().catch(console.error);
