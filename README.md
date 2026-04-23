# Timetable App

An interactive timetable web application built with **Vite + React + TypeScript**. Upload an Excel file and instantly view a filterable weekly schedule — all processing happens in the browser, no backend required.

## Features

- 📂 **Excel Upload** — drag-and-drop or click to upload `.xlsx` / `.xls` timetable files
- 📅 **Weekly Grid** — Monday–Friday columns with time slots as rows; color-coded by major
- 🔍 **Live Filtering** — filter by Professor, Grade Level, Major, or Course Name (text search)
- 📥 **Sample Download** — download a sample Excel file to see the expected format

## Expected Excel Columns

| Column | Accepted aliases |
|---|---|
| Course Name | Course, Subject |
| Professor | Teacher, Instructor, Lecturer |
| Grade Level | Grade, Year, Level |
| Major | Department, Program, Field |
| Day | Weekday |
| Time Slot | Time, Period, Slot, Timeslots, Hours |
| Room *(optional)* | Classroom, Venue, Location |

Headers are case-insensitive and whitespace/dash/underscore-tolerant.

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
```

