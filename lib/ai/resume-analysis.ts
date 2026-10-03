import { z } from "zod";

const evidenceScoreSchema = z.object({
  score: z.number().int().min(0).max(100),
  evidence: z.array(z.string().max(400)).max(5),
});

export const resumeAnalysisSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  summary: z.string().min(1).max(1200),
  dimensions: z.object({
    skills: evidenceScoreSchema,
    experience: evidenceScoreSchema,
    education: evidenceScoreSchema,
    requirements: evidenceScoreSchema,
    roleAlignment: evidenceScoreSchema,
  }),
  extractedSkills: z.array(z.string().max(100)).max(30),
  matchedRequirements: z.array(z.object({
    requirement: z.string().max(300),
    evidence: z.string().max(500),
    priority: z.enum(["essential", "preferred", "unclear"]),
  })).max(15),
  missingRequirements: z.array(z.string().max(300)).max(15),
  strengths: z.array(z.string().max(400)).max(8),
  cautions: z.array(z.string().max(400)).max(8),
  interviewQuestions: z.array(z.object({
    question: z.string().max(500),
    rationale: z.string().max(400),
    competency: z.string().max(100),
  })).min(3).max(8),
});

export type ResumeAnalysisResult = z.infer<typeof resumeAnalysisSchema>;

export const resumeAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "overallScore",
    "summary",
    "dimensions",
    "extractedSkills",
    "matchedRequirements",
    "missingRequirements",
    "strengths",
    "cautions",
    "interviewQuestions",
  ],
  properties: {
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    summary: { type: "string" },
    dimensions: {
      type: "object",
      additionalProperties: false,
      required: ["skills", "experience", "education", "requirements", "roleAlignment"],
      properties: Object.fromEntries(
        ["skills", "experience", "education", "requirements", "roleAlignment"].map((key) => [
          key,
          {
            type: "object",
            additionalProperties: false,
            required: ["score", "evidence"],
            properties: {
              score: { type: "integer", minimum: 0, maximum: 100 },
              evidence: { type: "array", items: { type: "string" }, maxItems: 5 },
            },
          },
        ]),
      ),
    },
    extractedSkills: { type: "array", items: { type: "string" }, maxItems: 30 },
    matchedRequirements: {
      type: "array",
      maxItems: 15,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["requirement", "evidence", "priority"],
        properties: {
          requirement: { type: "string" },
          evidence: { type: "string" },
          priority: { type: "string", enum: ["essential", "preferred", "unclear"] },
        },
      },
    },
    missingRequirements: { type: "array", items: { type: "string" }, maxItems: 15 },
    strengths: { type: "array", items: { type: "string" }, maxItems: 8 },
    cautions: { type: "array", items: { type: "string" }, maxItems: 8 },
    interviewQuestions: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "rationale", "competency"],
        properties: {
          question: { type: "string" },
          rationale: { type: "string" },
          competency: { type: "string" },
        },
      },
    },
  },
} as const;
