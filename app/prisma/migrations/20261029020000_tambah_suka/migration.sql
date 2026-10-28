-- Suka per diskusi: satu akun satu suka, klik lagi membatalkan.
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "discussion_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "likes_discussion_id_user_id_key" ON "likes"("discussion_id", "user_id");
CREATE INDEX "likes_user_id_idx" ON "likes"("user_id");

ALTER TABLE "likes" ADD CONSTRAINT "likes_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
