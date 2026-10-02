import personaData from './synthetic/personas.json';
import stepData from './synthetic/steps.json';
import planData from './synthetic/plans.json';
import documentData from './synthetic/documents.json';
import timelineData from './synthetic/timeline.json';
import deadlineData from './synthetic/deadlines.json';
import housingData from './synthetic/housing-options.json';
import blockerData from './synthetic/blockers.json';
import mismatchData from './synthetic/name-mismatches.json';
import templateData from './synthetic/message-templates.json';
import companyData from './synthetic/companies.json';
import extractionData from './synthetic/mock-extractions.json';
import insightsData from './synthetic/city-insights.json';

export const datasetMeta = personaData.meta;
export const personas = personaData.records;
export const steps = stepData.records;
export const plans = planData.records;
export const documents = documentData.records;
export const timeline = timelineData.records;
export const deadlines = deadlineData.records;
export const housingOptions = housingData.records;
export const blockers = blockerData.records;
export const nameMismatches = mismatchData.records;
export const messageTemplates = templateData.records;
export const companies = companyData.records;
export const mockExtractions = extractionData.records;
export const cityInsights = insightsData.records;

// Import city-cases.json separately to keep the corpus out of the default bundle.
export type Persona = (typeof personas)[number];
export type Step = (typeof steps)[number];
export type Plan = (typeof plans)[number];
export type DemoChapter = (typeof timeline)[number];
export type Lane = 'visa' | 'money' | 'home' | 'family' | 'car';
export type StepStatus = 'locked' | 'available' | 'doing' | 'done' | 'blocked' | 'keystone';
