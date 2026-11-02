import type { Metadata } from "next";
import { EmptyState, PageHeader, Panel, RowLink } from "@/components/admin/ui";
import { listProjects } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Portfolio" };

export default async function PortfolioAdminPage() {
  const projects = await listProjects();
  return (
    <>
      <PageHeader title="Portfolio" lead="Only publish work you have permission to show." action={{ href: "/admin/portfolio/new", label: "New project" }} />
      <Panel>
        {projects.length === 0 ? <EmptyState>No projects yet.</EmptyState> : (
          <ul className="divide-y divide-aqua/10">
            {projects.map((project) => (
              <RowLink key={project.id} href={`/admin/portfolio/${project.id}`} title={project.title} meta={`${project.category}${project.isSample ? " · Sample" : ""}${project.isFeatured ? " · Featured" : ""}`} badge={project.isPublished ? "Live" : "Draft"} />
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
