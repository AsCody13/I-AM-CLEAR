(async()=>{
  i=0;
  await (new Promise(r=>setInterval(()=>{
    if(document.readyState=='complete')return r();
    document.title='loading..'.replace('loading'[++i%7],'loading'[i%7].toUpperCase());
  },60)));
  document.title="Screen share";
  document.getElementById("volume").addEventListener('input',elem=>{
    let vidElem = document.getElementById('vidElem');
    let textElem = document.getElementById('volText')||document.getElementById('vold');
    textElem.textContent = Math.round((vidElem.volume = elem.target.value) * 100) + '%';
  });
  try{
    var elem = document.getElementById('vold'), {style} = elem;
//    style.top = '0px';
//    style.left = (window.innerWidth - 48) + 'px';
    elem.textContent = document.getElementById('volume').value*100+'%';
    var {style} = document.getElementById('volume');
    style.top = '80px';
    style.left = (window.innerWidth - 96) + 'px';
  }catch{}
  //document.body.style.setProperty('visibility','visible');
  dragElement(document.getElementById("vold"));
  dragElement(document.getElementById("tip1"));
  dragElement(document.getElementById("tip2"));
  dragElement(document.getElementById("tip3"));
  function dragElement(elmnt) {
    elem = document.getElementById("volume");
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      if(elmnt.id==='vold') {
        elem.style.top = parseFloat(elmnt.style.top.replace('px',''))+90 + "px";
        elem.style.left = parseFloat(elmnt.style.left.replace('px',''))-10 + "px";
      }
    }
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      let top = parseFloat(elmnt.style.top.replace('px','')),
          left = parseFloat(elmnt.style.left.replace('px',''));
      if(top < -20 || top > window.innerHeight-4) elmnt.style.top = '128px';
      if(left < -30 || left > window.innerWidth-4) elmnt.style.left = '128px';
    }
  }
  window.pl = ()=>{
    document.getElementById('vidElem').style.width=`100%`;
    document.getElementById('vidElem').style.height=`100%`;
    if(flvjs.isSupported()) {
      let vidElem = document.getElementById('vidElem');
      let flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: location.origin + (location.protocol.includes('https') ? ':8443/live/' : ':8000/live/') +
             (location.pathname=='/live' ? location.hash.replace('#','') : 'AsCody94') + '.flv'
      });
      flvPlayer.attachMediaElement(vidElem);
      flvPlayer.load();
      flvPlayer.play();
    } else alert("Not supported");
  };
  window.play = ()=>{
    if(!window.hasOwnProperty('flvjs')) return alert('Looks like FLV.js didn\'t loaded yet!');
    pl();
  };
  console.log('loaded');
})();
