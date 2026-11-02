import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Download, Mail, MessageCircle, Phone } from "lucide-react";
import { ActionButton, AdminForm, SelectField, TextAreaField, TextField } from "@/components/admin/form";
import { Badge, dateFormat, dateTimeFormat, PageHeader, Panel } from "@/components/admin/ui";
import { inquiryStatus } from "@/db/schema";
import { addInquiryNote, addQuotation, deleteQuotation, updateInquiryStatus } from "@/lib/admin/actions";
import { getInquiry } from "@/lib/admin/queries";
import { whatsappLink } from "@/lib/site-config";
import { isUuid } from "@/lib/utils";

export const metadata: Metadata = { title: "Inquiry" };

const contactClass = "inline-flex items-center gap-2 rounded-lg border border-aqua/20 px-3 py-2 text-sm hover:border-aqua/60";

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = isUuid(id) ? await getInquiry(id) : null;
  if (!data) notFound();
  const { inquiry, attachments, notes, quotes } = data;
  const whatsapp = inquiry.phone ? whatsappLink(inquiry.phone.replace(/\D/g, ""), `Hi ${inquiry.name}, this is Study Help about your inquiry ${inquiry.reference}.`) : null;

  return (
    <>
      <Link href="/admin/inquiries" className="mb-4 inline-flex items-center gap-1 text-sm text-aqua hover:underline"><ChevronLeft className="size-4" aria-hidden />All inquiries</Link>
      <PageHeader title={inquiry.reference} lead={`Received ${dateTimeFormat.format(inquiry.createdAt)}`} />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Panel title="Request">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-mist">Name</dt><dd className="font-medium">{inquiry.name}</dd></div>
              <div><dt className="text-mist">Email</dt><dd className="font-medium break-all">{inquiry.email}</dd></div>
              <div><dt className="text-mist">Phone</dt><dd className="font-medium">{inquiry.phone || "Not given"}</dd></div>
              <div><dt className="text-mist">Service</dt><dd className="font-medium">{inquiry.serviceTitle ?? inquiry.categoryTitle ?? "Not selected"}</dd></div>
              <div><dt className="text-mist">Preferred deadline</dt><dd className="font-medium">{inquiry.deadline ? dateFormat.format(new Date(inquiry.deadline)) : "Not given"}</dd></div>
              <div><dt className="text-mist">Came from</dt><dd className="font-medium">{inquiry.source === "contact" ? "Contact form" : "Quotation form"}</dd></div>
            </dl>
            <h3 className="mt-6 text-sm text-mist">Requirements</h3>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent(`Your Study Help inquiry ${inquiry.reference}`)}`} className={contactClass}><Mail className="size-4 text-aqua" aria-hidden />Email</a>
              {inquiry.phone && <a href={`tel:${inquiry.phone}`} className={contactClass}><Phone className="size-4 text-aqua" aria-hidden />Call</a>}
              {whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className={contactClass}><MessageCircle className="size-4 text-aqua" aria-hidden />WhatsApp</a>}
            </div>
          </Panel>

          <Panel title="Attachments">
            {attachments.length === 0 ? <p className="text-sm text-mist">No files were attached.</p> : (
              <ul className="space-y-2">
                {attachments.map((file) => (
                  <li key={file.id}>
                    <a href={`/admin/inquiries/attachments/${file.id}`} className="inline-flex items-center gap-2 text-sm text-aqua hover:underline">
                      <Download className="size-4" aria-hidden />{file.fileName} <span className="text-mist">({(file.sizeBytes / 1024 / 1024).toFixed(2)} MB)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Internal notes">
            <AdminForm action={addInquiryNote} submitLabel="Add note" resetOnSuccess>
              <input type="hidden" name="inquiryId" value={inquiry.id} />
              <TextAreaField name="body" label="New note" hint="Only your team can see these." rows={3} />
            </AdminForm>
            <ul className="mt-6 space-y-4">
              {notes.map(({ note, author }) => (
                <li key={note.id} className="border-l-2 border-aqua/30 pl-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.body}</p>
                  <p className="mt-1 text-xs text-mist">{author ?? "Former admin"} · {dateTimeFormat.format(note.createdAt)}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Status">
            <div className="mb-4"><Badge>{inquiry.status}</Badge></div>
            <AdminForm action={updateInquiryStatus} submitLabel="Update status">
              <input type="hidden" name="id" value={inquiry.id} />
              <SelectField name="status" label="Change status" defaultValue={inquiry.status} options={inquiryStatus.enumValues.map((value) => ({ value, label: value }))} />
            </AdminForm>
          </Panel>

          <Panel title="Quotations">
            <ul className="mb-6 space-y-4">
              {quotes.map((quote) => (
                <li key={quote.id} className="rounded-lg bg-white/5 p-4 text-sm">
                  <p className="font-display text-lg font-semibold">{quote.currency} {Number(quote.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  <p className="mt-1 whitespace-pre-wrap text-mist">{quote.scope}</p>
                  <p className="mt-2 text-xs text-mist">Recorded {dateFormat.format(quote.createdAt)}{quote.validUntil ? ` · valid until ${dateFormat.format(new Date(quote.validUntil))}` : ""}</p>
                  <div className="mt-2"><ActionButton action={deleteQuotation} fields={{ id: quote.id, inquiryId: inquiry.id }} label="Delete" confirm="Delete this quotation?" tone="danger" /></div>
                </li>
              ))}
            </ul>
            <AdminForm action={addQuotation} submitLabel="Record quotation" resetOnSuccess>
              <input type="hidden" name="inquiryId" value={inquiry.id} />
              <div className="grid grid-cols-[1fr_6rem] gap-3">
                <TextField name="amount" label="Amount" type="number" step="0.01" />
                <TextField name="currency" label="Currency" defaultValue="LKR" />
              </div>
              <TextAreaField name="scope" label="Scope" rows={3} />
              <TextField name="validUntil" label="Valid until (optional)" type="date" />
            </AdminForm>
          </Panel>
        </div>
      </div>
    </>
  );
}
