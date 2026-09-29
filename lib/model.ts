export type Axis = 'place' | 'grape' | 'technique';
export type Prerequisites = { all: string[]; any: string[] };
export type Question = { prompt: string; options: string[]; correct: number; why: string };
export type LessonNode = {
  id: string; title: string; chapter: number; axis: Axis;
  secondaryConnections: Axis[]; prerequisites: Prerequisites;
  relatedLessons: string[]; tastingConnections: string[];
  kind: 'lesson' | 'scenario'; revision: number;
};
export type LessonContent = {
  subtitle: string; centralIdea: string; sentences: string[];
  visual: { kind: 'process'|'taste'|'color'|'labels'|'regions'|'flight'|'vine'|'ferment'; labels: string[] };
  takeaway: string; questions: Question[]; sources: string[];
};
export type Lesson = LessonNode & LessonContent;
export type LessonProgress = { answers: number[]; completed: boolean; revision: number; legacyCredit?: boolean };
export type Progress = Record<string, LessonProgress>;
export type TastingState = 'unlocked' | 'available' | 'completed';
export type TastingProgress = Record<string, {status:TastingState; updatedAt:string}>;
export type SavedState = {version:2; progress:Progress; tastings:TastingProgress; legacy?:unknown; migrationChecked:boolean; completionOrder:string[]; milestones:Record<string,{templateId:string; earnedAfter:string[]}>};
export type Tasting = {id:string; number:number; title:string; axis:Axis; wines:string[]; concept:string; prompts:string[]; preparation:string; relatedLessons:string[]};
