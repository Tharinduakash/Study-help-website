import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/entity-forms";
import { ActionButton, GalleryUpload } from "@/components/admin/form";
import { PageHeader, Panel } from "@/components/admin/ui";
import { deleteGalleryImage, deleteProject } from "@/lib/admin/actions";
import { getProjectRow, listCategoryOptions } from "@/lib/admin/queries";
import { isUuid } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = isUuid(id) ? await getProjectRow(id) : null;
  if (!data) notFound();
  const { project: row, images } = data;

  return (
    <>
      <PageHeader title={row.title} />
      <ProjectForm row={row} categories={await listCategoryOptions()} />

      <Panel title="Gallery" className="mt-10 max-w-3xl">
        <GalleryUpload projectId={row.id} />
        {images.length > 0 && (
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((image) => (
              <li key={image.id}>
                <Image src={image.url} alt="" width={240} height={160} unoptimized className="aspect-[3/2] w-full rounded-lg border border-aqua/20 object-cover" />
                <div className="mt-1.5"><ActionButton action={deleteGalleryImage} fields={{ id: image.id }} label="Remove" confirm="Remove this image?" tone="danger" /></div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <div className="mt-10 border-t border-aqua/10 pt-6">
        <ActionButton action={deleteProject} fields={{ id: row.id }} label="Delete this project" confirm="Delete permanently? This cannot be undone." tone="danger" />
      </div>
    </>
  );
}
