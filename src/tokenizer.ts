export namespace Tokenizer {
    const WHITESPACE = /\s/,
        STRING_DELIM = /"/,
        STRING_REG = /\\/,
        PAREN = /\(|\)/
    export interface Token {
        token: string
        row: number
        col: number
    }
    export function tokenize(raw: string) {
        const last = () => tokens.length - 1
        let inStr = false, strReg = false
        let row = 1, col = 1
        const tokens: Token[] = [{ token: '', row, col }]
        for (const chr of raw) {
            if (!tokens[last()].token.length)
                tokens[last()] = { token: '', row, col }
            if (inStr) {
                if (strReg) {
                    tokens[last()].token += chr
                    strReg = false
                } else if (STRING_REG.test(chr))
                    strReg = true
                else if (STRING_DELIM.test(chr))
                    inStr = false
                else tokens[last()].token += chr
            } else {
                if (WHITESPACE.test(chr)) {
                    if (tokens[last()].token.length) tokens.push({ token: '', row, col })
                } else if (STRING_DELIM.test(chr))
                    inStr = true
                else if (PAREN.test(chr))
                    tokens.push({ token: chr, row, col }, { token: '', row, col })
                else tokens[last()].token += chr
            }
            col++
            if (chr === '\n') {
                col = 1
                row++
            }
        }
        return tokens.filter(i => i.token.length)
    }
}
