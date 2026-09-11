"use client";
import { useParams } from "next/navigation";
import GameActivities from "@/components/admin/game-activities/GameActivities";

/* ────────── Component-based game activity page ────────── */
export default function UserGameActivitiesPage() {
  const { id } = useParams<{ id: string }>();
  return <GameActivities key={id} userId={id} />;
}
