import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  {
    order: 1,
    question:
      "You are given a task you have never done before with no instructions. What do you do first?",
    optionA: "Wait for someone to guide you",
    optionB: "Break it into smaller parts and try to understand each one",
    optionC: "Skip it and move to something you know",
    optionD: "Ask someone else to do it",
    correctOption: "B",
  },
  {
    order: 2,
    question:
      "How do you respond when you make a mistake on something important?",
    optionA: "Ignore it and hope no one notices",
    optionB: "Blame the circumstances",
    optionC: "Acknowledge it, understand what went wrong, and correct it",
    optionD: "Give up on the task",
    correctOption: "C",
  },
  {
    order: 3,
    question:
      "You are part of a team and someone disagrees with your approach. What do you do?",
    optionA: "Insist your approach is correct",
    optionB: "Listen to their reasoning and evaluate it objectively",
    optionC: "Give in immediately to avoid conflict",
    optionD: "Ignore their input",
    correctOption: "B",
  },
  {
    order: 4,
    question:
      "A project you are working on is taking longer than expected. What is your response?",
    optionA: "Abandon it for something easier",
    optionB: "Complain about the timeline",
    optionC: "Reassess your approach and keep going",
    optionD: "Wait for someone to tell you what to do",
    correctOption: "C",
  },
  {
    order: 5,
    question:
      "Which of the following best describes how you prefer to learn something new?",
    optionA: "By watching others and copying exactly",
    optionB: "By understanding the principle and applying it yourself",
    optionC: "By memorising steps without understanding why",
    optionD: "By avoiding new things until you feel ready",
    correctOption: "B",
  },
  {
    order: 6,
    question:
      "You receive feedback that your work needs significant improvement. How do you feel?",
    optionA: "Defensive - you believe your work was fine",
    optionB: "Discouraged - you consider quitting",
    optionC: "Grateful - feedback helps you improve",
    optionD: "Indifferent - you do not take it seriously",
    correctOption: "C",
  },
  {
    order: 7,
    question: "What does long-term commitment mean to you?",
    optionA: "Staying involved as long as it is convenient",
    optionB: "Completing something only when rewards are guaranteed",
    optionC: "Staying consistent through difficulty because the goal matters",
    optionD: "Committing until something better comes along",
    correctOption: "C",
  },
  {
    order: 8,
    question:
      "You are asked to contribute to something where your role is small and unglamorous. What do you do?",
    optionA: "Decline - you want a more visible role",
    optionB: "Do it poorly since it does not matter much",
    optionC: "Do it well because contribution is contribution",
    optionD: "Agree but do nothing",
    correctOption: "C",
  },
  {
    order: 9,
    question:
      "How do you handle a situation where you do not have enough information to proceed?",
    optionA: "Guess and hope for the best",
    optionB: "Stop completely until someone provides all the information",
    optionC: "Identify what you know, what you need, and find a way to get it",
    optionD: "Proceed as if the missing information does not matter",
    correctOption: "C",
  },
  {
    order: 10,
    question:
      "What is your primary reason for wanting to develop yourself in a structured system like NIDC?",
    optionA: "To get a certificate to add to my CV",
    optionB: "To build real capability and contribute to something meaningful",
    optionC: "Because I have nothing else to do right now",
    optionD: "To network with people who can give me a job quickly",
    correctOption: "B",
  },
];

async function main() {
  for (const question of questions) {
    const existing = await prisma.assessmentQuestion.findFirst({
      where: { order: question.order },
      select: { id: true },
    });

    if (existing) {
      await prisma.assessmentQuestion.update({
        where: { id: existing.id },
        data: question,
      });
    } else {
      await prisma.assessmentQuestion.create({
        data: question,
      });
    }
  }

  console.log("Assessment questions seeded successfully");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
