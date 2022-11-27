const fs = require('fs');
const https = require('https');
const http = require('http');
const NodeMediaServer = require('node-media-server');

function getTime(date=new Date().getTime()) {
  var dt=new Date(date);
  var year=dt.getFullYear();
  var month=dt.getMonth()+1;
  var day=dt.getDate();
  var hour=dt.getHours();
  var minute=dt.getMinutes();
  var second=dt.getSeconds();
  var nnt1Ms=dt.getMilliseconds();
  if(month.toString().length==1) {
    month='0'+month.toString();
  }
  if(day.toString().length==1) {
    day='0'+day.toString();
  }
  if(hour.toString().length==1) {
    hour='0'+hour.toString();
  }
  if(minute.toString().length==1) {
    minute='0'+minute.toString();
  }
  if(second.toString().length==1) {
    second='0'+second.toString();
  }
  return `${year}-${month}-${day} ${hour}:${minute}:${second}.${nnt1Ms.toString().substr(0,1)}`;
}

let nms = new NodeMediaServer({
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  },
  https: {
    port: 8443,
    key:'./cert/privkey.pem',
    cert:'./cert/cert.pem',
    ca:'./cert/fullchain.pem'
  }
});

let sv = https.createServer({
  key: fs.readFileSync('./cert/privkey.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
  ca: fs.readFileSync('./cert/fullchain.pem')
},(req,res)=>{
  let ip = req.headers['x-forwarded-for'] || (req.connection||req.socket).remoteAddress;
  let url = req.url.toLowerCase();
  
  var d='';console.log(d=`[HTTPS Connection | ${getTime()}]: ${ip}:${(req.connection||req.socket).remotePort}  ->  ${req.url}`);
  fs.appendFileSync('logs/https.log',`${d}\n`);
  
  let ext = {
    html:{'Content-Type': 'text/html'},
    css: {'Content-Type': 'text/css'},
    ico: {'Content-Type': 'image/x-icon'},
    png: {'Content-Type': 'image/png'},
    svg: {'Content-Type': 'image/svg+xml'},
    js:  {'Content-Type': 'text/javascript'}
  };
  let files = {
    'favicon.svg': fs.readFileSync('src/min/favicon.svg'), // ?
    'index.html':  fs.readFileSync('src/min/index.html'),
    'main.css':    fs.readFileSync('src/min/main.css'),
    'index.js':    fs.readFileSync('src/min/index.js'),
    'favicon.ico': fs.readFileSync('src/favicon.ico'),
    'favicon.png': fs.readFileSync('src/favicon.png'),
    'flv.js':      fs.readFileSync('src/min/flv.js')
  };
  let currReq = { file: null, type: null };
  if(url.includes('.css')) {
    currReq.file = files['main.css'];
    currReq.type = ext['css'];
  } else if(url.includes('.js')) {
    currReq.file = ext['js'];
    if(url.includes('flv')) currReq.file = files['flv.js'];
    else if(url.includes('main')||url.includes('index')) currReq.file = files['index.js']
  } else if(url.includes('favicon')) {
    if(url.includes('.ico')) {
      currReq.file = files['favicon.ico'];
      currReq.type = ext['ico'];
    } else if(url.includes('png')) {
      currReq.file = files['favicon.png'];
      currReq.type = ext['png'];
    }
  } else {
    currReq.file = files['index.html'];
    currReq.type = ext['html'];
  }
  res.writeHead(200, currReq['type']);
  res.write(currReq['file']);
  res.end();
});
sv.listen(443,()=>console.log('HTTPS Server is Started.'));

let nsv = http.createServer((req,res)=>{
  let ip = req.headers['x-forwarded-for'] || (req.connection||req.socket).remoteAddress;
  let url = req.url.toLowerCase();

  var d='';console.log(d=`[HTTP Connection | ${getTime()}]: ${ip}:${(req.connection||req.socket).remotePort}  ->  ${req.url}`);
  fs.appendFileSync('logs/http.log',`${d}\n`);

  let ext = {
    html:{'Content-Type': 'text/html'},
    css: {'Content-Type': 'text/css'},
    ico: {'Content-Type': 'image/x-icon'},
    png: {'Content-Type': 'image/png'},
    svg: {'Content-Type': 'image/svg+xml'},
    js:  {'Content-Type': 'text/javascript'}
  };
  let files = {
    'favicon.svg': fs.readFileSync('src/min/favicon.svg'), // ?
    'index.html':  fs.readFileSync('src/min/index.html'),
    'main.css':    fs.readFileSync('src/min/main.css'),
    'index.js':    fs.readFileSync('src/min/index.js'),
    'favicon.ico': fs.readFileSync('src/favicon.ico'),
    'favicon.png': fs.readFileSync('src/favicon.png'),
    'flv.js':      fs.readFileSync('src/min/flv.js')
  };
  let currReq = { file: null, type: null };
  if(url.includes('.css')) {
    currReq.file = files['main.css'];
    currReq.type = ext['css'];
  } else if(url.includes('.js')) {
    currReq.file = ext['js'];
    if(url.includes('flv')) currReq.file = files['flv.js'];
    else if(url.includes('main')||url.includes('index')) currReq.file = files['index.js']
  } else if(url.includes('favicon')) {
    if(url.includes('.ico')) {
      currReq.file = files['favicon.ico'];
      currReq.type = ext['ico'];
    } else if(url.includes('png')) {
      currReq.file = files['favicon.png'];
      currReq.type = ext['png'];
    }
  } else {
    currReq.file = files['index.html'];
    currReq.type = ext['html'];
  }
  res.writeHead(200, currReq['type']);
  res.write(currReq['file']);
  res.end();
});
nsv.listen(80,()=>console.log('HTTPS Server is Started.'));
nms.run();
