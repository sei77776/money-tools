---
name: payroll-run
description: Prepare and check a payroll run — gross-to-net, statutory deductions, employer contributions, and the pre-submission verification checklist. Use when the user says "run payroll", "payroll check", "給与計算", "給与支払い", "payslip", "how much do I need for payroll", or is preparing to pay employees. For hiring paperwork, see hiring-and-onboarding. For the cash timing, see cash-flow-management.
metadata:
  department: small-business
  version: 1.0.0
---

# Payroll Run

> **Not tax or payroll advice.** Rates, thresholds, and filing obligations change
> and are jurisdiction-specific. Verify current rates against the official source
> or a licensed payroll provider before paying anyone. Never rely on rates recalled
> from memory — look them up and cite the source and date.

## Step 1 — Freeze the inputs

For the period, per person:
- Base pay, and pay type (salary / hourly / commission)
- Hours worked, including overtime at the correct multiplier
- Variable pay: bonus, commission, tips, shift premiums
- Unpaid leave, sick leave, and paid leave taken
- Starters and leavers (partial periods — the most error-prone rows in any run)
- Changes since last period: raises, role changes, benefit elections

Get sign-off on hours **before** computing. Recomputing after a run is far more
work than confirming inputs once.

## Step 2 — Gross to net

```
Gross pay
  − pre-tax deductions (pension, some benefits)
  − income tax withholding
  − social insurance / statutory employee contributions
  − post-tax deductions (garnishments, loan repayments)
  = Net pay
```

Then, separately, **employer-side cost**:
```
Gross pay + employer social insurance + employer pension + levies = total cost
```

Employer contributions are frequently forgotten in cash planning. Report total
employer cost, not just the sum of net pay — the bank needs the former.

Japan: 健康保険, 厚生年金, 雇用保険, 労災保険, plus 源泉所得税 and 住民税.
Confirm the current 標準報酬月額 grade per employee rather than deriving it from
this month's gross.

## Step 3 — Run the verification checklist

Do not submit until each of these passes, with the actual figures shown:

- [ ] Headcount this period vs last — every difference explained by a known starter/leaver
- [ ] Any individual's net pay changed more than 10% vs last period — each explained
- [ ] No negative net pay
- [ ] No zero-pay row for an active employee
- [ ] Every bank account number matches the record on file (changed bank details are a common fraud vector — verify any change out-of-band, by phone, never by replying to the email requesting it)
- [ ] Gross total, deduction total, and net total sum correctly
- [ ] Employer contribution total computed and included in the funding figure
- [ ] Sufficient cleared cash on the funding date, not the pay date
- [ ] Statutory filing and payment deadlines for this period noted

## Step 4 — Deliver

- Payroll register: per person gross, each deduction, net.
- Funding summary: total net to employees, total to tax/insurance authorities, total employer cost, and the date each must clear.
- Exception report: every row flagged in Step 3 and its explanation.
- Upcoming filing deadlines.

State plainly whether the checklist passed in full. If any item failed, the run
is **not** ready to submit — say that rather than presenting it as complete.
