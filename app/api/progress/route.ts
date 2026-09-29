// Read-only bridge for prototype progress. Beta progress is device-local by request.
import {env} from 'cloudflare:workers';
export async function GET(req:Request){
 const id=req.headers.get('cookie')?.match(/(?:^|;\s*)cc_learner=([a-f0-9-]{36})(?:;|$)/)?.[1];
 const headers={'Cache-Control':'no-store'};
 if(!id)return Response.json({progress:{}},{headers});
 try{
  if(!env.DB)return Response.json({error:'Prototype storage is unavailable.'},{status:503,headers});
  const rows=await env.DB.prepare('SELECT lesson, answers FROM lesson_progress WHERE learner = ?').bind(id).all<{lesson:string;answers:string}>();
  const progress=Object.fromEntries(rows.results.map(row=>{const answers=JSON.parse(row.answers);return [row.lesson,{answers,completed:Array.isArray(answers)&&answers.length===4}]}));
  return Response.json({progress},{headers});
 }catch(e){console.error('Prototype migration read failed',e);return Response.json({error:'Prototype progress could not be checked.'},{status:503,headers});}
}
