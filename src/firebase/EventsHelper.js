/* eslint-disable import/prefer-default-export */
export function formatEventForm(data, startDate, endDate) {
  const { name, category, location, contactPhone, contactEmail } = data;
  return {
    name,
    categoryId: category.id,
    location,
    contactPhone,
    contactEmail,
    startDate: startDate.unix(),
    endDate: endDate.unix(),
  };
}
