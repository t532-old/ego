# pole
A try on implementing a programming language.

## Syntax (WIP)
Everything is literal, variable or function call.

### Hello World
```pole
write("Hello World")
```

### A+B+...+N Problem
```pole
def( nums
    map( split(readline() " ")
        fn(i) ( tonumber(i) ) ) )
write(
    reduce( nums 0
        fn(a i) ( +(a i) ) ) )
```

### O(sqrt(n)) isprime
```pole
def( isprime
    fn(n s) (
        defnull(s 2)
        if ( >(s sqrt(n)) ) ( true )
        if ( =(%(n s) 0)) ) ( false )
        isprime(n +(s 1)) ) )
```

## Roadmap
- [x] Tokenizer
- [x] AST Generator
- [ ] Language Core
    - [ ] Scopes & Closures
    - [ ] Def/Fn/Array/... Expressions
    - [ ] If/For/While/... Expressions
- [ ] Standard Lib
- [ ] CLI/REPL