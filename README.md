# Student Excellence Portal

The **Student Excellence Portal** (or Achievement List) is a comprehensive web-based registry designed for faculty and administrators to track, view, and celebrate student milestones across various departments. It provides a modern, responsive interface for managing academic, sports, technical, and cultural achievements.

## Key Uses & Features

This webpage serves several main purposes, offering robust tools for exploring and managing student records:

### 1. View and Browse Achievements
* **Categorized Directory:** Achievements are divided into three main categories:
  * **Technical:** Hackathons, coding challenges, tech fests, etc.
  * **Non-Technical:** Debates, MUNs, social service, sports, etc.
  * **Cultural:** Dance, music, arts, college fests, etc.
* **Dual Viewing Modes:**
  * **By Students:** Browse a grid of student cards within a selected category.
  * **By Events:** See a summarized list of unique events within a category and the number of participants.

### 2. Deep Drill-Down & Participant Tracking
* When in **"By Events"** mode, clicking on an event will drill down to show all the specific students who participated in that exact event.
* **Print Functionality:** Faculty can easily generate and print a clean, formatted roster of all students participating in a specific event for official record-keeping.

### 3. Dynamic Search
* A powerful real-time search bar allows users to instantly filter the displayed list.
* You can search by:
  * Student Name
  * Roll Number
  * Department
  * Event Name / Title

### 4. Interactive Proof Verification (PDF Preview)
* Clicking on any student card opens an **Achievement Log** modal.
* The modal provides a split-screen view:
  * **Left Side:** A list of the student's logged activities.
  * **Right Side:** An integrated PDF viewer that displays the actual certificate or proof document for the selected activity, without needing to download it.

### 5. Upload New Achievements
* A dedicated **Upload Section** allows students to submit new accomplishments directly through the portal.
* The form collects details such as Name, Roll Number, Department, Category, Event Title, Date, Description, and a PDF Proof.
* Submitted records are immediately reflected in the portal. Data is handled entirely client-side and saved temporarily via browser `localStorage` for the active session.

### 6. Pre-Loaded Mock Data
* The system comes pre-configured with a rich dataset of **40 diverse student profiles** (`storage/stu-records.js`) to demonstrate the portal's capabilities immediately upon load.

## Technical Stack
* **Frontend:** HTML5, Vanilla JavaScript, CSS3
* **Framework:** Bootstrap 5 (for responsive layout and modals)
* **Icons & Fonts:** FontAwesome 6, Google Fonts (Inter, Poppins)
* **Storage:** Browser `localStorage` (for retaining user-uploaded data across page reloads)

## Getting Started
Simply open `index.html` in any modern web browser to access the portal. No backend server or complex environment setup is required.

## 6 Main Phases of Building

If you were to recreate or extend this project, it can be systematically divided into these 6 development phases:

### Phase 1: Project Setup and UI Wireframing
* Set up the initial `index.html` and `style.css`.
* Integrate Bootstrap 5 and FontAwesome.
* Build the static layout components: Navigation bar, Hero section, Image Carousel, and the Footer.

### Phase 2: Mock Data Structure Design
* Design the JSON-like array structure for students.
* Create `storage/stu-records.js` to hold 40 dummy profiles containing ID, name, roll number, department, avatar URL, and an array of their activities/proofs.

### Phase 3: Core DOM Manipulation & Rendering
* Write the foundational JavaScript to read from `window.studentsData`.
* Create functions to dynamically inject HTML for the "Technical," "Non-Technical," and "Cultural" category cards.
* Implement the logic to render individual student cards into the grid when a category is selected.

### Phase 4: Advanced Filtering & Search
* Implement the toggle switch to view data "By Students" or "By Events".
* Develop the event grouping logic (counting participants per event).
* Build the real-time search bar that filters the DOM based on name, roll number, department, or event titles.
* Add the "Print" functionality for the event participant lists.

### Phase 5: Interactive Modal & Document Preview
* Construct the Bootstrap Modal for the "Achievement Log".
* Write the JavaScript to populate the modal with a specific student's activity history upon clicking their card.
* Implement the `iframe` PDF preview feature on the right side of the modal to view certificates dynamically.

### Phase 6: Form Handling & Data Persistence
* Build the "Submit Your Achievement" form UI.
* Write the event listener to handle form submissions and read PDF files as Base64 data strings using `FileReader`.
* Implement browser `localStorage` integration to save new achievements, ensuring that newly added records persist during the active session without overwriting the static mock data file.
