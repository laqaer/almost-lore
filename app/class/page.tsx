import { Classroom } from "@/components/game/classroom";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Classroom projector mode — a daily history bell-ringer",
  description:
    "Put today's five history claims on the projector. Students call each one happened, almost, or lore, then you reveal the sourced record. Free, no accounts, no student data.",
  path: "/class",
});

export default function ClassPage() {
  return <Classroom />;
}
