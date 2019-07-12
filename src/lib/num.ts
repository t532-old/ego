import { Callable } from '../types'
import { fromValue, executeAll } from '../executor'
import { assertType, assertLength } from '../util'
import { Num, Int } from './types'

function gcd(numerator: bigint, denominator: bigint) {
    while (denominator !== 0n)
        [numerator, denominator] = [
            denominator,
            numerator % denominator,
        ]
    return numerator
}

export const Lib = [
    {
        name: '#',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            return fromValue(Int(BigInt(variableName)))
        })
    }, {
        name: '##',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            const [num, denom] = await executeAll(exprs, scope)
            return fromValue(Num(BigInt(num.variableName), BigInt(denom.variableName)))
        })
    }, {
        name: 'Int',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            const { variableName } = await exprs[0].execute(scope)
            return fromValue(Int(BigInt(variableName)))
        })
    }, {
        name: 'Num',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 2)
            const [num, denom] = await executeAll(exprs, scope)
            return fromValue(Num(BigInt(num.variableName), BigInt(denom.variableName)))
        })
    }, {
        name: 'gcd',
        value: Callable(async (exprs, scope) => {
            assertLength(exprs, 1)
            let { value: { numerator, denominator } }: {
                value: {
                    numerator: bigint
                    denominator: bigint
                }
            } = assertType(await executeAll(exprs, scope), 'num')[0]
            return fromValue(Int(gcd(numerator, denominator)))
        })
    },
]
