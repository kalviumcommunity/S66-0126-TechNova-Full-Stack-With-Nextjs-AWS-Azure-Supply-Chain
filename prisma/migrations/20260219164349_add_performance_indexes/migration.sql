-- CreateIndex
CREATE INDEX "parking_lots_city_isActive_idx" ON "parking_lots"("city", "isActive");

-- CreateIndex
CREATE INDEX "parking_lots_pricePerHour_idx" ON "parking_lots"("pricePerHour");

-- CreateIndex
CREATE INDEX "parking_spots_parkingLotId_status_idx" ON "parking_spots"("parkingLotId", "status");

-- CreateIndex
CREATE INDEX "parking_spots_type_status_idx" ON "parking_spots"("type", "status");

-- CreateIndex
CREATE INDEX "parking_spots_lastUpdated_idx" ON "parking_spots"("lastUpdated");

-- CreateIndex
CREATE INDEX "bookings_userId_status_idx" ON "bookings"("userId", "status");

-- CreateIndex
CREATE INDEX "bookings_createdAt_idx" ON "bookings"("createdAt");

-- CreateIndex
CREATE INDEX "bookings_paymentStatus_idx" ON "bookings"("paymentStatus");

-- CreateIndex
CREATE INDEX "reports_userId_idx" ON "reports"("userId");

-- CreateIndex
CREATE INDEX "reports_reportType_idx" ON "reports"("reportType");

-- CreateIndex
CREATE INDEX "reports_parkingLotId_createdAt_idx" ON "reports"("parkingLotId", "createdAt");

-- CreateIndex
CREATE INDEX "reports_isVerified_idx" ON "reports"("isVerified");

-- CreateIndex
CREATE INDEX "sensors_parkingSpotId_idx" ON "sensors"("parkingSpotId");

-- CreateIndex
CREATE INDEX "sensors_batteryLevel_idx" ON "sensors"("batteryLevel");

-- CreateIndex
CREATE INDEX "sensors_status_lastPing_idx" ON "sensors"("status", "lastPing");
