// app/(auth)/login/page.tsx

import LoginContent from "@/app/(public)/_components/LoginContent";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
