
const STORAGE_KEY = "lmpTeachers";
const OLD_STORAGE_KEY = "coachEaseTeachers";
const COURSE_STORAGE_KEY = "coachEaseCourses";


function normalizeTeacher(teacher) {

    const fullName = teacher.name ||
        [teacher.first_name, teacher.last_name]
            .filter(Boolean)
            .join(" ");

    const nameParts = fullName.trim().split(/\s+/);

    return {

        id: teacher.id || "TCH-" + Date.now(),

        first_name:
            teacher.first_name || nameParts[0] || "",

        last_name:
            teacher.last_name ||
            nameParts.slice(1).join(" ") || "",

        name: fullName,

        email: (teacher.email || "").toLowerCase(),

        level: teacher.level || "",

        course_id: teacher.course_id || "",

        qualification:
            teacher.qualification ||
            teacher.expertise || "",

        phone:
            teacher.phone ||
            teacher.mobile || "",

        mobile:
            teacher.mobile ||
            teacher.phone || "",

        expertise:
            teacher.expertise ||
            teacher.qualification || "",

        username: teacher.username || "",

        password: teacher.password || "",

        status: teacher.status || "Active"

    };

}



function getTeachers() {

    let savedTeachers = localStorage.getItem(STORAGE_KEY);

    if (savedTeachers === null) {

        const oldTeachers = localStorage.getItem(OLD_STORAGE_KEY);

        let initialTeachers;

        if (oldTeachers !== null) {

            try {

                initialTeachers = JSON.parse(oldTeachers);

                if (!Array.isArray(initialTeachers)) {
                    initialTeachers = defaultTeachers;
                }

            } catch (error) {

                initialTeachers = defaultTeachers;

            }

        } else {

            initialTeachers = defaultTeachers;

        }

        initialTeachers = initialTeachers.map(normalizeTeacher);

        saveTeachers(initialTeachers);

        return initialTeachers;

    }

    try {

        const teachers = JSON.parse(savedTeachers);

        if (!Array.isArray(teachers)) return [];

        return teachers.map(normalizeTeacher);

    } catch (error) {

        console.error("Teacher data error:", error);

        return [];

    }

}

function saveTeachers(teachers) {

    const normalized = teachers.map(normalizeTeacher);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(normalized)
    );

}



function getCourses() {

    try {

        const savedCourses =
            localStorage.getItem(COURSE_STORAGE_KEY);

        if (!savedCourses) return [];

        const courses = JSON.parse(savedCourses);

        return Array.isArray(courses) ? courses : [];

    } catch (error) {

        return [];

    }

}

function getCourseName(courseID) {

    const course = getCourses().find(
        item => item.id === courseID
    );

    return course ? course.name : courseID;

}

function populateCourseDropdowns() {

    const courseList = getCourses();

    const dropdowns = [

        document.getElementById("course_id"),

        document.getElementById("teacher_course")

    ];

    dropdowns.forEach(dropdown => {

        if (!dropdown) return;

        const selectedValue = dropdown.value;

        dropdown.innerHTML = "";

        const defaultOption = document.createElement("option");

        defaultOption.value = "";
        defaultOption.textContent = "Select Course";

        dropdown.appendChild(defaultOption);

        courseList.forEach(course => {

            const option = document.createElement("option");

            option.value = course.id;
            option.textContent = course.name;

            dropdown.appendChild(option);

        });

        if (courseList.some(course => course.id === selectedValue)) {
            dropdown.value = selectedValue;
        }

    });

}



function generateTeacherID(teachers) {

    let highestNumber = 100;

    teachers.forEach(teacher => {

        const number = parseInt(
            String(teacher.id || "").replace("TCH-", ""),
            10
        );

        if (!isNaN(number) && number > highestNumber) {
            highestNumber = number;
        }

    });

    return "TCH-" + (highestNumber + 1);

}



const teacherPopup = document.getElementById("teacher_popup");

const openPopupButton =
    document.getElementById("open_teacher_popup");

const closePopupButton =
    document.getElementById("close_teacher_popup");

const teacherForm =
    document.getElementById("teacher_form");

const teacherTableBody =
    document.getElementById("teacher_table_body");

const searchInput =
    document.getElementById("teacher_search");

const levelFilter =
    document.getElementById("teacher_level");

const courseFilter =
    document.getElementById("teacher_course");

const passwordInput =
    document.getElementById("password");

const usernameInput =
    document.getElementById("username");

const submitButton = teacherForm
    ? teacherForm.querySelector(
        'input[type="submit"], button[type="submit"]'
    )
    : null;

let editingTeacherID = null;



