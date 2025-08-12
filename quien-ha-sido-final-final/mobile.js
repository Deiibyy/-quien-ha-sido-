const socket = io();
const params = new URLSearchParams(window.location.search);
if(params.get('room')) document.getElementById('room').value = params.get('room');
document.getElementById('join').onclick = ()=>{
  const room = document.getElementById('room').value.trim();
  const name = document.getElementById('name').value.trim() || 'Jugador';
  if(!room) return alert('Introduce código'); 
  socket.emit('joinRoom', {room, name}, (res)=>{ if(res.ok){ document.getElementById('photoArea').style.display='block'; } else { alert('Error: '+res.error); } });
};
document.getElementById('photo').onchange = (e)=>{
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader(); r.onload = ()=>{
    const data = r.result; document.getElementById('preview').src = data; document.getElementById('preview').style.display='block';
    socket.emit('uploadPhoto', {room: document.getElementById('room').value, dataUrl: data});
  }; r.readAsDataURL(f);
};
socket.on('roomUpdate', (r)=>{
  if(r.state==='playing'){ document.getElementById('voteArea').style.display='block'; const opts = document.getElementById('options'); opts.innerHTML=''; for(const id in r.players){ const p=r.players[id]; const b=document.createElement('button'); b.textContent = p.name; b.onclick = ()=>{ socket.emit('vote', {room: document.getElementById('room').value, targetId: id}); alert('Votado'); }; opts.appendChild(b); } }
});
