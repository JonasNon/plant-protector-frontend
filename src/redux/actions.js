export const saveSearch = (searchTerm) => {
  return {
      type: 'SAVE_SEARCH',
      payload: searchTerm,
  };
};