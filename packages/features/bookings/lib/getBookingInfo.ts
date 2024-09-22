import getUserBooking from "./getUserBooking";

const getBookingInfo = async (uid: string) => {
  const bookingInfoRaw = await getUserBooking(uid);
  const bookingInfo = bookingInfoRaw;

  return { bookingInfoRaw, bookingInfo };
};

export default getBookingInfo;
