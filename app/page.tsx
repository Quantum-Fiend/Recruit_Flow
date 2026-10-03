import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardList,
  FileCheck2,
  MessageSquareText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const workflow = [
  { label: "Applied", tone: "workflow-applied" },
  { label: "Shortlisted", tone: "workflow-shortlisted" },
  { label: "Interview", tone: "workflow-interview" },
  { label: "Offer", tone: "workflow-offer" },
  { label: "Hired", tone: "workflow-hired" },
];

const features = [
  {
    icon: ClipboardList,
    title: "Keep every role organized",
    description:
      "Create job listings with clear responsibilities, requirements, location, and employment details.",
  },
  {
    icon: FileCheck2,
    title: "Review candidates in context",
    description:
      "See applications and submitted resumes alongside the role they belong to.",
  },
  {
    icon: MessageSquareText,
    title: "Make better team decisions",
    description:
      "Track status changes and leave recruiter notes as candidates move through your process.",
  },
  {
    icon: ShieldCheck,
    title: "Keep access role-aware",
    description:
      "Give recruiters and applicants separate workspaces with clear, purpose-built access.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="landing-eyebrow">
            <span className="landing-eyebrow-dot" />
            A calmer way to hire
          </p>
          <h1>
            Great hiring starts with a <span>clearer process.</span>
          </h1>
          <p className="landing-description">
            RecruitFlow brings job listings, candidate applications, and hiring
            decisions together in one thoughtful workspace.
          </p>
          <div className="landing-actions">
            <Link href="/signup">
              <Button className="dashboard-primary-action landing-primary">
                Create your workspace
                <ArrowRight aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/jobs" className="landing-secondary">
              Explore open positions
            </Link>
          </div>
          <div className="landing-trust">
            <span><Check aria-hidden="true" /> Organized applications</span>
            <span><Check aria-hidden="true" /> Clear hiring stages</span>
            <span><Check aria-hidden="true" /> Private recruiter notes</span>
          </div>
        </div>

        <div className="workflow-preview" aria-label="Example candidate workflow">
          <div className="preview-window-bar">
            <span className="preview-window-dots" aria-hidden="true">
              <i /><i /><i />
            </span>
            <span>Candidate workflow</span>
            <span className="preview-live"><span /> Example</span>
          </div>
          <div className="preview-content">
            <div className="preview-heading">
              <div>
                <p>Recruiting overview</p>
                <h2>Move candidates forward</h2>
              </div>
              <UsersRound aria-hidden="true" />
            </div>
            <div className="workflow-steps">
              {workflow.map((stage, index) => (
                <div className="workflow-step" key={stage.label}>
                  <div className={`workflow-step-marker ${stage.tone}`}>
                    {index < 2 ? <Check aria-hidden="true" /> : index + 1}
                  </div>
                  <div className="workflow-step-copy">
                    <strong>{stage.label}</strong>
                    <span>
                      {index === 0
                        ? "Application received"
                        : index === 1
                          ? "Ready for review"
                          : index === 2
                            ? "Meet the candidate"
                            : index === 3
                              ? "Share an offer"
                              : "Process complete"}
                    </span>
                  </div>
                  {index < workflow.length - 1 && (
                    <span className="workflow-connector" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
            <p className="preview-footnote">
              A simple example of the application statuses your team can use.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-features" aria-labelledby="features-title">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">One connected workspace</p>
          <h2 id="features-title">The details that make hiring work.</h2>
          <p>
            Give your team a reliable place to manage the work behind every
            great hire.
          </p>
        </div>
        <div className="landing-feature-grid">
          {features.map(({ icon: Icon, title, description }) => (
            <article className="landing-feature-card" key={title}>
              <span className="landing-feature-icon">
                <Icon aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <p className="landing-eyebrow">Start with your next opening</p>
          <h2>Make your hiring process easier to follow.</h2>
        </div>
        <Link href="/signup">
          <Button className="dashboard-primary-action landing-primary">
            Get started <ArrowRight aria-hidden="true" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
