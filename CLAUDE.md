@AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules --> 
<!--", AVG("cultureScore") AS "_avg$cultureScore", AVG("dataScore") AS "_avg$dataScore", AVG("operationsScore") AS "_avg$operationsScore", AVG("durationSec") AS "_avg$durationSec" FROM (SELECT "public"."Assessment"."overallScore", "public"."Assessment"."strategyScore", "public"."Assessment"."technologyScore", "public"."Assessment"."cultureScore", "public"."Assessment"."dataScore", "public"."Assessment"."operationsScore", "public"."Assessment"."durationSec" FROM "public"."Assessment" WHERE 1=1 OFFSET $1) AS "sub"
prisma:query SELECT COUNT(*) AS "_count$_all", AVG("public"."Assessment"."overallScore") AS "_avg$overallScore", "public"."Assessment"."industry" FROM "public"."Assessment" WHERE 1=1 GROUP BY "public"."Assessment"."industry" ORDER BY COUNT("public"."Assessment"."industry") DESC OFFSET $1
prisma:query SELECT COUNT(*) AS "_count$_all", AVG("public"."Assessment"."overallScore") AS "_avg$overallScore", "public"."Assessment"."companySize" FROM "public"."Assessment" WHERE 1=1 GROUP BY "public"."Assessment"."companySize" OFFSET $1
prisma:query
        SELECT
          TO_CHAR(DATE_TRUNC('week', "createdAt"), 'YYYY-MM-DD') AS "weekStart",
          COUNT(*)::int AS "count",
          COALESCE(ROUND(AVG("overallScore"))::int, 0) AS "average"
        FROM "Assessment"
        WHERE "createdAt" > NOW() - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', "createdAt")
        ORDER BY DATE_TRUNC('week', "createdAt") ASC

 GET /api/benchmark/stats 200 in 772ms (next.js: 345ms, application-code: 426ms)
prisma:query
        SELECT
          TO_CHAR(DATE_TRUNC('week', "createdAt"), 'YYYY-MM-DD') AS "weekStart",
          COUNT(*)::int AS "count",
          COALESCE(ROUND(AVG("overallScore"))::int, 0) AS "average"
        FROM "Assessment"
        WHERE "createdAt" > NOW() - INTERVAL '12 weeks'
        GROUP BY DATE_TRUNC('week', "createdAt")
        ORDER BY DATE_TRUNC('week', "createdAt") ASC

 GET /api/benchmark/stats 200 in 757ms (next.js: 339ms, application-code: 419ms)
 GET /api/auth/session 200 in 69ms (next.js: 45ms, application-code: 23ms)
 GET /api/auth/session 200 in 41ms (next.js: 5ms, application-code: 35ms)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
[browser] Not valid image extension (src/lib/pdf-generator.tsx:951:16)
✓ Compiled in 364ms
 GET / 200 in 170ms (next.js: 34ms, application-code: 136ms)
 GET /admin/assessments 200 in 196ms (next.js: 65ms, proxy.ts: 45ms, application-code: 86ms)
 GET /api/auth/session 200 in 43ms (next.js: 15ms, application-code: 27ms)
 GET /api/auth/session 200 in 30ms (next.js: 3ms, application-code: 26ms)
 GET /admin/assessments 200 in 844ms (next.js: 16ms, proxy.ts: 6ms, application-code: 822ms)
 GET /api/auth/session 200 in 42ms (next.js: 18ms, application-code: 24ms)
 GET /api/auth/session 200 in 75ms (next.js: 14ms, application-code: 60ms)
 GET /api/auth/session 200 in 38ms (next.js: 5ms, application-code: 32ms)
 GET /trennt-logo.png 404 in 226ms (next.js: 40ms, application-code: 186ms)
⨯ The requested resource isn't a valid image for /trennt-logo.png received null
prisma:query SELECT 1
prisma:query SELECT 1
prisma:query SELECT 1
prisma:query SELECT 1
prisma:query SELECT COUNT(*) AS "_count$_all" FROM (SELECT "public"."Assessment"."id" FROM "public"."Assessment" WHERE 1=1 OFFSET $1) AS "sub"
prisma:query SELECT "public"."Assessment"."id", "public"."Assessment"."respondentName", "public"."Assessment"."respondentEmail", "public"."Assessment"."companyName", "public"."Assessment"."companySize", "public"."Assessment"."industry", "public"."Assessment"."country", "public"."Assessment"."role", "public"."Assessment"."consentContact", "public"."Assessment"."overallScore", "public"."Assessment"."strategyScore", "public"."Assessment"."technologyScore", "public"."Assessment"."cultureScore", "public"."Assessment"."dataScore", "public"."Assessment"."operationsScore", "public"."Assessment"."tier", "public"."Assessment"."questionCount", "public"."Assessment"."durationSec", "public"."Assessment"."createdAt", "public"."Assessment"."responses" FROM "public"."Assessment" WHERE 1=1 ORDER BY "public"."Assessment"."createdAt" DESC LIMIT $1 OFFSET $2
prisma:query SELECT COUNT(*) AS "_count$_all" FROM (SELECT "public"."Assessment"."id" FROM "public"."Assessment" WHERE 1=1 OFFSET $1) AS "sub"
prisma:query SELECT "public"."Assessment"."id", "public"."Assessment"."respondentName", "public"."Assessment"."respondentEmail", "public"."Assessment"."companyName", "public"."Assessment"."companySize", "public"."Assessment"."industry", "public"."Assessment"."country", "public"."Assessment"."role", "public"."Assessment"."consentContact", "public"."Assessment"."overallScore", "public"."Assessment"."strategyScore", "public"."Assessment"."technologyScore", "public"."Assessment"."cultureScore", "public"."Assessment"."dataScore", "public"."Assessment"."operationsScore", "public"."Assessment"."tier", "public"."Assessment"."questionCount", "public"."Assessment"."durationSec", "public"."Assessment"."createdAt", "public"."Assessment"."responses" FROM "public"."Assessment" WHERE 1=1 ORDER BY "public"."Assessment"."createdAt" DESC LIMIT $1 OFFSET $2
prisma:query SELECT "public"."AssessmentFollowUp"."id", "public"."AssessmentFollowUp"."interest", "public"."AssessmentFollowUp"."status", "public"."AssessmentFollowUp"."createdAt", "public"."AssessmentFollowUp"."assessmentId" FROM "public"."AssessmentFollowUp" WHERE "public"."AssessmentFollowUp"."assessmentId" IN ($1) OFFSET $2
prisma:query SELECT "public"."AssessmentFollowUp"."id", "public"."AssessmentFollowUp"."interest", "public"."AssessmentFollowUp"."status", "public"."AssessmentFollowUp"."createdAt", "public"."AssessmentFollowUp"."assessmentId" FROM "public"."AssessmentFollowUp" WHERE "public"."AssessmentFollowUp"."assessmentId" IN ($1) OFFSET $2
prisma:query SELECT "public -->
