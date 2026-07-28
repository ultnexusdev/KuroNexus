"use client";

import { useParams } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { WritingStudio } from "@/components/studio/WritingStudio";

export default function WritingStudioPage() {
  const params = useParams<{ universeSlug: string }>();

  return (
    <AdminGuard>
      <WritingStudio universeSlug={params.universeSlug} />
    </AdminGuard>
  );
}
