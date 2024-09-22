import { supabase } from "../../../lib/server/supabase";

const getUserBooking = async (uid: string) => {
  const { data: bookingInfo, error } = await supabase
    .from("Bookings")
    .select("*")
    .eq("uid", uid)
    .limit(1)
    .single();

  console.log("VASCO", { bookingInfo }, { error });

  if (error) return null;

  return bookingInfo;
};

export default getUserBooking;
