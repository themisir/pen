import { PenFile, IPenProvider } from "../types";
import { penProviderRegistry } from "./registry";

export class GistPenProvider implements IPenProvider {
  async getFileContents(gistId: string, file: string) {
    const response = await fetch(
      `https://gist.githubusercontent.com/raw/` + gistId + file
    );
    if (response.status > 299) {
      throw new Error("Gist file is not exists");
    }
    return response.text();
  }

  async getFiles(url: string): Promise<PenFile[] | false> {
    if (!url.startsWith("/gist/")) {
      return false;
    }

    const gistId = url.substr("/gist/".length).split("/")[0];
    const files: PenFile[] = [];
    const checkForFiles = [
      ["", "html"],
      ["/style.css", "css"],
      ["/script.js", "javascript"],
    ];

    for (const [name, language] of checkForFiles) {
      try {
        const contents = await this.getFileContents(gistId, name);
        files.push({ name, language, contents });
      } catch (e) {
        // Cancel if first file (index.html) is not found
        if (files.length === 0) {
          return false;
        }
      }
    }

    return files;
  }
}

penProviderRegistry.register(GistPenProvider);
