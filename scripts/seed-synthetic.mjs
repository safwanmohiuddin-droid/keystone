import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../src/data/synthetic/', import.meta.url));
mkdirSync(out, { recursive: true });
const meta = { schemaVersion: 1, synthetic: true, seed: 71026, currency: 'AED', generatedFor: 'Keystone visual prototype', label: 'Fictional demo data · not official requirements or market statistics', rulesReviewed: false };
const save = (name, records) => writeFileSync(`${out}/${name}.json`, JSON.stringify({ meta, records }, null, 2) + '\n');
const day = (offset) => new Date(Date.UTC(2026, 9, 5 + offset)).toISOString().slice(0, 10);
const bilingual = (en, ar) => ({ en, ar });

const personas = [
  { id: 'priya', name: 'Priya Ramesh Nair', displayName: 'Priya', nationality: 'Indian', role: 'Software engineer', employer: 'Demo Sandstone Labs', sponsor: 'employer', hasFamily: true, hasKids: true, hasCar: true, licenceConvertible: false, family: [{ id: 'priya-spouse', name: 'Ramesh Nair', relationship: 'spouse' }, { id: 'priya-child-1', name: 'Anaya Nair', relationship: 'child', age: 8 }, { id: 'priya-child-2', name: 'Arjun Nair', relationship: 'child', age: 5 }], arrivalDate: day(0), salaryMonthly: 26000, relocationAllowance: 18000, openingCash: 42000, firstSalaryDay: 25, district: 'Al Reem Island', annualRent: 108000, nameVariants: ['Priya Ramesh Nair', 'Priya R. Nair', 'NAIR PRIYA RAMESH'], bio: bilingual('A new role. Two children. One family to settle.', 'وظيفة جديدة وطفلان وأسرة تبدأ حياة جديدة.') },
  { id: 'omar', name: 'Omar Hassan', displayName: 'Omar', nationality: 'Egyptian', role: 'Product designer', employer: 'Demo Gulf Studio', sponsor: 'employer', hasFamily: false, hasKids: false, hasCar: false, licenceConvertible: false, family: [], arrivalDate: day(4), salaryMonthly: 14000, relocationAllowance: 8000, openingCash: 22000, firstSalaryDay: 25, district: 'Al Danah', annualRent: 48000, nameVariants: ['Omar Hassan'], bio: bilingual('Moving solo. A shared home. A simpler start.', 'انتقال بمفرده وسكن مشترك وبداية أبسط.') },
  { id: 'lena', name: 'Lena Fischer', displayName: 'Lena', nationality: 'German', role: 'UX researcher', employer: 'Demo Palm Research', sponsor: 'spouse', hasFamily: true, hasKids: false, hasCar: true, licenceConvertible: true, family: [{ id: 'lena-spouse', name: 'Jonas Fischer', relationship: 'spouse' }], arrivalDate: day(7), salaryMonthly: 18000, relocationAllowance: 0, openingCash: 55000, firstSalaryDay: 30, district: 'Al Raha Beach', annualRent: 96000, nameVariants: ['Lena Fischer'], bio: bilingual('Joining her spouse. Preparing to work. Finding her own rhythm.', 'تلتحق بزوجها وتستعد للعمل وتبدأ حياتها الجديدة.') },
];
save('personas', personas);

