export const buildSearchQuery = (
  baseQuery: string,
  includeTerms: string[],
  excludeTerms: string[]
): string => {
  const parts = [baseQuery.trim()];
  
  //  обязательные термины
   if (includeTerms.length > 0) {
    const orTerms = includeTerms
      .filter(term => term.trim())
      .map(term => term.trim())
      .join(' OR ');
    parts.push(`(${orTerms})`);
  }
  
  //  исключающие термины
  excludeTerms.forEach(term => {
    if (term.trim()) parts.push(`NOT ${term.trim()}`);
  });
  
  return parts.filter(part => part.length > 0).join(' ');
};