if (openPopupButton) {

    openPopupButton.addEventListener("click", function () {

        editingTeacherID = null;

        if (teacherForm) teacherForm.reset();

        populateCourseDropdowns();

        if (passwordInput) {
            passwordInput.required = true;
            passwordInput.placeholder = "Enter password";
        }

        if (submitButton) {
            if (submitButton.tagName === "INPUT") {
                submitButton.value = "Add Teacher";
            } else {
                submitButton.textContent = "Add Teacher";
            }
        }

        if (teacherPopup) {
            teacherPopup.style.display = "block";
        }

    });

}

// ==================================================
// CLOSE POPUP
// ==================================================

function closeTeacherPopup() {

    if (teacherPopup) {
        teacherPopup.style.display = "none";
    }

    if (teacherForm) teacherForm.reset();

    editingTeacherID = null;

    if (passwordInput) {
        passwordInput.required = true;
        passwordInput.placeholder = "Enter password";
    }

    if (submitButton) {
        if (submitButton.tagName === "INPUT") {
            submitButton.value = "Add Teacher";
        } else {
            submitButton.textContent = "Add Teacher";
        }
    }

}

if (closePopupButton) {

    closePopupButton.addEventListener(
        "click",
        closeTeacherPopup
    );

}

window.addEventListener("click", function (event) {

    if (event.target === teacherPopup) {
        closeTeacherPopup();
    }

});



function displayTeachers() {

    if (!teacherTableBody) return;

    const teachers = getTeachers();

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const selectedLevel = levelFilter
        ? levelFilter.value
        : "";

    const selectedCourse = courseFilter
        ? courseFilter.value
        : "";

    teacherTableBody.innerHTML = "";

    const filteredTeachers = teachers.filter(teacher => {

        const fullName =
            teacher.first_name + " " + teacher.last_name;

        const matchesSearch = [

            teacher.id,
            teacher.first_name,
            teacher.last_name,
            fullName,
            teacher.email,
            teacher.phone,
            teacher.username,
            teacher.qualification,
            getCourseName(teacher.course_id)

        ].some(value =>
            String(value || "")
                .toLowerCase()
                .includes(searchText)
        );

        const matchesLevel =
            selectedLevel === "" ||
            teacher.level === selectedLevel;

        const matchesCourse =
            selectedCourse === "" ||
            teacher.course_id === selectedCourse;

        return matchesSearch && matchesLevel && matchesCourse;

    });

    if (filteredTeachers.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 9;
        cell.textContent = "No Teacher Found!";
        cell.style.textAlign = "center";

        row.appendChild(cell);
        teacherTableBody.appendChild(row);

        return;

    }

    filteredTeachers.forEach(teacher => {

        const row = document.createElement("tr");

        const values = [

            teacher.id,
            teacher.first_name,
            teacher.last_name,
            teacher.email,
            teacher.level,
            getCourseName(teacher.course_id),
            teacher.qualification,
            teacher.phone

        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value || "";

            row.appendChild(cell);

        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("input");

        editButton.type = "button";
        editButton.value = "Edit";

        const deleteButton = document.createElement("input");

        deleteButton.type = "button";
        deleteButton.value = "Delete";

        editButton.addEventListener("click", function () {
            editTeacher(teacher.id);
        });

        deleteButton.addEventListener("click", function () {
            deleteTeacher(teacher.id);
        });

        actionCell.append(editButton, deleteButton);

        row.appendChild(actionCell);

        teacherTableBody.appendChild(row);

    });

}


if (teacherForm) {

    teacherForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const firstName =
            document.getElementById("first_name").value.trim();

        const lastName =
            document.getElementById("last_name").value.trim();

        const email =
            document.getElementById("email").value.trim().toLowerCase();

        const phone =
            document.getElementById("phone").value.trim();

        const qualification =
            document.getElementById("qualification").value.trim();

        const level =
            document.getElementById("level").value;

        const courseID =
            document.getElementById("course_id").value;

        const username =
            usernameInput.value.trim().toLowerCase();

        const password = passwordInput.value;

        // Name Validation

        if (firstName.length < 3 || lastName.length < 3) {
            alert("First Name and Last Name must contain at least 3 characters.");
            return;
        }

        // Email Validation

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Phone Validation

        const phonePattern = /^01[0-9]{9}$/;

        if (!phonePattern.test(phone)) {
            alert("Phone number must be 11 digits and start with 01.");
            return;
        }

        // Qualification

        if (qualification.length < 3) {
            alert("Please enter a valid qualification.");
            return;
        }

        // Level

        if (!["L-1", "L-2", "L-3"].includes(level)) {
            alert("Please select a valid level.");
            return;
        }

        // Course

        const validCourse = getCourses().some(
            course => course.id === courseID
        );

        if (!validCourse) {
            alert("Please select a valid course.");
            return;
        }

        // Username

        const usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;

        if (!usernamePattern.test(username)) {
            alert("Username must be 4-20 characters.");
            return;
        }

        // Password

        if (editingTeacherID === null && password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (editingTeacherID !== null &&
            password !== "" &&
            password.length < 6) {

            alert("New password must contain at least 6 characters.");
            return;
        }

        const teachers = getTeachers();

        // Duplicate Email

        const duplicateEmail = teachers.some(teacher =>
            teacher.email.toLowerCase() === email &&
            teacher.id !== editingTeacherID
        );

        if (duplicateEmail) {
            alert("This email is already registered.");
            return;
        }

        // Duplicate Phone

        const duplicatePhone = teachers.some(teacher =>
            teacher.phone === phone &&
            teacher.id !== editingTeacherID
        );

        if (duplicatePhone) {
            alert("This phone number is already registered.");
            return;
        }

        // Duplicate Username in Teachers

        const duplicateUsername = teachers.some(teacher =>
            teacher.username &&
            teacher.username.toLowerCase() === username &&
            teacher.id !== editingTeacherID
        );

        // Duplicate Username in other roles

        const registeredUsers = JSON.parse(
            localStorage.getItem("coachEaseUsers") || "[]"
        );

        const duplicateRegisteredUser = registeredUsers.some(user =>
            user.username &&
            user.username.toLowerCase() === username
        );

        if (duplicateUsername || duplicateRegisteredUser) {
            alert("This username is already taken.");
            return;
        }



        if (editingTeacherID !== null) {

            const index = teachers.findIndex(
                teacher => teacher.id === editingTeacherID
            );

            if (index === -1) return;

            const teacher = teachers[index];

            teacher.first_name = firstName;
            teacher.last_name = lastName;
            teacher.name = firstName + " " + lastName;

            teacher.email = email;
            teacher.phone = phone;
            teacher.mobile = phone;

            teacher.qualification = qualification;
            teacher.expertise = qualification;

            teacher.level = level;
            teacher.course_id = courseID;

            teacher.username = username;

            if (password !== "") {
                teacher.password = password;
            }

            saveTeachers(teachers);

            displayTeachers();

            closeTeacherPopup();

            alert("Teacher updated successfully!");

        }



        else {

            const newTeacher = {

                id: generateTeacherID(teachers),

                first_name: firstName,

                last_name: lastName,

                name: firstName + " " + lastName,

                email: email,

                phone: phone,

                mobile: phone,

                qualification: qualification,

                expertise: qualification,

                level: level,

                course_id: courseID,

                username: username,

                password: password,

                status: "Active"

            };

            teachers.push(newTeacher);

            saveTeachers(teachers);

            displayTeachers();

            closeTeacherPopup();

            alert("Teacher added successfully! Login account created.");

        }

    });

}



