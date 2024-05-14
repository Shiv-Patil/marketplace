import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

export const listingStatusEnum = pgEnum("listing_status", [
  "active",
  "sold",
  "expired",
]);

export const users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  email: text("email").unique(),
  fullName: text("full_name"),
  avatar: text("avatar"),
  phone: varchar("phone", { length: 32 }),
});

export const listings = pgTable("listings", {
  listingId: serial("listing_id").primaryKey(),
  sellerId: integer("seller_id").references(() => users.userId),
  startDate: timestamp("start_date", { mode: "date" }).defaultNow(),
  endDate: timestamp("end_date", { mode: "date" }),
  name: text("name"),
  shortDescription: varchar("short_description", { length: 69 }),
  longDescription: text("long_description"),
  basePrice: numeric("base_price"),
  status: listingStatusEnum("status").default("active"),
});

export const bids = pgTable("bids", {
  bidId: serial("bid_id"),
  listingId: integer("listing_id").references(() => listings.listingId),
  bidderId: integer("bidder_id").references(() => users.userId),
  amount: numeric("amount"),
  bidDate: timestamp("bid_date", { mode: "date" }).defaultNow(),
});

export const media = pgTable("media", {
  mediaId: serial("meida_id").primaryKey(),
  listingId: integer("listing_id").references(() => listings.listingId),
  url: text("url"),
});

// return types when queried
export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Media = typeof media.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewListing = typeof listings.$inferInsert;
export type NewMedia = typeof media.$inferInsert;
