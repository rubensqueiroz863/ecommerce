export type UserProps = {
  id: string;
  name: string;
  email: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
};

export type UserLog = {
  id: string;
  userId: string;
  performedBy: string;
  action: string;
  details: string;
  timestamp: string;
};