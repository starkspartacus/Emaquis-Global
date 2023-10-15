exports.formatQuery = (query) => {
  const start =
    query.from !== 'null'
      ? new Date(new Date(query.from).setHours(0, 0, 0))
      : null;
  const end =
    query.to !== 'null'
      ? new Date(new Date(query.to).setHours(23, 59, 59))
      : null;

  const users = query.users
    ? query.users?.includes('[')
      ? JSON.parse(query.users || '[]')
      : [query.users]
    : null;

  return {
    start,
    end,
    users,
  };
};
