ALTER TABLE "bookings" ALTER COLUMN "bookingStatus" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "paymentStatus" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "paymentDate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supportTickets" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supportTickets" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "supportTickets" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "venues" ALTER COLUMN "createdAt" SET NOT NULL;