const rawSteps = [
  ['entry_permit','Check entry arrangements','التحقق من إجراءات الدخول','visa','federal',[],[],2],
  ['arrival','Arrive in Abu Dhabi','الوصول إلى أبوظبي','visa','personal',['entry_permit'],[],0],
  ['medical_test','Attend the medical appointment','حضور موعد الفحص الطبي','visa','emirate',['arrival'],['passport'],1],
  ['eid_biometrics','Attend Emirates ID biometrics','حضور موعد البصمة للهوية','visa','federal',['arrival'],['passport'],1],
  ['residence_visa','Confirm residence approval','تأكيد الموافقة على الإقامة','visa','federal',['medical_test','eid_biometrics'],['passport'],3],
  ['eid_card','Receive Emirates ID','استلام الهوية الإماراتية','visa','federal',['residence_visa'],[],2],
  ['local_sim','Set up a local phone number','تفعيل رقم هاتف محلي','money','private',['arrival'],['passport'],1],
  ['bank_account','Prepare and open a bank account','تجهيز وفتح حساب مصرفي','money','private',['eid_card','local_sim'],['passport','emirates_id','offer_letter'],2],
  ['salary_transfer','Confirm salary payment details','تأكيد تفاصيل تحويل الراتب','money','personal',['bank_account'],['offer_letter'],1],
  ['chequebook','Request a cheque book if needed','طلب دفتر شيكات عند الحاجة','money','private',['bank_account'],['emirates_id'],2],
  ['credit_file','Understand your credit profile','فهم الملف الائتماني','money','private',['bank_account'],['emirates_id'],1],
  ['temp_stay','Confirm temporary accommodation','تأكيد السكن المؤقت','home','private',['entry_permit'],[],1],
  ['apartment_search','Shortlist homes and payment options','اختيار السكن وخيارات الدفع','home','personal',['arrival'],[],3],
  ['lease_and_cheques','Review and sign the demo lease','مراجعة وتوقيع عقد الإيجار التجريبي','home','personal',['apartment_search','chequebook'],['passport','emirates_id'],1],
  ['tawtheeq','Confirm tenancy registration','تأكيد تسجيل عقد الإيجار','home','emirate',['lease_and_cheques'],['lease'],1],
  ['utilities','Confirm the utility account handoff','تأكيد تفعيل حساب الخدمات','home','private',['tawtheeq'],['tenancy_registration'],1],
  ['internet','Arrange home internet','ترتيب خدمة الإنترنت المنزلي','home','private',['lease_and_cheques'],['emirates_id'],2],
  ['dependent_visas','Prepare dependent residence applications','تجهيز طلبات إقامة أفراد الأسرة','family','federal',['residence_visa','tawtheeq','salary_transfer'],['marriage_certificate','birth_certificate'],4,{ hasFamily:true, sponsor:'employer' }],
  ['dependent_eids','Confirm dependent Emirates IDs','تأكيد هويات أفراد الأسرة','family','federal',['dependent_visas'],[],2,{ hasFamily:true, sponsor:'employer' }],
  ['family_insurance','Confirm family insurance cover','تأكيد التأمين الصحي للأسرة','family','private',['arrival'],['passport'],1,{ hasFamily:true }],
  ['school_enrollment','Complete school enrolment','إتمام التسجيل المدرسي','family','private',['dependent_eids','tawtheeq'],['birth_certificate','transfer_certificate'],3,{ hasKids:true }],
  ['eye_test','Complete the driving eye test','إجراء فحص النظر للقيادة','car','private',['eid_card'],['emirates_id'],1,{ hasCar:true }],
  ['licence_conversion','Confirm licence exchange eligibility','تأكيد أهلية استبدال رخصة القيادة','car','emirate',['eye_test'],['driving_licence'],1,{ hasCar:true, licenceConvertible:true }],
  ['car_purchase','Choose a vehicle','اختيار المركبة','car','private',['bank_account'],[],2,{ hasCar:true }],
  ['car_registration','Complete vehicle registration','إتمام تسجيل المركبة','car','emirate',['driving_ready','car_purchase'],['vehicle_insurance'],1,{ hasCar:true }],
  ['driving_training','Complete the demo training and test route','إتمام التدريب والاختبار التجريبي','car','emirate',['eye_test'],['emirates_id'],7,{ hasCar:true, licenceConvertible:false }],
  ['driving_ready','Confirm driving permission','تأكيد جاهزية رخصة القيادة','car','personal',[],[],0,{ hasCar:true }],
  ['salary_letter','Request a salary letter','طلب شهادة راتب','money','personal',['arrival'],['offer_letter'],1],
  ['extend_temp_stay','Extend temporary accommodation','تمديد السكن المؤقت','home','private',['temp_stay'],[],1],
  ['name_correction','Clarify document name differences','توضيح اختلاف الاسم في المستندات','money','personal',['arrival'],['passport','offer_letter'],1],
];
const steps = rawSteps.map(([id,en,ar,lane,actor,dependsOn,docsNeeded,typicalDays,conditions]) => ({ id,title:bilingual(en,ar),lane,actor,dependsOn,docsNeeded,typicalDays,conditions:conditions ?? {}, optional: ['credit_file','salary_letter','extend_temp_stay','name_correction'].includes(id), where: actor === 'federal' ? 'Confirm with ICP / relevant authority' : actor === 'emirate' ? 'Confirm via TAMM / relevant authority' : actor === 'personal' ? 'Applicant, HR or landlord' : 'Selected private provider', ruleType:'demo-assumption', notice:'Demo data · verify the applicable requirements with the provider', hardDeadline:null }));
save('steps',steps);

