type TaskBase<T> = {
  id: number
  name: string
  type: T
}

type AutoTask<T, A> = TaskBase<T> & {
  correctAnswer: A
}

type ManualTask<T> = TaskBase<T>

type AgreeTask = AutoTask<'agree', boolean>

type SelectOneTask = AutoTask<'select-one', string>

type SelectManyTask = AutoTask<'select-many', string[]>

type FillGapsTask = AutoTask<'fill-gaps', {}[]>
