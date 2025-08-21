import { z } from "zod";

//for some reason the normal coerce was not working correctly
const booleanSchema = z
  .union([
    z.boolean(), // For programmatic requests
    z.literal("true"), // URL query string
    z.literal("false"), // URL query string
    z.literal(1), // Numeric true
    z.literal(0), // Numeric false
    z.literal("1"), // String numeric true
    z.literal("0"), // String numeric false
  ])
  .optional()
  .transform((val) => {
    if (val === true || val === "true" || val === 1 || val === "1") return true;
    if (val === false || val === "false" || val === 0 || val === "0")
      return false;
    throw new Error('Value must be boolean, "true"/"false", 1/0, or "1"/"0"');
  });

export { booleanSchema };