const plans = personas.map(p => {
  const selected = steps.filter(s => Object.entries(s.conditions).every(([key,value]) => p[key] === value)).filter(s => !s.optional);
  const ids = new Set(selected.map(s => s.id));
  return { personaId:p.id, stepIds:[...ids], dependencies:Object.fromEntries(selected.map(s => [s.id, s.id === 'driving_ready' ? [p.licenceConvertible ? 'licence_conversion' : 'driving_training'] : s.dependsOn.filter(id => ids.has(id))])), notes:['These are coherent fictional demo paths, not universally applicable immigration or banking rules.', 'The cheque dependency assumes this sample landlord requires cheques; other payment routes exist.', 'Utilities represent confirmation of a registration handoff, not an invented duplicate application.', ...(p.id === 'lena' ? ['Spouse-sponsored residence is simplified in this fixture; work-authorisation eligibility requires separate review.'] : [])] };
});
save('plans',plans);

const documents = personas.flatMap(p => [
  { id:`${p.id}-passport`, personaId:p.id, type:'passport', title:'Sample passport facts', name:p.name, extractedFields:{ fullName:p.name,nationality:p.nationality,documentNumber:`SYNTHETIC-${p.id.toUpperCase()}-PASSPORT` }, status:'reviewed' },
  { id:`${p.id}-offer`,personaId:p.id,type:'offer_letter',title:'Sample employment offer',name:p.nameVariants[1] ?? p.name,extractedFields:{ fullName:p.nameVariants[1] ?? p.name,employer:p.employer,salaryMonthly:p.salaryMonthly,relocationAllowance:p.relocationAllowance },status:p.id === 'priya' ? 'needs_review':'reviewed' },
  { id:`${p.id}-eid`,personaId:p.id,type:'emirates_id',title:'Sample Emirates ID facts',name:p.name,extractedFields:{ fullName:p.name,documentNumber:`SYNTHETIC-${p.id.toUpperCase()}-EID` },status:'sample' },
  ...['lease','tenancy_registration','driving_licence','vehicle_insurance',...(p.hasFamily?['marriage_certificate']:[]),...(p.hasKids?['birth_certificate','transfer_certificate']:[])].map(type=>({ id:`${p.id}-${type}`,personaId:p.id,type,title:`Sample ${type.replaceAll('_',' ')}`,name:p.name,extractedFields:{ reference:`SYNTHETIC-${p.id}-${type}` },status:'sample' })),
]);
save('documents',documents.map(d=>({...d,synthetic:true,containsRealPersonalData:false,fileUrl:null})));
save('name-mismatches',[{ id:'priya-offer-name',personaId:'priya',documentIds:['priya-passport','priya-offer'],variants:personas[0].nameVariants,status:'needs-human-review',severity:'review',explanation:'An abbreviated name differs from the sample passport name. The receiving institution must confirm whether a correction is required.',canonicalSuggestion:'Priya Ramesh Nair' }]);

save('mock-extractions',personas.map(p=>({ personaId:p.id,inputDocumentIds:[`${p.id}-passport`,`${p.id}-offer`],delayMs:1000,names:p.nameVariants,nationality:p.nationality,sponsor:p.sponsor,family:p.family,arrivalDate:p.arrivalDate,employer:p.employer,requiresHumanReview:p.nameVariants.length>1 })));
const snapshots = [
  [0,['entry_permit','arrival','temp_stay'],'medical_test'],
  [1,['medical_test','local_sim'],'eid_biometrics'],
  [3,['eid_biometrics','apartment_search','family_insurance'],'residence_visa'],
  [5,['residence_visa','eid_card'],'bank_account'],
  [6,[],'name_correction'],
  [7,['name_correction','bank_account','salary_transfer'],'chequebook'],
  [8,['chequebook'],'extend_temp_stay'],
  [9,['extend_temp_stay','lease_and_cheques'],'tawtheeq'],
  [10,['tawtheeq','utilities'],'dependent_visas'],
  [14,['internet','dependent_visas','eye_test'],'dependent_eids'],
  [21,['dependent_eids','school_enrollment','driving_training','driving_ready','car_purchase'],'car_registration'],
  [30,['car_registration','credit_file'],null],
];
const done = [];
const timeline = snapshots.map(([offset,completedStepIds,suggestedStepId])=>{
  done.push(...completedStepIds);
  return { id:`priya-day-${offset}`,personaId:'priya',day:offset,date:day(offset),completedStepIds,doneStepIds:[...done],suggestedStepId,blockedStepIds:offset===6?['bank_account']:offset===8?['lease_and_cheques']:[],caption:bilingual(offset===30?'Priya’s sample relocation is complete.':offset===6?'Review the name difference before submitting.':offset===8?'The lease is delayed. Extend temporary accommodation.':offset===14?'School applications are in progress; final enrolment is still pending.':`Day ${offset}: ${completedStepIds.map(id=>steps.find(s=>s.id===id).title.en).join('. ')}.`,offset===30?'اكتملت رحلة بريا التجريبية.':offset===8?'تأخر عقد الإيجار. تمديد السكن المؤقت.':`اليوم ${offset} من الرحلة التجريبية.`),illustrative:true };
});
save('timeline',timeline);
save('deadlines',personas.flatMap(p=>[
  { id:`${p.id}-hotel`,personaId:p.id,stepId:'temp_stay',dueDay:8,bookByDay:6,label:'Sample hotel booking ends',kind:'booking',isLegalDeadline:false,source:'Fictional accommodation booking' },
  { id:`${p.id}-salary`,personaId:p.id,stepId:'salary_transfer',dueDay:p.firstSalaryDay,bookByDay:Math.max(0,p.firstSalaryDay-5),label:'Sample first payroll date',kind:'employer',isLegalDeadline:false,source:'Fictional employer payroll calendar' },
  ...(p.hasKids?[{ id:`${p.id}-school`,personaId:p.id,stepId:'school_enrollment',dueDay:24,bookByDay:14,label:'Sample school offer expires',kind:'provider',isLegalDeadline:false,source:'Fictional school offer' }]:[]),
]));

