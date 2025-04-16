const KEY_PIXIV2RSS_PARAMETER_STORE_ID = 'PIXIV2RSS_PARAMETER_STORE_ID';

interface IEnv {
  [KEY_PIXIV2RSS_PARAMETER_STORE_ID]: string;
}

export class InsufficientEnvironmentException extends Error {}

type RawEnv = Record<string, string | undefined>;

export class Environment {
  env: IEnv;
  constructor(dict: RawEnv) {
    this.setupEnv(dict);
  }

  get(key: keyof IEnv): IEnv[typeof key] {
    return this.env[key];
  }

  clean(): Record<string, string> {
    return {
      [KEY_PIXIV2RSS_PARAMETER_STORE_ID]: this.env[KEY_PIXIV2RSS_PARAMETER_STORE_ID]
    };
  }

  setupEnv(dict: RawEnv) {
    const pixiv2RssParameterStoreId =
      this.getOrError(dict, KEY_PIXIV2RSS_PARAMETER_STORE_ID);
    this.env = {
      [KEY_PIXIV2RSS_PARAMETER_STORE_ID]: pixiv2RssParameterStoreId
    };
  }

  getOrError(dict: RawEnv, key: string): string {
    const value = dict[key];
    if (!value) {
      throw new InsufficientEnvironmentException(
        `${key} does not configured in environment`
      );
    }
    return value;
  }
}

let globalEnv: Environment | null;

export function getEnvironment(dict: RawEnv): Environment {
  if (!globalEnv)
    globalEnv = new Environment(dict);
  return globalEnv;
}
