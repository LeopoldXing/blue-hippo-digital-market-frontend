import { z } from "zod";

const AuthCredentialsValidator = z.object({
  email: z.string().min(0, "Email can not be empty").email("Email must be valid"),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  province: z.string().min(1, { message: 'Province must be valid' }),
  addressLine1: z.string().min(1, { message: "Address is required" }),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(1, { message: "Postal Code is required" }),
})

export type AuthCredentialValidatorType = {
  email: string,
  password: string,
  province?: string,
  addressLine1?: string,
  addressLine2?: string | undefined,
  postalCode?: string
}

export { AuthCredentialsValidator };
