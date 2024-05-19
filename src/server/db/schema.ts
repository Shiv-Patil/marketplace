import { relations } from "drizzle-orm";
import {
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

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts, {
    relationName: "user",
  }),
  media: many(sessions, {
    relationName: "user",
  }),
  listings: many(listings, {
    relationName: "seller",
  }),
  bids: many(bids, {
    relationName: "bidder",
  }),
}));

export const listings = createTable("listing", {
  listingId: serial("listing_id").primaryKey(),
  sellerId: text("seller_id").notNull(),
  startDate: timestamp("start_date", { mode: "date" }).defaultNow().notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  name: text("name").notNull(),
  shortDescription: varchar("short_description", { length: 69 }).notNull(),
  longDescription: text("long_description"),
  basePrice: numeric("base_price").notNull(),
  status: listingStatusEnum("status").default("active").notNull(),
});

export const listingsRelations = relations(listings, ({ one, many }) => ({
  seller: one(users, {
    fields: [listings.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
  bids: many(bids, {
    relationName: "listing",
  }),
  media: many(media, {
    relationName: "listing",
  }),
}));

export const bids = createTable("bid", {
  bidId: serial("bid_id").primaryKey(),
  listingId: integer("listing_id").notNull(),
  bidderId: text("bidder_id").notNull(),
  amount: numeric("amount").notNull(),
  bidDate: timestamp("bid_date", { mode: "date" }).defaultNow().notNull(),
});

export const bidsRelations = relations(bids, ({ one }) => ({
  listing: one(listings, {
    fields: [bids.listingId],
    references: [listings.listingId],
    relationName: "listing",
  }),
  bidder: one(users, {
    fields: [bids.bidderId],
    references: [users.id],
    relationName: "bidder",
  }),
}));

export const media = createTable("media", {
  mediaId: serial("meida_id").primaryKey(),
  listingId: integer("listing_id").notNull(),
  url: text("url").notNull(),
});

export const mediaRelations = relations(media, ({ one }) => ({
  listing: one(listings, {
    fields: [media.listingId],
    references: [listings.listingId],
    relationName: "listing",
  }),
}));

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

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
    relationName: "user",
  }),
}));

export const sessions = createTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
    relationName: "user",
  }),
}));

// return types when queried
// export type User = typeof users.$inferSelect;
// export type Listing = typeof listings.$inferSelect;
// export type Bid = typeof bids.$inferSelect;
// export type Media = typeof media.$inferSelect;

// export type NewUser = typeof users.$inferInsert;
// export type NewListing = typeof listings.$inferInsert;
// export type NewBid = typeof bids.$inferInsert;
// export type NewMedia = typeof media.$inferInsert;
