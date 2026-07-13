-- CreateEnum
CREATE TYPE "CohortStatus" AS ENUM ('draft', 'open', 'closed', 'completed');

-- CreateTable
CREATE TABLE "cohorts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CohortStatus" NOT NULL DEFAULT 'draft',
    "applicationWindowOpen" TIMESTAMP(3),
    "applicationWindowClose" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cohorts_pkey" PRIMARY KEY ("id")
);
