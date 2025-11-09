
export enum AppMode {
  REASONING = 'reasoning',
  CODE_GEN = 'code_gen',
  KNOWLEDGE = 'knowledge',
}

export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  author: MessageAuthor;
  content: string;
}