const stringToQuery = query => {
  const queryStr = query.slice(1);
  return queryStr.split('&').reduce((acc, crr) => {
    const [queryKey, queryValue] = crr.split('=');
    return { ...acc, [queryKey]: queryValue };
  }, {});
};

const queryToString = queryObj => {
  return (
    '?' +
    Object.entries(queryObj)
      .flatMap(e => e.join('='))
      .join('&')
  );
};

export { stringToQuery, queryToString };
