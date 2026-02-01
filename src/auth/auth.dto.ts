import zod from "zod";

export const registerDto = zod
  .object({
    firstname: zod
      .string()
      .min(3, "First name must be at least 3 characters long"),
    lastname: zod
      .string()
      .min(3, "Last name must be at least 3 characters long"),
    email: zod.email("Invalid email address"),
    phone_number: zod
      .string()
      .min(10, "Phone number must be at least 10 digits long"),
    university: zod.string(),
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/\d/, "Must contain a number"),
    confirm_password: zod.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

  export const loginDto = zod.object({
    email: zod.email("Invalid email address"),
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/\d/, "Must contain a number"),
  })

  export const resetPasswordDto = zod.object({
    token: zod.jwt(),
    password: zod
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/\d/, "Must contain a number"),
    confirm_password: zod.string(),
  }).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"]
  });

  export const forgetPasswordDto = zod.object({
    email: zod.email("Invalid email")
  })

  export const verifyEmailDto = zod.object({
    otp: zod.string("Must be a string of numbers").length(6, "Must be exactly 6 digits")
  })
