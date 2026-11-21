// STORAGE KEYS

const TEACHER_KEY = "lmpTeachers";
const SESSION_KEY = "coachEaseCurrentUser";

const ATTENDANCE_KEY = "lmpAttendance";
const EXAM_KEY = "lmpExams";
const RESULT_KEY = "lmpResults";
const ASSIGNMENT_KEY = "lmpAssignments";

// COMMON FUNCTIONS

function getTeachers() {
    try {

        const teachers = JSON.parse(
            localStorage.getItem(TEACHER_KEY) || "[]"
        );
        return Array.isArray(teachers) ? teachers : [];

    } catch (error) {
        return [];
    }

}
function saveTeachers(teachers) {

    localStorage.setItem(
        TEACHER_KEY,
        JSON.stringify(teachers)
    );
}
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
// LOGIN SESSION

const currentUser = JSON.parse(
    localStorage.getItem(SESSION_KEY) || "null"
);

// FIND LOGGED-IN TEACHER

function getActiveTeacher() {

    if (!currentUser || currentUser.role !== "Teacher") {
        return null;
    }
    const teachers = getTeachers();

    return teachers.find(function (teacher) {
        return teacher.id === currentUser.teacherID;

    }) || null;
}
function getActiveTeacherEmail() {
    const teacher = getActiveTeacher();
    return teacher ? teacher.email : "";

}
function getActiveTeacherID() {
    const teacher = getActiveTeacher();
    return teacher ? teacher.id : "";

}
// CHECK LOGIN AND ACCOUNT STATUS
const activeTeacher = getActiveTeacher();

if (!currentUser || currentUser.role !== "Teacher") {

    localStorage.removeItem(SESSION_KEY);

    window.location.href = "login.html";
} else if (!activeTeacher || activeTeacher.status !== "Active") {

    localStorage.removeItem(SESSION_KEY);
    alert("Your teacher account is unavailable or inactive.");

    window.location.href = "login.html";
}

// TEACHER PROFILE

function displayTeacherProfile() {

    const profileTeacherName =
        document.getElementById("profileTeacherName");

    if (!profileTeacherName) return;

    const teacher = getActiveTeacher();
    const message =
        document.getElementById("teacherProfileMessage");

    if (!teacher) {

        message.textContent =
            "No teacher information found.";
        return;
    }
    const fullName = teacher.name ||
        [teacher.first_name, teacher.last_name]
            .filter(Boolean)
            .join(" ");

    document.getElementById("teacherWelcome").textContent =
        "Welcome, " + fullName + "!";

    document.getElementById("profileTeacherID").textContent =
        teacher.id || "Not Assigned";

    document.getElementById("profileTeacherName").textContent =
        fullName || "Not Available";

    const usernameElement =
        document.getElementById("profileTeacherUsername");

    if (usernameElement) {
        usernameElement.textContent =
            teacher.username || "Not Available";
    }

    document.getElementById("profileTeacherMobile").textContent =
        teacher.mobile || teacher.phone || "Not Available";

    document.getElementById("profileTeacherEmail").textContent =
        teacher.email || "Not Available";

    document.getElementById("profileTeacherExpertise").textContent =
        teacher.expertise || teacher.qualification || "Not Available";

    document.getElementById("profileTeacherLevel").textContent =
        teacher.level || "Not Assigned";

    const courseElement =
        document.getElementById("profileTeacherCourse");

    if (courseElement) {

        const courses = getStoredData("coachEaseCourses");
        const course = courses.find(function (item) {

            return item.id === teacher.course_id;
        });

        courseElement.textContent =
            course ? course.name : (teacher.course_id || "Not Assigned");
    }
    const qualificationElement =
        document.getElementById("profileTeacherQualification");

    if (qualificationElement) {

        qualificationElement.textContent =
            teacher.qualification || "Not Available";
    }
    document.getElementById("profileTeacherStatus").textContent =
        teacher.status || "Not Available";
    message.textContent = "";
}
//  LOGOUT
const teacherLogoutBtn =
    document.getElementById("teacherLogoutBtn");

