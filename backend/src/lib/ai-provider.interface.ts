export interface AICompleteOptions {
  maxTokens?: number;
}

export interface AIProvider {
  complete(prompt: string, options?: AICompleteOptions): Promise<string>;
}
