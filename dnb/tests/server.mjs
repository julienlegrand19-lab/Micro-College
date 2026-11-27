import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
const worker=(await import('data:text/javascript;base64,'+Buffer.from(readFileSync('school/worker-dnb-candidate.js','utf8')).toString('base64'))).default;
const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON');db.exec(readFileSync('school/schema.sql','utf8'));db.exec(readFileSync('school/migration-dnb.sql','utf8'));
class Statement{
 constructor(sql,values=[]){this.sql=sql;this.values=values}
 bind(...values){return new Statement(this.sql,values)}
 async first(){return db.prepare(this.sql).get(...this.values)||null}
 async all(){return {results:db.prepare(this.sql).all(...this.values)}}
 async run(){return {meta:{changes:Number(db.prepare(this.sql).run(...this.values).changes)}}}
}
const env={DB:{prepare:sql=>new Statement(sql),batch:async statements=>{db.exec('BEGIN');try{let out=[];for(let s of statements)out.push(await s.run());db.exec('COMMIT');return out}catch(e){db.exec('ROLLBACK');throw e}}},AUTH_PEPPER:'test-only-pepper-'.repeat(4),ADMIN_SECRET:'test-only-admin-'.repeat(3)};
async function call(path,method='GET',body,token,status=200){let headers={'Origin':'https://julienlegrand19-lab.github.io','CF-Connecting-IP':'127.0.0.1'};if(token)headers.Authorization='Bearer '+token;if(body!==undefined)headers['Content-Type']='application/json';let r=await worker.fetch(new Request('https://test.invalid'+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)}),env),data=await r.json();assert.equal(r.status,status,path+': '+JSON.stringify(data));return data}
let health=await call('/health');assert.equal(health.dnb,1);
await call('/teacher/dnb/results','GET',undefined,undefined,401);
await call('/teacher/dnb/roster','GET',undefined,undefined,401);
let admin=(await call('/teacher/login','POST',{password:env.ADMIN_SECRET})).token;
let pupil=await call('/teacher/students','POST',{pseudo:'TEST-DNB-01',classroom:'3 LYRA'},admin,201);
let second=await call('/teacher/students','POST',{pseudo:'TEST-DNB-02',classroom:'3 LYRA'},admin,201);
await call('/teacher/students','POST',{pseudo:'TEST-DNB-03',classroom:'3 LYRA'},admin,201);
await call('/teacher/students','POST',{pseudo:'TEST-4E',classroom:'4 MOREAU'},admin,201);
let initialRoster=(await call('/teacher/dnb/roster','GET',undefined,admin)).students;assert.equal(initialRoster.length,3);assert(initialRoster.every(s=>s.status==='none'&&s.completed===0));
let token=(await call('/student/login','POST',{name:pupil.name,password:pupil.password})).token;
let t2=(await call('/student/login','POST',{name:second.name,password:second.password})).token;
await call('/teacher/dnb/results','GET',undefined,token,401);
await call('/teacher/dnb/roster','GET',undefined,token,401);
let a=await call('/student/dnb/start','POST',{},token);
assert.equal(a.qs.length,24);assert.equal(a.finished,false);assert(a.qs.every(q=>!('expected'in q)&&!('solution'in q)&&!('hint'in q)));
let b=await call('/student/dnb/start','POST',{},t2);assert.notEqual(a.student,b.student);
let again=await call('/student/dnb/start','POST',{},token);assert.deepEqual(again.qs,a.qs);
let row=db.prepare('SELECT * FROM dnb_attempts WHERE student_id=?').get(a.student),keys=JSON.parse(row.questions).map(q=>q.expected.map(String));
await call('/student/dnb/save','PUT',{answers:[['bad']],at:0},token,400);
await call('/student/dnb/save','PUT',{answers:keys,at:12},token);
let saved=(await call('/student/dnb/attempt','GET',undefined,token)).attempt;assert.equal(saved.at,12);assert.deepEqual(saved.answers,keys);
assert((await call('/student/dnb/attempt','GET',undefined,t2)).attempt.answers.every(x=>x===null));
assert.equal((await call('/teacher/dnb/results','GET',undefined,admin)).reports.length,0);
let final=await call('/student/dnb/submit','POST',{answers:keys,at:23,total:999},token);assert.equal(final.finished,true);assert.equal(final.result.total,20);
await call('/student/dnb/save','PUT',{answers:keys.map(()=>null),at:0},token,409);
let duplicate=await call('/student/dnb/submit','POST',{answers:keys.map(()=>null),at:0},token);assert.equal(duplicate.result.total,20);
let reports=(await call('/teacher/dnb/results','GET',undefined,admin)).reports;assert.equal(reports.length,1);assert.equal(reports[0].classroom,'3 LYRA');assert.equal(reports[0].total,20);
let roster=(await call('/teacher/dnb/roster','GET',undefined,admin)).students;assert.equal(roster.length,3);assert.deepEqual(roster.map(s=>s.status).sort(),['none','started','submitted']);assert.equal(roster.find(s=>s.status==='submitted').completed,24);assert(roster.every(s=>!('answers' in s)&&!('expected' in s)));
let row2=db.prepare('SELECT * FROM dnb_attempts WHERE student_id=?').get(b.student),qs2=JSON.parse(row2.questions),keys2=qs2.map(q=>q.expected.map(String));
assert.equal(qs2.filter(q=>q.kind==='proof').length,12);
assert(b.qs.filter(q=>q.kind==='proof').every(q=>q.options.length===4&&!('expected'in q)));
let idx=qs2.findIndex(q=>q.kind==='proof');keys2[idx][0]='';let partial=await call('/student/dnb/submit','POST',{answers:keys2,at:23},t2);assert.equal(partial.result.total,20-3/16);

await call('/student/relatifs','PUT',{progress:{records:{}}},t2);assert.deepEqual((await call('/student/relatifs','GET',undefined,t2)).progress,{records:{}});
await call('/teacher/delete','POST',{id:a.student},admin);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM dnb_attempts WHERE student_id=?').get(a.student).n,0);
await call('/student/dnb/attempt','GET',undefined,token,401);
console.log('PASS: migration, real SQL, auth, isolation, resume, grading, locked submission, legacy 4e, deletion');
