document.addEventListener("DOMContentLoaded", () => {
    const students = [
        {
            id: 1,
            name: "Alex Rivera",
            roll: "CS2024001",
            dept: "Computer Science",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            activities: [
                { title: "National Coding Blitz 2024", category: "Technical", date: "March 12, 2024", description: "Secured Gold Medal in a 48-hour AI marathon. Developed a scalable inventory system." },
                { title: "Open Source Contributor", category: "Technical", date: "Feb 05, 2024", description: "Merged 15+ PRs in major React libraries." }
            ]
        },
        {
            id: 2,
            name: "Sarah Jenkins",
            roll: "EN2024045",
            dept: "Environmental Engineering",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            activities: [
                { title: "Green Campus Drive", category: "Community", date: "Feb 05, 2024", description: "Successfully led the reforestation movement by planting 500+ indigenous trees." },
                { title: "Eco-Summit Speaker", category: "Leadership", date: "Jan 12, 2024", description: "Presented a paper on sustainable urban drainage systems." }
            ]
        },
        {
            id: 3,
            name: "David Chang",
            roll: "AR2024012",
            dept: "Architecture & Design",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            activities: [
                { title: "Modern Arts Exposition", category: "Arts", date: "April 01, 2024", description: "Curated a digital gallery featuring 45 student photographers." },
                { title: "Urban Sketching Award", category: "Arts", date: "Dec 15, 2023", description: "First prize in city-wide landscape sketching competition." }
            ]
        },
        {
            id: 4,
            name: "Maria Garcia",
            roll: "PS2024088",
            dept: "Political Science",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            activities: [
                { title: "Model United Nations", category: "Leadership", date: "May 15, 2024", description: "Nominated as 'Outstanding Delegate' at Global MUN 2024." },
                { title: "Debate Championship", category: "Leadership", date: "March 22, 2024", description: "Finalist in the Inter-State Bilingual Debate." }
            ]
        },
        {
            id: 5,
            name: "Kevin Patel",
            roll: "SW2024102",
            dept: "Social Work",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
            activities: [
                { title: "Food for All Initiative", category: "Volunteering", date: "Feb 28, 2024", description: "Organized a drive distributing 2,500+ meals." },
                { title: "Literacy Program", category: "Volunteering", date: "Oct 10, 2023", description: "Taught basic computing to 50+ elderly citizens." }
            ]
        }
    ];

    const studentGrid = document.getElementById("studentGrid");
    const searchInput = document.getElementById("searchInput");
    const typingElement = document.getElementById("typing-text");
    const activityModal = new bootstrap.Modal(document.getElementById('activityModal'));
    const modalBody = document.getElementById('modalActivityBody');
    const modalStudentName = document.getElementById('modalStudentName');

    const heroSubtitle = "Faculty Portal: Tracking student excellence and extraordinary achievements across departments.";
    let speed = 50;
    let index = 0;

    function handleTyping() {
        if (index < heroSubtitle.length) {
            typingElement.textContent += heroSubtitle.charAt(index);
            index++;
            setTimeout(handleTyping, speed);
        }
    }
    setTimeout(handleTyping, 500);

    function renderStudents(filteredStudents = students) {
        studentGrid.innerHTML = "";

        if (filteredStudents.length === 0) {
            studentGrid.innerHTML = `
                <div class="col-12 empty-state">
                    <i class="fas fa-search"></i>
                    <h5 class="fw-bold mb-2">No Students Found</h5>
                    <p class="text-muted">Try adjusting your search query or clearing the filter.</p>
                </div>
            `;
            return;
        }

        filteredStudents.forEach(student => {
            const card = document.createElement("div");
            card.className = "col-md-6 col-lg-4";
            card.innerHTML = `
                <div class="student-card" data-student-id="${student.id}">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${student.avatar}" alt="Avatar of ${student.name}" class="student-avatar me-3">
                        <div>
                            <h5 class="mb-0 fw-bold">${student.name}</h5>
                            <small class="text-muted">${student.roll}</small>
                        </div>
                    </div>
                    <div class="mb-3">
                        <span class="badge-custom small">${student.dept}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                        <span class="small text-muted"><i class="fas fa-medal me-2"></i>${student.activities.length} Activities</span>
                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3">View Profile</button>
                    </div>
                </div>
            `;
            studentGrid.appendChild(card);
        });
    }

    studentGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".student-card");
        if (!card) return;

        const studentId = parseInt(card.dataset.studentId, 10);
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        modalStudentName.textContent = `${student.name}'s Achievement Log`;
        modalBody.innerHTML = student.activities.map(act => `
            <div class="activity-item-log mb-4 p-3 rounded-4 border">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0 text-primary">${act.title}</h6>
                    <span class="badge bg-light text-primary border">${act.category}</span>
                </div>
                <p class="small text-muted mb-2">${act.description}</p>
                <div class="small text-muted">
                    <i class="far fa-calendar-alt me-2"></i>${act.date}
                </div>
            </div>
        `);

        activityModal.show();
    });

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = students.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.roll.toLowerCase().includes(query) ||
            s.dept.toLowerCase().includes(query)
        );
        renderStudents(filtered);
    });

    renderStudents();
});
