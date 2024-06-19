import { $Enums, Prisma } from '@prisma/client'
import { queryNotifications } from './actions/users'

export type Notifications = Awaited<ReturnType<typeof queryNotifications>>[number]
export type Notification<T extends $Enums.NotificationType> = Notifications & { type: T }

export function getSharedNotificationsFindManyArgs(receiverId: number) {
  return {
    where: {
      receiverId,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          surname: true,
          middlename: true,
        },
      },
    },
  } satisfies Prisma.NotificationFindManyArgs
}

// export async function prefetchNotifications(queryClient: QueryClient, userId: number) {
//   await queryClient.prefetchQuery({
//     queryKey: queryKeys.notifications(userId),
//     queryFn: () => queryNotifications(userId),
//   })
// }
