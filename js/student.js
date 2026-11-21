// STORAGE KEYS

const STUDENT_KEY = "lmpStudents";
const SESSION_KEY = "lmpStudentSession";

const ASSIGNMENT_KEY = "lmpStudentAssignments";
const PLAN_KEY = "lmpStudyPlans";
const FEEDBACK_KEY = "lmpStudentFeedbacks";

// COMMON FUNCTIONS

function getStoredData(key) {

    try {
        const data = JSON.parse(
            localStorage.getItem(key) || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {

        return [];
    }
}
function saveStoredData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}
function createRow(values, onDelete) {

    const row = document.createElement("tr");

    values.forEach(function (value) {

        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });
    const action = document.createElement("td");
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = "Delete";
    button.addEventListener("click", onDelete);

    action.appendChild(button);
    row.appendChild(action);

    return row;
}

// STUDENT LOGIN

const studentLoginForm =
    document.getElementById("studentLoginForm");

if (studentLoginForm) {

    const studentLoginMessage =
        document.getElementById("studentLoginMessage");

    // demo student (kono student saved na thakle)
    if (getStoredData(STUDENT_KEY).length === 0) {

        saveStoredData(STUDENT_KEY, [{

            name: "Arik Ahmed",
            roll: "HSC-2026-08",
            studentClass: "12 - Physics Vanguard",
            email: "arik@example.com",
            password: "1234"
        }]);
    }
    studentLoginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!studentLoginForm.checkValidity()) {
            studentLoginForm.reportValidity();
            return;
        }
        const email = document.getElementById("studentEmail")
            .value.trim().toLowerCase();
        const password = document.getElementById("studentPassword")
            .value;

        const students = getStoredData(STUDENT_KEY);

        const student = students.find(function (item) {

            return item.email === email &&
                item.password === password;
        });
        if (!student) {

            studentLoginMessage.textContent =
                "Invalid email or password!";
            return;
        }
        localStorage.setItem(SESSION_KEY, student.email);

        window.location.href = "Student_Dashboard.html";
    });
}

// STUDENT ASSIGNMENTS

const assignmentForm =
    document.getElementById("assignmentForm");

if (assignmentForm) {

    const assignmentTableBody =
        document.getElementById("assignmentTableBody");

    const assignmentMessage =
        document.getElementById("assignmentMessage");

    const assignmentListMessage =
        document.getElementById("assignmentListMessage");

    function displayAssignments() {

        assignmentTableBody.innerHTML = "";
        assignmentListMessage.textContent = "";

        const assignments = getStoredData(ASSIGNMENT_KEY);

        assignments.forEach(function (item, index) {

            const row = createRow([
                index + 1,
                item.title,
                item.subject,
                item.date,
                item.fileName,
                item.status
            ], function () {

                if (!confirm("Delete this assignment?")) return;

                const latest = getStoredData(ASSIGNMENT_KEY);
                latest.splice(index, 1);
                saveStoredData(ASSIGNMENT_KEY, latest);

                displayAssignments();
                assignmentMessage.textContent =
                    "Assignment deleted.";
            });
            assignmentTableBody.appendChild(row);
        });
        if (assignments.length === 0) {

            assignmentListMessage.textContent =
                "No assignments submitted yet.";
        }
    }
    assignmentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!assignmentForm.checkValidity()) {
            assignmentForm.reportValidity();
            return;
        }
        const assignments = getStoredData(ASSIGNMENT_KEY);

        assignments.push({

            title: document.getElementById("assignment-title")
                .value.trim(),
            subject: document.getElementById("assignment-subject")
                .value,
            date: document.getElementById("submission-date")
                .value,
            fileName: document.getElementById("file-name")
                .value.trim(),
            status: document.getElementById("assignment-status")
                .value,
            notes: document.getElementById("assignment-notes")
                .value.trim()
        });
        saveStoredData(ASSIGNMENT_KEY, assignments);

        assignmentForm.reset();
        displayAssignments();

        assignmentMessage.textContent =
            "Assignment submitted successfully!";
    });
    displayAssignments();
}

// STUDY PLANNER

const plannerForm =
    document.getElementById("plannerForm");

