# Ego
A programming language for no purpose.

Aims to:
- Have a selected, unextensible set of types:
    - Integer (of any precision): TypeID `int`, underlying type `bigint`
    - Float (64bit double-precision): TypeID `float`, underlying type `number`
    - String: TypeID `string`, underlying type `string`
    - Boolean: TypeID `bool`, underlying type `boolean`
    - Null: TypeID `null`, underlying type `null`
    - Hash Table: TypeID `scope`, underlying type `Scope`
    - List: TypeID `list`, underlying type `Scope`
    - Executable: TypeID `exec`, underlying type `Executable`
    - Callable: TypeID `*/callable`, underlying type `AsyncFunction`
- Have a simplistic syntax (Only identifiers and function calls; no literals, keywords or anything else)
- Implement runtime "macro"s, which allows developers to arrange execution order and time

It's a script language and is expected to run very slow.

## Spec
> TODO

## Standard Lib
> ❓ Planning; ⚠️ Working On It; ✅ Done

- ✅ Constants - TRUE, FALSE and NULL
- ✅ Preload - Functions for importing other libs
- ✅ Scope - Hash table
- ⚠️ Util - Miscalleneous
- ✅ Var - Declare, set and compare variables
- ⚠️ Num - Basic rational calculation
- ❓ Expr - Operations on expressions, for building runtime "macro"s
- ❓ Flow - Control the program flow
- ❓ Iter - Tools for iterables, e.g. map, reduce, filter, etc
- ❓ Async - Async utility
- ❓ Math - Identical to JavaScript Math utility
- ⚠️ Str - String tools
- ❓ Node - Interact with Node.js
