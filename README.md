# Ego
A programming language for no purpose.

Aims to:
- Have the least basic types (Rational `num`, HashTable `scope`, Boolean `bool`, Null `null`)
- Have some unusual(?) high-level types (Callable `*/callable`, Expression Wrapper `expr`)
- Have a simplistic syntax (Only identifiers and function calls; no literals, keywords or anything else)
- Implement runtime "macro"s, which allows developers to arrange execution order and time

It's a script language and is expected to run very slow.

## Spec
> TODO

## Standard Lib
> ❓ Planning; ⚠️ Working On It; ✅ Done

- ✅ Constants - TRUE, FALSE and NULL
- ✅ Preload - Load libs with these functions
- ✅ Scope - Hash table
- ✅ Util - Miscalleneous
- ⚠️ Var - Declare, set and compare variables
- ⚠️ Num - Basic rational calculation
- ❓ Expr - Operations on expressions, for building runtime "macro"s
- ❓ Flow - Control the program flow
- ❓ Iter - Tools for arrays, e.g. map, reduce, filter, etc *(arrays are just scopes)*
- ❓ Async - Async utility
- ❓ Math - Identical to JavaScript Math utility
- ❓ Str - String tools *(strings are just arrays)*
- ❓ Node - Interact with Node.js
