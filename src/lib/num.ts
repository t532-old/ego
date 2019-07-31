import { Callable } from '../types'
import { fromValue } from '../executor'
import { assertLength } from '../util'
import { Float, Int } from './types'
import { Exception } from '../throwable'

export const Lib = [
    {
        name: '#',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            try { return fromValue(Int(BigInt(variableName))) }
            catch { throw new Exception('Invalid integer literal') }
        })
    }, {
        name: '##',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            const value = Number(variableName)
            if (!isNaN(value)) return fromValue(Float(value))
            else throw new Exception('Invalid float literal')
        })
    }, {
        name: 'Int',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            try { return fromValue(Int(BigInt(variableName))) }
            catch { throw new Exception('Invalid integer literal') }
        })
    }, {
        name: 'Float',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            const value = Number(variableName)
            if (!isNaN(value)) return fromValue(Float(value))
            else throw new Exception('Invalid float literal')
        })
    }
]
