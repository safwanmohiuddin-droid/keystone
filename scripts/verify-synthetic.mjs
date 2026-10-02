import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const directory=fileURLToPath(new URL('../src/data/synthetic/',import.meta.url));
const data=Object.fromEntries(readdirSync(directory).filter(f=>f.endsWith('.json')).map(file=>[file.slice(0,-5),JSON.parse(readFileSync(`${directory}/${file}`,'utf8'))]));
for(const [name,dataset] of Object.entries(data)) {
  assert.equal(dataset.meta.synthetic,true,`${name}: missing synthetic flag`);assert.equal(dataset.meta.rulesReviewed,false);
  if(Array.isArray(dataset.records)&&dataset.records.every(r=>'id' in r)) assert.equal(new Set(dataset.records.map(r=>r.id)).size,dataset.records.length,`${name}: duplicate IDs`);
}
const steps=data.steps.records,stepMap=new Map(steps.map(s=>[s.id,s]));
const personas=data.personas.records,personasById=new Map(personas.map(p=>[p.id,p]));
for(const s of steps) {assert.ok(s.title.en&&s.title.ar);for(const id of s.dependsOn) assert.ok(stepMap.has(id));assert.ok(s.typicalDays>=0);assert.equal(s.hardDeadline,null);}
for(const plan of data.plans.records) {
  const persona=personasById.get(plan.personaId);assert.ok(persona);
  const selected=new Set(plan.stepIds),visited=new Set(),active=new Set();
  const visit=id=>{assert.ok(selected.has(id),`Dangling dependency ${id}`);assert.ok(!active.has(id),`Cycle ${id}`);if(visited.has(id))return;active.add(id);for(const parent of plan.dependencies[id])visit(parent);active.delete(id);visited.add(id);};
  plan.stepIds.forEach(visit);
  for(const id of selected)for(const [key,value]of Object.entries(stepMap.get(id).conditions))assert.equal(persona[key],value);
  if(!persona.hasKids)assert.ok(!selected.has('school_enrollment'));
  if(!persona.hasCar)assert.ok(!selected.has('car_registration'));
  if(persona.hasCar)assert.deepEqual(plan.dependencies.driving_ready,[persona.licenceConvertible?'licence_conversion':'driving_training']);
}
const priyaPlan=data.plans.records.find(p=>p.personaId==='priya'),done=new Set();let previousDay=-1;
for(const chapter of data.timeline.records) {
  assert.ok(chapter.day>previousDay);previousDay=chapter.day;
  for(const id of chapter.completedStepIds) {assert.ok(stepMap.has(id));for(const dep of priyaPlan.dependencies[id]??stepMap.get(id).dependsOn)assert.ok(done.has(dep),`${id} completed before ${dep} on day ${chapter.day}`);assert.ok(!chapter.blockedStepIds.includes(id));done.add(id);}
  assert.deepEqual(chapter.doneStepIds,[...done]);
  if(chapter.suggestedStepId){const id=chapter.suggestedStepId;assert.ok(!done.has(id));assert.ok(!chapter.blockedStepIds.includes(id));for(const dep of priyaPlan.dependencies[id]??stepMap.get(id).dependsOn)assert.ok(done.has(dep),`${id}: suggestion not ready`);}
}
assert.ok(priyaPlan.stepIds.every(id=>done.has(id)),'Incomplete finale');
for(const row of data['housing-options'].records){assert.equal(row.cheques.reduce((sum,c)=>sum+c.amount,0),row.annualRent);assert.equal(row.cheques.length,row.chequeCount);assert.equal(row.upfrontCash,row.firstPayment+row.deposit+row.agentFee+row.utilityDeposit+row.movingCost);}
for(const doc of data.documents.records){assert.ok(personasById.has(doc.personaId));assert.equal(doc.containsRealPersonalData,false);assert.equal(doc.fileUrl,null);}
for(const deadline of data.deadlines.records){assert.ok(stepMap.has(deadline.stepId));assert.ok(deadline.bookByDay<=deadline.dueDay);assert.equal(deadline.isLegalDeadline,false);}
const cases=data['city-cases'].records,insights=data['city-insights'].records;
assert.equal(cases.length,240);assert.equal(insights.population,cases.length);assert.equal(insights.districts.reduce((sum,d)=>sum+d.cases,0),cases.length);
for(const b of insights.blockers)assert.equal(b.count,cases.filter(c=>c.blockerId===b.id).length);
for(const metric of insights.medianDaysPerStep){const values=cases.flatMap(c=>c.stepDurations.filter(s=>s.stepId===metric.stepId).map(s=>s.durationDays)).sort((a,b)=>a-b),mid=Math.floor(values.length/2);assert.equal(metric.medianDays,values.length%2?values[mid]:(values[mid-1]+values[mid])/2);}
console.log(`Verified ${Object.keys(data).length} datasets: acyclic plans, valid replay, exact payments, fictional identifiers and recomputed aggregates.`);
