import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Recruiter
  const recruiterPassword = await bcrypt.hash('password123', 10)
  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@example.com' },
    update: {},
    create: {
      email: 'recruiter@example.com',
      name: 'John Recruiter',
      password: recruiterPassword,
      role: 'RECRUITER',
    },
  })

  // Create Applicant
  const applicantPassword = await bcrypt.hash('password123', 10)
  await prisma.user.upsert({
    where: { email: 'applicant@example.com' },
    update: {},
    create: {
      email: 'applicant@example.com',
      name: 'Jane Applicant',
      password: applicantPassword,
      role: 'APPLICANT',
    },
  })

  // Create Jobs
  const jobsData = [
    {
      title: 'Senior Frontend Developer',
      description: 'We are looking for an experienced Frontend Developer to join our team. You should have deep knowledge of React, Next.js, and Tailwind CSS. Experience with TypeScript is a must.',
      location: 'San Francisco, CA',
      type: 'FULL_TIME',
      employmentType: 'REMOTE',
      experienceLevel: 'Senior',
      skills: 'React,Next.js,TypeScript,Tailwind CSS',
      status: 'OPEN',
      recruiterId: recruiter.id,
    },
    {
      title: 'Full Stack Engineer',
      description: 'Join our fast-growing startup as a Full Stack Engineer. You will work on everything from database design to UI components. Stack: Node.js, PostgreSQL, React.',
      location: 'New York, NY',
      type: 'FULL_TIME',
      employmentType: 'HYBRID',
      experienceLevel: 'Mid Level',
      skills: 'Node.js,PostgreSQL,React,Docker',
      status: 'OPEN',
      recruiterId: recruiter.id,
    },
    {
      title: 'UX/UI Designer',
      description: 'Create beautiful and intuitive user experiences for our enterprise platform. Proficiency in Figma and a strong portfolio are required.',
      location: 'Austin, TX',
      type: 'CONTRACT',
      employmentType: 'OFFICE',
      experienceLevel: 'Mid Level',
      skills: 'Figma,Adobe XD,UI Design,UX Research',
      status: 'OPEN',
      recruiterId: recruiter.id,
    },
    {
      title: 'DevOps Engineer',
      description: 'Help us scale our infrastructure and automate our deployment pipelines. Knowledge of AWS, Kubernetes, and Terraform is essential.',
      location: 'Seattle, WA',
      type: 'FULL_TIME',
      employmentType: 'REMOTE',
      experienceLevel: 'Senior',
      skills: 'AWS,Kubernetes,Terraform,CI/CD',
      status: 'OPEN',
      recruiterId: recruiter.id,
    },
    {
      title: 'Product Manager',
      description: 'Define the vision and roadmap for our core product. Work closely with engineering, design, and marketing teams to deliver high-impact features.',
      location: 'Chicago, IL',
      type: 'FULL_TIME',
      employmentType: 'OFFICE',
      experienceLevel: 'Lead',
      skills: 'Product Strategy,Agile,Roadmapping,Analytics',
      status: 'OPEN',
      recruiterId: recruiter.id,
    },
  ]

  for (const job of jobsData) {
    await prisma.job.create({
      data: job as any, // Keeping as any for simplicity in seed if it's dynamic
    })
  }

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
