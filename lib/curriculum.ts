import {backroadsLessons} from './backroads.ts';
import {graph,chapters,paths} from './graph.ts';
import {experiences} from './experiences.ts';
import {content} from './content.ts';
import type {Lesson, Progress, Axis} from './model.ts';
export type * from './model.ts';
export {chapters,paths};
export const lessons:Lesson[]=graph.map(node=>{
 if(!content[node.id])throw new Error(`Missing content for ${node.id}`);
 return {...node,...content[node.id],...experiences[node.id]};
});
// Keep `lessons` and `completeIds` core-only: badges, eight tastings, and the
// original map must retain their meaning as optional collections are added.
export {backroadsLessons};
export const allLessons=[...lessons,...backroadsLessons];
export const byId:Record<string,Lesson>=Object.fromEntries(allLessons.map(l=>[l.id,l]));
export const backroadsCompleteIds=(p:Progress)=>backroadsLessons.filter(l=>p[l.id]?.completed).map(l=>l.id);
export const backroadsOpen=(p:Progress)=>completeIds(p).length===lessons.length;
export const completeIds=(p:Progress)=>lessons.filter(l=>p[l.id]?.completed).map(l=>l.id);
export const isOpen=(l:Lesson,p:Progress)=>(l.collection!=='backroads'||backroadsOpen(p))&&(!!p[l.id]?.completed || (
 l.prerequisites.all.every(id=>p[id]?.completed) &&
 (!l.prerequisites.any.length||l.prerequisites.any.some(id=>p[id]?.completed))
));
export const tastingCount=(p:Progress)=>Math.min(8,Math.floor(completeIds(p).length/5));
export const connectionIds=(l:Lesson)=>Array.from(new Set([...l.relatedLessons,...l.prerequisites.all,...l.prerequisites.any, ...lessons.filter(other=>other.relatedLessons.includes(l.id)||other.prerequisites.all.includes(l.id)||other.prerequisites.any.includes(l.id)).map(other=>other.id)])).filter(id=>id!==l.id);
export function suggested(axis:Axis,p:Progress,from?:string):Lesson[]{
 const source=from?byId[from]:undefined;
 const related=source?connectionIds(source):[];
 const entry=paths.find(path=>path.axis===axis)?.entry;
 return lessons.filter(l=>isOpen(l,p)&&!p[l.id]?.completed&&l.chapter>1&&(l.axis===axis||l.secondaryConnections.includes(axis)))
 .sort((a,b)=>Number(related.includes(b.id))-Number(related.includes(a.id))||Number(b.id===entry)-Number(a.id===entry)||Number(b.axis===axis)-Number(a.axis===axis)||lessons.indexOf(a)-lessons.indexOf(b));
}
export function lockReason(l:Lesson,p:Progress){
 if(l.collection==='backroads'&&!backroadsOpen(p))return 'Complete the 40 core lessons to open Backroads.';
 const all=l.prerequisites.all.filter(id=>!p[id]?.completed).map(id=>byId[id].title);
 const any=l.prerequisites.any.length&&!l.prerequisites.any.some(id=>p[id]?.completed)?l.prerequisites.any.map(id=>byId[id].title):[];
 return [all.length?`Finish ${all.join(' + ')}.`:'',any.length?`Then finish any one: ${any.join(' / ')}.`:''].filter(Boolean).join(' ');
}
