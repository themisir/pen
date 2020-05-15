import { IPenProvider, PenFile } from "../types";

class PenProviderRegistry implements IPenProvider {
  private providers: IPenProvider[];

  constructor() {
    this.providers = [];
  }

  register<T extends IPenProvider>(type: { new (): T }) {
    this.providers.push(new type());
  }

  async getFiles(url: string): Promise<PenFile[] | false> {
    for (const provider of this.providers) {
      try {
        const result = provider.getFiles(url);
        if (result) {
          return result;
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return false;
  }
}

export const penProviderRegistry = new PenProviderRegistry();