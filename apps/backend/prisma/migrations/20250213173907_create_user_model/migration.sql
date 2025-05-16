-- CreateTable
CREATE TABLE "users" (
  "id" serial NOT NULL,
  "email" TEXT NOT NULL,
  "nickname" TEXT NOT NULL,
  "first_name" TEXT NOT NULL DEFAULT '',
  "last_name" TEXT NOT NULL DEFAULT '',
  "password_hash" TEXT NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users" ("nickname");
