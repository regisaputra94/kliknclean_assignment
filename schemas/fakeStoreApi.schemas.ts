import { z } from 'zod';

/**
 * Runtime schema validation for the Fake Store API. Using zod instead of
 * hand-rolled property checks means a single schema both documents the
 * expected contract and gives precise, readable failures (field name +
 * reason) when the API drifts from it.
 */

export const AuthTokenSchema = z.object({
  token: z.string().min(10),
});
