# Ego
A try on implementing a programming language.

## Syntax
Everything is variable or function call.

### Hello World
```ego
write('("Hello World"))
```

### A+B+...+N Problem
```ego
def( nums
    map( split(readline() '(" "))
        fn(i) ( tonumber(i) ) ) )
write(
    reduce( nums #(0)
        fn(a i) ( +(a i) ) ) )
```

### O(sqrt(n)) isprime
```ego
def( isprime
    fn(n s) (
        setnull(s #(2))
        if ( >(s sqrt(n)) ) ( true )
        if ( =(%(n s) #(0))) ) ( false )
        isprime(n +(s #(1))) ) )
```

## Roadmap
- [x] Tokenizer
- [x] AST Generator
- [x] Language Core
- [ ] Standard Lib **WIP**
- [ ] CLI/REPL