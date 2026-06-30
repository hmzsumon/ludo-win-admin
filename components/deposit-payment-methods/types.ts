export type MethodName = "Bkash" | "Nagad" | "Rocket";
export type MethodType = "personal" | "agent" | "payment" | "merchant";

export type DepositPaymentMethod = {
  _id: string;
  accountNumber: string;
  methodName: MethodName;
  methodType: MethodType;
  title: string;
  totalReceiveAmount?: number;
  isActive?: boolean;
  isDefault?: boolean;
  activeFrom?: string | null;
  activeUntil?: string | null;
  nextActiveAt?: string | null;
  nextInactiveAt?: string | null;
  owner?: {
    id?: string;
    name?: string;
    customerId?: string;
    role?: string;
  };
};

export type Agent = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  customerId?: string;
  is_active?: boolean;
  statusDoc?: {
    status?: string;
    agentType?: "e-wallet" | "cash";
  };
};

export type FormState = {
  id?: string;
  accountNumber: string;
  methodName: MethodName;
  methodType: MethodType;
  title: string;
  ownerId: string;
  isActive: boolean;
  isDefault: boolean;
};