if (teacherLogoutBtn) {
    teacherLogoutBtn.addEventListener("click", function () {

        localStorage.removeItem(SESSION_KEY);

        window.location.href = "login.html";
    });
}
// TEACHER EXAMS
const examForm =
    document.getElementById("examForm");

if (examForm) {

    const examTableBody =
        document.getElementById("examTableBody");

    const examMessage =
        document.getElementById("examMessage");

    function displayExams() {

        examTableBody.innerHTML = "";
        examMessage.textContent = "";

        const exams = getStoredData(EXAM_KEY);
        const teacherEmail = getActiveTeacherEmail();

        const myExams = exams.filter(function (exam) {

            return exam.teacherEmail === teacherEmail;
        });

        myExams.forEach(function (exam) {

            const row = document.createElement("tr");
            const values = [

                exam.name,
                exam.course,
                exam.subject,
                exam.date,
                exam.time,
                exam.marks
            ];
            values.forEach(function (value) {

                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);

            });
            const action = document.createElement("td");

            const button = document.createElement("button");

            button.type = "button";
            button.textContent = "Delete";
            button.addEventListener("click", function () {

                if (!confirm("Delete this exam?")) return;

                let latestExams = getStoredData(EXAM_KEY);

                latestExams = latestExams.filter(function (item) {

                    return item !== exam;
                });
                saveStoredData(EXAM_KEY, latestExams);
                displayExams();

            });
            action.appendChild(button);
            row.appendChild(action);
            examTableBody.appendChild(row);

        });
        if (myExams.length === 0) {

            examMessage.textContent =
                "No exams saved yet.";
        }
    }
    examForm.addEventListener("submit", function (event) {

        event.preventDefault();
        if (!examForm.checkValidity()) {

            examForm.reportValidity();
            return;
        }
        const teacherEmail = getActiveTeacherEmail();
        if (!teacherEmail) {

            examMessage.textContent =
                "Teacher account not found.";
            return;

        }
        const exam = {

            teacherEmail: teacherEmail,
            name: document.getElementById("examName").value.trim(),
            course: document.getElementById("examCourse").value,
            subject: document.getElementById("examSubject").value.trim(),
            date: document.getElementById("examDate").value,
            time: document.getElementById("examTime").value,
            marks: Number(
                document.getElementById("totalMarks").value
            )
        };
        const exams = getStoredData(EXAM_KEY);
        exams.push(exam);

        saveStoredData(EXAM_KEY, exams);

        examForm.reset();
        displayExams();

        examMessage.textContent =
            "Exam saved successfully!";

    });
    displayExams();
}
// TEACHER RESULTS
const resultForm =
    document.getElementById("resultForm");

