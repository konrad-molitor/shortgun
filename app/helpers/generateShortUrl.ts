const generateShortUrl = (id: string): string => {
  const symbols = "23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ-_";
  let short = "";
  // @ts-ignore
  let shortNum = Number.parseInt(id.toString().substring(0, 10), 16);
  while (shortNum > 0) {
    short = symbols.charAt(shortNum % symbols.length) + short;
    shortNum = Math.floor(shortNum / symbols.length);
  }
  return short;
};

export default generateShortUrl;
