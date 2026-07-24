"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PipelineTrack =
  | "educational_pathway"
  | "direct_development_track"
  | "borderline";

type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "rejected"
  | "accepted";

type PersonalForm = {
  dateOfBirth: string;
  gender: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  phoneNumber: string;
};

type EducationForm = {
  educationLevel: string;
  fieldOfStudy: string;
  institutionName: string;
  yearCompleted: string;
};

type ExperienceForm = {
  employmentStatus: string;
  currentRole: string;
  experienceYears: string;
  experienceDescription: string;
};

type SectorForm = {
  sectorPreference: string;
  sectorReason: string;
};

type MotivationForm = {
  whyApplying: string;
  longTermCommitment: string;
  howHeard: string;
};

type AssessmentQuestion = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  order: number;
};

type ApplicationPayload = {
  id: string;
  status: ApplicationStatus;
  currentStep: number;
  pipelineTrack: PipelineTrack | null;
  assessmentScore: number | null;
  isBorderline: boolean;
  submittedAt: string | null;
  personalInfo: (PersonalForm & { dateOfBirth: string }) | null;
  educationInfo:
    | {
        educationLevel: string;
        fieldOfStudy: string | null;
        institutionName: string | null;
        yearCompleted: number | null;
      }
    | null;
  experienceInfo:
    | {
        employmentStatus: string;
        currentRole: string | null;
        experienceYears: string;
        experienceDescription: string | null;
      }
    | null;
  sectorInfo: SectorForm | null;
  motivationInfo: MotivationForm | null;
};

type AssessmentResult = {
  score: number;
  pipelineTrack: PipelineTrack;
  isBorderline: boolean;
};

const steps = [
  "Personal",
  "Education",
  "Experience",
  "Sector",
  "Motivation",
  "Assessment",
];

const emptyPersonal: PersonalForm = {
  dateOfBirth: "",
  gender: "",
  stateOfOrigin: "",
  stateOfResidence: "",
  phoneNumber: "",
};

const emptyEducation: EducationForm = {
  educationLevel: "",
  fieldOfStudy: "",
  institutionName: "",
  yearCompleted: "",
};

const emptyExperience: ExperienceForm = {
  employmentStatus: "",
  currentRole: "",
  experienceYears: "",
  experienceDescription: "",
};

const emptySector: SectorForm = {
  sectorPreference: "",
  sectorReason: "",
};

const emptyMotivation: MotivationForm = {
  whyApplying: "",
  longTermCommitment: "",
  howHeard: "",
};

const inputClass =
  "min-h-11 rounded-sm border border-surface-elevated bg-surface-primary px-4 py-3 text-base text-text-primary focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime disabled:bg-surface-elevated disabled:text-text-secondary";

function getRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload: unknown = await response.json();
  const record = getRecord(payload);

  if (!record) {
    throw new Error("Unexpected response from server");
  }

  if ("error" in record) {
    const errorRecord = getRecord(record.error);
    const message =
      typeof errorRecord?.message === "string"
        ? errorRecord.message
        : "Request failed";
    throw new Error(message);
  }

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return record.data as T;
}

function formatDateInput(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function trackLabel(track: PipelineTrack | null) {
  if (track === "educational_pathway") return "Educational Pathway";
  if (track === "direct_development_track") return "Direct Development Track";
  if (track === "borderline") return "Borderline - manual review required";
  return "Pending";
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-text-secondary">
      <span>{label}</span>
      {children}
      {error ? <span className="text-status-rejected">{error}</span> : null}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      className={inputClass}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function TextArea({
  value,
  onChange,
  maxLength,
}: {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <textarea
      className={`${inputClass} min-h-32`}
      value={value}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function SelectInput({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <select
      className={inputClass}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <ol className="grid gap-3 md:grid-cols-6">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isComplete = currentStep > stepNumber;

        return (
          <li
            key={label}
            className={`rounded-md border p-3 text-sm font-medium ${
              isActive
                ? "border-brand-lime bg-brand-lime text-text-on-light"
                : isComplete
                  ? "border-brand-green bg-surface-elevated text-text-primary"
                  : "border-surface-elevated bg-surface-primary text-text-secondary"
            }`}
          >
            <span className="block text-xs uppercase">Step {stepNumber}</span>
            <span>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function ApplicationForm() {
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationPayload | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [personal, setPersonal] = useState<PersonalForm>(emptyPersonal);
  const [education, setEducation] = useState<EducationForm>(emptyEducation);
  const [experience, setExperience] =
    useState<ExperienceForm>(emptyExperience);
  const [sector, setSector] = useState<SectorForm>(emptySector);
  const [motivation, setMotivation] =
    useState<MotivationForm>(emptyMotivation);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reviewReady =
    currentStep === 7 ||
    (application?.assessmentScore !== null && application?.pipelineTrack);

  useEffect(() => {
    async function loadApplication() {
      try {
        const existing = await requestJson<ApplicationPayload | null>(
          "/api/applications/me",
        );
        const draft =
          existing ??
          (await requestJson<ApplicationPayload>("/api/applications", {
            method: "POST",
          }));

        setApplication(draft);
        setCurrentStep(draft.currentStep >= 7 ? 7 : draft.currentStep);

        if (draft.personalInfo) {
          setPersonal({
            dateOfBirth: formatDateInput(draft.personalInfo.dateOfBirth),
            gender: draft.personalInfo.gender,
            stateOfOrigin: draft.personalInfo.stateOfOrigin,
            stateOfResidence: draft.personalInfo.stateOfResidence,
            phoneNumber: draft.personalInfo.phoneNumber,
          });
        }

        if (draft.educationInfo) {
          setEducation({
            educationLevel: draft.educationInfo.educationLevel,
            fieldOfStudy: draft.educationInfo.fieldOfStudy ?? "",
            institutionName: draft.educationInfo.institutionName ?? "",
            yearCompleted:
              draft.educationInfo.yearCompleted === null
                ? ""
                : String(draft.educationInfo.yearCompleted),
          });
        }

        if (draft.experienceInfo) {
          setExperience({
            employmentStatus: draft.experienceInfo.employmentStatus,
            currentRole: draft.experienceInfo.currentRole ?? "",
            experienceYears: draft.experienceInfo.experienceYears,
            experienceDescription:
              draft.experienceInfo.experienceDescription ?? "",
          });
        }

        if (draft.sectorInfo) {
          setSector(draft.sectorInfo);
        }

        if (draft.motivationInfo) {
          setMotivation(draft.motivationInfo);
        }

        if (draft.assessmentScore !== null && draft.pipelineTrack) {
          setAssessmentResult({
            score: draft.assessmentScore,
            pipelineTrack: draft.pipelineTrack,
            isBorderline: draft.isBorderline,
          });
        }
      } catch (error) {
        setPageError(
          error instanceof Error
            ? error.message
            : "Unable to load your application",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadApplication();
  }, []);

  useEffect(() => {
    if (currentStep !== 6 || questions.length > 0) return;

    async function loadQuestions() {
      try {
        const data = await requestJson<AssessmentQuestion[]>(
          "/api/assessments/questions",
        );
        setQuestions(data);
      } catch (error) {
        setPageError(
          error instanceof Error
            ? error.message
            : "Unable to load assessment questions",
        );
      }
    }

    void loadQuestions();
  }, [currentStep, questions.length]);

  const progressText = useMemo(() => {
    if (currentStep >= 7) return "Assessment complete";
    return `Step ${currentStep} of 6`;
  }, [currentStep]);

  function validateStep(step: number) {
    const nextErrors: Record<string, string> = {};

    if (step === 1) {
      if (!personal.dateOfBirth) nextErrors.dateOfBirth = "Required";
      if (!personal.gender) nextErrors.gender = "Required";
      if (!personal.stateOfOrigin) nextErrors.stateOfOrigin = "Required";
      if (!personal.stateOfResidence) nextErrors.stateOfResidence = "Required";
      if (!personal.phoneNumber) nextErrors.phoneNumber = "Required";
    }

    if (step === 2) {
      if (!education.educationLevel) nextErrors.educationLevel = "Required";
      if (
        education.yearCompleted &&
        Number.isNaN(Number(education.yearCompleted))
      ) {
        nextErrors.yearCompleted = "Use a valid year";
      }
    }

    if (step === 3) {
      if (!experience.employmentStatus) {
        nextErrors.employmentStatus = "Required";
      }
      if (!experience.experienceYears) nextErrors.experienceYears = "Required";
      if (experience.experienceDescription.length > 1000) {
        nextErrors.experienceDescription = "Maximum 1000 characters";
      }
    }

    if (step === 4) {
      if (!sector.sectorPreference) nextErrors.sectorPreference = "Required";
      if (!sector.sectorReason) nextErrors.sectorReason = "Required";
      if (sector.sectorReason.length > 750) {
        nextErrors.sectorReason = "Maximum 750 characters";
      }
    }

    if (step === 5) {
      if (!motivation.whyApplying) nextErrors.whyApplying = "Required";
      if (!motivation.longTermCommitment) {
        nextErrors.longTermCommitment = "Required";
      }
      if (!motivation.howHeard) nextErrors.howHeard = "Required";
      if (motivation.whyApplying.length > 1250) {
        nextErrors.whyApplying = "Maximum 1250 characters";
      }
      if (motivation.longTermCommitment.length > 750) {
        nextErrors.longTermCommitment = "Maximum 750 characters";
      }
    }

    if (step === 6) {
      const missing = questions.some((question) => !responses[question.id]);
      if (missing || questions.length !== 10) {
        nextErrors.assessment = "Answer all 10 assessment questions";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function payloadForStep(step: number) {
    if (step === 1) return personal;
    if (step === 2) {
      return {
        educationLevel: education.educationLevel,
        fieldOfStudy: education.fieldOfStudy || undefined,
        institutionName: education.institutionName || undefined,
        yearCompleted: education.yearCompleted
          ? Number(education.yearCompleted)
          : undefined,
      };
    }
    if (step === 3) {
      return {
        employmentStatus: experience.employmentStatus,
        currentRole: experience.currentRole || undefined,
        experienceYears: experience.experienceYears,
        experienceDescription: experience.experienceDescription || undefined,
      };
    }
    if (step === 4) return sector;
    return motivation;
  }

  async function handleNext() {
    if (!application || !validateStep(currentStep)) return;
    setSaving(true);
    setPageError(null);

    try {
      if (currentStep < 6) {
        await requestJson<{ success: boolean; nextStep: number }>(
          `/api/applications/${application.id}/step/${currentStep}`,
          {
            method: "PATCH",
            body: JSON.stringify(payloadForStep(currentStep)),
          },
        );
        setCurrentStep((step) => step + 1);
        setApplication((current) =>
          current
            ? { ...current, currentStep: Math.max(current.currentStep, currentStep + 1) }
            : current,
        );
      } else {
        const result = await requestJson<AssessmentResult>(
          `/api/applications/${application.id}/assessment`,
          {
            method: "POST",
            body: JSON.stringify({
              responses: questions.map((question) => ({
                questionId: question.id,
                selectedOption: responses[question.id],
              })),
            }),
          },
        );
        setAssessmentResult(result);
        setApplication((current) =>
          current
            ? {
                ...current,
                currentStep: 7,
                assessmentScore: result.score,
                pipelineTrack: result.pipelineTrack,
                isBorderline: result.isBorderline,
              }
            : current,
        );
        setCurrentStep(7);
      }
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Unable to save this step",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitApplication() {
    if (!application) return;
    setSaving(true);
    setPageError(null);

    try {
      await requestJson<{ success: boolean }>(
        `/api/applications/${application.id}/submit`,
        { method: "POST" },
      );
      router.push("/applicant?submitted=true");
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to submit your application",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-surface-primary p-6 md:p-8">
        <section className="rounded-md border border-surface-elevated bg-surface-secondary p-6 shadow-card">
          <p className="text-text-secondary">Loading your application...</p>
        </section>
      </main>
    );
  }

  if (application?.status === "submitted") {
    return (
      <main className="min-h-screen bg-surface-primary p-6 md:p-8">
        <section className="rounded-md border border-brand-lime bg-surface-secondary p-6 shadow-card">
          <p className="text-sm font-medium uppercase text-text-accent">
            Application submitted
          </p>
          <h1 className="mt-3 font-heading text-2xl font-semibold text-text-primary">
            Your application is read-only now.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">
            Your NIDC application has been received. The team will review it and
            contact you with the next steps.
          </p>
        </section>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="min-h-screen bg-surface-primary p-6 md:p-8">
        <section className="rounded-md border border-surface-elevated bg-surface-secondary p-6 shadow-card">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            Application unavailable
          </h1>
          <p className="mt-3 text-text-secondary">
            {pageError ?? "No active application could be loaded."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-primary p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase text-text-accent">
            {progressText}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-text-primary">
            NIDC Application
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-secondary">
            Complete each section and save as you go. Your progress is stored
            after each step.
          </p>
        </header>

        <section className="rounded-md border border-surface-elevated bg-surface-secondary p-6 shadow-card">
          {currentStep <= 6 ? <StepIndicator currentStep={currentStep} /> : null}

          {pageError ? (
            <p className="mt-6 rounded-md border border-status-rejected bg-surface-primary p-4 text-sm font-medium text-status-rejected">
              {pageError}
            </p>
          ) : null}

          <div className="mt-8">
            {currentStep === 1 ? (
              <div className="grid gap-5">
                <Field label="Date of birth" error={errors.dateOfBirth}>
                  <TextInput
                    type="date"
                    value={personal.dateOfBirth}
                    onChange={(value) =>
                      setPersonal((current) => ({
                        ...current,
                        dateOfBirth: value,
                      }))
                    }
                  />
                </Field>
                <Field label="Gender" error={errors.gender}>
                  <TextInput
                    value={personal.gender}
                    onChange={(value) =>
                      setPersonal((current) => ({ ...current, gender: value }))
                    }
                  />
                </Field>
                <Field label="State of origin" error={errors.stateOfOrigin}>
                  <TextInput
                    value={personal.stateOfOrigin}
                    onChange={(value) =>
                      setPersonal((current) => ({
                        ...current,
                        stateOfOrigin: value,
                      }))
                    }
                  />
                </Field>
                <Field
                  label="State of residence"
                  error={errors.stateOfResidence}
                >
                  <TextInput
                    value={personal.stateOfResidence}
                    onChange={(value) =>
                      setPersonal((current) => ({
                        ...current,
                        stateOfResidence: value,
                      }))
                    }
                  />
                </Field>
                <Field label="Phone number" error={errors.phoneNumber}>
                  <TextInput
                    value={personal.phoneNumber}
                    onChange={(value) =>
                      setPersonal((current) => ({
                        ...current,
                        phoneNumber: value,
                      }))
                    }
                  />
                </Field>
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="grid gap-5">
                <Field label="Highest level of education" error={errors.educationLevel}>
                  <SelectInput
                    value={education.educationLevel}
                    onChange={(value) =>
                      setEducation((current) => ({
                        ...current,
                        educationLevel: value,
                      }))
                    }
                  >
                    <option value="">Select one</option>
                    <option value="no_formal_education">No formal education</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="vocational_trade">Vocational or trade</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="postgraduate">Postgraduate</option>
                  </SelectInput>
                </Field>
                <Field label="Field of study">
                  <TextInput
                    value={education.fieldOfStudy}
                    onChange={(value) =>
                      setEducation((current) => ({
                        ...current,
                        fieldOfStudy: value,
                      }))
                    }
                  />
                </Field>
                <Field label="Institution name">
                  <TextInput
                    value={education.institutionName}
                    onChange={(value) =>
                      setEducation((current) => ({
                        ...current,
                        institutionName: value,
                      }))
                    }
                  />
                </Field>
                <Field label="Year completed" error={errors.yearCompleted}>
                  <TextInput
                    value={education.yearCompleted}
                    onChange={(value) =>
                      setEducation((current) => ({
                        ...current,
                        yearCompleted: value,
                      }))
                    }
                  />
                </Field>
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="grid gap-5">
                <Field label="Employment status" error={errors.employmentStatus}>
                  <SelectInput
                    value={experience.employmentStatus}
                    onChange={(value) =>
                      setExperience((current) => ({
                        ...current,
                        employmentStatus: value,
                      }))
                    }
                  >
                    <option value="">Select one</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="self_employed">Self-employed</option>
                    <option value="employed">Employed</option>
                    <option value="student">Student</option>
                  </SelectInput>
                </Field>
                <Field label="Current or most recent role">
                  <TextInput
                    value={experience.currentRole}
                    onChange={(value) =>
                      setExperience((current) => ({
                        ...current,
                        currentRole: value,
                      }))
                    }
                  />
                </Field>
                <Field label="Years of relevant experience" error={errors.experienceYears}>
                  <SelectInput
                    value={experience.experienceYears}
                    onChange={(value) =>
                      setExperience((current) => ({
                        ...current,
                        experienceYears: value,
                      }))
                    }
                  >
                    <option value="">Select one</option>
                    <option value="none">None</option>
                    <option value="less_than_1">Less than 1 year</option>
                    <option value="one_to_3">1 to 3 years</option>
                    <option value="three_to_5">3 to 5 years</option>
                    <option value="five_plus">5+ years</option>
                  </SelectInput>
                </Field>
                <Field
                  label="Brief description of relevant experience"
                  error={errors.experienceDescription}
                >
                  <TextArea
                    value={experience.experienceDescription}
                    maxLength={1000}
                    onChange={(value) =>
                      setExperience((current) => ({
                        ...current,
                        experienceDescription: value,
                      }))
                    }
                  />
                </Field>
              </div>
            ) : null}

            {currentStep === 4 ? (
              <div className="grid gap-5">
                <Field label="Sector preference" error={errors.sectorPreference}>
                  <SelectInput
                    value={sector.sectorPreference}
                    onChange={(value) =>
                      setSector((current) => ({
                        ...current,
                        sectorPreference: value,
                      }))
                    }
                  >
                    <option value="">Select one</option>
                    <option value="energy_systems">Energy Systems</option>
                    <option value="manufacturing_industrial_systems">
                      Manufacturing and Industrial Systems
                    </option>
                    <option value="digital_infrastructure">
                      Digital Infrastructure
                    </option>
                  </SelectInput>
                </Field>
                <Field label="Why this sector?" error={errors.sectorReason}>
                  <TextArea
                    value={sector.sectorReason}
                    maxLength={750}
                    onChange={(value) =>
                      setSector((current) => ({
                        ...current,
                        sectorReason: value,
                      }))
                    }
                  />
                </Field>
              </div>
            ) : null}

            {currentStep === 5 ? (
              <div className="grid gap-5">
                <Field label="Why are you applying to NIDC?" error={errors.whyApplying}>
                  <TextArea
                    value={motivation.whyApplying}
                    maxLength={1250}
                    onChange={(value) =>
                      setMotivation((current) => ({
                        ...current,
                        whyApplying: value,
                      }))
                    }
                  />
                </Field>
                <Field
                  label="What does long-term commitment mean to you?"
                  error={errors.longTermCommitment}
                >
                  <TextArea
                    value={motivation.longTermCommitment}
                    maxLength={750}
                    onChange={(value) =>
                      setMotivation((current) => ({
                        ...current,
                        longTermCommitment: value,
                      }))
                    }
                  />
                </Field>
                <Field label="How did you hear about NIDC?" error={errors.howHeard}>
                  <SelectInput
                    value={motivation.howHeard}
                    onChange={(value) =>
                      setMotivation((current) => ({
                        ...current,
                        howHeard: value,
                      }))
                    }
                  >
                    <option value="">Select one</option>
                    <option value="social_media">Social media</option>
                    <option value="word_of_mouth">Word of mouth</option>
                    <option value="online_search">Online search</option>
                    <option value="event">Event</option>
                    <option value="referred">Referred</option>
                    <option value="other">Other</option>
                  </SelectInput>
                </Field>
              </div>
            ) : null}

            {currentStep === 6 ? (
              <div className="grid gap-6">
                {errors.assessment ? (
                  <p className="rounded-md border border-status-rejected bg-surface-primary p-4 text-sm font-medium text-status-rejected">
                    {errors.assessment}
                  </p>
                ) : null}
                {questions.map((question) => (
                  <fieldset
                    key={question.id}
                    className="border-t border-surface-elevated pt-5"
                  >
                    <legend className="font-heading text-lg font-semibold text-text-primary">
                      {question.order}. {question.question}
                    </legend>
                    <div className="mt-4 grid gap-3">
                      {[
                        ["A", question.optionA],
                        ["B", question.optionB],
                        ["C", question.optionC],
                        ["D", question.optionD],
                      ].map(([value, label]) => (
                        <label
                          key={value}
                          className="flex min-h-11 items-center gap-3 rounded-sm border border-surface-elevated bg-surface-primary px-4 py-3 text-sm text-text-secondary"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={value}
                            checked={responses[question.id] === value}
                            onChange={() =>
                              setResponses((current) => ({
                                ...current,
                                [question.id]: value,
                              }))
                            }
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            ) : null}

            {reviewReady ? (
              <div className="rounded-md border border-brand-lime bg-surface-primary p-6">
                <p className="text-sm font-medium uppercase text-text-accent">
                  Review
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold text-text-primary">
                  Pipeline assignment
                </h2>
                <p className="mt-3 text-base text-text-secondary">
                  Assessment score:{" "}
                  <span className="font-semibold text-text-primary">
                    {assessmentResult?.score ?? application.assessmentScore}
                    /10
                  </span>
                </p>
                <p className="mt-2 text-base text-text-secondary">
                  Assigned track:{" "}
                  <span className="font-semibold text-text-primary">
                    {trackLabel(
                      assessmentResult?.pipelineTrack ??
                        application.pipelineTrack,
                    )}
                  </span>
                </p>
                {(assessmentResult?.isBorderline ?? application.isBorderline) ? (
                  <p className="mt-4 rounded-md border border-status-warning bg-surface-secondary p-4 text-sm font-medium text-status-warning">
                    Your assessment result requires screening team manual
                    review before a final track decision.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className={`${buttonClass} border border-brand-lime bg-transparent text-brand-lime hover:bg-surface-elevated`}
              disabled={saving || currentStep === 1 || currentStep === 7}
              onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
            >
              Back
            </button>

            {currentStep < 7 ? (
              <button
                type="button"
                className={`${buttonClass} bg-brand-lime text-text-on-light hover:bg-brand-green`}
                disabled={saving}
                onClick={handleNext}
              >
                {currentStep === 6 ? "Submit Assessment" : "Next"}
              </button>
            ) : (
              <button
                type="button"
                className={`${buttonClass} bg-brand-lime text-text-on-light hover:bg-brand-green`}
                disabled={saving}
                onClick={handleSubmitApplication}
              >
                Submit Application
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
