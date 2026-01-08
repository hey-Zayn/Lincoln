# Implementation Plan - Learning Management System (LMS)

This plan outlines the architecture and implementation steps for a comprehensive Learning Management System within the Lincoln platform, enabling teachers to manage content, assignments, and assessments.

## Proposed Changes

### 2. LMS (Learning Management System)

- **Course Management**: Teachers can upload videos, documents, and notes.
- **Assignments**: Online submission and grading system.
- **Quizzes**: Auto-graded assessments for students.

### Database Layer
New models to support LMS functionality.

#### [NEW] [Course.Model.js](file:///f:/Lincoln-fyp/backend/models/Course.Model.js)
- Fields: `title`, `description`, `teacher` (Ref: User), `studentsEnrolled` (Array Ref: User), `materials` (Array of objects: `type` (video/doc/note), `url`, `title`).

#### [NEW] [Assignment.Model.js](file:///f:/Lincoln-fyp/backend/models/Assignment.Model.js)
- Fields: `title`, `description`, `course` (Ref: Course), `deadline`, `maxPoints`.

#### [NEW] [Submission.Model.js](file:///f:/Lincoln-fyp/backend/models/Submission.Model.js)
- Fields: `assignment` (Ref: Assignment), `student` (Ref: User), `fileUrl`, `grade`, `feedback`.

#### [NEW] [Quiz.Model.js](file:///f:/Lincoln-fyp/backend/models/Quiz.Model.js)
- Fields: `title`, `course` (Ref: Course), `questions` (Array: `question`, `options`, `correctIndex`).

---

### Backend Layer
Controllers and Routers for all LMS entities.

#### [NEW] [Course.controller.js](file:///f:/Lincoln-fyp/backend/controllers/Course.controller.js)
- Functions: `createCourse`, `getCourses`, `getCourseById`, `uploadMaterial`.

#### [NEW] [LMS.router.js](file:///f:/Lincoln-fyp/backend/router/lms.router.js)
- Grouped routes for Courses, Assignments, and Quizzes.
- Integration: Add `router.use('/lms', protectedRoute, lmsRouter)` in [index.js](file:///f:/Lincoln-fyp/backend/index.js).

---

### Frontend Layer
Modular components for teacher and student views.

#### [NEW] [CourseCreator.jsx](file:///f:/Lincoln-fyp/frontend/src/pages/LMS/CourseCreator.jsx)
- Form for teachers to define course metadata and upload materials.

#### [NEW] [AssignmentCenter.jsx](file:///f:/Lincoln-fyp/frontend/src/pages/LMS/AssignmentCenter.jsx)
- Teacher interface for creating assignments and grading submissions.

#### [NEW] [QuizBuilder.jsx](file:///f:/Lincoln-fyp/frontend/src/pages/LMS/QuizBuilder.jsx)
- Interface for teachers to build auto-graded quizzes.

---

## Verification Plan

### Automated Tests
- Postman/Insomnia tests for course creation and material upload.
- Unit tests for quiz auto-grading logic.

### Manual Verification
- Log in as Teacher: Create a course, upload a PDF, add an assignment.
- Log in as Student: Enroll in course, view material, submit assignment, take quiz.
- Verify that grades are correctly calculated and stored.