if (resultForm) {

    const resultExam =
        document.getElementById("resultExam");
    const resultTableBody =
        document.getElementById("resultTableBody");
    const resultMessage =
        document.getElementById("resultMessage");

    const courseNames = {

        "wd-l3": "web development",

        "gd-l3": "graphic design",

        "dm-l3": "digital marketing"
    };
    function populateResultExams() {

        resultExam.innerHTML = "";
        const defaultOption = document.createElement("option");

        defaultOption.value = "";
        defaultOption.textContent = "Select Exam";

        resultExam.appendChild(defaultOption);

        const exams = getStoredData(EXAM_KEY);
        const teacherEmail = getActiveTeacherEmail();

        exams.forEach(function (exam, index) {

            if (exam.teacherEmail !== teacherEmail) return;

            const option = document.createElement("option");

            option.value = index;

            option.textContent =
                exam.name + " - " +
                exam.course + " (" + exam.date + ")";
            resultExam.appendChild(option);
        });
    }
    function displayResultStudents() {
        resultTableBody.innerHTML = "";
        resultMessage.textContent = "";

        if (resultExam.value === "") return;

        const examIndex = Number(resultExam.value);
        const exams = getStoredData(EXAM_KEY);
        const exam = exams[examIndex];

        const teacherEmail = getActiveTeacherEmail();

        if (!exam || exam.teacherEmail !== teacherEmail) return;

        const saved = getStoredData(RESULT_KEY);
        const students = getStoredData("lmpStudents");

        const selectedStudents = students.filter(function (student) {
            const course = (student.course || "").toLowerCase();
            const examCourse = (exam.course || "").toLowerCase();
            return (

                course === examCourse ||
                (courseNames[examCourse] &&
                    course.includes(courseNames[examCourse]))

            );
        });
        selectedStudents.forEach(function (student, index) {
            const old = saved.find(function (item) {

                return item.teacherEmail === teacherEmail &&
                    item.examIndex === examIndex &&
                    item.studentEmail === student.email;
            });
            const row = document.createElement("tr");

            const sl = document.createElement("td");
            sl.textContent = index + 1;

            const name = document.createElement("td");
            name.textContent = student.name;

            const email = document.createElement("td");
            email.textContent = student.email;

            const marksCell = document.createElement("td");
            const marksInput = document.createElement("input");

            marksInput.type = "number";
            marksInput.min = "0";
            marksInput.max = exam.marks;
            marksInput.required = true;
            marksInput.value =
                old ? old.obtainedMarks : "";

            marksCell.appendChild(marksInput);

            row.append(sl, name, email, marksCell);
            row.dataset.studentEmail = student.email;
            resultTableBody.appendChild(row);

        });
        if (selectedStudents.length === 0) {

            resultMessage.textContent =
                "No students found for this course.";
        }
    }
    resultExam.addEventListener(
        "change",
        displayResultStudents
    );
    resultForm.addEventListener("submit", function (event) {

        event.preventDefault();
        if (!resultForm.checkValidity()) {

            resultForm.reportValidity();
            return;
        }
        const rows =
            resultTableBody.querySelectorAll("tr");
        if (rows.length === 0) {

            resultMessage.textContent =
                "No students to save.";
            return;
        }
        const examIndex = Number(resultExam.value);
        const exams = getStoredData(EXAM_KEY);
        const exam = exams[examIndex];
        const teacherEmail = getActiveTeacherEmail();

        if (!exam || exam.teacherEmail !== teacherEmail) return;
        let saved = getStoredData(RESULT_KEY);
        // Validate marks before saving

        for (const row of rows) {
            const marks = Number(
                row.querySelector("input").value
            );
            if (
                !Number.isFinite(marks) ||
                marks < 0 ||
                marks > Number(exam.marks)
            ) {
                resultMessage.textContent =
                    "Please enter valid marks within the total marks.";

                return;
            }
        }
        rows.forEach(function (row) {

            const marks = Number(
                row.querySelector("input").value
            );
            saved = saved.filter(function (item) {
                return !(

                    item.teacherEmail === teacherEmail &&
                    item.examIndex === examIndex &&
                    item.studentEmail === row.dataset.studentEmail

                );
            });
            saved.push({

                teacherEmail: teacherEmail,
                examIndex: examIndex,
                studentEmail: row.dataset.studentEmail,
                obtainedMarks: marks,
                totalMarks: exam.marks

            });

        });
        saveStoredData(RESULT_KEY, saved);
        resultMessage.textContent =
            "Results saved successfully!";
        displayResultSummary();

    });
    populateResultExams();

}
// CLASS-JS-28A: RESULT SUMMARY

function displayResultSummary() {
    const summaryBody =
        document.getElementById("resultSummaryBody");

    if (!summaryBody) return;

    const summaryMessage =
        document.getElementById("resultSummaryMessage");
    const teacherEmail = getActiveTeacherEmail();
    const exams = getStoredData(EXAM_KEY);
    const results = getStoredData(RESULT_KEY);
    const students = getStoredData("lmpStudents");
    summaryBody.innerHTML = "";

    summaryMessage.textContent = "";
    const myResults = results.filter(function (item) {

        return item.teacherEmail === teacherEmail &&

            exams[item.examIndex] &&
            exams[item.examIndex].teacherEmail === teacherEmail;

    });
    const emails = [...new Set(

        myResults.map(item => item.studentEmail)

    )];
    emails.forEach(function (email, index) {

        const student = students.find(function (item) {

            return item.email === email;

        });
        const studentResults = myResults.filter(function (item) {

            return item.studentEmail === email;

        });
        let total = 0;

        let obtained = 0;
        studentResults.forEach(function (item) {

            total += Number(item.totalMarks);

            obtained += Number(item.obtainedMarks);

        });
        const percentage =
            total > 0 ? obtained / total * 100 : 0;

        let grade = "F";

        if (percentage >= 80) grade = "A+";
        else if (percentage >= 70) grade = "A";
        else if (percentage >= 60) grade = "A-";
        else if (percentage >= 50) grade = "B";
        else if (percentage >= 40) grade = "C";
        else if (percentage >= 33) grade = "D";
        const row = document.createElement("tr");
        const values = [

            index + 1,

            student ? student.name : email,

            email,
            studentResults.length,
            total,
            obtained,
            percentage.toFixed(2) + "%",
            grade
        ];
        values.forEach(function (value) {

            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);

        });
        summaryBody.appendChild(row);

    });
    if (emails.length === 0) {
        summaryMessage.textContent =
            "No saved results yet.";
    }
}
if (document.getElementById("resultSummaryBody")) {

    displayResultSummary();
}
// TEACHER ASSIGNMENTS

