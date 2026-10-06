export type Slot = {id:string; date:string; start:string; end:string};
export type Poll = {id:string; title:string; project:string; organizer:string; slots:Slot[]; confirmed?:string; ownerId?:string; projectId?:string};
export type Answer = {uid?:string;name:string; choices:Record<string,string>};
export const projects = ["バンド練習", "ライブ準備", "新規プロジェクト"];
export function dateKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
export function monday(date:Date){const d=new Date(date);d.setDate(d.getDate()-((d.getDay()+6)%7));return d;}
export function dayLabel(date:string){return new Date(date+"T12:00:00").toLocaleDateString("ja-JP",{month:"numeric",day:"numeric",weekday:"short"});}
