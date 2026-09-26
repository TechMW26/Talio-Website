# Talio product content audit — 26 September 2026

Source: sibling `Talio` checkout, commit `3dbbd1b7`. This is an implementation audit, not a claim that every module is enabled for every tenant or deployed to every desktop client.

## Evidence used

| Website feature | Implementation reviewed |
| --- | --- |
| Projects & tasks | `app/dashboard/projects/[projectId]/page.js`, `models/Project.js`, project API routes and task views |
| MIRA | `lib/miraNavigation.js`, `lib/miraActions.js`, `contexts/MiraChatContext.js`, snapshot/voice/PiP implementations |
| Productivity | `app/dashboard/productivity/page.js`, `app/api/productivity/team/route.js`, capture and composite APIs |
| Attendance | `app/dashboard/attendance/*`, attendance/regularisation APIs, geofence settings and integration routes |
| Leave | `app/dashboard/leave/*` including allocations, balances, WFH and early leave |
| Payroll | `app/api/payroll/route.js`, bulk and payslip routes; payroll screens |
| Goals & performance | performance goals, ratings, reports and task/attendance statistics APIs |
| Requests & approvals | `lib/hrms/workflowService.server.js`, lifecycle services and project/leave approval views |
| Team chat | chat page, FloatingChatWidget, ChatPopup and presence normalisation |
| Meetings | meeting rooms and `app/api/meetings/[id]/summary/route.js` (transcript/notes prerequisites) |
| TalioBoard | `app/dashboard/talioboard/*`, whiteboard components and MiraAgentSidebar |
| People & lifecycle | employee pages, `lib/hrms/employeeLifecycle.server.js`, onboarding/probation/offboarding services |
| Recruitment | recruitment pages and jobs/candidates/interviews/conversion APIs |
| Assets & helpdesk | asset APIs, ticket/comment APIs, offboarding asset clearance |
| Documents & policies | document APIs and dashboard documents/policies pages |
| Notifications | notification preferences, actionable notifications and scheduled reminders |

## Content decisions

- Removed made-up success percentages, sample customer testimonials, unbounded usage promises, facial-recognition claims, automatic compliance promises and unverified workflow-builder descriptions from feature pages.
- Do not present the 31-item HRMS registry as 31 fully independent finished products: the legacy HRMS route redirects to employee operations, and some entries are setup-dependent workflow records.
- Learning pages contain sample course content. Do not market a fully operational LMS on that evidence.
- Do not claim payroll performs statutory filing or bank payouts.
- Explain capture permissions and avoid equating activity screenshots with the quality of a person's work.
- MIRA performs supported, permission-bound actions. Do not promise unlimited autonomous work or identical features on every device.
- Product illustrations use invented example work and are labelled illustrative; no customer names, private screenshots or performance claims.
- Retain live release availability, stable installer endpoints, retry and periodic refresh. Mobile links use the existing official store destinations. Do not invent minimum OS or disk requirements.

## Design research

Reviewed [Linear features](https://linear.app/features), [Notion projects](https://www.notion.com/product/projects), and [Slack downloads](https://slack.com/intl/en-gb/downloads/windows). Applied concise task-oriented introductions, product-first illustrations, grouped browsing and a clear device/download choice. No competitor copy, imagery or UI assets reused.

## Layout decisions

One responsive feature index and detail template; filter/search and illustrative controls are keyboard accessible. Product routes retain native zoom and standard scrolling/cursors. CSS viewport width drives reflow. Desktop downloads use three cards on the first row and two centered cards on the second; incomplete tablet rows also center. Narrow screens use a single column. Reduced-motion settings suppress decorative transitions.

## Validation

- Production Vite build passed; existing large-chunk advisory remains.
- All 10 download helper tests passed.
- Browser checks at 320, 390, 768 and 1440 CSS pixels showed no page horizontal overflow. Verified desktop 3+2 centered downloads, tablet 2+2+1 centered downloads, and phone single-column cards.
- Verified category/search filtering, empty-state reset, interactive illustration selection, records/conversation layouts, and a clean console on the tested feature page.
- Confirmed product routes retain the 16px root font and disable inverse zoom compensation; breakpoint checks cover narrow-viewport reflow, not an OS/browser zoom matrix.
- Live release metadata returned v6.0.14; all four local desktop download endpoints returned 302 redirects. Full installer binaries were not downloaded or installed.
