'use client';
import {useEffect,useRef} from 'react';
import type {CoreCompletion} from '../lib/model';

export function CoreCompletionDialog({badge,onClose,onExplore,error}:{badge:CoreCompletion;onClose:()=>void;onExplore?:()=>void;error:string}){
 const dialog=useRef<HTMLDialogElement>(null);
 const celebrate=!badge.celebrationSeen;
 useEffect(()=>{
  const element=dialog.current,previous=document.activeElement as HTMLElement|null;
  element?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{element?.close();document.body.style.overflow=overflow;previous?.focus()};
 },[]);
 return <dialog ref={dialog} className={`core-completion ${celebrate?'celebrate':''}`} aria-labelledby="core-title" onCancel={event=>{event.preventDefault();onClose()}}>
  {celebrate&&<div className="core-confetti" aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i} style={{left:`${5+i*5}%`,animationDelay:`${i%5*.12}s`,background:['#e7ed9b','#72394d','#678345'][i%3]}}/>)}</div>}
  <div className="core-content">
   {/* Keep Fern's original artwork and rendering. */}
   {/* eslint-disable-next-line @next/next/no-img-element */}
   <img src="/frog.png" alt={celebrate?'Fern celebrating your completed trail':'Fern, your field guide'} className="core-fern"/>
   {celebrate&&<><h1>You followed the whole trail.</h1><p>Forty little hops. One much wider world.<br/>I’d raise a glass, but these are very small frog hands.</p></>}
   <section className="core-award" aria-label="Core Trail completion badge">
    <span className="eyebrow">CORK &amp; COMPASS</span><span className="core-seal" aria-hidden="true">✧</span>
    <h2 id="core-title">CORE TRAIL COMPLETE</h2><p>40 lessons · 8 chapters</p><p>You followed the whole trail.</p>
    <p className="core-date">Completed <time dateTime={badge.completedAt}>{new Date(badge.completedAt).toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'})}</time></p>
   </section>
   <p className="core-keepsake">Your badge is saved with your field notes. Find it anytime on My journey.</p>
   {onExplore&&<div className="core-backroads-invite"><span className="eyebrow">BACKROADS — 20 MORE PLACES WORTH GETTING LOST.</span><p>You finished the course. Everything from here is because you’re curious.</p><button className="text-button" onClick={onExplore}>Take a look at Backroads <span aria-hidden="true">↗</span></button></div>}
   {error&&<p role="alert">{error}</p>}
   <button autoFocus className="primary" onClick={onClose}>{celebrate?'A very good place to pause':'Back to my journey'}</button>
  </div>
 </dialog>;
}
