import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const prisma = new PrismaClient();

const CSV_PATH = resolve(
  process.cwd(),
  'src',
  'data',
  'egyptian-drugs.csv',
);

const EXPECTED_HEADERS = [
  'commercial_name_en',
  'commercial_name_ar',
  'scientific_name',
  'manufacturer',
  'drug_class',
  'route',
  'price_egp',
] as const;

type DrugCsvRow = {
  commercial_name_en: string;
  commercial_name_ar?: string;
  scientific_name?: string;
  manufacturer?: string;
  drug_class?: string;
  route?: string;
  price_egp?: string | number;
};

function cleanString(
  value: unknown,
): string | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const cleaned = String(value).trim();

  if (!cleaned) {
    return null;
  }

  const upper = cleaned.toUpperCase();

  if (
    upper === 'N/A' ||
    upper === 'NULL' ||
    upper === 'N.A.' ||
    upper === 'NA'
  ) {
    return null;
  }

  return cleaned;
}

function parsePrice(
  value: unknown,
): number | null {
  const cleaned = cleanString(value);

  if (!cleaned) {
    return null;
  }

  const normalized = cleaned.replace(
    /,/g,
    '',
  );

  const price = Number(normalized);

  if (!Number.isFinite(price)) {
    return null;
  }

  return price;
}

function validateHeaders(
  records: Record<string, unknown>[],
) {
  if (records.length === 0) {
    throw new Error(
      'CSV file is empty.',
    );
  }

  const headers = Object.keys(
    records[0],
  );

  const missingHeaders =
    EXPECTED_HEADERS.filter(
      (header) =>
        !headers.includes(header),
    );

  if (missingHeaders.length > 0) {
    throw new Error(
      `CSV is missing required headers: ${missingHeaders.join(', ')}`,
    );
  }
}

async function main() {
  console.log(
    '========================================',
  );
  console.log(
    'Cliniqara Drug Database Import',
  );
  console.log(
    '========================================',
  );

  console.log(
    `CSV: ${CSV_PATH}`,
  );

  // ---------------------------------------------------------
  // Read CSV
  // ---------------------------------------------------------

  const csv = await readFile(
    CSV_PATH,
    'utf8',
  );

  const records =
    parse(csv, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      trim: true,
      relax_column_count: false,
    }) as Record<
      string,
      unknown
    >[];

  validateHeaders(records);

  console.log(
    `CSV rows: ${records.length.toLocaleString()}`,
  );

  // ---------------------------------------------------------
  // Normalize and deduplicate
  // ---------------------------------------------------------

  const uniqueRows =
    new Map<
      string,
      DrugCsvRow
    >();

  let skipped = 0;
  let duplicateRows = 0;

  for (const rawRow of records) {
    const commercialNameEn =
      cleanString(
        rawRow.commercial_name_en,
      );

    if (!commercialNameEn) {
      skipped++;
      continue;
    }

    if (
      uniqueRows.has(
        commercialNameEn,
      )
    ) {
      duplicateRows++;
      continue;
    }

    uniqueRows.set(
      commercialNameEn,
      {
        commercial_name_en:
          commercialNameEn,

        commercial_name_ar:
          cleanString(
            rawRow.commercial_name_ar,
          ) ?? undefined,

        scientific_name:
          cleanString(
            rawRow.scientific_name,
          ) ?? undefined,

        manufacturer:
          cleanString(
            rawRow.manufacturer,
          ) ?? undefined,

        drug_class:
          cleanString(
            rawRow.drug_class,
          ) ?? undefined,

        route:
          cleanString(
            rawRow.route,
          ) ?? undefined,

        price_egp:
          rawRow.price_egp as
            | string
            | number
            | undefined,
      },
    );
  }

  console.log(
    `Unique products: ${uniqueRows.size.toLocaleString()}`,
  );

  console.log(
    `Duplicate CSV rows: ${duplicateRows.toLocaleString()}`,
  );

  console.log(
    `Skipped rows: ${skipped.toLocaleString()}`,
  );

  // ---------------------------------------------------------
  // Import
  // ---------------------------------------------------------

  let inserted = 0;
  let updated = 0;

  const rows = Array.from(
    uniqueRows.values(),
  );

  for (
    let index = 0;
    index < rows.length;
    index++
  ) {
    const row = rows[index];

    const existing =
      await prisma.drug.findUnique({
        where: {
          commercialNameEn:
            row.commercial_name_en,
        },
        select: {
          id: true,
        },
      });

    const data = {
      commercialNameEn:
        row.commercial_name_en,

      commercialNameAr:
        cleanString(
          row.commercial_name_ar,
        ),

      scientificName:
        cleanString(
          row.scientific_name,
        ),

      manufacturer:
        cleanString(
          row.manufacturer,
        ),

      drugClass:
        cleanString(
          row.drug_class,
        ),

      route:
        cleanString(
          row.route,
        ),

      priceEgp:
        parsePrice(
          row.price_egp,
        ),

      source:
        'github-egyptian-drug-database',

      sourceRowKey:
        row.commercial_name_en,

      isActive: true,
    };

    if (existing) {
      await prisma.drug.update({
        where: {
          id: existing.id,
        },
        data,
      });

      updated++;
    } else {
      await prisma.drug.create({
        data,
      });

      inserted++;
    }

    if (
      (index + 1) % 500 === 0 ||
      index === rows.length - 1
    ) {
      console.log(
        `Processed ${(
          index + 1
        ).toLocaleString()} / ${rows.length.toLocaleString()} | ` +
          `Inserted: ${inserted.toLocaleString()} | ` +
          `Updated: ${updated.toLocaleString()}`,
      );
    }
  }

  console.log('');
  console.log(
    '========================================',
  );
  console.log(
    'Import completed successfully',
  );
  console.log(
    '========================================',
  );
  console.log(
    `CSV rows       : ${records.length.toLocaleString()}`,
  );
  console.log(
    `Unique products: ${uniqueRows.size.toLocaleString()}`,
  );
  console.log(
    `Inserted       : ${inserted.toLocaleString()}`,
  );
  console.log(
    `Updated        : ${updated.toLocaleString()}`,
  );
  console.log(
    `Duplicates     : ${duplicateRows.toLocaleString()}`,
  );
  console.log(
    `Skipped        : ${skipped.toLocaleString()}`,
  );
}

main()
  .catch((error) => {
    console.error('');
    console.error(
      'Drug import failed:',
    );
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });