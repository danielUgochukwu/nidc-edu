-- CreateEnum
CREATE TYPE "PipelineTrack" AS ENUM ('educational_pathway', 'direct_development_track', 'borderline');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('draft', 'submitted', 'under_review', 'shortlisted', 'rejected', 'accepted');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('no_formal_education', 'primary', 'secondary', 'vocational_trade', 'undergraduate', 'postgraduate');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('unemployed', 'self_employed', 'employed', 'student');

-- CreateEnum
CREATE TYPE "ExperienceYears" AS ENUM ('none', 'less_than_1', 'one_to_3', 'three_to_5', 'five_plus');

-- CreateEnum
CREATE TYPE "SectorPreference" AS ENUM ('energy_systems', 'manufacturing_industrial_systems', 'digital_infrastructure');

-- CreateEnum
CREATE TYPE "HowHeard" AS ENUM ('social_media', 'word_of_mouth', 'online_search', 'event', 'referred', 'other');

-- CreateEnum
CREATE TYPE "PipelineStage" AS ENUM ('enrolled', 'foundation_learning', 'university_integration', 'skill_development', 'applied_practice', 'mentorship', 'deployment');

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'draft',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "pipelineTrack" "PipelineTrack",
    "pipelineStage" "PipelineStage",
    "assessmentScore" INTEGER,
    "isBorderline" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_personal_info" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "stateOfResidence" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_personal_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_education_info" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "educationLevel" "EducationLevel" NOT NULL,
    "fieldOfStudy" TEXT,
    "institutionName" TEXT,
    "yearCompleted" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_education_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_experience_info" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "employmentStatus" "EmploymentStatus" NOT NULL,
    "currentRole" TEXT,
    "experienceYears" "ExperienceYears" NOT NULL,
    "experienceDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_experience_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_sector_info" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "sectorPreference" "SectorPreference" NOT NULL,
    "sectorReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_sector_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_motivation_info" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "whyApplying" TEXT NOT NULL,
    "longTermCommitment" TEXT NOT NULL,
    "howHeard" "HowHeard" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_motivation_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correctOption" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_responses" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOption" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_userId_key" ON "applications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "application_personal_info_applicationId_key" ON "application_personal_info"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "application_education_info_applicationId_key" ON "application_education_info"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "application_experience_info_applicationId_key" ON "application_experience_info"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "application_sector_info_applicationId_key" ON "application_sector_info"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "application_motivation_info_applicationId_key" ON "application_motivation_info"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_responses_applicationId_questionId_key" ON "assessment_responses"("applicationId", "questionId");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "cohorts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_personal_info" ADD CONSTRAINT "application_personal_info_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_education_info" ADD CONSTRAINT "application_education_info_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_experience_info" ADD CONSTRAINT "application_experience_info_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_sector_info" ADD CONSTRAINT "application_sector_info_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_motivation_info" ADD CONSTRAINT "application_motivation_info_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "assessment_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
