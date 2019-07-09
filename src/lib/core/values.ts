import { Null } from '../../types'
import { Bool } from './types'

export const nullValue = { name: 'null', value: Null() }
export const trueValue = { name: 'true', value: Bool(true) }
export const falseValue = { name: 'false', value: Bool(false) }
