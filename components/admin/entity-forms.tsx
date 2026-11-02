import { AdminForm, CheckField, ImageField, SelectField, TextAreaField, TextField } from "@/components/admin/form";
import type { faqs, portfolioProjects, serviceCategories, services, teamMembers, testimonials } from "@/db/schema";
import { saveCategory, saveFaq, saveProject, saveService, saveTeamMember, saveTestimonial } from "@/lib/admin/actions";
import { portfolioCategories } from "@/lib/content/portfolio";

type Option = { value: string; label: string };

const IdField = ({ id }: { id?: string }) => (id ? <input type="hidden" name="id" value={id} /> : null);
const slugHint = "Leave empty to create it from the title. Changing it breaks existing links.";
const two = "grid gap-5 sm:grid-cols-2";

export function CategoryForm({ row }: { row?: typeof serviceCategories.$inferSelect }) {
  return (
    <AdminForm action={saveCategory} className="max-w-3xl">
      <IdField id={row?.id} />
      <div className={two}>
        <TextField name="title" label="Title" defaultValue={row?.title} required />
        <TextField name="slug" label="Web address" hint={slugHint} defaultValue={row?.slug} />
      </div>
      <TextField name="short" label="Short description" defaultValue={row?.short} required />
      <TextAreaField name="description" label="Description" defaultValue={row?.description} rows={5} />
      <TextAreaField name="deliverables" label="What customers receive" hint="One per line." defaultValue={row?.deliverables.join("\n")} />
      <TextAreaField name="note" label="Note (optional)" defaultValue={row?.note} rows={2} />
      <div className={two}>
        <SelectField name="icon" label="Icon" defaultValue={row?.icon ?? "chart"} options={["chart", "book", "code", "presentation", "video"].map((value) => ({ value, label: value }))} />
        <TextField name="sortOrder" label="Position" type="number" defaultValue={row?.sortOrder ?? 0} />
      </div>
      <ImageField name="imageUrl" label="Hero image (optional)" folder="services" defaultValue={row?.imageUrl} />
      <CheckField name="isActive" label="Show on the website" defaultChecked={row?.isActive ?? true} />
    </AdminForm>
  );
}

export function ServiceForm({ row, categories }: { row?: typeof services.$inferSelect; categories: Option[] }) {
  return (
    <AdminForm action={saveService} className="max-w-3xl">
      <IdField id={row?.id} />
      <div className={two}>
        <TextField name="title" label="Title" defaultValue={row?.title} required />
        <SelectField name="categoryId" label="Category" defaultValue={row?.categoryId} options={categories} />
      </div>
      <TextField name="slug" label="Web address" hint={slugHint} defaultValue={row?.slug} />
      <TextField name="summary" label="Summary" defaultValue={row?.summary} required />
      <TextAreaField name="description" label="Detailed description (optional)" defaultValue={row?.description} rows={6} />
      <TextAreaField name="options" label="Service options" hint="One per line." defaultValue={row?.options.join("\n")} />
      <div className={two}>
        <SelectField name="pricingType" label="Pricing" defaultValue={row?.pricingType ?? "quote"} options={[{ value: "quote", label: "Custom quotation" }, { value: "fixed", label: "Fixed price" }]} />
        <TextField name="priceLabel" label="Price to display" hint="Required for a fixed price, e.g. From LKR 5,000" defaultValue={row?.priceLabel} />
      </div>
      <TextField name="sortOrder" label="Position" type="number" defaultValue={row?.sortOrder ?? 0} />
      <ImageField name="imageUrl" label="Service image (optional)" folder="services" defaultValue={row?.imageUrl} />
      <CheckField name="isActive" label="Show on the website" defaultChecked={row?.isActive ?? true} />
    </AdminForm>
  );
}

