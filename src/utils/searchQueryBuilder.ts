export const buildSearchQuery = (
  baseQuery: string,
  includeTerms: string[],
  excludeTerms: string[]
): string => {
  const parts = [baseQuery.trim()];
  
  //  обязательные термины
  includeTerms.forEach(term => {
    if (term.trim()) parts.push(term.trim());
  });
  
  //  исключающие термины
  excludeTerms.forEach(term => {
    if (term.trim()) parts.push(`NOT ${term.trim()}`);
  });
  
  return parts.filter(part => part.length > 0).join(' ');
};
