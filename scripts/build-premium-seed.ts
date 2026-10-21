// Gera supabase/seed_premium.sql a partir de content-premium/.
// Uso: npm run seed:premium
import { writeFileSync } from 'node:fs'
import { PREMIUM_TONES } from '../content-premium/method'
import { METHOD_PRODUCT } from '../src/content/method/types'

const q = (s: string) => `'${s.replace(/'/g, "''")}'`
const rows = PREMIUM_TONES.map(
  (t) =>
    `insert into public.premium_content (id, product, kind, data) values (${q(`method-${t.id}`)}, ${q(METHOD_PRODUCT)}, 'method-tone', ${q(JSON.stringify(t))}::jsonb)\n` +
    `  on conflict (id) do update set data = excluded.data, product = excluded.product, updated_at = now();`,
)
const sql = `-- GERADO por scripts/build-premium-seed.ts. Não edite à mão.\n-- Rode no Supabase: SQL Editor → cole → Run.\n\n${rows.join('\n\n')}\n`
writeFileSync(new URL('../supabase/seed_premium.sql', import.meta.url), sql)
console.log(`seed_premium.sql: ${PREMIUM_TONES.length} tons`)
