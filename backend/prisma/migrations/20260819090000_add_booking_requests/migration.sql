CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED');

CREATE TABLE "VenueSpace" (
  "id" TEXT NOT NULL,
  "venueId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sport" TEXT NOT NULL,
  "hourlyRate" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VenueSpace_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BookingRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "venueId" TEXT NOT NULL,
  "spaceId" TEXT NOT NULL,
  "startAt" TIMESTAMP(3) NOT NULL,
  "duration" INTEGER NOT NULL,
  "participants" INTEGER,
  "message" TEXT,
  "hourlyRate" INTEGER NOT NULL,
  "estimatedRate" INTEGER NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VenueSpace_venueId_name_key" ON "VenueSpace"("venueId", "name");
CREATE INDEX "VenueSpace_venueId_idx" ON "VenueSpace"("venueId");
CREATE INDEX "BookingRequest_userId_idx" ON "BookingRequest"("userId");
CREATE INDEX "BookingRequest_venueId_idx" ON "BookingRequest"("venueId");
CREATE INDEX "BookingRequest_spaceId_idx" ON "BookingRequest"("spaceId");
CREATE INDEX "BookingRequest_status_idx" ON "BookingRequest"("status");
CREATE INDEX "BookingRequest_startAt_idx" ON "BookingRequest"("startAt");
CREATE INDEX "BookingRequest_spaceId_status_startAt_idx" ON "BookingRequest"("spaceId", "status", "startAt");
ALTER TABLE "VenueSpace" ADD CONSTRAINT "VenueSpace_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "VenueSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
