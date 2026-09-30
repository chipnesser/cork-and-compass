import assert from 'node:assert/strict';
import {lessons,isOpen,completeIds} from '../lib/curriculum.ts';
import {emptyState,recordAnswer,awardCoreCompletion,acknowledgeCoreCompletion,parseState,readLocal,updateLocal} from '../lib/progress.ts';
let state=emptyState();state.migrationChecked=true;
let beforeLast=state;
while(completeIds(state.progress).length<40){
 const lesson=lessons.find(l=>!state.progress[l.id]?.completed&&isOpen(l,state.progress))!;
 for(let i=0;i<4;i++){
  if(completeIds(state.progress).length===39&&i===3)beforeLast=structuredClone(state);
  state=recordAnswer(state,lesson.id,i,lesson.questions[i].correct);
  if(completeIds(state.progress).length<40)assert.equal(state.coreCompletion,undefined);
 }
}
assert.ok(state.coreCompletion);assert.equal(state.coreCompletion.celebrationSeen,false);
const date=state.coreCompletion.completedAt;
assert.equal(JSON.stringify(parseState(JSON.stringify(state))),JSON.stringify(state));
const dismissed=acknowledgeCoreCompletion(state);
assert.equal(dismissed.coreCompletion?.celebrationSeen,true);
assert.equal(awardCoreCompletion(dismissed,'2099-01-01T00:00:00.000Z').coreCompletion?.completedAt,date);
assert.equal(JSON.stringify(parseState(JSON.stringify(dismissed))),JSON.stringify(dismissed));
const old=structuredClone(state);delete old.coreCompletion;
let data=JSON.stringify(old);
const storage={getItem:()=>data,setItem:(_key:string,value:string)=>{data=value}};
const migrated=updateLocal(storage,s=>awardCoreCompletion(s,'2026-09-30T12:00:00.000Z'));
assert.deepEqual(migrated.progress,old.progress);assert.deepEqual(migrated.tastings,old.tastings);
assert.deepEqual(migrated.milestones,old.milestones);assert.deepEqual(migrated.completionOrder,old.completionOrder);
assert.equal(readLocal(storage).coreCompletion?.completedAt,'2026-09-30T12:00:00.000Z');
updateLocal(storage,acknowledgeCoreCompletion);assert.equal(readLocal(storage).coreCompletion?.celebrationSeen,true);
assert.equal(awardCoreCompletion(emptyState()).coreCompletion,undefined);
const original=JSON.stringify(old);
assert.throws(()=>updateLocal({getItem:()=>original,setItem:()=>{throw Error('quota')}},awardCoreCompletion));
assert.equal(JSON.parse(original).coreCompletion,undefined);
console.log('PASS new 40/40, existing 40/40 migration, stable date, reopen/acknowledgement, progress preservation, save failure.');
// Optional fixtures for the local-only browser harness, never part of the app.
if(process.argv.includes('--fixtures')){
 const {writeFileSync}=await import('node:fs');
 writeFileSync(process.argv[process.argv.indexOf('--fixtures')+1],JSON.stringify({newLearner:beforeLast,existing:old}));
}
