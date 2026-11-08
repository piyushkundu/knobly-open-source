// ── Typing App Data & Constants ──

export const FINGER_COLORS: Record<string, string> = {
  'left-pinky': '#ef4444', 'left-ring': '#f97316', 'left-middle': '#eab308', 'left-index': '#22c55e',
  'right-index': '#06b6d4', 'right-middle': '#3b82f6', 'right-ring': '#8b5cf6', 'right-pinky': '#ec4899',
  'thumb': '#64748b',
};

export const KEY_FINGER_MAP: Record<string, string> = {
  '`':'left-pinky','1':'left-pinky','2':'left-ring','3':'left-middle','4':'left-index','5':'left-index',
  '6':'right-index','7':'right-index','8':'right-middle','9':'right-ring','0':'right-pinky','-':'right-pinky','=':'right-pinky',
  'q':'left-pinky','w':'left-ring','e':'left-middle','r':'left-index','t':'left-index',
  'y':'right-index','u':'right-index','i':'right-middle','o':'right-ring','p':'right-pinky','[':'right-pinky',']':'right-pinky','\\':'right-pinky',
  'a':'left-pinky','s':'left-ring','d':'left-middle','f':'left-index','g':'left-index',
  'h':'right-index','j':'right-index','k':'right-middle','l':'right-ring',';':'right-pinky',"'":'right-pinky',
  'z':'left-pinky','x':'left-ring','c':'left-middle','v':'left-index','b':'left-index',
  'n':'right-index','m':'right-index',',':'right-middle','.':'right-ring','/':'right-pinky',
  ' ':'thumb',
};

export const KEYBOARD_ROWS = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['a','s','d','f','g','h','j','k','l',';',"'"],
  ['z','x','c','v','b','n','m',',','.','/'],
];

export interface Lesson {
  id: number; title: string; description: string; keys: string[]; exercises: string[];
}

export const LESSONS: Lesson[] = [
  { id:1,title:'Home Row Basics',description:'Learn home position keys',keys:['a','s','d','f','j','k','l',';'],exercises:['asdf jkl;','ff jj dd kk','asd fgh jkl','sad lad fall','ask dad flask'] },
  { id:2,title:'Home Row Words',description:'Common words with home row',keys:['a','s','d','f','g','h','j','k','l',';'],exercises:['fall glad half','had dash flash','glass salad flags','ask flask lads','shall add hall'] },
  { id:3,title:'E and I Keys',description:'Top row vowels E and I',keys:['e','i','a','s','d','f','g','h','j','k','l'],exercises:['die fie lie','like file side','life hide ride','field shield','slide glide inside'] },
  { id:4,title:'R and U Keys',description:'Reach for R and U',keys:['r','u','e','i','a','s','d','f','g','h','j','k','l'],exercises:['rule sure fire','rush fuel risk','figure desire','require sure','fur rug true'] },
  { id:5,title:'T and Y Keys',description:'Index finger reach',keys:['t','y','r','u','e','i','a','s','d','f','g','h','j','k','l'],exercises:['the they that','try yet yes','stayed style','still type right','pretty yesterday'] },
  { id:6,title:'W and O Keys',description:'Ring and middle fingers',keys:['w','o','t','y','r','u','e','i','a','s','d','f','g','h','j','k','l'],exercises:['work would world','write two show','follow yellow','window wood word','tower towel lower'] },
  { id:7,title:'Q and P Keys',description:'Pinky finger keys',keys:['q','p','w','o','t','y','r','u','e','i','a','s','d','f','g','h','j','k','l'],exercises:['quip quote poke','quick past quiet','equip display','pique opaque','equal people power'] },
  { id:8,title:'Bottom Row Left',description:'Z X C V keys',keys:['z','x','c','v','q','p','w','o','t','y','r','u','e','i','a','s','d','f','g','h','j','k','l'],exercises:['voice exact civic','exceed vaccine','cave gave active','excite vaccine','exact voice vivid'] },
  { id:9,title:'Bottom Row Right',description:'B N M keys',keys:['b','n','m','z','x','c','v'],exercises:['number maybe name','bank menu bench','never matter','bonus minimum','mobile manner noble'] },
  { id:10,title:'Full Alphabet',description:'All letters together',keys:[],exercises:['the quick brown fox jumps','over the lazy sleeping dog','pack my box with five','dozen liquor jugs quickly','amazing boxing wizard'] },
  { id:11,title:'Numbers Row',description:'Number keys practice',keys:['1','2','3','4','5','6','7','8','9','0'],exercises:['123 456 789 0','10 20 30 40 50','1984 2025 3000','55 66 77 88 99','112233 445566'] },
  { id:12,title:'Symbols',description:'Punctuation practice',keys:[',','.',';','-','='],exercises:['hello, world.','one; two; three;','well-known self-made','1 + 2 = 3','price: $5.99'] },
];

export const PRACTICE_TEXTS = [
  'The quick brown fox jumps over the lazy dog near the river bank.',
  'Programming is the art of telling a computer what to do step by step.',
  'Practice makes perfect when you dedicate time to learning new skills.',
  'Technology changes fast but the fundamentals remain the same always.',
  'A journey of a thousand miles begins with a single step forward.',
  'Education is the most powerful weapon which you can use to change the world.',
  'The best way to predict the future is to create it with your own hands.',
  'Success is not final and failure is not fatal it is courage to continue.',
  'In the middle of difficulty lies opportunity for those who seek it.',
  'Knowledge is power but enthusiasm pulls the switch to turn it on.',
];

