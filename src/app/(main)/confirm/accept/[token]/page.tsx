import { db } from '#/prisma'
import { AccountConfirmationToken, Token } from '@/auth'
import { pagePathSchema } from '@/types/path'
import jwt from 'jsonwebtoken'
import Link from 'next/link'
import { TbCheck } from 'react-icons/tb'
import { z } from 'zod'

const pathPathSchema = pagePathSchema({
  paramsSchema: {
    token: z.string().min(1),
  },
})

export default async function AcceptConfirmationPage(path: unknown) {
  const parseRes = pathPathSchema.safeParse(path)

  if (!parseRes.success) {
    return 'Invalid token'
  }

  let verifiedToken: Token | undefined = undefined
  try {
    verifiedToken = jwt.verify(parseRes.data.params.token, process.env.JWT_SECRET!) as AccountConfirmationToken
  } catch (tokenError) {
    return <p>Damaged link</p>
  }
  const dbUser = await db.user.findFirst({
    where: {
      id: verifiedToken.id,
    },
  })

  if (!dbUser) {
    return <p>User does not exist</p>
  }

  if (dbUser.confirmed) {
    return <p>User's accound is already confirmed</p>
  }

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      confirmed: true,
    },
  })

  return (
    <div className='mt-[15vh] text-center'>
      <TbCheck className='mb-8 inline-block size-32 rounded-full bg-accent/10 stroke-accent p-8' />
      <h1 className='mb-4'>Your account has been successfully confirmed</h1>
      <Link href={'/home/courses'} className='inline-block rounded-md bg-zinc-900 px-4 py-2 text-zinc-200 duration-100 hover:bg-zinc-800'>
        Go to courses
      </Link>
    </div>
  )
}
