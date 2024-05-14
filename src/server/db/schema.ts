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
  primaryKey,
} from "drizzle-orm/pg-core";

export const listingStatusEnum = pgEnum("listing_status", [
  "active",
  "sold",
  "expired",
]);

export const createTable = pgTableCreator((name) => `marketplace_${name}`);

export const users = createTable("user", {
  id: text("user_id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  phone: varchar("phone", { length: 32 }),
});

export const listings = createTable("listing", {
  listingId: serial("listing_id").primaryKey(),
  sellerId: text("seller_id")
    .references(() => users.id, { onDelete: "cascade" })
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
  bidId: serial("bid_id").primaryKey(),
  listingId: integer("listing_id")
    .references(() => listings.listingId, { onDelete: "cascade" })
    .notNull(),
  bidderId: text("bidder_id")
    .references(() => users.id, { onDelete: "cascade" })
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

export const accounts = createTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = createTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
