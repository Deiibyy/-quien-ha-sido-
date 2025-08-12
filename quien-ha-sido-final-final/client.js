const socket = io();
let currentRoom = null;
document.getElementById('create').onclick = ()=>{
  socket.emit('createRoom', (res)=>{
    if(res.ok){ currentRoom = res.room; document.getElementById('code').textContent = currentRoom; document.getElementById('roomInfo').style.display='block';
      const url = window.location.origin + '/mobile.html?room=' + currentRoom;
      document.getElementById('qr').innerHTML = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url) + '" />';
    }
  });
};
socket.on('roomUpdate', (r)=>{
  const players = r.players || {};
  const pdiv = document.getElementById('players'); pdiv.innerHTML='';
  let count=0;
  for(const id in players){ count++; const p=players[id]; const el=document.createElement('div'); el.textContent = p.name + ' (' + (p.points||0) + ')'; pdiv.appendChild(el); }
  document.getElementById('start').disabled = count<2;
});
document.getElementById('start').onclick = ()=>{
  socket.emit('startGame', {room: currentRoom}, (res)=>{ if(res.ok){ document.getElementById('lobby').style.display='none'; document.getElementById('game').style.display='block'; } });
};
socket.on('roundResult', (data)=>{ const s=document.getElementById('scores'); s.innerHTML=''; for(const id in data.players){ const p=data.players[id]; const e=document.createElement('div'); e.textContent = p.name + ' - ' + (p.points||0); s.appendChild(e); } });
document.getElementById('next').onclick = ()=>{ socket.emit('nextRound', {room: currentRoom}, ()=>{}); };
