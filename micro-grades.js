/* V34 — Indicateur pédagogique calculé à partir des compteurs existants.
   Les combats, bonus et temps de jeu n'entrent pas dans la note. */
(function(root){
'use strict';
const count=n=>Number.isFinite(n)?Math.max(0,Math.min(1000000,Math.floor(n))):0;
function score(correct,answered){const a=Math.max(0,Number(answered)||0),c=Math.max(0,Number(correct)||0);return a>0?Math.round(200*Math.min(c,a)/a)/10:null}
function format(n){return n===null?'—':n.toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})+'/20'}
function summarize(profile,max){let correct=0,answered=0,worlds=0;for(let w=0;w<max;w++){const records=Object.values(profile?.records?.[w]||{});if(records.length)worlds++;for(const r of records){correct+=count(r?.correct);answered+=count(r?.answered)}for(const r of Object.values(profile?.runs||{})){if(r?.world===w){correct+=count(r.state?.firstCorrect);answered+=count(r.state?.crystals)}}}return {correct,answered,worlds,max}}
function label(d){const n=score(d?.correct,d?.answered);return n===null?'Pas encore de note':format(n)+(d.worlds<d.max?' · provisoire':' · indicative')}
root.MicroGrades={score,format,summarize,label};
})(globalThis);
