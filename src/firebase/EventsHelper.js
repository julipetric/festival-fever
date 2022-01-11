/* eslint-disable import/prefer-default-export */
export function formatEventForm(data, timeDate) {
  const { name, category, location, contactPhone, contactEmail } = data;
  return {
    name,
    categoryId: category.id,
    location,
    contactPhone,
    contactEmail,
  };
}
