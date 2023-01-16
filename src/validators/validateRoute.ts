export const isPathnameWithParametr = (pathname: string) => {
  const numberOfSlashes = pathname.split("/").length;
  return numberOfSlashes > 2 && numberOfSlashes <= 4 && pathname.split("/")[2];
}