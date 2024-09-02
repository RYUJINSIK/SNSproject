"use client";
import WithComponentLayout from "@/components/WithComponentLayout/page";
import { useUserStore } from "@/store/useUserStore";

export default async function Index() {
  const token = useUserStore((state) => state.token);
  const userData = useUserStore((state) => state.userData);
  return (
    <WithComponentLayout>
      <div>
        <p>Token: {token}</p>
        <p>User Data: {JSON.stringify(userData)}</p>
      </div>
    </WithComponentLayout>
  );
}
