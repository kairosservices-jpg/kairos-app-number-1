# Kairos Nutrition Quiz - Make.com Integration & Scoring Reference

This document tracks the **exact** text strings that the website sends to the Make.com webhook. 

If you update formulas inside Make.com (such as the `Tools 2: Set multiple variables` node or the `Tools 3: Set lead_score` node), your `if()` statements must match these exact strings character-for-character. 

Mismatching uppercase letters, hyphens, or spacing will cause Make.com to drop the score to `0`. 

---

### Step 7: How much weight would you like to lose?
*(Uses standard hyphens `-` with no spaces)*
* `1-10 lbs`
* `10-20 lbs`
* `20-30 lbs`
* `30+ lbs`

### Step 8: How many hours do you work each week?
*(Uses standard hyphens `-` with no spaces)*
* `Under 40`
* `40-50`
* `50-60`
* `60+`

### Step 9: To help us recommend the right level of support, what is your approximate personal annual income?
*(Uses Uppercase `K` and standard hyphens `-` with no spaces)*
* `Under $50K`
* `$50K-$75K`
* `$75K-$100K`
* `$100K-$150K`
* `$150K+`

### Step 10: How important is losing this weight to you right now?
*(Uses a standard hyphen `-` with a space on each side)*
* `1 - Not very important`
* `2 - I know I should, but I'm not ready`
* `3 - I want to make a change`
* `4 - I'm serious about it`
* `5 - I need to do this now`

### Step 11: What is your biggest struggle right now?
*(Uses standard single quotes `'`)*
* `I don't have time`
* `I can't stay consistent`
* `I don't know what to eat`
* `I'm too tired after work`
* `I lose weight, then gain it back`

### ZIP Code Scoring Equation (Step 1)
```text
if(
  {{1.`What's your ZIP code?`}} = "99201" or
  {{1.`What's your ZIP code?`}} = "99202" or
  {{1.`What's your ZIP code?`}} = "99203" or
  {{1.`What's your ZIP code?`}} = "99204" or
  {{1.`What's your ZIP code?`}} = "99205" or
  {{1.`What's your ZIP code?`}} = "99206" or
  {{1.`What's your ZIP code?`}} = "99207" or
  {{1.`What's your ZIP code?`}} = "99208" or
  {{1.`What's your ZIP code?`}} = "99212" or
  {{1.`What's your ZIP code?`}} = "99216" or
  {{1.`What's your ZIP code?`}} = "99217" or
  {{1.`What's your ZIP code?`}} = "99218" or
  {{1.`What's your ZIP code?`}} = "99223" or
  {{1.`What's your ZIP code?`}} = "99224" or
  {{1.`What's your ZIP code?`}} = "99251" or
  {{1.`What's your ZIP code?`}} = "99001" or
  {{1.`What's your ZIP code?`}} = "99004" or
  {{1.`What's your ZIP code?`}} = "99005" or
  {{1.`What's your ZIP code?`}} = "99006" or
  {{1.`What's your ZIP code?`}} = "99008" or
  {{1.`What's your ZIP code?`}} = "99009" or
  {{1.`What's your ZIP code?`}} = "99011" or
  {{1.`What's your ZIP code?`}} = "99013" or
  {{1.`What's your ZIP code?`}} = "99014" or
  {{1.`What's your ZIP code?`}} = "99016" or
  {{1.`What's your ZIP code?`}} = "99019" or
  {{1.`What's your ZIP code?`}} = "99021" or
  {{1.`What's your ZIP code?`}} = "99022" or
  {{1.`What's your ZIP code?`}} = "99023" or
  {{1.`What's your ZIP code?`}} = "99025" or
  {{1.`What's your ZIP code?`}} = "99026" or
  {{1.`What's your ZIP code?`}} = "99027" or
  {{1.`What's your ZIP code?`}} = "99030" or
  {{1.`What's your ZIP code?`}} = "99036" or
  {{1.`What's your ZIP code?`}} = "99037" or
  {{1.`What's your ZIP code?`}} = "99039" or
  {{1.`What's your ZIP code?`}} = "83814" or
  {{1.`What's your ZIP code?`}} = "83815" or
  {{1.`What's your ZIP code?`}} = "83835" or
  {{1.`What's your ZIP code?`}} = "83854" or
  {{1.`What's your ZIP code?`}} = "83858" or
  {{1.`What's your ZIP code?`}} = "83801" or
  {{1.`What's your ZIP code?`}} = "83816" or
  {{1.`What's your ZIP code?`}} = "83822" or
  {{1.`What's your ZIP code?`}} = "83833" or
  {{1.`What's your ZIP code?`}} = "83842" or
  {{1.`What's your ZIP code?`}} = "83845" or
  {{1.`What's your ZIP code?`}} = "83869",
2
, 0)
```

---

## Make.com Routing Conditions
The output of your final `Tools 3` node in Make.com evaluating these answers must result in a single `lead_score` variable (max score 4). Then, your **Router** module will evaluate `lead_score` and `service_area_match` (which outputs `2` for local, `0` for out of range) using these 3 paths:

1. **Qualified**: `lead_score` Numeric Equal to `4` AND `service_area_match` Numeric Equal to `2`
2. **Unqualified Local**: `lead_score` Numeric Less than `4` AND `service_area_match` Numeric Equal to `2`
3. **Not Local**: `service_area_match` Numeric Equal to `0`

> **CRITICAL REMINDER**: 
> When configuring the Router filters, DO NOT type the raw text `lead_score` manually into the condition box. You must select the actual mapped variable (the colored pill) from the popup menu AND you must use **Numeric operators** (not Text operators).

