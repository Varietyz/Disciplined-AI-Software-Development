export interface CommentGrammar {
    lang: string;
    directivePrefixes: string[];
}

export interface StripResult {
    content: string;
    changed: boolean;
}

export interface ExtractedComment {
    line: number;
    text: string;
}

export interface ExtractResult extends StripResult {
    comments: ExtractedComment[];
}

export interface FileComment extends ExtractedComment {
    file: string;
}

export interface CommentSpan {
    start: number;
    end: number;
    directive: boolean;
    ownLine: boolean;
}