if (plannerForm) {

    const plannerTableBody =
        document.getElementById("plannerTableBody");

    const plannerMessage =
        document.getElementById("plannerMessage");

    const plannerListMessage =
        document.getElementById("plannerListMessage");

    function displayPlans() {

        plannerTableBody.innerHTML = "";
        plannerListMessage.textContent = "";

        const plans = getStoredData(PLAN_KEY);

        plans.forEach(function (item, index) {

            const row = createRow([
                index + 1,
                item.topic,
                item.subject,
                item.date,
                item.startTime + " - " + item.endTime,
                item.priority,
                item.status
            ], function () {

                if (!confirm("Delete this study plan?")) return;

                const latest = getStoredData(PLAN_KEY);
                latest.splice(index, 1);
                saveStoredData(PLAN_KEY, latest);

                displayPlans();
                plannerMessage.textContent =
                    "Study plan deleted.";
            });
            plannerTableBody.appendChild(row);
        });
        if (plans.length === 0) {

            plannerListMessage.textContent =
                "No study plans added yet.";
        }
    }
    plannerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!plannerForm.checkValidity()) {
            plannerForm.reportValidity();
            return;
        }
        const startTime =
            document.getElementById("plan-start").value;
        const endTime =
            document.getElementById("plan-end").value;

        if (endTime <= startTime) {

            plannerMessage.textContent =
                "End Time must be after Start Time!";
            return;
        }
        const plans = getStoredData(PLAN_KEY);

        plans.push({

            topic: document.getElementById("plan-topic")
                .value.trim(),
            subject: document.getElementById("plan-subject")
                .value,
            date: document.getElementById("plan-date")
                .value,
            startTime: startTime,
            endTime: endTime,
            priority: document.getElementById("plan-priority")
                .value,
            status: document.getElementById("plan-status")
                .value,
            notes: document.getElementById("plan-notes")
                .value.trim()
        });
        saveStoredData(PLAN_KEY, plans);

        plannerForm.reset();
        displayPlans();

        plannerMessage.textContent =
            "Study plan added successfully!";
    });
    displayPlans();
}

// STUDENT FEEDBACK

const feedbackForm =
    document.getElementById("feedbackForm");

if (feedbackForm) {

    const feedbackTableBody =
        document.getElementById("feedbackTableBody");

    const feedbackMessage =
        document.getElementById("feedbackMessage");

    const feedbackListMessage =
        document.getElementById("feedbackListMessage");

    function displayFeedbacks() {

        feedbackTableBody.innerHTML = "";
        feedbackListMessage.textContent = "";

        const feedbacks = getStoredData(FEEDBACK_KEY);

        feedbacks.forEach(function (item, index) {

            const row = createRow([
                index + 1,
                item.teacher,
                item.subject,
                item.type,
                item.rating,
                item.date,
                item.comments
            ], function () {

                if (!confirm("Delete this feedback?")) return;

                const latest = getStoredData(FEEDBACK_KEY);
                latest.splice(index, 1);
                saveStoredData(FEEDBACK_KEY, latest);

                displayFeedbacks();
                feedbackMessage.textContent =
                    "Feedback deleted.";
            });
            feedbackTableBody.appendChild(row);
        });
        if (feedbacks.length === 0) {

            feedbackListMessage.textContent =
                "No feedback submitted yet.";
        }
    }
    feedbackForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!feedbackForm.checkValidity()) {
            feedbackForm.reportValidity();
            return;
        }
        const feedbacks = getStoredData(FEEDBACK_KEY);

        feedbacks.push({

            teacher: document.getElementById("feedback-teacher")
                .value,
            subject: document.getElementById("feedback-subject")
                .value,
            type: document.getElementById("feedback-type")
                .value,
            rating: document.getElementById("feedback-rating")
                .value,
            date: document.getElementById("feedback-date")
                .value,
            comments: document.getElementById("feedback-comments")
                .value.trim()
        });
        saveStoredData(FEEDBACK_KEY, feedbacks);

        feedbackForm.reset();
        displayFeedbacks();

        feedbackMessage.textContent =
            "Feedback submitted successfully!";
    });
    displayFeedbacks();
}
