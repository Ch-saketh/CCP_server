-- CreateTable
CREATE TABLE "product_submissions" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "ai_extracted_data" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_submissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_submissions" ADD CONSTRAINT "product_submissions_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
