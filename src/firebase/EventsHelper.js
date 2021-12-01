/* eslint-disable import/prefer-default-export */
export function formatNewEvent(data, timeDate) {
  const {
    address,
    addressDescription,
    eventName,
    contactPhone,
    contactEmail,
    location: locationObject,
  } = data;
  return {
    dates: timeDate,
    location: { address, addressDescription, locationObject },
    name: eventName,
    contactPhone,
    contactEmail,
  };
}
