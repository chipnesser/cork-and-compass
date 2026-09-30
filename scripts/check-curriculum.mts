import {experiences,vistas,restSuggestion} from '../lib/experiences.ts';
import assert from 'node:assert/strict';
import {lessons,byId,chapters,paths,isOpen,completeIds,tastingCount,connectionIds,suggested} from '../lib/curriculum.ts';
import {tastings} from '../lib/tastings.ts';
import {sources} from '../lib/sources.ts';
import {emptyState,parseState,recordAnswer,recordTasting,importLegacy,readLocal,updateLocal} from '../lib/progress.ts';
import type {Progress} from '../lib/model.ts';
assert.equal(lessons.length,40);assert.equal(new Set(lessons.map(l=>l.id)).size,40);
for(const ch of chapters)assert.equal(lessons.filter(l=>l.chapter===ch.id).length,5);
for(const l of lessons){
 assert.ok(l.centralIdea&&l.takeaway&&l.visual.labels.length>=2,l.id);
 assert.equal(l.sentences.length,4,l.id);assert.equal(l.questions.length,4,l.id);
 assert.ok(l.sentences.join(' ').split(/\s+/).length<=105,`Teaching too long: ${l.id}`);
 assert.ok(connectionIds(l).length>=2,l.id);
 for(const id of [...l.prerequisites.all,...l.prerequisites.any,...l.relatedLessons])assert.ok(byId[id]&&id!==l.id,`${l.id} has bad edge ${id}`);
 for(const t of l.tastingConnections)assert.ok(tastings.some(x=>x.id===t));
 for(const id of l.sources)assert.ok(sources[id],`Missing source ${id}`);
 assert.ok(l.sources.length>0);
 for(const q of l.questions){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.ok(q.correct>=0&&q.correct<3);assert.ok(q.why.length>10)}
}
assert.equal(tastings.length,8);for(const t of tastings){assert.ok(t.wines.length>=2&&t.wines.length<=4);for(const id of t.relatedLessons)assert.ok(byId[id])}
// Every order preference must eventually reach all nodes. Nothing waits for a tasting.
for(const preference of ['place','grape','technique','reverse','seeded']){
 let state=emptyState(),step=0;const order:string[]=[];
 while(completeIds(state.progress).length<40){
  const open=lessons.filter(l=>!state.progress[l.id]?.completed&&isOpen(l,state.progress));assert.ok(open.length,`Dead end in ${preference}`);
  if(preference==='reverse')open.reverse();
  else if(preference==='seeded')open.sort((a,b)=>((lessons.indexOf(a)*17+step)%41)-((lessons.indexOf(b)*17+step)%41));
  else open.sort((a,b)=>Number(b.axis===preference)-Number(a.axis===preference));
  const l=open[0];order.push(l.id);
  for(let i=0;i<4;i++){
   state=recordAnswer(parseState(JSON.stringify(state)),l.id,i,l.questions[i].correct);
   assert.equal(state.progress[l.id].completed,i===3);
   assert.deepEqual(parseState(JSON.stringify(state)),state);
  }
  step++;assert.equal(tastingCount(state.progress),Math.floor(step/5));assert.equal(Object.keys(state.milestones).length,Math.floor(step/5));assert.equal(Object.keys(state.tastings).length,0);
 }
 assert.equal(Object.values(state.milestones)[0].templateId,'tasting-1');
 assert.equal(new Set(Object.values(state.milestones).map(m=>m.templateId)).size,8);
 for(let n=1;n<=8;n++){
  assert.throws(()=>recordTasting(state,`token-${n}`,'completed'));
  state=recordTasting(state,`token-${n}`,'available');state=recordTasting(state,`token-${n}`,'completed');
 }
 assert.equal(Object.values(state.tastings).filter(t=>t.status==='completed').length,8);
 const before=completeIds(state.progress);state=recordTasting(state,'token-8','available');assert.deepEqual(completeIds(state.progress),before);
 console.log(`PASS full fresh journey: ${preference}, 160 answer saves/reloads, 8 independent tastings`);
}
// ALL + ANY join semantics: texture is reached through Chardonnay or oak after fermentation.
const credit=(ids:string[]):Progress=>Object.fromEntries(ids.map(id=>[id,{answers:[],completed:true,revision:2,legacyCredit:true}]));
assert.equal(isOpen(byId.malo,credit(['fermentation'])),false);
assert.equal(isOpen(byId.malo,credit(['chardonnay'])),false);
assert.equal(isOpen(byId.malo,credit(['fermentation','chardonnay'])),true);
assert.equal(isOpen(byId.malo,credit(['fermentation','oak'])),true);
assert.ok(connectionIds(byId.burgundy).includes('chardonnay'));assert.ok(connectionIds(byId.oak).includes('chardonnay'));
assert.ok(suggested('grape',credit(['france']),'france').some(l=>l.id==='chardonnay'));
assert.ok(paths.every(p=>byId[p.entry]));
// Reachable frontier must always be accessible through the map, regardless of path filter.
assert.throws(()=>recordAnswer(emptyState(),'france',0,0));assert.throws(()=>recordTasting(emptyState(),'token-1','available'));
const state=recordAnswer(emptyState(),'welcome',0,0);assert.equal(state.progress.welcome.answers.length,1);
assert.deepEqual(recordAnswer(state,'welcome',0,0),state);assert.throws(()=>recordAnswer(state,'welcome',0,1));assert.throws(()=>recordAnswer(state,'welcome',3,0));
assert.throws(()=>parseState('{bad'));assert.throws(()=>parseState('{"version":999}'));
const legacy=Object.fromEntries(['welcome','taste','color','labels','service','france','new-zealand','pinot','fermentation'].map(id=>[id,{answers:[0,0,0,0],completed:true}]));
const imported=importLegacy(emptyState(),legacy);assert.equal(completeIds(imported.progress).length,9);assert.equal(tastingCount(imported.progress),1);assert.deepEqual(importLegacy(imported,legacy),imported);assert.deepEqual(imported.legacy,legacy);
let data:string|null=null;const storage={getItem:()=>data,setItem:(_key:string,value:string)=>{data=value}};
updateLocal(storage,s=>recordAnswer(s,'welcome',0,1));assert.equal(readLocal(storage).progress.welcome.answers[0],1);
const kept=data;assert.throws(()=>updateLocal({getItem:()=>data,setItem:()=>{throw new Error('Quota')}},s=>recordAnswer(s,'welcome',1,1)));assert.equal(data,kept);
console.log('PASS schema, graph joins, blocked prerequisites, local persistence, retry/conflict handling, corrupt-storage protection, legacy migration, storage failure.');

// Quiet experiences are valid optional content, never gates or progress records.
for(const [id,experience] of Object.entries(experiences)){
 assert.ok(byId[id],`Unknown experience lesson ${id}`);
 for(const vistaId of experience.vistaIds||[]){
  const vista=vistas[vistaId];assert.ok(vista,`Unknown vista ${vistaId}`);
  for(const field of ['image','alt','caption','photographer','source','license','sourceUrl'] as const)assert.ok(vista[field]);
 }
}
assert.equal(restSuggestion(0),undefined);assert.equal(restSuggestion(2),undefined);
assert.ok(restSuggestion(3));assert.equal(restSuggestion(4),undefined);assert.ok(restSuggestion(6));
console.log('PASS optional vistas and attribution, experience references, session-only rest cadence.');
