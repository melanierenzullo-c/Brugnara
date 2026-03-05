/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as clearProducts from "../clearProducts.js";
import type * as files from "../files.js";
import type * as kategorien from "../kategorien.js";
import type * as oeffnungszeiten from "../oeffnungszeiten.js";
import type * as produkte from "../produkte.js";
import type * as seed from "../seed.js";
import type * as seedHelpers from "../seedHelpers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  clearProducts: typeof clearProducts;
  files: typeof files;
  kategorien: typeof kategorien;
  oeffnungszeiten: typeof oeffnungszeiten;
  produkte: typeof produkte;
  seed: typeof seed;
  seedHelpers: typeof seedHelpers;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