export function ProjectForm({ row, categories }: { row?: typeof portfolioProjects.$inferSelect; categories: Option[] }) {
  return (
    <AdminForm action={saveProject} className="max-w-3xl">
      <IdField id={row?.id} />
      <div className={two}>
        <TextField name="title" label="Title" defaultValue={row?.title} required />
        <TextField name="slug" label="Web address" hint={slugHint} defaultValue={row?.slug} />
      </div>
      <div className={two}>
        <SelectField name="category" label="Portfolio category" defaultValue={row?.category} options={portfolioCategories.map((value) => ({ value, label: value }))} />
        <SelectField name="serviceCategoryId" label="Related service area" defaultValue={row?.serviceCategoryId} options={[{ value: "", label: "None" }, ...categories]} />
      </div>
      <TextField name="summary" label="Summary" defaultValue={row?.summary} required />
      <TextAreaField name="description" label="Description" defaultValue={row?.description} rows={6} />
      <div className={two}>
        <TextAreaField name="tags" label="Technology tags" hint="One per line." defaultValue={row?.tags.join("\n")} />
        <TextAreaField name="deliverables" label="Deliverables" hint="One per line." defaultValue={row?.deliverables.join("\n")} />
      </div>
      <TextAreaField name="outcomes" label="Outcomes" hint="One per line. Use real results only." defaultValue={row?.outcomes.join("\n")} />
      <TextField name="videoUrl" label="Video link (optional)" hint="YouTube links play on the page; other links open in a new tab." defaultValue={row?.videoUrl} />
      <div className={two}>
        <SelectField name="coverVariant" label="Placeholder artwork" hint="Shown when there is no cover image." defaultValue={row?.coverVariant ?? "dashboard"} options={["dashboard", "report", "slides", "code", "poster", "video"].map((value) => ({ value, label: value }))} />
        <TextField name="sortOrder" label="Position" type="number" defaultValue={row?.sortOrder ?? 0} />
      </div>
      <ImageField name="coverImageUrl" label="Cover image" folder="portfolio" defaultValue={row?.coverImageUrl} />
      <div className="flex flex-wrap gap-6">
        <CheckField name="isPublished" label="Published" defaultChecked={row?.isPublished ?? false} />
        <CheckField name="isFeatured" label="Feature on homepage" defaultChecked={row?.isFeatured ?? false} />
        <CheckField name="isSample" label="Label as sample concept" defaultChecked={row?.isSample ?? false} />
      </div>
    </AdminForm>
  );
}

export function TeamForm({ row }: { row?: typeof teamMembers.$inferSelect }) {
  return (
    <AdminForm action={saveTeamMember} className="max-w-3xl">
      <IdField id={row?.id} />
      <div className={two}>
        <TextField name="name" label="Full name" defaultValue={row?.name} required />
        <TextField name="designation" label="Designation" defaultValue={row?.designation} required />
      </div>
      <TextAreaField name="bio" label="Short biography" defaultValue={row?.bio} />
      <TextAreaField name="skills" label="Skills and expertise" hint="One per line." defaultValue={row?.skills.join("\n")} />
      <TextAreaField name="links" label="Professional links" hint="One per line, as: LinkedIn | https://linkedin.com/in/name" defaultValue={row?.links.map((link) => `${link.label} | ${link.href}`).join("\n")} rows={3} />
      <TextField name="sortOrder" label="Position" type="number" defaultValue={row?.sortOrder ?? 0} />
      <ImageField name="imageUrl" label="Profile image" folder="team" defaultValue={row?.imageUrl} />
      <CheckField name="isActive" label="Show on the website" defaultChecked={row?.isActive ?? true} />
    </AdminForm>
  );
}

export function TestimonialForm({ row }: { row?: typeof testimonials.$inferSelect }) {
  return (
    <AdminForm action={saveTestimonial} className="max-w-3xl">
      <IdField id={row?.id} />
      <div className={two}>
        <TextField name="name" label="Approved display name" defaultValue={row?.name} required />
        <TextField name="service" label="Service received" defaultValue={row?.service} required />
      </div>
      <TextAreaField name="quote" label="Review" defaultValue={row?.quote} rows={5} />
      <div className={two}>
        <SelectField name="rating" label="Rating" defaultValue={String(row?.rating ?? 5)} options={[5, 4, 3, 2, 1].map((value) => ({ value: String(value), label: `${value} out of 5` }))} />
        <SelectField name="status" label="Status" defaultValue={row?.status ?? "pending"} options={["pending", "approved", "rejected"].map((value) => ({ value, label: value }))} />
      </div>
    </AdminForm>
  );
}

export function FaqForm({ row, categories }: { row?: typeof faqs.$inferSelect; categories: Option[] }) {
  return (
    <AdminForm action={saveFaq} className="max-w-3xl">
      <IdField id={row?.id} />
      <TextField name="question" label="Question" defaultValue={row?.question} required />
      <TextAreaField name="answer" label="Answer" defaultValue={row?.answer} rows={5} />
      <div className={two}>
        <SelectField name="categoryId" label="Appears on" defaultValue={row?.categoryId} options={[{ value: "", label: "Homepage and FAQ page" }, ...categories]} />
        <TextField name="sortOrder" label="Position" type="number" defaultValue={row?.sortOrder ?? 0} />
      </div>
      <CheckField name="isActive" label="Show on the website" defaultChecked={row?.isActive ?? true} />
    </AdminForm>
  );
}
