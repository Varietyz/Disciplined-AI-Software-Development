const QUOTES: ReadonlySet<string> = new Set(['"', "'"]);
const WHITESPACE: ReadonlySet<string> = new Set([" ", "\t", "\n", "\r"]);

class Tokenizer {
    private readonly words: string[] = [];
    private current = "";
    private quote = "";

    public tokenize(command: string): string[] {
        for (const char of command) {
            this.feed(char);
        }
        this.flush();
        return this.words;
    }

    private feed(char: string): void {
        if (this.quote !== "") {
            this.inQuote(char);
            return;
        }
        if (QUOTES.has(char)) {
            this.quote = char;
            return;
        }
        if (WHITESPACE.has(char)) {
            this.flush();
            return;
        }
        this.current += char;
    }

    private inQuote(char: string): void {
        if (char === this.quote) {
            this.quote = "";
            return;
        }
        this.current += char;
    }

    private flush(): void {
        if (this.current !== "") {
            this.words.push(this.current);
            this.current = "";
        }
    }
}

export const tokenizeCommand = function tokenizeCommand(command: string): string[] {
    return new Tokenizer().tokenize(command);
};
