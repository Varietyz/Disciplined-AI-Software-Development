const ROW = "| ";

const ACTIVE_STATE = "ACTIVE";

const HEADER_CELL = "letter";

interface IndexRow {
    readonly letter: string;
    readonly state: string;
}

const rowsOf = function rowsOf(index: string): IndexRow[] {
    return index
        .split("\n")
        .filter((line) => line.startsWith(ROW))
        .map((line) => {
            const cells = line.split("|");
            return { letter: (cells[1] ?? "").trim(), state: (cells[3] ?? "").trim() };
        });
};

const isCapital = function isCapital(char: string): boolean {
    return char >= "A" && char <= "Z";
};

const isSeatLetter = function isSeatLetter(letter: string): boolean {
    return letter.length === 1 && isCapital(letter);
};

const isIndexedLetter = function isIndexedLetter(letter: string): boolean {
    return letter.length > 0 && letter !== HEADER_CELL && isCapital(letter.charAt(0));
};

export const activeSeatLetters = function activeSeatLetters(index: string): string[] {
    return rowsOf(index)
        .filter((row) => isSeatLetter(row.letter) && row.state === ACTIVE_STATE)
        .map((row) => row.letter);
};

export const indexedStates = function indexedStates(index: string): Map<string, string> {
    return new Map(
        rowsOf(index)
            .filter((row) => isSeatLetter(row.letter) && row.state.length > 0)
            .map((row) => [row.letter, row.state]),
    );
};

export const indexedLetters = function indexedLetters(index: string): { letters: Set<string>; duplicates: string[] } {
    const listed = rowsOf(index)
        .map((row) => row.letter)
        .filter(isIndexedLetter);

    return { duplicates: listed.filter((letter, at) => listed.indexOf(letter) !== at), letters: new Set(listed) };
};
