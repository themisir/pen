export type PenFile = {
  contents: string;
  language: string;
  name: string;
};

export interface IPenProvider {
  getFiles(url: string): Promise<PenFile[] | false>;
}
