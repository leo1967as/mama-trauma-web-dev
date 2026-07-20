# CareCircle — Source-only Task List

## Source

- Google Doc tab: `t.p2tz2s4f3vop`
- RAW: [Afterbloom_CareCircle_TAB_p2tz2s4f3vop_RAW.txt](Afterbloom_CareCircle_TAB_p2tz2s4f3vop_RAW.txt)
- Rule: follow only the source below. Do not add features, routes, services, or assumptions outside it.

## Scope from the source

- Purpose: validate the Care Circle concept and user flow.
- Data: Mock Data only.
- Backend, booking, and payment are not real in this MVP.

## User flow

- [ ] `Home → Care Circle`
- [ ] `I Need Help → Therapist`
- [ ] Both paths open the same Care Circle area.

## Screens and source requirements

### Screen 1 — Care Circle Home

- [ ] Show two categories: Caregiver Support and Therapist Support.

### Screen 2 — Caregiver Support

- [ ] Show provider cards with profile photo, name, service tag, short description, rating, review count, hourly price, and availability.
- [ ] Support categories: Nanny, Midwife, Lactation Consultant, Postnatal Massage.
- [ ] Filter chips: All plus the four categories.
- [ ] Filter Mock Data only.

### Screen 3 — Therapist Support

- [ ] Use the same list layout as Caregiver Support.
- [ ] Show all psychologists/therapists.
- [ ] No filter required.

### Screen 4 — Provider Detail

- [ ] Show large photo, name, category, specialties, experience, bio, rating, review count, price, and availability.
- [ ] Show the `นัดหมาย` button.

### Screen 5 — Appointment Request (Mock)

- [ ] Date choices: today, tomorrow, or another day.
- [ ] Time choices: morning, afternoon, evening.
- [ ] Show `ส่งคำขอนัดหมาย`.
- [ ] No real logic.

### Screen 6 — Confirmation

- [ ] Show successful appointment-request message.
- [ ] Include provider name and waiting-for-response message.
- [ ] Include `กลับหน้าหลัก`.

## Mock Data fields

- [ ] `provider_id`
- [ ] `name`
- [ ] `profile_photo`
- [ ] `category`
- [ ] `sub_specialty`
- [ ] `bio`
- [ ] `experience`
- [ ] `expertise`
- [ ] `hourly_rate`
- [ ] `rating`
- [ ] `review_count`
- [ ] `availability`
- [ ] Suggested source volume: 12–15 caregivers and about 5 therapists.
- [ ] Provider records should be different; do not repeat the same placeholder.

## Source exclusions — do not build in this MVP

- Payment Gateway or payment system
- Real booking system
- Real-time calendar
- Provider Login
- Provider Dashboard
- License verification
- Chat
- Video Call
- Real review system
- Push Notification
- Backend Integration

## Acceptance criteria from the source

- [ ] Reach Care Circle from Home and I Need Help.
- [ ] Select Caregiver or Therapist.
- [ ] Filter all four Caregiver categories.
- [ ] Open provider detail.
- [ ] Press `นัดหมาย`.
- [ ] Complete the request through Confirmation.
- [ ] Use Mock Data only.
- [ ] Have no real Payment or Backend.

## UI direction from the source

- Pastel Pink Theme
- White Background
- Rounded cards
- Pill buttons
- Soft Shadow
- Warm, safe healthcare feeling; not hospital-like.

## Explicit non-addition rule

- Do not add a separate Therapy feature.
- Do not add navigation beyond the two source entry paths.
- Do not add backend, real providers, real booking, or extra workflow.
