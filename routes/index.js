var express = require('express');
const firebase = require('firebase');
const { compileClientWithDependenciesTracked } = require('jade');
var router = express.Router();

const firebaseConfig = {
  apiKey: 'healthcheck-7ec75.firebaseapp.com',
  authDoamin: 'AIzaSyBMPMFL1g6Vgs1l5LPiwhpHY-nXxw82InM',
  projectId: 'healthcheck-7ec75'
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

router.get('/events', async function(req, res, next) {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();
  let count = 0;
  res.write('retry: 10000\n\n');

  while(true) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.write(`data: ${count}\n\n`);

    count ++;
  }
});
module.exports = router;