save('housing-options',personas.flatMap(p=>[1,2,4,6].map(count=>{
  const annualRent=Math.round(p.annualRent*(1+(count-1)*0.012));
  const deposit=Math.round(annualRent*0.05),agentFee=Math.round(annualRent*0.04),firstRent=Math.ceil(annualRent/count);
  return { id:`${p.id}-${count}-cheques`,personaId:p.id,district:p.district,chequeCount:count,annualRent,deposit,agentFee,utilityDeposit:1000,movingCost:3500,firstPayment: firstRent,upfrontCash:firstRent+deposit+agentFee+1000+3500,cheques:Array.from({length:count},(_,i)=>({ number:i+1,dueDay:9+Math.floor(i*365/count),amount:i===count-1?annualRent-firstRent*(count-1):firstRent })),assumption:'Entirely fictional quotes and payment dates. These are not market prices or mandated fees.' };
})));
save('blockers',[
  { id:'bank-rejected',stepId:'bank_account',recoveryStepId:'salary_letter',owner:'HR',impact:'Bank account remains blocked until the applicant and bank clarify the requested evidence.',message:'Request the bank’s additional-document checklist. Gather genuine evidence; do not invent reasons or guarantee approval.' },
  { id:'lease-delayed',stepId:'lease_and_cheques',recoveryStepId:'extend_temp_stay',owner:'landlord',impact:'Tenancy registration and dependent plans remain pending.',message:'Confirm a revised lease date and arrange a temporary-stay extension.' },
  { id:'medical-rescheduled',stepId:'medical_test',recoveryStepId:null,owner:'applicant',impact:'Residence approval remains pending.',message:'Confirm a new appointment with the provider and update HR.' },
  { id:'name-mismatch',stepId:'bank_account',recoveryStepId:'name_correction',owner:'HR',impact:'Receiving institution needs to review the name variants.',message:'Ask whether the abbreviation is acceptable or request a corrected employer letter.' },
]);
save('message-templates',[
  { id:'name-correction',recipient:'HR',tone:'formal',en:'Hello, my sample offer lists Priya R. Nair while my sample passport lists Priya Ramesh Nair. Could you confirm whether the receiving institution requires an updated letter and issue one if needed? Thank you.',ar:'مرحباً، يرد اسمي مختصراً في خطاب العرض التجريبي، بينما يظهر كاملاً في جواز السفر التجريبي. هل يمكنكم التأكد مما إذا كانت الجهة المستلمة تحتاج إلى خطاب محدث وإصداره عند الحاجة؟ شكراً لكم.' },
  { id:'lease-follow-up',recipient:'landlord',tone:'friendly',en:'Hello, could you confirm when the lease will be ready and which tenancy-registration process applies? My temporary booking ends soon, so a confirmed date would help me plan. Thank you.',ar:'مرحباً، هل يمكنكم تأكيد موعد جاهزية عقد الإيجار وإجراءات تسجيله؟ تنتهي إقامتي المؤقتة قريباً، وسيساعدني موعد مؤكد على التخطيط. شكراً لكم.' },
  { id:'school-admissions',recipient:'school',tone:'formal',en:'Hello, we are relocating with children aged five and eight. Could you confirm year-group availability, the application documents, total fees and whether there is a waiting list? Thank you.',ar:'مرحباً، ننتقل مع طفلين يبلغ عمرهما خمس وثماني سنوات. هل يمكنكم تأكيد توفر الأماكن والمستندات المطلوبة والرسوم الإجمالية ووجود قائمة انتظار؟ شكراً لكم.' },
  { id:'bank-follow-up',recipient:'bank',tone:'formal',en:'Hello, could you confirm which documents remain outstanding for my application and the appropriate follow-up channel? I can provide genuine supporting evidence as requested. Thank you.',ar:'مرحباً، هل يمكنكم تأكيد المستندات الناقصة في طلبي وقناة المتابعة المناسبة؟ يمكنني تقديم المستندات الداعمة المطلوبة. شكراً لكم.' },
]);

