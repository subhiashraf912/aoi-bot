export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      APP_ID: string;
      GUILD_ID: string;
      OPENAI_ORGANIZATION: string;
      OPENAI_KEY: string;
    }
  }
}
