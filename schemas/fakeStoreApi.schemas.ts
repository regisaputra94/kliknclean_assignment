import { z } from 'zod';

/**
 * Runtime schema validation for the Fake Store API. Using zod instead of
 * hand-rolled property checks means a single schema both documents the
 * expected contract and gives precise, readable failures (field name +
 * reason) when the API drifts from it.
 */

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string(),
  category: z.string(),
  image: z.string().url(),
  rating: z
    .object({
      rate: z.number(),
      count: z.number(),
    })
    .optional(),
});

export const ProductListSchema = z.array(ProductSchema);

export const CategoryListSchema = z.array(z.string());

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(1),
  name: z.object({
    firstname: z.string(),
    lastname: z.string(),
  }),
  address: z.object({
    city: z.string(),
    street: z.string(),
    number: z.number(),
    zipcode: z.string(),
    geolocation: z.object({
      lat: z.string(),
      long: z.string(),
    }),
  }),
  phone: z.string(),
});

export const UserListSchema = z.array(UserSchema);

export const AuthTokenSchema = z.object({
  token: z.string().min(10),
});

