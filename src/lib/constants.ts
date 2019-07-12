import { Null } from '../types'
import { Bool } from './types'

export const Lib = [
    { name: 'NULL', value: Null() },
    { name: 'TRUE', value: Bool(true) },
    { name: 'FALSE', value: Bool(false) },
]
