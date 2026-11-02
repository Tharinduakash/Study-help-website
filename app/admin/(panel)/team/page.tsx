import type { Metadata } from "next";
import { EmptyState, PageHeader, Panel, RowLink } from "@/components/admin/ui";
import { listTeam } from "@/lib/admin/queries";
import { showTeam } from "@/lib/site-config";

export const metadata: Metadata = { title: "Team" };

export default async function TeamAdminPage() {
  const members = await listTeam();
  return (
    <>
      <PageHeader title="Team" lead={showTeam ? undefined : "Hidden from the public site for now. You can prepare profiles here."} action={{ href: "/admin/team/new", label: "New team member" }} />
      <Panel>
        {members.length === 0 ? <EmptyState>No team members yet.</EmptyState> : (
          <ul className="divide-y divide-aqua/10">
            {members.map((member) => (
              <RowLink key={member.id} href={`/admin/team/${member.id}`} title={member.name || "Name needed"} meta={member.designation} badge={member.isActive ? "Live" : "Hidden"} />
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
