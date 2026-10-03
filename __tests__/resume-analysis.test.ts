import { describe, expect, it } from "vitest";
import { resumeAnalysisSchema } from "@/lib/ai/resume-analysis";
import { hasValidRequestOrigin } from "@/lib/security/request-origin";

const validAnalysis = {
  overallScore: 76,
  summary: "The resume demonstrates relevant experience with a few requirements to clarify.",
  dimensions: {
    skills: { score: 80, evidence: ["Recent TypeScript delivery"] },
    experience: { score: 75, evidence: ["Four years building web applications"] },
    education: { score: 70, evidence: ["Relevant degree listed"] },
    requirements: { score: 72, evidence: ["Several listed requirements are evidenced"] },
    roleAlignment: { score: 78, evidence: ["Recent experience aligns with the role"] },
  },
  extractedSkills: ["TypeScript", "React"],
  matchedRequirements: [{
    requirement: "Production React experience",
    evidence: "Built and maintained a React application",
    priority: "essential",
  }],
  missingRequirements: ["No evidence of mentoring responsibilities"],
  strengths: ["Recent, relevant product experience"],
  cautions: ["Mentoring experience is not stated"],
  interviewQuestions: [
    {
      question: "How have you improved the reliability of a React application?",
      rationale: "Explore production ownership",
      competency: "Frontend engineering",
    },
    {
      question: "How do you decide what to test in a new feature?",
      rationale: "Understand quality practices",
      competency: "Testing",
    },
    {
      question: "How have you worked through a difficult technical trade-off?",
      rationale: "Explore decision-making",
      competency: "Problem solving",
    },
  ],
};

describe("resume analysis result validation", () => {
  it("accepts structured job-related evidence and interview prompts", () => {
    expect(resumeAnalysisSchema.parse(validAnalysis)).toEqual(validAnalysis);
  });

  describe("same-origin request validation", () => {
    it("allows same-origin API requests", () => {
      const request = new Request("https://recruitflow.example/api/action", {
        headers: { origin: "https://recruitflow.example" },
      });
      expect(hasValidRequestOrigin(request)).toBe(true);
    });

    it("matches the browser origin to the host behind an internal container URL", () => {
      const request = new Request("http://web:3000/api/action", {
        headers: {
          host: "localhost:3000",
          origin: "http://localhost:3000",
        },
      });
      expect(hasValidRequestOrigin(request)).toBe(true);
    });

    it("rejects origins that only share a hostname prefix", () => {
      const request = new Request("https://recruitflow.example/api/action", {
        headers: { origin: "https://recruitflow.example.attacker.invalid" },
      });
      expect(hasValidRequestOrigin(request)).toBe(false);
    });

    it("allows non-browser requests without an Origin header", () => {
      expect(hasValidRequestOrigin(new Request("https://recruitflow.example/api/action"))).toBe(true);
    });
  });

  it("rejects scores outside the defined 0-100 range", () => {
    const result = resumeAnalysisSchema.safeParse({
      ...validAnalysis,
      dimensions: {
        ...validAnalysis.dimensions,
        skills: { score: 101, evidence: ["unsupported score"] },
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects analyses without grounded follow-up questions", () => {
    const result = resumeAnalysisSchema.safeParse({
      ...validAnalysis,
      interviewQuestions: [],
    });

    expect(result.success).toBe(false);
  });
});
