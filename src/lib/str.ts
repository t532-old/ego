import { Callable } from '../types'
import { fromValue, executeAll } from '../executor'
import { Str } from './types'

export const Lib = [
    {
        name: '\'',
        value: Callable(async (exprs, parent) => {
            const names = await executeAll(exprs, parent)
            const str = names.map(i => i.variableName).join('')
            return fromValue(Str(str))
        })
    }, {
        name: 'Str',
        value: Callable(async (exprs, parent) => {
            const names = await executeAll(exprs, parent)
            const str = names.map(i => i.variableName).join('')
            return fromValue(Str(str))
        }),
    }
]
