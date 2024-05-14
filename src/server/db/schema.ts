import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  numeric,
  pgEnum,
  pgTableCreator,
} from "drizzle-orm/pg-core";

export const listingStatusEnum = pgEnum("listing_status", [
  "active",
  "sold",
  "expired",
]);

export const createTable = pgTableCreator((name) => `marketplace_${name}`);

export const users = createTable("user", {
  userId: serial("user_id").primaryKey(),
  email: text("email").unique().notNull(),
  fullName: text("full_name").notNull(),
  avatar: text("avatar"),
  phone: varchar("phone", { length: 32 }),
});

export const listings = createTable("listing", {
  listingId: serial("listing_id").primaryKey(),
  sellerId: integer("seller_id")
    .references(() => users.userId, { onDelete: "cascade" })
    .notNull(),
  startDate: timestamp("start_date", { mode: "date" }).defaultNow().notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  name: text("name").notNull(),
  shortDescription: varchar("short_description", { length: 69 }).notNull(),
  longDescription: text("long_description"),
  basePrice: numeric("base_price").notNull(),
  status: listingStatusEnum("status").default("active").notNull(),
});

export const bids = createTable("bid", {
  bidId: serial("bid_id"),
  listingId: integer("listing_id")
    .references(() => listings.listingId, { onDelete: "cascade" })
    .notNull(),
  bidderId: integer("bidder_id")
    .references(() => users.userId, { onDelete: "cascade" })
    .notNull(),
  amount: numeric("amount").notNull(),
  bidDate: timestamp("bid_date", { mode: "date" }).defaultNow().notNull(),
});

export const media = createTable("media", {
  mediaId: serial("meida_id").primaryKey(),
  listingId: integer("listing_id")
    .references(() => listings.listingId, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
});

// return types when queried
export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Bid = typeof bids.$inferSelect;
export type Media = typeof media.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewListing = typeof listings.$inferInsert;
export type NewBid = typeof bids.$inferInsert;
export type NewMedia = typeof media.$inferInsert;
