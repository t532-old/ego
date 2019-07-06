import { Environment } from './environment'
import { Executor } from './executor'
import { Types } from './types'

export namespace Interpreter {
    export const globalScope = new Environment.Scope()

    globalScope.create('null')
    globalScope.set('null', Types.Null())

    globalScope.create('false')
    globalScope.set('false', Types.Boolean(false))

    globalScope.create('true')
    globalScope.set('true', Types.Boolean(true))

    globalScope.create('decl')
    globalScope.set('decl', Types.Callable(Types.Null(), async (args, parent) => {
        let retname = 'null'
        for (const expr of args) {
            const { name } = (await expr.execute(parent)).get()
            parent.create(retname = name)
        }
        return Executor.makeExecutableFromVariable(parent.get(retname))
    }))

    globalScope.create('set')
    globalScope.set('set', Types.Callable(Types.Null(), async (args, parent) => {
        const [varExpr, valExpr] = args
        const variable = await varExpr.execute(parent),
            value = await valExpr.execute(parent)
        variable.set(value.value())
        return Executor.makeExecutableFromVariable(variable.get())
    }))

    globalScope.create('def')
    globalScope.set('def', Types.Callable(Types.Null(), async (args, parent) => {
        const [varExpr, valExpr] = args
        await parent.call('decl', [varExpr], parent)
        await parent.call('set', [varExpr, valExpr], parent)
        return varExpr
    }))

    globalScope.create('{}')
    globalScope.set('{}', Types.Callable(Types.Null(), async (args, parent) => {
        const scope = new Environment.Scope(parent)
        args.forEach((expr, idx) => {
            if (idx % 2) return
            else scope.call('def', [expr, args[idx + 1]], scope)
        })
        return Executor.makeExecutableFromValue(Types.Scope(scope))
    }))

    globalScope.create('#')
    globalScope.set('#', Types.Callable(Types.Null(), async (args, parent) => {
        const name = (await args[0].execute(parent)).get().name as string
        return Executor.makeExecutableFromValue(Types.Number(Number(name)))
    }))

    globalScope.create('\'')
    globalScope.set('\'', Types.Callable(Types.Null(), async (args, parent) => {
        const name = (await args[0].execute(parent)).get().name as string
        return Executor.makeExecutableFromValue(Types.String(name))
    }))

    globalScope.create('.')
    globalScope.set('.', Types.Callable(Types.Null(), async (args, parent) => {
        const [scopeExpr, nameExpr] = args
        const scope = (await scopeExpr.execute(parent)).value().value as Environment.Scope,
            name = (await nameExpr.execute(parent)).get().name
        return Executor.makeExecutableFromVariable(scope.get(name))
    }))

    globalScope.create('+')
    globalScope.set('+', Types.Callable(Types.Null(), async (args, parent) => {
        const sum = (await Promise.all(
            args
            .map(async expr => (await expr.execute(parent)).value().value as number)))
        .reduce((acc, num) => acc + num)
        return Executor.makeExecutableFromValue(Types.Number(sum))
    }))

    globalScope.create('tostring')
    globalScope.set('tostring', Types.Callable(Types.Null(), async (args, parent) => {
        const num = (await args[0].execute(parent)).value().value as number
        return Executor.makeExecutableFromValue(Types.String(String(num)))
    }))

    globalScope.create('write')
    globalScope.set('write', Types.Callable(Types.Null(), async (args, parent) => {
        console.log(...await Promise.all(args.map(async expr => (await expr.execute(parent)).value().value)))
        return Executor.makeExecutableFromValue(Types.Null())
    }))

    globalScope.create('fn')
    globalScope.set('fn', Types.Callable(Types.Null(), async (paramExprs, outerParent) => {
        const params = await Promise.all(paramExprs
            .map(async expr => (await expr.execute(outerParent)).get().name))
        const handler = Types.Callable(Types.Null(), async (exprs, innerParent) => {
            const fn = Types.Callable(Types.Null(), async argExprs => {
                const scope = new Environment.Scope(innerParent)
                const args = await Promise.all(argExprs
                    .map(async expr => (await expr.execute(innerParent)).value()))
                args.forEach((arg, idx) => {
                    scope.create(params[idx])
                    scope.set(params[idx], arg)
                })
                let retval: Types.Value = Types.Null()
                for (const expr of exprs) {
                    const value = (await expr.execute(scope)).value()
                    if (value.call || value.type !== Types.ID.NULL)
                        retval = value
                }
                return Executor.makeExecutableFromValue(retval)
            })
            return Executor.makeExecutableFromValue(fn)
        })
        return Executor.makeExecutableFromValue(handler)
    }))
    
    export async function interpret(code: string) {
        const exprs = Executor.makeExpressions(code)
        for (const expr of exprs)
            await expr.execute(globalScope)
    }
}