function editTeacher(teacherID) {

    const teachers = getTeachers();

    const teacher = teachers.find(
        item => item.id === teacherID
    );

    if (!teacher) return;

    populateCourseDropdowns();

    editingTeacherID = teacherID;

    document.getElementById("first_name").value =
        teacher.first_name;

    document.getElementById("last_name").value =
        teacher.last_name;

    document.getElementById("email").value =
        teacher.email;

    document.getElementById("phone").value =
        teacher.phone;

    document.getElementById("qualification").value =
        teacher.qualification;

    document.getElementById("level").value =
        teacher.level;

    document.getElementById("course_id").value =
        teacher.course_id;

    usernameInput.value = teacher.username || "";

    passwordInput.value = "";

    passwordInput.required = false;

    passwordInput.placeholder =
        "Leave blank to keep current password";

    if (submitButton.tagName === "INPUT") {
        submitButton.value = "Update Teacher";
    } else {
        submitButton.textContent = "Update Teacher";
    }

    teacherPopup.style.display = "block";

}



function deleteTeacher(teacherID) {

    if (!confirm("Are you sure you want to delete this teacher?")) {
        return;
    }

    let teachers = getTeachers();

    teachers = teachers.filter(
        teacher => teacher.id !== teacherID
    );

    saveTeachers(teachers);

    displayTeachers();

    alert("Teacher deleted successfully!");

}



if (searchInput) {
    searchInput.addEventListener("input", displayTeachers);
}

if (levelFilter) {
    levelFilter.addEventListener("change", displayTeachers);
}

if (courseFilter) {
    courseFilter.addEventListener("change", displayTeachers);
}



populateCourseDropdowns();

displayTeachers();


window.addEventListener("storage", function (event) {

    if (event.key === COURSE_STORAGE_KEY) {

        populateCourseDropdowns();

        displayTeachers();

    }

});
