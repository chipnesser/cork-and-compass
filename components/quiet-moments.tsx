'use client';
import {useEffect,useRef} from 'react';
import type {Vista} from '../lib/model';

export function FieldAssignment({text}:{text:string}){
 return <aside className="quiet-note"><span className="eyebrow">AN OPTIONAL FIELD ASSIGNMENT</span><p>{text}</p><small>No points. Nothing to submit. No need to report back.</small></aside>;
}
export function VistaViewer({vista,onClose}:{vista:Vista;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const element=dialog.current;
  const previous=document.activeElement as HTMLElement|null;
  element?.showModal();
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{element?.close();document.body.style.overflow=overflow;previous?.focus()};
 },[]);
 return <dialog ref={dialog} className="vista-dialog" aria-labelledby="vista-title" onCancel={onClose}>
  <button className="vista-close" autoFocus onClick={onClose} aria-label="Close vista">Back to wandering ×</button>
  {/* Native image preserves curated photography without an image processing service. */}
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img className="vista-image" src={vista.image} alt={vista.alt}/>
  <div className="vista-caption"><h2 id="vista-title">{vista.title}</h2><p>{vista.caption}</p>{vista.placeholder&&<small>Illustrated placeholder · photography to be curated</small>}
   <details><summary>Image credit</summary><p>{vista.photographer} · {vista.source} · {vista.license} · <a href={vista.sourceUrl} target="_blank" rel="noreferrer">Source</a></p></details>
  </div>
 </dialog>;
}
