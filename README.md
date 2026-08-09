# Submission Contents

An overview of what's included for each task and what each file contains.

## Task 1 — Scratchcard "Schatzsuche" (2 files)

**Test_Strategy_and_Cases_Schatzsuche(ScratchCard).xlsx**
All Task 1 documentation in one file, across four tabs: 1. Test Strategy (objective, scope, approach, entry/exit criteria), 2. Risk Assessment, 3. Symbol Combination Matrix (the valid/invalid decision table for ticket symbol combinations), and 4. Test Cases (30 detailed cases with test data, steps, expected results, and priority).

**BDD_Scenarios_Schatzsuche(ScratchCard).pdf**
The same 30 test cases re-expressed as Given/When/Then scenarios, grouped by Feature, for anyone who prefers to read or automate against BDD-style acceptance criteria rather than a spreadsheet.

## Task 2 — Slot "Cash Kiosk" (3 items)

**Automation script(s)**
Automated tests that play the game until a win occurs and check the win amount shown against the amount returned by the API.

**Manual_Test_Cases_CashKiosk(SlotGame).xlsx**
The manual testing companion to the automation, across two tabs: 1. Exploratory Observations (notes from initial exploration of the game and its API call sequence, which shaped the test design) and 2. Manual Test Cases (19 cases covering core UI actions, cross-browser/device compatibility, continuity and edge cases, and network/sync reliability).

**BDD_Scenarios_CashKiosk(SlotGame).pdf**
The manual test cases re-expressed as Given/When/Then scenarios, grouped by Feature.
