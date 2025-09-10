declare module '@mastra/core/agent' {
  export class Agent<TId extends string = string, TTools = any, TMetrics = any> {
    constructor(config: any);
    generate(messages: any, options?: any): Promise<any>;
    stream(messages: any, options?: any): Promise<any>;
  }
}

declare module '@ai-sdk/openai' {
  export function openai(model: string): any;
}

declare module '@mastra/core/tools' {
  export function createTool(def: any): any;
}
