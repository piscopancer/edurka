import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export default function UseronlyPage() {
  const token = cookies().get('auth')

  if (!token) return <p>No token</p>

  try {
    const user = jwt.verify(token.value, process.env.JWT_SECRET!)
    return <pre>{JSON.stringify(user, null, 2)}</pre>
  } catch (error) {
    return <pre className='text-red-500'>{(error as Error).message}</pre>
  }
}
