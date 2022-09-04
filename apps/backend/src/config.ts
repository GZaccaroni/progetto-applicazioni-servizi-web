export const MONGODB_CONNECTION_STRING =
  process.env.MONGODB_CONNECTION_STRING || "##changewithdevelopment_server##";
export const SESSIONS_COLLECTION = "sessions";
export const SESSION_MAX_AGE = 60 * 60 * 1000; // 1 hour;
// The following secret should be changed for every install
export const SESSION_SECRET =
  process.env.SESSION_SECRET || "r8q,+&1LM3)CD*zAGpx1xm{Pusadnstrc;#";
