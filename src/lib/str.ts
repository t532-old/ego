import { Callable } from '../types'
import { fromValue, executeAll } from '../executor'
import { assertTypeof, assertLength } from '../util'
import { Str } from './types'

export const Lib = [
    {
        name: '\'',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            return fromValue(Str(variableName))
        })
    }, {
        name: 'Str',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            return fromValue(Str(variableName))
        })
    }, {
        name: '$',
        value: Callable(async (exprs, scope) => {
            const values = await executeAll(exprs, scope)
            assertTypeof(values.map(i => i.value), 'string')
            return fromValue(Str(values.map(i => i.value).join('')))
        })
    }
]
