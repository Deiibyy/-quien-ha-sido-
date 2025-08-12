// Ligero servidor listo — mantener como placeholder si lo deseas
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT||3000;
app.use(express.static(path.join(__dirname,'/')));
const rooms = {};
function makeRoom(){ const chars='ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let s=''; for(let i=0;i<5;i++) s+=chars[Math.floor(Math.random()*chars.length)]; return s; }
io.on('connection',(socket)=>{
  socket.on('createRoom',(cb)=>{ let r=makeRoom(); while(rooms[r]) r=makeRoom(); rooms[r]={players:{},host:socket.id,state:'lobby',round:0}; socket.join(r); rooms[r].players[socket.id]={id:socket.id,name:'Host',photo:null,points:0}; cb({ok:true,room:r}); io.to(r).emit('roomUpdate',rooms[r]); });
  socket.on('joinRoom',({room,name},cb)=>{ if(!rooms[room]) return cb({ok:false,error:'ROOM_NOT_FOUND'}); socket.join(room); rooms[room].players[socket.id]={id:socket.id,name:name||'Jugador',photo:null,points:0}; cb({ok:true}); io.to(room).emit('roomUpdate',rooms[room]); });
  socket.on('uploadPhoto',({room,dataUrl})=>{ if(!rooms[room]||!rooms[room].players[socket.id]) return; rooms[room].players[socket.id].photo = dataUrl; io.to(room).emit('roomUpdate',rooms[room]); });
  socket.on('startGame',({room},cb)=>{ if(!rooms[room]) return cb({ok:false}); rooms[room].state='playing'; rooms[room].round=1; io.to(room).emit('gameStarted',rooms[room]); cb({ok:true}); });
  socket.on('vote',({room,targetId})=>{ if(!rooms[room]) return; const r=rooms[room]; r.votes = r.votes||{}; r.votes[targetId] = (r.votes[targetId]||0)+1; io.to(room).emit('voteUpdate',r.votes); });
  socket.on('nextRound',({room},cb)=>{ if(!rooms[room]) return; const r=rooms[room]; const votes = r.votes||{}; let maxId=null,maxV=-1; for(const pid in votes){ if(votes[pid]>maxV){ maxV=votes[pid]; maxId=pid; } } if(maxId) r.players[maxId].points += 10; r.votes={}; r.round = (r.round||0)+1; io.to(room).emit('roundResult',{winner:maxId,players:r.players}); io.to(room).emit('roomUpdate',r); if(cb) cb({ok:true}); });
  socket.on('disconnect',()=>{ for(const room in rooms){ if(rooms[room].players && rooms[room].players[socket.id]){ delete rooms[room].players[socket.id]; io.to(room).emit('roomUpdate',rooms[room]); if(rooms[room].host===socket.id){ const ids = Object.keys(rooms[room].players); rooms[room].host = ids.length?ids[0]:null; } if(Object.keys(rooms[room].players).length===0) delete rooms[room]; } } });
});
server.listen(PORT,()=>console.log('listening',PORT));
