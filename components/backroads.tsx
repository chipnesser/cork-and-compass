'use client';
import {Check,Compass,ChevronLeft} from 'lucide-react';
import {backroadsLessons,backroadsGroups} from '../lib/backroads';
import type {Progress} from '../lib/model';
import {backroadsCompleteIds,backroadsOpen} from '../lib/curriculum';

export function Backroads({progress,onStart,onBack}:{progress:Progress;onStart:(id:string)=>void;onBack:()=>void}){
 if(!backroadsOpen(progress))return <section className="backroads-page"><h1 tabIndex={-1}>A trail for later.</h1><p>Backroads opens after the 40 core lessons.</p><button className="text-button" onClick={onBack}>Back to the core trail</button></section>;
 const explored=backroadsCompleteIds(progress).length;
 return <section className="backroads-page">
  <button className="text-button" onClick={onBack}><ChevronLeft size={18}/> Back to the core trail</button>
  <div className="backroads-heading"><span className="eyebrow">CORE TRAIL COMPLETE · THE REST IS CURIOSITY</span><h1 tabIndex={-1}>Backroads</h1><p className="backroads-tagline">20 more places worth getting lost.</p><p>The original trail taught you how to navigate wine.<br/>Here’s where things get interesting.</p><div className="backroads-fern"><img src="/frog.png" alt="Fern, your Backroads guide"/><p>“Okay. You want the weird stuff.”<small>— Fern, taking the scenic route</small></p></div></div>
  <div className="backroads-note"><Compass size={21}/><p>You finished Cork &amp; Compass. Everything from here is because you’re curious.<small>{explored===20?'You’ve wandered all 20 detours. Take a favorite story to the table.':`${explored} of 20 optional detours explored. Pick any signpost; there’s no required order.`}</small></p></div>
  <div className="backroads-groups">{backroadsGroups.map(group=><section key={group.id} className="backroads-group"><h2>{group.title}</h2><p>{group.note}</p><div className="backroads-stops">{backroadsLessons.filter(l=>l.chapter===group.id).map(l=>{
   const record=progress[l.id];
   return <button key={l.id} className={`backroads-stop ${record?.completed?'explored':''}`} onClick={()=>onStart(l.id)}><span className="backroads-marker" aria-hidden="true">{record?.completed?<Check size={17}/>:<Compass size={17}/>}</span><span><strong>{l.title}</strong><small>{l.centralIdea}</small><em>{record?.completed?'Revisit':record?.answers.length?'Resume':'Wander here'} · 4–6 min</em></span></button>;
  })}</div></section>)}</div>
  <p className="backroads-end">No extra credential. No deadline. A few more good stories for dinner.</p>
 </section>;
}
