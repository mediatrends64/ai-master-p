
import { LearningModule, Persona } from './types';

export const TCREI_MODULES: LearningModule[] = [
  {
    id: 'task',
    titleKey: 'learn.modules.task.title',
    subtitleKey: 'learn.modules.task.subtitle',
    emoji: '🎯',
    descriptionKey: 'learn.modules.task.description',
    progress: 100,
    content: [
      {
        titleKey: 'learn.modules.task.content.0.title',
        textKey: 'learn.modules.task.content.0.text',
      },
      {
        titleKey: 'learn.modules.task.content.1.title',
        textKey: 'learn.modules.task.content.1.text',
        example: '"Act as a professional speech writer..." or "You are a marketing executive with 15 years of experience..."',
      },
      {
        titleKey: 'learn.modules.task.content.2.title',
        textKey: 'learn.modules.task.content.2.text',
        example: '"Provide the answer in a markdown table with columns for Feature, Benefit, and Use Case." or "Summarize the key points in a bulleted list."',
      },
    ],
  },
  {
    id: 'context',
    titleKey: 'learn.modules.context.title',
    subtitleKey: 'learn.modules.context.subtitle',
    emoji: '📚',
    descriptionKey: 'learn.modules.context.description',
    progress: 75,
    content: [
      {
        titleKey: 'learn.modules.context.content.0.title',
        textKey: 'learn.modules.context.content.0.text',
        example: 'When asking for an email, provide the recipient\'s role, your relationship, the goal of the email, and key points to include.',
      },
      {
        titleKey: 'learn.modules.context.content.1.title',
        textKey: 'learn.modules.context.content.1.text',
      },
      {
        titleKey: 'learn.modules.context.content.2.title',
        textKey: 'learn.modules.context.content.2.text',
      },
    ],
  },
  {
    id: 'references',
    titleKey: 'learn.modules.references.title',
    subtitleKey: 'learn.modules.references.subtitle',
    emoji: '📄',
    descriptionKey: 'learn.modules.references.description',
    progress: 25,
    content: [
      {
        titleKey: 'learn.modules.references.content.0.title',
        textKey: 'learn.modules.references.content.0.text',
      },
      {
        titleKey: 'learn.modules.references.content.1.title',
        textKey: 'learn.modules.references.content.1.text',
      },
      {
        titleKey: 'learn.modules.references.content.2.title',
        textKey: 'learn.modules.references.content.2.text',
        example: 'User: "Translate to French: sea otter -> loutre de mer"\nUser: "Translate to French: platypus -> ornithorynque"\nUser: "Translate to French: narwhal -> ?"\nAI: "narval"',
      },
    ],
  },
  {
    id: 'evaluation',
    titleKey: 'learn.modules.evaluation.title',
    subtitleKey: 'learn.modules.evaluation.subtitle',
    emoji: '🤔',
    descriptionKey: 'learn.modules.evaluation.description',
    progress: 0,
    content: [
      {
        titleKey: 'learn.modules.evaluation.content.0.title',
        textKey: 'learn.modules.evaluation.content.0.text',
      },
      {
        titleKey: 'learn.modules.evaluation.content.1.title',
        textKey: 'learn.modules.evaluation.content.1.text',
      },
      {
        titleKey: 'learn.modules.evaluation.content.2.title',
        textKey: 'learn.modules.evaluation.content.2.text',
      },
    ],
  },
  {
    id: 'iteration',
    titleKey: 'learn.modules.iteration.title',
    subtitleKey: 'learn.modules.iteration.subtitle',
    emoji: '🔄',
    descriptionKey: 'learn.modules.iteration.description',
    progress: 0,
    content: [
      {
        titleKey: 'learn.modules.iteration.content.0.title',
        textKey: 'learn.modules.iteration.content.0.text',
      },
      {
        titleKey: 'learn.modules.iteration.content.1.title',
        textKey: 'learn.modules.iteration.content.1.text',
      },
      {
        titleKey: 'learn.modules.iteration.content.2.title',
        textKey: 'learn.modules.iteration.content.2.text',
      },
      {
        titleKey: 'learn.modules.iteration.content.3.title',
        textKey: 'learn.modules.iteration.content.3.text',
      },
    ],
  },
];

export const PERSONAS: Persona[] = [
    { nameKey: 'personas.marketing_executive.name', descriptionKey: 'personas.marketing_executive.description', englishName: 'Marketing Executive' },
    { nameKey: 'personas.anime_expert.name', descriptionKey: 'personas.anime_expert.description', englishName: 'Anime Expert' },
    { nameKey: 'personas.speech_writer.name', descriptionKey: 'personas.speech_writer.description', englishName: 'Professional Speech Writer' },
    { nameKey: 'personas.software_engineer.name', descriptionKey: 'personas.software_engineer.description', englishName: 'Senior Software Engineer' },
    { nameKey: 'personas.travel_blogger.name', descriptionKey: 'personas.travel_blogger.description', englishName: 'Travel Blogger' },
    { nameKey: 'personas.financial_analyst.name', descriptionKey: 'personas.financial_analyst.description', englishName: 'Financial Analyst' },
];