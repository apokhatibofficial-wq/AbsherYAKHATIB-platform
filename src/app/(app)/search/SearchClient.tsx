"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/ui/icons";
import { Chip } from "@/components/ui/Chip";
import { ProfessionalRow } from "@/components/professionals/ProfessionalRow";
import { CITIES } from "@/types/domain";
import type { Professional } from "@/types/domain";

const ALL_PROFESSIONS = "الكل";
const ALL_CITIES = "كل المدن";

function SearchContent({ professionals, professions }: { professionals: Professional[]; professions: string[] }) {
  const searchParams = useSearchParams();
  const initialProfession = searchParams.get("profession") ?? ALL_PROFESSIONS;

  const [query, setQuery] = useState("");
  const [professionFilter, setProfessionFilter] = useState<string>(initialProfession);
  const [cityFilter, setCityFilter] = useState<string>(ALL_CITIES);

  const results = useMemo(() => {
    return professionals.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        p.name.includes(query.trim()) ||
        p.profession.includes(query.trim());
      const matchesProfession = professionFilter === ALL_PROFESSIONS || p.profession === professionFilter;
      const matchesCity = cityFilter === ALL_CITIES || p.city === cityFilter;
      return matchesQuery && matchesProfession && matchesCity;
    });
  }, [professionals, query, professionFilter, cityFilter]);

  return (
    <div className="px-5 py-5">
      <h1 className="mb-4 text-[19px] font-extrabold text-text-primary">البحث</h1>

      <div className="mb-4 flex items-center gap-2.5 rounded-card border-[1.5px] border-border bg-white px-4 py-3.5">
        <SearchIcon size={18} className="text-text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="اسم أو مهنة..."
          className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-faint"
        />
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-0.5">
        <Chip label={ALL_PROFESSIONS} active={professionFilter === ALL_PROFESSIONS} onClick={() => setProfessionFilter(ALL_PROFESSIONS)} />
        {professions.map((p) => (
          <Chip key={p} label={p} active={professionFilter === p} onClick={() => setProfessionFilter(p)} />
        ))}
      </div>

      <select
        value={cityFilter}
        onChange={(e) => setCityFilter(e.target.value)}
        className="mb-[18px] w-full rounded-input border-[1.5px] border-border bg-white px-3.5 py-[11px] text-[13.5px] text-text-primary"
      >
        <option value={ALL_CITIES}>{ALL_CITIES}</option>
        {CITIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <p className="mb-2.5 text-[13px] text-text-muted">{results.length} نتيجة</p>

      {results.length === 0 ? (
        <div className="py-[50px] text-center text-[13.5px] text-text-faint">لا توجد نتائج مطابقة لبحثك</div>
      ) : (
        results.map((p) => <ProfessionalRow key={p.id} professional={p} />)
      )}
    </div>
  );
}

export function SearchClient({
  professionals,
  professions,
}: {
  professionals: Professional[];
  professions: string[];
}) {
  return (
    <Suspense fallback={null}>
      <SearchContent professionals={professionals} professions={professions} />
    </Suspense>
  );
}
