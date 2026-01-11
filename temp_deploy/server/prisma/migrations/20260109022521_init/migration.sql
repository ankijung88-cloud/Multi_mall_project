-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "personalPrice" REAL NOT NULL,
    "companyPrice" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "isRecommendedPersonal" BOOLEAN NOT NULL DEFAULT false,
    "isRecommendedCompany" BOOLEAN NOT NULL DEFAULT false,
    "isNewPersonal" BOOLEAN NOT NULL DEFAULT false,
    "isNewCompany" BOOLEAN NOT NULL DEFAULT false,
    "isBrandPersonal" BOOLEAN NOT NULL DEFAULT false,
    "isBrandCompany" BOOLEAN NOT NULL DEFAULT false,
    "isSalePersonal" BOOLEAN NOT NULL DEFAULT false,
    "isSaleCompany" BOOLEAN NOT NULL DEFAULT false,
    "detailImages" TEXT NOT NULL DEFAULT '[]'
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "detailImage" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "username" TEXT,
    "password" TEXT
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "maxSlots" INTEGER NOT NULL,
    "currentSlots" INTEGER NOT NULL,
    "pricePersonal" REAL,
    "priceCompany" REAL,
    "detailImage" TEXT,
    CONSTRAINT "Schedule_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PartnerRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partnerId" INTEGER NOT NULL,
    "partnerName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "scheduleTitle" TEXT NOT NULL,
    "scheduleDate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "timestamp" TEXT NOT NULL,
    "paymentStatus" TEXT,
    "paymentAmount" REAL,
    "paymentDate" TEXT,
    "paymentMethod" TEXT,
    "userType" TEXT,
    "inquiryContent" TEXT,
    "contact" TEXT
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT
);

-- CreateTable
CREATE TABLE "AgentSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "maxSlots" INTEGER NOT NULL,
    "currentSlots" INTEGER NOT NULL,
    "pricePersonal" REAL,
    "priceCompany" REAL,
    CONSTRAINT "AgentSchedule_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgentRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" INTEGER NOT NULL,
    "agentName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "scheduleTitle" TEXT NOT NULL,
    "scheduleDate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "timestamp" TEXT NOT NULL,
    "paymentStatus" TEXT,
    "paymentAmount" REAL,
    "paymentDate" TEXT,
    "paymentMethod" TEXT,
    "userType" TEXT
);

-- CreateTable
CREATE TABLE "Freelancer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "portfolioImages" TEXT NOT NULL DEFAULT '[]',
    "authorId" TEXT,
    "username" TEXT,
    "password" TEXT
);

-- CreateTable
CREATE TABLE "ContentRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "freelancerId" TEXT NOT NULL,
    "freelancerName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT,
    "contactInfo" TEXT,
    "message" TEXT NOT NULL,
    "requesterType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "date" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ContentFavorite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentFavorite_userId_contentId_key" ON "ContentFavorite"("userId", "contentId");
