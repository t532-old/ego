export namespace Tokenizer {
    export namespace REGEX {
        export const WHITESPACE = /\s/,
            STRING_DELIM = /"/,
            STRING_REG = /\\/,
            PAREN = /\(|\)/
    }
    export function tokenize(raw: string) {
        const tokens = ['']
        const last = () => tokens.length - 1
        let inStr = false, strReg = false
        for (const chr of raw) {
            if (inStr) {
                tokens[last()] += chr
                if (strReg)
                    strReg = false
                else if (REGEX.STRING_REG.test(chr))
                    strReg = true
                else if (REGEX.STRING_DELIM.test(chr)) {
                    tokens.push('')
                    inStr = false
                }
            } else {
                if (REGEX.WHITESPACE.test(chr)) {
                    if (tokens[last()].length) tokens.push('')
                } else if (REGEX.STRING_DELIM.test(chr)) {
                    tokens.push(chr)
                    inStr = true
                } else if (REGEX.PAREN.test(chr))
                    tokens.push(chr, '')
                else tokens[last()] += chr
            }
        }
        return tokens.filter(i => i.length)
    }
}
