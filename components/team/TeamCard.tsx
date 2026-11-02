import Image from "next/image";
import { UserRound } from "lucide-react";
import type { TeamMember } from "@/lib/content/general";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="glass glow-hover flex h-full flex-col rounded-2xl p-7">
      <div className="grid size-20 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-ocean/50 to-deep text-aqua">
        {member.image ? (
          <Image src={member.image} alt={member.name} width={160} height={160} className="size-full object-cover" />
        ) : (
          <UserRound className="size-9" aria-hidden />
        )}
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold">{member.name || member.designation}</h3>
      {member.name ? <p className="text-sm text-aqua">{member.designation}</p> : <p className="text-sm text-aqua">Profile coming soon</p>}
      <p className="mt-3 text-sm leading-relaxed text-mist">{member.bio}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {member.skills.map((skill) => <li key={skill} className="rounded-full bg-white/6 px-2.5 py-1 text-xs text-mist">{skill}</li>)}
      </ul>
      {member.links.length > 0 && (
        <div className="mt-auto flex gap-4 pt-4 text-sm">
          {member.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="text-aqua hover:underline">{link.label}</a>)}
        </div>
      )}
    </article>
  );
}