const assignmentForm =
    document.getElementById("assignmentForm");

if (assignmentForm) {

    const assignmentTableBody =
        document.getElementById("assignmentTableBody");

    const assignmentMessage =
        document.getElementById("assignmentMessage");

    function displayAssignments() {

        assignmentTableBody.innerHTML = "";
        assignmentMessage.textContent = "";
        const assignments = getStoredData(ASSIGNMENT_KEY);
        const teacherEmail = getActiveTeacherEmail();
        const myAssignments = assignments.filter(function (item) {

            return item.teacherEmail === teacherEmail;

        });
        myAssignments.forEach(function (item) {

            const row = document.createElement("tr");
            const sl = document.createElement("td");

            sl.textContent = row.parentElement
                ? row.parentElement.children.length + 1
                : assignmentTableBody.children.length + 1;
            row.appendChild(sl);

            const values = [
                item.title,
                item.course,
                item.deadline
            ];
            values.forEach(function (value) {

                const cell = document.createElement("td");

                cell.textContent = value;

                row.appendChild(cell);

            });


            const action = document.createElement("td");

            const button = document.createElement("button");

            button.type = "button";

            button.textContent = "Delete";


            button.addEventListener("click", function () {

                if (!confirm("Delete this assignment?")) return;


                let latestAssignments =
                    getStoredData(ASSIGNMENT_KEY);


                latestAssignments = latestAssignments.filter(
                    assignment => assignment !== item
                );


                saveStoredData(
                    ASSIGNMENT_KEY,
                    latestAssignments
                );
                displayAssignments();

                assignmentMessage.textContent =
                    "Assignment deleted.";

            });
            action.appendChild(button);
            row.appendChild(action);
            assignmentTableBody.appendChild(row);

        });
        if (myAssignments.length === 0) {

            assignmentMessage.textContent =
                "No assignments saved yet.";
        }
    }
    assignmentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!assignmentForm.checkValidity()) {
            assignmentForm.reportValidity();
            return;
        }
        const teacherEmail = getActiveTeacherEmail();
        if (!teacherEmail) {

            assignmentMessage.textContent =
                "Teacher account not found.";

            return;
        }
        const assignments = getStoredData(ASSIGNMENT_KEY);
        assignments.push({

            teacherEmail: teacherEmail,

            title: document.getElementById("assignmentTitle")
                .value.trim(),

            course: document.getElementById("assignmentCourse")
                .value,

            description: document.getElementById("assignmentDescription")
                .value.trim(),

            deadline: document.getElementById("assignmentDeadline")
                .value

        });
        saveStoredData(ASSIGNMENT_KEY, assignments);
        assignmentForm.reset();
        displayAssignments();

        assignmentMessage.textContent =
            "Assignment saved successfully!";

    });
    displayAssignments();
}
// INITIALIZE DASHBOARD
displayTeacherProfile();

// UPDATE PROFILE IF ADMIN CHANGES TEACHER DATA

window.addEventListener("storage", function (event) {

    if (event.key === TEACHER_KEY) {

        const updatedTeacher = getActiveTeacher();
        if (!updatedTeacher || updatedTeacher.status !== "Active") {
            localStorage.removeItem(SESSION_KEY);

            window.location.href = "login.html";
            return;
        }

        displayTeacherProfile();
    }
});