export const GAME_WORDS = [
  'the','and','for','are','but','not','you','all','can','had','her','was','one','our','out',
  'day','get','has','him','his','how','its','may','new','now','old','see','way','who','did',
  'code','type','fast','word','fire','game','play','star','beat','race','jump','flow','glow',
  'swift','quick','blaze','power','speed','timer','score','level','bonus','combo','ultra',
  'python','coding','master','typing','rocket','stream','bright','shadow','energy','matrix',
  'keyboard','program','quantum','digital','thunder','phoenix','pioneer','crystal','dynamic',
];

export interface TypingStats {
  totalWordsTyped: number; totalCharsTyped: number; totalErrors: number; bestWpm: number;
  totalTestsTaken: number; lessonsCompleted: number[]; totalPracticeTime: number;
  keyErrors: Record<string, number>; keyHits: Record<string, number>;
  dailyStreak: number; lastPracticeDate: string; achievements: string[];
  gamesPlayed: number; highScore: number;
}

export const DEFAULT_STATS: TypingStats = {
  totalWordsTyped:0,totalCharsTyped:0,totalErrors:0,bestWpm:0,
  totalTestsTaken:0,lessonsCompleted:[],totalPracticeTime:0,
  keyErrors:{},keyHits:{},dailyStreak:0,lastPracticeDate:'',
  achievements:[],gamesPlayed:0,highScore:0,
};

export interface Achievement { id:string; title:string; description:string; icon:string; condition:(s:TypingStats)=>boolean; }

export const ACHIEVEMENTS: Achievement[] = [
  { id:'first_lesson',title:'First Steps',description:'Complete first lesson',icon:'ph-bold ph-baby',condition:s=>s.lessonsCompleted.length>=1 },
  { id:'five_lessons',title:'Dedicated Learner',description:'Complete 5 lessons',icon:'ph-bold ph-book-open',condition:s=>s.lessonsCompleted.length>=5 },
  { id:'all_lessons',title:'Curriculum Master',description:'Complete all 12 lessons',icon:'ph-bold ph-graduation-cap',condition:s=>s.lessonsCompleted.length>=12 },
  { id:'wpm_30',title:'Getting Speed',description:'Reach 30 WPM',icon:'ph-bold ph-gauge',condition:s=>s.bestWpm>=30 },
  { id:'wpm_50',title:'Speed Demon',description:'Reach 50 WPM',icon:'ph-bold ph-lightning',condition:s=>s.bestWpm>=50 },
  { id:'wpm_80',title:'Typing Thunder',description:'Reach 80 WPM',icon:'ph-bold ph-rocket',condition:s=>s.bestWpm>=80 },
  { id:'wpm_100',title:'Legendary Fingers',description:'Reach 100 WPM',icon:'ph-bold ph-crown',condition:s=>s.bestWpm>=100 },
  { id:'words_500',title:'Word Warrior',description:'Type 500 words',icon:'ph-bold ph-sword',condition:s=>s.totalWordsTyped>=500 },
  { id:'words_2000',title:'Word Master',description:'Type 2000 words',icon:'ph-bold ph-trophy',condition:s=>s.totalWordsTyped>=2000 },
  { id:'game_play',title:'Game On',description:'Play first game',icon:'ph-bold ph-game-controller',condition:s=>s.gamesPlayed>=1 },
  { id:'high_score_500',title:'High Scorer',description:'Score 500+ in game',icon:'ph-bold ph-star',condition:s=>s.highScore>=500 },
  { id:'test_5',title:'Test Veteran',description:'Take 5 tests',icon:'ph-bold ph-exam',condition:s=>s.totalTestsTaken>=5 },
  { id:'streak_3',title:'On Fire',description:'3-day streak',icon:'ph-bold ph-fire',condition:s=>s.dailyStreak>=3 },
  { id:'streak_7',title:'Week Warrior',description:'7-day streak',icon:'ph-bold ph-flame',condition:s=>s.dailyStreak>=7 },
];

export function getTypingLevel(wpm:number) {
  if(wpm<15) return {level:'Beginner',color:'#94a3b8',progress:(wpm/15)*100};
  if(wpm<30) return {level:'Novice',color:'#22c55e',progress:((wpm-15)/15)*100};
  if(wpm<50) return {level:'Intermediate',color:'#3b82f6',progress:((wpm-30)/20)*100};
  if(wpm<70) return {level:'Advanced',color:'#8b5cf6',progress:((wpm-50)/20)*100};
  if(wpm<100) return {level:'Expert',color:'#f59e0b',progress:((wpm-70)/30)*100};
  return {level:'Legend',color:'#ef4444',progress:100};
}

export function getCertificate(wpm:number) {
  if(wpm>=60) return {tier:'Gold',color:'#fbbf24',bg:'linear-gradient(135deg,#92400e,#fbbf24)'};
  if(wpm>=30) return {tier:'Silver',color:'#cbd5e1',bg:'linear-gradient(135deg,#475569,#cbd5e1)'};
  if(wpm>=15) return {tier:'Bronze',color:'#f97316',bg:'linear-gradient(135deg,#7c2d12,#f97316)'};
  return null;
}

// ── Persistent AudioContext for ZERO-LAG sound ──
let _audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return _audioCtx;
  } catch { return null; }
}

export function playKeySound(correct: boolean) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = correct ? 800 : 300;
  osc.type = correct ? 'sine' : 'square';
  gain.gain.value = 0.04;
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.stop(ctx.currentTime + 0.06);
}
