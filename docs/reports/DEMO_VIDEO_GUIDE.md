# StudySync 5–7 Minute Demonstration Video Script & Recording Guide

**Evaluation Requirement:** Course PDF Section 3.D  
**Target Duration:** 5 to 7 Minutes  
**Quality Standards:** Clear screen capture (1080p recommended), clear audible voiceover, system output visible.  

---

## Video Outline & Time Allocation

| Section | Duration | Speaker | Content & Screen Action |
| :--- | :--- | :--- | :--- |
| **1. Intro & Team** | 0:00 - 0:45 (45s) | Member 1 (Lead) | Title slide displaying project name, group number, all 4 members' names and registration numbers. State project objectives. |
| **2. Problem Statement** | 0:45 - 1:30 (45s) | Member 2 | Explain why traditional messaging apps fail for academic groups (schedule mismatches, no course context, lack of accountability). |
| **3. Architecture & Design** | 1:30 - 2:30 (60s) | Member 3 | Show System Architecture diagram and 3NF PostgreSQL schema. Explain separation between React client, Express REST API, and PostgreSQL persistence. |
| **4. Live Feature Demo** | 2:30 - 4:45 (135s) | Member 1 & 4 | **Live End-to-End Walkthrough:**<br>1. Register a new student account (`alice@uni.edu`).<br>2. Complete profile and weekly availability slots.<br>3. Create a study group ("SE301 Architecture Study Group").<br>4. Switch to second browser/incognito session: Register second student (`bob@uni.edu`).<br>5. Search for the group and submit a join request.<br>6. Switch back to Alice to accept the request. |
| **5. Limitations & Next Steps** | 4:45 - 5:30 (45s) | Member 4 | State current limitations (basic keyword matching, calendar conflict detection undergoing testing). Outline work planned for Sprint 3 & 4. |
| **6. Member Contributions** | 5:30 - 6:30 (60s) | All Members | Each member speaks for 15 seconds summarizing their specific deliverables and verifiable git commits. |

---

## Pre-Recording Checklist
- [ ] Fresh seed data loaded via `database/seeds/001_sample_seed.sql`.
- [ ] Frontend and backend servers running without console errors.
- [ ] Browser zoom set to 110% or 125% for readable font size.
- [ ] Audio microphone checked for low background noise.
- [ ] Video uploaded to institutionally permitted cloud drive with public view-only link placed in `DEMO_VIDEO_LINK.txt`.
