import { isNil } from 'lodash'

export function notEmpty<TValue> (
  value: TValue | null | undefined
): value is TValue {
  return !isNil(value)
}
