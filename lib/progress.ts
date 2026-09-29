import {byId,isOpen,completeIds,tastingCount} from './curriculum.ts';
import {tastings} from './tastings.ts';
import type {SavedState,TastingState} from './model.ts';
export const STORAGE_KEY='cork-compass:beta:v2';
export const emptyState=():SavedState=>({version:2,progress:{},tastings:{},migrationChecked:false,completionOrder:[],milestones:{}});
const legacyMap:Record<string,string>={welcome:'welcome',taste:'structure',color:'skin-aging',labels:'labels',service:'preferences',france:'france','new-zealand':'southern',pinot:'pinot',fermentation:'fermentation'};
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function reconcile(input:SavedState):SavedState{
 const state=structuredClone(input);
 const completed=completeIds(state.progress);
 state.completionOrder=[...new Set([...state.completionOrder.filter(id=>completed.includes(id)),...completed])];
 for(let number=1;number<=tastingCount(state.progress);number++){
  const id=`token-${number}`;
  if(state.milestones[id])continue;
  const recent=state.completionOrder.slice((number-1)*5,number*5);
  const used=Object.values(state.milestones).map(m=>m.templateId);
  const candidates=tastings.filter(t=>!used.includes(t.id));
  const score=(t:typeof tastings[number])=>recent.reduce((sum,lid)=>sum+(t.relatedLessons.includes(lid)?5:0)+(byId[lid]?.axis===t.axis?1:0),0);
  const template=number===1?tastings[0]:candidates.sort((a,b)=>score(b)-score(a)||a.number-b.number)[0];
  if(template)state.milestones[id]={templateId:template.id,earnedAfter:recent};
 }
 return state;
}
export function parseState(raw:string|null):SavedState{
 if(raw===null)return emptyState();
 let value:unknown;
 try{value=JSON.parse(raw)}catch{throw new Error('Saved progress could not be read. Your existing data has been kept; reload or ask for help before changing it.')}
 if(!object(value)||value.version!==2||!object(value.progress)||!object(value.tastings))throw new Error('This saved-progress format is not supported. The existing data has been kept.');
 const state=emptyState();state.migrationChecked=value.migrationChecked===true;state.legacy=value.legacy;
 for(const [id,v] of Object.entries(value.progress)){
  if(!byId[id])continue;
  if(!object(v)||!Array.isArray(v.answers)||v.revision!==2||!v.answers.every((a,i)=>Number.isInteger(a)&&i<4&&a>=0&&a<byId[id].questions[i].options.length))throw new Error('A saved lesson needs recovery. Your original progress has not been overwritten.');
  const credited=v.legacyCredit===true&&v.completed===true;
  state.progress[id]={answers:v.answers as number[],completed:credited||v.answers.length===4,revision:2,...(credited?{legacyCredit:true}:{})};
 }
 state.completionOrder=Array.isArray(value.completionOrder)?value.completionOrder.filter((id):id is string=>typeof id==='string'):[];
 const used=new Set<string>();
 if(object(value.milestones))for(let n=1;n<=tastingCount(state.progress);n++){
  const m=value.milestones[`token-${n}`];
  if(object(m)&&typeof m.templateId==='string'&&tastings.some(t=>t.id===m.templateId)&&!used.has(m.templateId)&&Array.isArray(m.earnedAfter)){
   state.milestones[`token-${n}`]={templateId:m.templateId,earnedAfter:m.earnedAfter.filter((id):id is string=>typeof id==='string'&&!!byId[id])};used.add(m.templateId);
  }
 }
 for(let n=1;n<=tastingCount(state.progress);n++){
  const id=`token-${n}`,v=value.tastings[id];
  if(object(v)&&['unlocked','available','completed'].includes(String(v.status)))state.tastings[id]={status:v.status as TastingState,updatedAt:typeof v.updatedAt==='string'?v.updatedAt:''};
 }
 return reconcile(state);
}
export function importLegacy(state:SavedState,legacy:unknown):SavedState{
 const next=structuredClone(state);next.legacy=legacy;next.migrationChecked=true;
 if(!object(legacy))return next;
 for(const [oldId,v] of Object.entries(legacy)){
  const id=legacyMap[oldId];
  if(id&&object(v)&&v.completed===true&&!next.progress[id]?.completed){
   next.progress[id]={answers:[],completed:true,revision:2,legacyCredit:true};next.completionOrder.push(id);
  }
 }
 return reconcile(next);
}
export function recordAnswer(state:SavedState,id:string,index:number,answer:number):SavedState{
 const l=byId[id];if(!l||!isOpen(l,state.progress))throw new Error('Finish the prerequisite lesson first.');
 if(!Number.isInteger(index)||index<0||index>=l.questions.length||!Number.isInteger(answer)||answer<0||answer>=l.questions[index].options.length)throw new Error('Choose one of the answers.');
 const previous=state.progress[id];
 if(previous?.completed)return state;
 const answers=previous?.answers||[];
 if(index<answers.length){if(answers[index]===answer)return state;throw new Error('This answer changed in another tab. Reopen the lesson to use the saved progress.');}
 if(index!==answers.length)throw new Error('This lesson changed in another tab. Reopen it to continue.');
 const next=structuredClone(state);const updated=[...answers,answer];
 next.progress[id]={answers:updated,completed:updated.length===4,revision:2};
 if(updated.length===4)next.completionOrder.push(id);
 return reconcile(next);
}
export function recordTasting(state:SavedState,id:string,status:TastingState):SavedState{
 const n=Number(id.replace('token-',''));
 if(id!==`token-${n}`||!Number.isInteger(n)||n<1||n>tastingCount(state.progress))throw new Error('This tasting has not unlocked yet.');
 const previous=state.tastings[id]?.status||'unlocked';
 const allowed:Record<TastingState,TastingState[]>={unlocked:['available'],available:['completed','unlocked'],completed:['available']};
 if(!allowed[previous].includes(status))throw new Error('Prepare this tasting before marking it complete.');
 const next=structuredClone(state);next.tastings[id]={status,updatedAt:new Date().toISOString()};return next;
}
export interface LocalStore {getItem(key:string):string|null; setItem(key:string,value:string):void;}
export const readLocal=(storage:LocalStore)=>parseState(storage.getItem(STORAGE_KEY));
export function updateLocal(storage:LocalStore,update:(state:SavedState)=>SavedState):SavedState{
 const next=update(readLocal(storage));
 try{storage.setItem(STORAGE_KEY,JSON.stringify(next))}catch{throw new Error('This browser could not save progress. Your answer is still here; allow local storage or free space, then retry.');}
 return next;
}
