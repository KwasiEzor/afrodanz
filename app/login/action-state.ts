export type RegisterActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string[]>>;
};

export const initialRegisterActionState: RegisterActionState = {
  status: 'idle',
};
