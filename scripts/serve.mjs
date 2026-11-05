import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('dist');
const port=Number(process.env.PORT || 4210);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.webm':'video/webm','.png':'image/png','.mp4':'video/mp4'};
createServer(async(req,res)=>{
 res.setHeader('X-Robots-Tag','noindex, nofollow');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 if(req.method!=='GET'&&req.method!=='HEAD'){
  res.writeHead(405,{'Content-Type':'application/json','Allow':'GET, HEAD'});
  res.end(JSON.stringify({error:'Review preview: enquiries are disabled. No message was sent.'}));return;
 }
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);res.end('Bad request');return;}
 let file=resolve(root,'.'+pathname);
 if(!file.startsWith(root+sep)&&file!==root){res.writeHead(403);res.end();return;}
 try{
  if((await stat(file)).isDirectory())file=resolve(file,'index.html');
  const body=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-store'});
  res.end(req.method==='HEAD'?undefined:body);
 }catch{
  const body=await readFile(resolve(root,'404.html'));
  res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:body);
 }
}).listen(port,'127.0.0.1',()=>console.log(`Trade Etching Direct review: http://127.0.0.1:${port} (loopback only, no live submissions)`));
