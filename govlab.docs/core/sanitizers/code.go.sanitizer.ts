const PAIR = 2;
const LINE_BREAK = "\n";
const RAW_QUOTE = "`";
const ESCAPE = "\\";
const QUOTES: ReadonlySet<string> = new Set(['"', "'", RAW_QUOTE]);
const BLANK_PAIR = "  ";

const blank = function blank(char: string): string {
    return char === LINE_BREAK ? LINE_BREAK : " ";
};

class GoSanitizer {
    readonly #src: string;
    readonly #length: number;
    #at = 0;
    #out = "";

    public constructor(src: string) {
        this.#src = src;
        this.#length = src.length;
    }

    public run(): string {
        while (this.#at < this.#length) {
            this.#step();
        }
        return this.#out;
    }

    #char(offset = 0): string {
        return this.#src.charAt(this.#at + offset);
    }

    #step(): void {
        const char = this.#char();
        if (QUOTES.has(char)) {
            this.#scanString(char);
        } else if (char === "/" && this.#char(1) === "/") {
            this.#scanLineComment();
        } else if (char === "/" && this.#char(1) === "*") {
            this.#scanBlockComment();
        } else {
            this.#out += char;
            this.#at += 1;
        }
    }

    #scanString(quote: string): void {
        this.#out += " ";
        this.#at += 1;
        let open = true;
        while (open && this.#at < this.#length) {
            open = this.#scanStringChar(quote);
        }
    }

    #scanStringChar(quote: string): boolean {
        const char = this.#char();
        if (char === ESCAPE && quote !== RAW_QUOTE) {
            this.#out += BLANK_PAIR;
            this.#at += PAIR;
            return true;
        }
        this.#out += blank(char);
        this.#at += 1;
        return char !== quote;
    }

    #scanLineComment(): void {
        while (this.#at < this.#length && this.#char() !== LINE_BREAK) {
            this.#out += " ";
            this.#at += 1;
        }
    }

    #scanBlockComment(): void {
        this.#out += BLANK_PAIR;
        this.#at += PAIR;
        while (this.#at < this.#length && !(this.#char() === "*" && this.#char(1) === "/")) {
            this.#out += blank(this.#char());
            this.#at += 1;
        }
        if (this.#at < this.#length) {
            this.#out += BLANK_PAIR;
            this.#at += PAIR;
        }
    }
}

export const sanitizeGo = function sanitizeGo(src: string): string {
    return new GoSanitizer(src).run();
};
