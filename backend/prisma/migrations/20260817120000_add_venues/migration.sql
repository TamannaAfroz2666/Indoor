-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "venueType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bookingMode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "businessStatus" TEXT,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "area" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Bangladesh',
    "venueSize" INTEGER NOT NULL,
    "maximumParticipants" INTEGER NOT NULL,
    "minimumBookingMinutes" INTEGER NOT NULL,
    "maximumBookingMinutes" INTEGER NOT NULL,
    "bookingLeadTime" INTEGER NOT NULL,
    "advanceBookingDays" INTEGER NOT NULL,
    "cancellationPolicy" TEXT NOT NULL,
    "houseRules" TEXT NOT NULL,
    "facilities" TEXT[],
    "environment" TEXT[],
    "courtTypes" TEXT[],
    "highlights" TEXT[],
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VenuePhoto" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VenuePhoto_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");
CREATE INDEX "Venue_createdByUserId_idx" ON "Venue"("createdByUserId");
CREATE INDEX "Venue_city_venueType_idx" ON "Venue"("city", "venueType");
CREATE INDEX "VenuePhoto_venueId_idx" ON "VenuePhoto"("venueId");
CREATE UNIQUE INDEX "VenuePhoto_venueId_sortOrder_key" ON "VenuePhoto"("venueId", "sortOrder");
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VenuePhoto" ADD CONSTRAINT "VenuePhoto_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
