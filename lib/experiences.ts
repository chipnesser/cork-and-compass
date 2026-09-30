import type {LessonExperience, Vista} from './model.ts';

// Deliberate placeholders: no third-party photography is fetched or implied.
// Replace image/alt and attribution together after checking reuse rights.
export const vistas: Record<string, Vista> = Object.fromEntries([
 ['burgundy','Burgundy','Vineyards, villages, and a little room to look.'],
 ['mosel','Mosel','Imagine the river turning beneath the vines.'],
 ['douro','Douro','Terraces following the folds of a valley.'],
 ['marlborough','Marlborough','A little space between the vines and the mountains.'],
 ['mendoza','Mendoza','Vineyards with the Andes for company.'],
 ['piedmont','Piedmont','One hill beyond another. No quiz here.'],
 ['willamette','Willamette Valley','A quiet stretch of the wine world.'],
 ['champagne','Champagne','Before the bubbles, a place.'],
].map(([id,title,caption])=>[id,{
 id,title,caption,image:'/vista-placeholder.svg',
 alt:`Abstract landscape placeholder for ${title}; not a photograph of the region.`,
 photographer:'Cork & Compass',source:'Original abstract placeholder illustration',
 license:'MIT',sourceUrl:'/vista-placeholder.svg',placeholder:true,
}]));

export const experiences: Record<string, LessonExperience> = {
 burgundy:{vistaIds:['burgundy']},
 'germany-austria':{vistaIds:['mosel']},
 spain:{vistaIds:['douro']},
 pacific:{vistaIds:['marlborough','willamette']},
 southern:{vistaIds:['mendoza']},
 italy:{vistaIds:['piedmont']},
 champagne:{vistaIds:['champagne']},
 sweetness:{fieldAssignment:'Next time you share a glass, ask what the other person notices before saying what you notice. There is no answer key at dinner.'},
 france:{fieldAssignment:'Open something unfamiliar with a friend, whenever it suits you. Being curious together is quite enough.'},
 preferences:{fieldAssignment:'Two people can taste the same wine differently. That’s not a bug. Ask someone what they enjoy, and listen for the surprise.'},
 'floor-mixed':{fieldAssignment:'Put the phone away and share something at the table. A conversation counts for more than a tasting vocabulary.'},
};
export const restNotes = [
 'That’s plenty for today. Wine isn’t improved by cramming.',
 'Rest day. The vines aren’t going anywhere.',
 'You’ve done enough homework. Go have dinner.',
];
// Session-only: no daily target, streak, clock, reminder, or persisted obligation.
export function restSuggestion(sessionCompletions:number):string|undefined {
 return sessionCompletions>0&&sessionCompletions%3===0
  ?restNotes[(sessionCompletions/3-1)%restNotes.length]:undefined;
}
export const sharingNote='Have a glass with someone, if you feel like it. Ask what they notice before telling them what you’re supposed to notice. Sharing a meal or simply talking works too.';
