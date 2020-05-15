export {};

function resolveScripts(html: string): string[] {
  const regex = /<script[^>]*src=("((?!https?:).?[\\\/])?+([^"]+)"|'((?!https?:)[\\\/])?+(.?[^"]+)')[^>]*>/gm;
  let m;
  let r: string[] = [];

  while ((m = regex.exec(html)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    r.push(m[m.length - 1]);
  }

  return r;
}

function resolveStyleSheets(html: string): string[] {
  const regex = /<link (rel=("stylesheet"|'stylesheet')[^>]*href=("((?!https?:).?[\\\/])?+([^"]+)"|'((?!https?:)[\\\/])?+(.?[^"]+)')|href=("((?!https?:).?[\\\/])?+([^"]+)"|'((?!https?:)[\\\/])?+(.?[^"]+)')[^>]*rel=("stylesheet"|'stylesheet'))[^\/>]*\/?>/gm;
  let m;
  let r: string[] = [];

  while ((m = regex.exec(html)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    r.push(m[m.length - 1]);
  }

  return r;
}
