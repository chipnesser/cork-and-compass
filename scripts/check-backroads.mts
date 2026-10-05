import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {lessons,allLessons,backroadsLessons,byId,completeIds,backroadsCompleteIds,backroadsOpen,isOpen,tastingCount} from '../lib/curriculum.ts';
import {backroadsGroups} from '../lib/backroads.ts';
import {sources} from '../lib/sources.ts';
import {emptyState,recordAnswer,parseState,readLocal,updateLocal,acknowledgeCoreCompletion} from '../lib/progress.ts';
assert.equal(lessons.length,40);assert.equal(backroadsLessons.length,20);assert.equal(allLessons.length,60);
assert.equal(new Set(allLessons.map(l=>l.id)).size,60);
for(const group of backroadsGroups)assert.equal(backroadsLessons.filter(l=>l.chapter===group.id).length,5);
for(const l of backroadsLessons){
 assert.equal(l.collection,'backroads');assert.equal(l.sentences.length,4);assert.equal(l.questions.length,4);
 assert.ok(l.sentences.join(' ').split(/\s+/).length<=125,`${l.id} exceeds short lesson length`);
 assert.ok(l.visual.labels.length>=2);assert.ok(l.takeaway&&l.centralIdea);
 assert.ok(l.sources.length);for(const source of l.sources)assert.ok(sources[source],source);
 for(const id of [...l.relatedLessons,...l.prerequisites.all,...l.prerequisites.any])assert.ok(byId[id]&&id!==l.id,id);
 for(const q of l.questions){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<3);assert.ok(q.why.length>10)}
 assert.equal(isOpen(l,{}),false);assert.throws(()=>recordAnswer(emptyState(),l.id,0,0));
}
let state=emptyState();state.migrationChecked=true;
let beforeUnlock=state;
while(completeIds(state.progress).length<40){
 const l=lessons.find(l=>!state.progress[l.id]?.completed&&isOpen(l,state.progress))!;
 for(let i=0;i<4;i++){
  if(completeIds(state.progress).length===39&&i===3)beforeUnlock=structuredClone(state);
  state=recordAnswer(state,l.id,i,l.questions[i].correct);
 }
 if(completeIds(state.progress).length<40){assert.equal(backroadsOpen(state.progress),false);for(const detour of backroadsLessons)assert.equal(isOpen(detour,state.progress),false)}
}
assert.ok(state.coreCompletion);const old=structuredClone(state);delete old.coreCompletion;
assert.equal(backroadsOpen(parseState(JSON.stringify(old)).progress),true,'Old 40/40 learner must unlock without a badge requirement');
state=acknowledgeCoreCompletion(state);
const coreSnapshot=structuredClone(state);
let data=JSON.stringify(state);const storage={getItem:()=>data,setItem:(_key:string,value:string)=>{data=value}};
// Every optional lesson is open immediately; reverse order proves no linear dependency.
for(const l of [...backroadsLessons].reverse()){
 assert.equal(isOpen(l,state.progress),true);
 for(let i=0;i<4;i++){
  state=updateLocal(storage,s=>recordAnswer(s,l.id,i,l.questions[i].correct));
  state=readLocal(storage);assert.equal(state.progress[l.id].answers.length,i+1);
 }
 assert.equal(completeIds(state.progress).length,40);assert.equal(tastingCount(state.progress),8);
 assert.deepEqual(state.coreCompletion,coreSnapshot.coreCompletion);
 assert.deepEqual(state.milestones,coreSnapshot.milestones);assert.deepEqual(state.tastings,coreSnapshot.tastings);
 assert.deepEqual(state.completionOrder,coreSnapshot.completionOrder);
 for(const l of lessons)assert.deepEqual(state.progress[l.id],coreSnapshot.progress[l.id]);
}
assert.equal(backroadsCompleteIds(state.progress).length,20);
const replay=recordAnswer(state,backroadsLessons[0].id,0,0);assert.deepEqual(replay,state);
const forged={...beforeUnlock.progress,[backroadsLessons[0].id]:state.progress[backroadsLessons[0].id]};
assert.equal(isOpen(backroadsLessons[0],forged),false,'Backroads credit cannot bypass core gate');
console.log('PASS 40 core + 20 Backroads, 80 new questions, 39/40 lock, 40/40 unlock, old saves, reverse-order completion, answer reloads, core badge/date/tastings untouched.');
if(process.argv.includes('--fixtures'))writeFileSync(process.argv[process.argv.indexOf('--fixtures')+1],JSON.stringify({fresh:emptyState(),beforeUnlock,existing:old,unlocked:coreSnapshot,finished:state,plan:backroadsLessons.map(l=>({id:l.id,title:l.title,answers:l.questions.map(q=>q.correct)}))}));
