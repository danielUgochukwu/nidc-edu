-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