save('companies',[
  { id:'co-sandstone',name:'Demo Sandstone Labs',sector:'Software',stage:'relocating-small-team',jurisdiction:'not-yet-selected',employeePersonaIds:['priya'],teamSize:8,setupBudget:85000,blockerIds:['name-mismatch'],tasks:[{ id:'activity-review',title:'Confirm activities and jurisdiction with the authority',owner:'founder',status:'doing' },{ id:'bank-pack',title:'Prepare genuine ownership and business evidence',owner:'finance',status:'available' },{ id:'employee-pack',title:'Review Priya’s document pack',owner:'HR',status:'blocked' }] },
  { id:'co-gulf',name:'Demo Gulf Studio',sector:'Design',stage:'operating-and-hiring',jurisdiction:'demo-mainland',employeePersonaIds:['omar'],teamSize:5,setupBudget:55000,blockerIds:[],tasks:[{ id:'payroll-details',title:'Confirm employee payroll readiness',owner:'HR',status:'available' }] },
  { id:'co-palm',name:'Demo Palm Research',sector:'Research',stage:'expansion-planning',jurisdiction:'not-yet-selected',employeePersonaIds:['lena'],teamSize:12,setupBudget:120000,blockerIds:['bank-rejected'],tasks:[{ id:'bank-follow-up',title:'Confirm outstanding business-bank evidence',owner:'finance',status:'blocked' }] },
]);

let seed=meta.seed;
const random=()=>{ seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; };
const districts=['Al Reem Island','Al Raha Beach','Al Danah','Khalifa City','Yas Island','Masdar City'];
const blockerIds=['bank-rejected','lease-delayed','medical-rescheduled','name-mismatch'];
const cases=Array.from({length:240},(_,i)=>{
  const persona=personas[i%personas.length],plan=plans[i%plans.length];
  const district=districts[Math.floor(random()*districts.length)];
  const rows=plan.stepIds.map(stepId=>{
    const base=steps.find(s=>s.id===stepId).typicalDays;
    return { stepId,durationDays:base===0?0:Math.max(1,base+Math.floor(random()*5)-2) };
  });
  return { id:`SYNTHETIC-CASE-${String(i+1).padStart(4,'0')}`,archetype:persona.id,district,arrivalMonth:'2026-10',blockerId:i%5===0?null:blockerIds[Math.floor(random()*blockerIds.length)],stepDurations:rows,containsRealPersonalData:false };
});
save('city-cases',cases);
const median=values=>{const sorted=[...values].sort((a,b)=>a-b),mid=Math.floor(sorted.length/2);return sorted.length%2?sorted[mid]:(sorted[mid-1]+sorted[mid])/2;};
save('city-insights',{
  population:cases.length,period:'Synthetic October 2026 cohort',
  label:'Generated fictional cases · no real residents or government records',
  blockers:blockerIds.map(id=>({ id,count:cases.filter(c=>c.blockerId===id).length })).sort((a,b)=>b.count-a.count),
  districts:districts.map(district=>{const subset=cases.filter(c=>c.district===district);return { district,cases:subset.length,blockedCases:subset.filter(c=>c.blockerId!==null).length };}),
  medianDaysPerStep:steps.filter(s=>!s.optional).map(s=>({ stepId:s.id,medianDays:median(cases.flatMap(c=>c.stepDurations.filter(r=>r.stepId===s.id).map(r=>r.durationDays))) })),
});
console.log('Generated 14 deterministic synthetic datasets. Seed:',meta.seed);
