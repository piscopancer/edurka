import twConfig from '#/tailwind.config'
import type { Route } from 'next'
import resolveConfig from 'tailwindcss/resolveConfig'
import { useSnapshot } from 'valtio'

export type NextPage<ParamsAlias extends string | never = never, SearchParams extends string[] = []> = {
  params: ParamsAlias extends never ? never : Record<ParamsAlias, string>
  searchParams: Record<SearchParams[number], string | null>
}

export function objectEntries<O extends object>(obj?: O) {
  return Object.entries(obj ?? {}) as [keyof O, O[keyof O]][]
}

export type StrictOmit<T extends { [K in string]: unknown }, K extends keyof T> = Omit<T, K>

export async function wait(seconds: number) {
  return new Promise((res) => setTimeout(res, seconds * 1000))
}

export function randomFromArray<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export function assignObject<T extends {} | undefined>(obj: T, newObj: T) {
  obj ? Object.assign(obj, newObj) : () => (obj = newObj)
}

export type RedefinedProperties<T, P extends Partial<Record<keyof T, unknown>>> = {
  [K in keyof T]: K extends keyof P ? P[K] : T[K]
}

export function cutStart(whole: string, length: number) {
  let firstPart = whole.slice(0, length)
  let secondPart = whole.slice(length)
  return [firstPart, secondPart] as const
}

export type Snapshot<T extends object> = ReturnType<typeof useSnapshot<T>>

export function route<R extends string>(route: Route<R>, searchParams?: Record<string, string>) {
  if (searchParams) {
    const searchParamsString = new URLSearchParams(searchParams).toString()
    return `${route}?${searchParamsString}` as Route<R>
  } else {
    return route as Route<R>
  }
}

export const ease = [0.3, 1, 0, 1] as const

export const { theme } = resolveConfig(twConfig)

export function getShuffledArray<T extends unknown>(array: readonly T[] | T[], seed: number): T[] {
  function random(seed: number) {
    var x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }
  const shuffled = [...array]
  let m = shuffled.length,
    t,
    i
  while (m) {
    i = Math.floor(random(seed) * m--)
    t = shuffled[m]
    shuffled[m] = shuffled[i]
    shuffled[i] = t
    ++seed
  }
  return shuffled
}

export function clone<O extends object>(obj: O) {
  return JSON.parse(JSON.stringify(obj)) as O
}

export function randomItemsFromArray<T>(arr: T[], num: number) {
  let result = []
  let arrCopy = [...arr]
  while (result.length < num) {
    let randomIndex = Math.floor(Math.random() * arrCopy.length)
    result.push(arrCopy[randomIndex])
    arrCopy.splice(randomIndex, 1)
  }
  return result
}

export function groupArray<T extends object, P extends string>(
  arr: Readonly<T[]> | T[],
  by: (item: T) => P,
): Record<P, T[]> {
  const groups: any = {}
  for (let i = 0; i < arr.length; i++) {
    const prop = by(arr[i])
    if (!groups[prop]) {
      groups[prop] = [arr[i]]
    } else {
      groups[prop].push(arr[i])
    }
  }
  return groups as Record<P, T[]>
}
