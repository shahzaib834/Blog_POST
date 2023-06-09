-- CreateTable
CREATE TABLE "Blogs" (
    "id" BIGINT NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "category" VARCHAR NOT NULL,
    "likes" INTEGER NOT NULL,
    "image" BYTEA,
    "author" VARCHAR NOT NULL,
    "status" VARCHAR,
    "createdAt" DATE,
    "updatedAt" DATE,

    CONSTRAINT "primary key" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "email" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "token" VARCHAR,
    "picture" BYTEA,
    "followersCount" INTEGER DEFAULT 0,
    "followingCount" INTEGER DEFAULT 0,
    "role" VARCHAR NOT NULL DEFAULT USER,
    "createdAt" DATE,
    "updatedAt" DATE,

    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "blogs_fk" FOREIGN KEY ("author") REFERENCES "Users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION;

