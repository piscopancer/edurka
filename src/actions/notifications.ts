'use server'

import { db } from '#/prisma'

export async function deleteNotification(id: number) {
  await db.notification.delete({
    where: {
      id,
    },
  })
}
