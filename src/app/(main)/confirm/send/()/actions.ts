'use server'

import { AccountConfirmationToken } from '@/auth'
import { route } from '@/utils'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

async function _sendConfirmationEmail(user: User) {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    } satisfies AccountConfirmationToken,
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
  )
  const confirmationUrl = process.env.NEXT_PUBLIC_URL + route(`/confirm/accept/${token}`)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'igor.bistr01092003',
      pass: 'qekw tucz vpng igvv',
    },
  })
  const emailDelivery = {
    from: 'edurka.edu@yandex.ru',
    to: user.email,
    subject: 'Подтверждения аккаунта на Edurka',
    html: `
      <h1>Регистрация на Edurka</h1>
      <p>Перейдите по <a href="${confirmationUrl}">этой ссылке</a>, чтобы завершить регистрацию.</p>
    `,
  }
  const res = await transporter.sendMail(emailDelivery)
  return res
}

export async function sendConfirmationEmail(user: User) {
  return await _sendConfirmationEmail.bind(null, user)()
}
