import { faqs as generalFaqs, teamMembers as seedTeam } from "@/lib/content/general";
import { portfolioProjects as seedProjects } from "@/lib/content/portfolio";
import { serviceCategories as seedCategories } from "@/lib/content/services";
import { db, sqlClient } from "./index";
import { faqs, portfolioProjects, serviceCategories, services, teamMembers } from "./schema";

// Loads the starter content once. An already-seeded database is left untouched,
// so running this again can never overwrite edits made in the admin dashboard.
async function main() {
  const existing = await db.select({ id: serviceCategories.id }).from(serviceCategories).limit(1);
  if (existing.length > 0) {
    console.log("Database already has content. Nothing to seed.");
    return;
  }

  await db.transaction(async (tx) => {
    const categoryIds = new Map<string, string>();

    for (const [index, category] of seedCategories.entries()) {
      const [row] = await tx.insert(serviceCategories).values({
        slug: category.slug,
        title: category.title,
        short: category.short,
        description: category.description,
        icon: category.icon,
        imageUrl: `/images/stock/${category.slug}.jpg`,
        deliverables: category.deliverables,
        note: category.note,
        sortOrder: index,
      }).returning({ id: serviceCategories.id });
      categoryIds.set(category.slug, row.id);

      await tx.insert(services).values(category.services.map((service, position) => ({
        categoryId: row.id,
        slug: service.slug,
        title: service.title,
        summary: service.summary,
        options: service.options,
        sortOrder: position,
      })));

      if (category.faqs.length > 0) {
        await tx.insert(faqs).values(category.faqs.map((faq, position) => ({ ...faq, categoryId: row.id, sortOrder: position })));
      }
    }

    await tx.insert(faqs).values(generalFaqs.map((faq, position) => ({ ...faq, sortOrder: position })));

    await tx.insert(teamMembers).values(seedTeam.map((member, position) => ({
      name: member.name,
      designation: member.designation,
      bio: member.bio,
      skills: member.skills,
      links: member.links,
      sortOrder: position,
    })));

    await tx.insert(portfolioProjects).values(seedProjects.map((project, position) => ({
      slug: project.slug,
      title: project.title,
      category: project.category,
      serviceCategoryId: categoryIds.get(project.categorySlug),
      summary: project.summary,
      description: project.description,
      tags: project.tags,
      deliverables: project.deliverables,
      coverVariant: project.cover,
      coverImageUrl: `/images/stock/projects/${project.slug}.jpg`,
      isSample: project.isSample,
      isFeatured: project.featured,
      isPublished: true,
      sortOrder: position,
    })));
  });

  console.log("Seeded services, portfolio samples, team placeholders and FAQs.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => sqlClient.end());
