import { TbMicroscope, TbNotebook, TbPresentation } from 'react-icons/tb'
import SignUp from './()/sign-up'

export default function WelcomePage() {
  return (
    <div>
      <section className='relative mb-[30vh] mt-[15vh]'>
        <TbMicroscope className='absolute left-[10%] top-[45%] size-32 animate-float stroke-zinc-300' />
        <TbPresentation className='absolute right-[10%] top-[30%] size-32 animate-float stroke-zinc-300' />
        <h2 className='relative mx-auto mb-4 w-fit rounded-full border border-dashed px-4 text-center font-mono'>Edurka</h2>
        <h1 className='relative mx-auto max-w-screen-md text-center text-5xl font-medium leading-snug'>
          Easy to use education platform for{' '}
          <span className='bg-accent/10 text-accent'>
            <a href=''>students</a>
          </span>{' '}
          and{' '}
          <span className='bg-accent/10 text-accent'>
            <a href=''>tutors</a>
          </span>
        </h1>
      </section>
      <section className='mb-24'>
        <div className='mx-auto max-w-screen-md'>
          <div className='flex flex-col items-center justify-center'>
            <TbNotebook className='mb-8 size-32 rounded-full bg-accent/10 stroke-accent p-8' />
          </div>
          <SignUp id='sign-up' className='px-12 py-6' />
        </div>
      </section>
    </div>
  )
}
