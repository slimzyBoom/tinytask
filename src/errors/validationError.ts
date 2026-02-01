import { ZodError } from "zod";

export function zodToFieldErrors(err: ZodError) {
  const { fieldErrors, formErrors } = err.flatten();
  return {
    message: formErrors[0] ?? "Validation error",
    errors: Object.fromEntries(
      Object.entries(fieldErrors).map(([k, v]) => [k, v ?? []])
    ),
  };
}
