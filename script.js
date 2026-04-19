document.addEventListener("DOMContentLoaded", () => {
    // Read students from the global window.studentsData injected by stu-records.js
    let students = window.studentsData || [];

    // Retrieve locally saved students from localStorage
    try {
        const localData = localStorage.getItem('userModifiedStudents');
        if (localData) {
            students = JSON.parse(localData);
        }
    } catch (e) {
        console.error("Could not parse local students data", e);
    }

    const categoryGrid = document.getElementById("categoryGrid");
    const viewControls = document.getElementById("viewControls");
    const backBtn = document.getElementById("backBtn");
    const currentCategoryTitle = document.getElementById("currentCategoryTitle");
    const studentGrid = document.getElementById("studentGrid");
    
    const searchInput = document.getElementById("searchInput");
    const typingElement = document.getElementById("typing-text");
    const activityModal = new bootstrap.Modal(document.getElementById('activityModal'));
    const modalBody = document.getElementById('modalActivityBody');
    const modalStudentName = document.getElementById('modalStudentName');
    const pdfContainer = document.getElementById("pdfContainer");
    const uploadForm = document.getElementById("uploadForm");

    const heroSubtitle = "Faculty Portal: Tracking student excellence and extraordinary achievements across departments.";
    let speed = 50;
    let index = 0;

    function handleTyping() {
        if (!typingElement) return;
        if (index < heroSubtitle.length) {
            typingElement.textContent += heroSubtitle.charAt(index);
            index++;
            setTimeout(handleTyping, speed);
        }
    }
    setTimeout(handleTyping, 500);

    // Initial state: show categories, hide students
    function showCategories() {
        categoryGrid.classList.remove("d-none");
        studentGrid.classList.add("d-none");
        viewControls.classList.add("d-none");
        viewControls.classList.remove("d-flex");
        searchInput.value = "";
    }

    // Show students for a specific category
    function showStudentsByCategory(category) {
        // filter students who have at least one activity in that category
        const filtered = students.filter(s => s.activities.some(a => a.category.toLowerCase() === category.toLowerCase()));
        
        categoryGrid.classList.add("d-none");
        studentGrid.classList.remove("d-none");
        viewControls.classList.remove("d-none");
        viewControls.classList.add("d-flex");
        currentCategoryTitle.textContent = `${category} Achievements`;
        
        renderStudents(filtered, category);
    }

    // Category click handler
    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            const category = card.getAttribute("data-category");
            showStudentsByCategory(category);
        });
    });

    if (backBtn) {
        backBtn.addEventListener("click", showCategories);
    }

    function renderStudents(filteredStudents, highlightCategory = null) {
        studentGrid.innerHTML = "";

        if (filteredStudents.length === 0) {
            studentGrid.innerHTML = `
                <div class="col-12 empty-state p-5 text-center">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
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
                <div class="student-card shadow-sm p-4 rounded bg-white h-100 border" data-student-id="${student.id}" style="cursor: pointer; transition: box-shadow 0.2s;" onmouseover="this.classList.add('shadow')" onmouseout="this.classList.remove('shadow')">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${student.avatar}" alt="Avatar of ${student.name}" class="student-avatar me-3 rounded-circle border" width="60" height="60">
                        <div>
                            <h5 class="mb-0 fw-bold">${student.name}</h5>
                            <small class="text-muted">${student.roll}</small>
                        </div>
                    </div>
                    <div class="mb-3">
                        <span class="badge bg-primary bg-opacity-10 text-primary small border border-primary border-opacity-25">${student.dept}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                        <span class="small text-muted"><i class="fas fa-medal me-2 text-warning"></i>${student.activities.length} Events</span>
                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3">View Proofs</button>
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

        modalStudentName.textContent = `${student.name}`;
        
        let activitiesHtml = student.activities.map((act, idx) => `
            <div class="activity-item-log mb-3 p-3 rounded-3 border activity-clickable" data-proof="${act.proof}" style="cursor:pointer; transition: background 0.2s;">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0 text-primary">${act.title}</h6>
                    <span class="badge bg-light text-secondary border">${act.category}</span>
                </div>
                <p class="small text-muted mb-2">${act.description}</p>
                <div class="d-flex justify-content-between align-items-center small text-muted">
                    <span><i class="far fa-calendar-alt me-2"></i>${act.date}</span>
                    <span class="text-danger fw-bold"><i class="fas fa-file-pdf me-1"></i> Preview Proof</span>
                </div>
            </div>
        `).join("");
        
        modalBody.innerHTML = activitiesHtml;
        
        if (student.activities.length > 0) {
            loadPdf(student.activities[0].proof);
        } else {
            pdfContainer.innerHTML = `<p class="text-muted">No proof available.</p>`;
        }

        modalBody.querySelectorAll(".activity-clickable").forEach(el => {
            el.addEventListener("click", () => {
                modalBody.querySelectorAll(".activity-clickable").forEach(sib => sib.classList.remove("bg-primary", "bg-opacity-10"));
                el.classList.add("bg-primary", "bg-opacity-10");
                const proof = el.getAttribute("data-proof");
                loadPdf(proof);
            });
        });

        const firstAct = modalBody.querySelector(".activity-clickable");
        if (firstAct) firstAct.classList.add("bg-primary", "bg-opacity-10");

        activityModal.show();
    });

    function loadPdf(pdfPath) {
        if (!pdfPath) {
             pdfContainer.innerHTML = `<p class="text-muted">No proof available.</p>`;
             return;
        }
        // Load the PDF via iframe
        pdfContainer.innerHTML = `<iframe src="${pdfPath}" width="100%" height="100%" style="border:none; min-height: 500px; border-radius: 8px;"></iframe>`;
    }

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === "") {
            showCategories();
            return;
        }

        // If typing, hide categories, show student grid with search results
        categoryGrid.classList.add("d-none");
        studentGrid.classList.remove("d-none");
        viewControls.classList.add("d-none");
        viewControls.classList.remove("d-flex");

        // Search logic: check if student name, roll, dept matches OR event title
        const filtered = students.filter(s => {
            const matchesBasic = s.name.toLowerCase().includes(query) ||
                                 s.roll.toLowerCase().includes(query) ||
                                 s.dept.toLowerCase().includes(query);
            
            const matchesEvent = s.activities.some(act => act.title.toLowerCase().includes(query) || act.category.toLowerCase().includes(query));
            
            return matchesBasic || matchesEvent;
        });
        
        renderStudents(filtered);
    });

    // Handle Upload Achievement
    if (uploadForm) {
        uploadForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fileInput = document.getElementById("upProof");
            const file = fileInput.files[0];
            if (!file) {
                alert("Please select a PDF file.");
                return;
            }

            // Optional: Limit file size to avoid LocalStorage Quota Exceeded (e.g., 2MB)
            // if (file.size > 2000000) {
            //     alert("File is too large! Please upload a PDF smaller than ~2MB.");
            //     return;
            // }

            // Read as data URL to persist the PDF inside LocalStorage correctly.
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Proof = event.target.result;
                
                const deptSelect = document.getElementById("upDept");
                const catSelect = document.getElementById("upCategory");
                
                const upRoll = document.getElementById("upRoll").value.trim();
                const upName = document.getElementById("upName").value.trim();
                const upTitle = document.getElementById("upTitle").value.trim();
                const upDate = document.getElementById("upDate").value;
                const upDesc = document.getElementById("upDesc").value.trim();
                const upDeptText = deptSelect.options[deptSelect.selectedIndex].text;
                const upCatText = catSelect.options[catSelect.selectedIndex].text;

                const newActivity = {
                    title: upTitle,
                    category: upCatText,
                    date: upDate,
                    description: upDesc,
                    proof: base64Proof
                };

                // Check if student exists
                let existingStudent = students.find(s => s.roll.toLowerCase() === upRoll.toLowerCase());

                if (existingStudent) {
                    existingStudent.activities.push(newActivity);
                } else {
                    const newStudent = {
                        id: Date.now(),
                        name: upName,
                        roll: upRoll,
                        dept: upDeptText,
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(upName)}`,
                        activities: [newActivity]
                    };
                    students.push(newStudent);
                }

                // Attempt to save state locally
                try {
                    localStorage.setItem('userModifiedStudents', JSON.stringify(students));
                    alert("Achievement successfully submitted and saved locally!");
                    
                    uploadForm.reset();
                    
                    // Route back to categories view and render
                    document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
                    showStudentsByCategory(upCatText);

                } catch (err) {
                    // LocalStorage limits are around ~5MB. If a large PDF is uploaded, it will fail here.
                    alert("The PDF size is too large for permanent browser local caching. It has been added temporarily for this active session!");
                    uploadForm.reset();
                    document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
                    showStudentsByCategory(upCatText);
                }
            };
            
            reader.readAsDataURL(file);
        });
    }
});
