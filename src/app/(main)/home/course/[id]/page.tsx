import { Tooltip } from '@/components/tooltip'
import { qc } from '@/query/server'
import { formatDate } from '@/utils'
import Link from 'next/link'
import { Course, coursePageUrlSchema, courseQueryKeys } from './()'
import { queryCourse } from './()/server'
import Tabs from './()/tabs'
import Title from './()/title'

/**
 * createdAt, tutor details (link to user page)
 * students: total, average completion (tutor mode)
 * groups: total, average completion (tutor mode)
 * works filter panel
 * works
 */

export default async function CoursePage(url: unknown) {
  const urlParse = coursePageUrlSchema.safeParse(url)

  if (!urlParse.success) return 'Invalid course id'

  const course = await queryCourse(urlParse.data.params.id)
  if (course) {
    qc.setQueryData<Course>(courseQueryKeys.course(urlParse.data.params.id), course)
  }

  if (!course) return <p>Course does not exist</p>

  return (
    <div className='grid grid-cols-[1fr,auto]'>
      <article className='border-r pt-8'>
        <div className='mx-6 mb-8 flex flex-wrap gap-3 text-sm'>
          <div className='flex w-fit items-center rounded-lg border'>
            <span className='bg-halftone rounded-l-lg border-r px-2 py-1'>Created at</span>
            <time className='px-2'>{formatDate(course.createdAt)}</time>
          </div>
          <div className='flex w-fit items-center rounded-lg border'>
            <span className='bg-halftone rounded-l-lg border-r px-2 py-1'>Tutor</span>
            <Tooltip content={`See tutor's profile`}>
              <Link href={`/`} className='px-2 hover:underline'>
                {course.tutor.surname} {course.tutor.name} {course.tutor.middlename}
              </Link>
            </Tooltip>
          </div>
        </div>
        <Title courseId={course.id} className='mx-6 mb-8' />
        <Tabs courseId={course.id} />
      </article>
      <aside className=''>
        <article className='border-b border-dashed px-6 py-4'>
          <p className='mb-2'>
            <span className='text-2xl font-medium'>{course.groups.length}</span> groups
          </p>
          <button className='block w-full rounded-lg border px-6 py-1 text-sm'>See all groups</button>
        </article>
        <article className='border-b border-dashed px-6 py-4'>
          <p className='mb-2'>
            <span className='text-2xl font-medium'>{course.students.length}</span> students
          </p>
          <button className='block w-full rounded-lg border px-6 py-1 text-sm'>See all students</button>
        </article>
      </aside>
    </div>
  )
}
