var express = require('express');
const firebase = require('firebase');
const { compileClientWithDependenciesTracked } = require('jade');
var router = express.Router();
let clients = [];

const firebaseConfig = {
  apiKey: '<api-key>',
  authDoamin: '<auth-domain>',
  projectId: '<project-id>'
}

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/get', async function(req, res, next) {
  let currentBallotInfo;
  let infoObject;
  try{
    currentBallotInfo = await db.collection('Wed Jul 15 2020').doc('current-ballot').get()
    infoObject = currentBallotInfo.data();
  } catch(e) {
    console.log('We got an error', e);
  }
  res.json({test: 'response', infoObject});
  return;
});

router.get('/reminder', async function(req, res, next) {
  for (let x = 5; x > 0; x --) {
    await new Promise(resolve => {
      setTimeout(() => {
        clients.forEach(c => c.res.write(`data: test reminder ${x}\n\n`));
        resolve();
    }, 1000)});
  }
  // [3, 2, 1].forEach(async function (countItem) {
  //   await new Promise(resolve => {
  //     setTimeout(() => {
  //       clients.forEach(c => c.res.write(`data: test reminder ${countItem}\n\n`));
  //       resolve();
  //   }, 1000)});
  // })
  // clients.forEach(c => c.res.write(`data: test reminder\n\n`));
  res.json({successful: 'true', count: clients.length});
});

router.get('/events', async function(req, res, next) {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();
  res.write('retry: 10000\n\n');
  let clientId = Date.now();
  clients.push({ id: clientId, res});

  // while(true) {
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   res.write(`data: ${count}\n\n`);

  //   count ++;
  // }

  req.on('close', () => {
    console.log(`${clientId} Connection Closed`);
    clients = clients.filter(c => c.id !== clientId);
  });
});
module.exports = router;
