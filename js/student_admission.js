

const STUDENT_STORAGE_KEY = "coachEaseStudents";
const COURSE_STORAGE_KEY = "coachEaseCourses";
const BATCH_STORAGE_KEY = "coachEaseBatches";




let studentData = [];

try {

    studentData = JSON.parse(
        localStorage.getItem(STUDENT_STORAGE_KEY)
    ) || [];

    if (!Array.isArray(studentData)) {
        studentData = [];
    }

}
catch (error) {

    studentData = [];

}


// Save Student Data

function saveStudents() {

    localStorage.setItem(
        STUDENT_STORAGE_KEY,
        JSON.stringify(studentData)
    );

}




let courseData = [];
let batchData = [];


// Get Latest Course and Batch Data

function getCurrentData() {

    try {

        courseData = JSON.parse(
            localStorage.getItem(COURSE_STORAGE_KEY)
        ) || [];

        if (!Array.isArray(courseData)) {
            courseData = [];
        }

    }
    catch (error) {

        courseData = [];

    }


    try {

        batchData = JSON.parse(
            localStorage.getItem(BATCH_STORAGE_KEY)
        ) || [];

        if (!Array.isArray(batchData)) {
            batchData = [];
        }

    }
    catch (error) {

        batchData = [];

    }

}



function getCourseName(courseID) {

    const course = courseData.find(function (item) {

        return String(item.id) === String(courseID);

    });

    return course ? course.name : courseID;

}



function getBatchName(batch) {

    return batch.batch_name ||
        batch.name ||
        batch.batchName ||
        batch.id;

}



const studentPopup = document.getElementById("student_popup");

const openPopup = document.getElementById("open_student_popup");

const closePopup = document.getElementById("close_student_popup");

const studentForm = document.getElementById("student_form");

const studentTable = document.getElementById("student_table_body");

const levelFilter = document.getElementById("student_level");

const courseFilter = document.getElementById("student_course");

const batchFilter = document.getElementById("student_batch");

const searchInput = document.getElementById("student_search");

const courseDropdown = document.getElementById("course_id");

const batchDropdown = document.getElementById("batch_id");

const submitButton = document.getElementById("student_submit");

let editIndex = -1;




function populateCourseFilter() {

    const selectedCourse = courseFilter.value;

    courseFilter.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "Select Course";

    courseFilter.appendChild(defaultOption);


    courseData.forEach(function (course) {

        const option = document.createElement("option");

        option.value = course.id;

        option.textContent = course.name;

        courseFilter.appendChild(option);

    });


    if (courseData.some(course =>
        String(course.id) === String(selectedCourse)
    )) {

        courseFilter.value = selectedCourse;

    }

}




function populatePopupCourseDropdown() {

    const selectedCourse = courseDropdown.value;

    courseDropdown.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "Select Course";

    courseDropdown.appendChild(defaultOption);


    courseData.forEach(function (course) {

        const option = document.createElement("option");

        option.value = course.id;

        option.textContent = course.name;

        courseDropdown.appendChild(option);

    });


    if (courseData.some(course =>
        String(course.id) === String(selectedCourse)
    )) {

        courseDropdown.value = selectedCourse;

    }

}



function populateBatchFilter() {

    const selectedBatch = batchFilter.value;

    const selectedCourse = courseFilter.value;

    batchFilter.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "Select Batch";

    batchFilter.appendChild(defaultOption);


    const filteredBatches = batchData.filter(function (batch) {

        return selectedCourse === "" ||
            String(batch.course_id) === String(selectedCourse);

    });


    filteredBatches.forEach(function (batch) {

        const option = document.createElement("option");

        option.value = batch.id;

        option.textContent = batch.id;

        batchFilter.appendChild(option);

    });


    if (filteredBatches.some(batch =>
        String(batch.id) === String(selectedBatch)
    )) {

        batchFilter.value = selectedBatch;

    }

}




function populatePopupBatchDropdown() {

    getCurrentData();

    const selectedBatch = batchDropdown.value;

    batchDropdown.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "Select Batch";

    batchDropdown.appendChild(defaultOption);


    // Show ALL Batches From Batch Management

    batchData.forEach(function (batch) {

        const option = document.createElement("option");

        option.value = batch.id;

        option.textContent =
            batch.id + " - " + getBatchName(batch);

        batchDropdown.appendChild(option);

    });


    // Keep Previously Selected Batch

    if (batchData.some(batch =>
        String(batch.id) === String(selectedBatch)
    )) {

        batchDropdown.value = selectedBatch;

    }

}



function refreshDropdowns() {

    getCurrentData();

    populateCourseFilter();

    populatePopupCourseDropdown();

    populateBatchFilter();

    populatePopupBatchDropdown();

}




courseDropdown.onchange = function () {

    // All Batches Will Remain Available

    populatePopupBatchDropdown();

};




courseFilter.onchange = function () {

    populateBatchFilter();

    showStudents();

};




openPopup.onclick = function () {

    editIndex = -1;

    studentForm.reset();

    refreshDropdowns();

    populatePopupBatchDropdown();

    submitButton.value = "Add Student";

    studentPopup.style.display = "block";

};




function closeStudentPopup() {

    studentPopup.style.display = "none";

    studentForm.reset();

    editIndex = -1;

    submitButton.value = "Add Student";

}


closePopup.onclick = function () {

    closeStudentPopup();

};


// Close Popup By Clicking Outside

window.addEventListener("click", function (event) {

    if (event.target === studentPopup) {

        closeStudentPopup();

    }

});




studentForm.onsubmit = function (event) {

    event.preventDefault();

    getCurrentData();


    // Get Form Values

    const firstName = document.getElementById("first_name").value.trim();

    const lastName = document.getElementById("last_name").value.trim();

    const email = document.getElementById("email").value.trim();

    const courseID = courseDropdown.value;

    const batchID = batchDropdown.value;

    const admissionDate = document.getElementById("admission_date").value;

    const contact = document.getElementById("contact").value.trim();

    const address = document.getElementById("address").value.trim();


    // First Name Validation

    if (firstName.length < 3) {

        alert("First Name must contain at least 3 characters!");

        document.getElementById("first_name").focus();

        return;

    }


    // Last Name Validation

    if (lastName.length < 3) {

        alert("Last Name must contain at least 3 characters!");

        document.getElementById("last_name").focus();

        return;

    }


    // Email Validation

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid Email Address containing @ and .");

        document.getElementById("email").focus();

        return;

    }


    // Mobile Number Validation

    const mobilePattern = /^01[0-9]{9}$/;

    if (!mobilePattern.test(contact)) {

        alert("Mobile Number must start with 01 and contain exactly 11 digits!");

        document.getElementById("contact").focus();

        return;

    }


    // Duplicate Email Validation

    const duplicateEmail = studentData.some(function (student, index) {

        return String(student.email || "").toLowerCase() === email.toLowerCase()
            && index !== editIndex;

    });

    if (duplicateEmail) {

        alert("This Email Address Already Exists!");

        document.getElementById("email").focus();

        return;

    }


    // Duplicate Phone Validation

    const duplicatePhone = studentData.some(function (student, index) {

        return student.contact === contact
            && index !== editIndex;

    });

    if (duplicatePhone) {

        alert("This Phone Number Already Exists!");

        document.getElementById("contact").focus();

        return;

    }


    // Address Validation

    const addressLetters = address.match(/[a-zA-Z]/g) || [];

    if (addressLetters.length < 5) {

        alert("Address must contain at least 5 English letters!");

        document.getElementById("address").focus();

        return;

    }


    // Find Selected Course

    const selectedCourse = courseData.find(function (course) {

        return String(course.id) === String(courseID);

    });

    if (!selectedCourse) {

        alert("Please select a valid Course!");

        courseDropdown.focus();

        return;

    }


    // Find Selected Batch

    const selectedBatch = batchData.find(function (batch) {

        return String(batch.id) === String(batchID);

    });

    if (!selectedBatch) {

        alert("Please select a valid Batch!");

        batchDropdown.focus();

        return;

    }


    // Validate Course And Batch Connection

    if (
        String(selectedBatch.course_id) !== String(selectedCourse.id)
    ) {

        alert("Selected Batch does not belong to the selected Course!");

        batchDropdown.focus();

        return;

    }


    // Generate Student ID

    let studentID;

    if (editIndex === -1) {

        let highestID = 0;

        for (let i = 0; i < studentData.length; i++) {

            const number = parseInt(
                String(studentData[i].id || "").replace("STD-", "")
            );

            if (!isNaN(number) && number > highestID) {

                highestID = number;

            }

        }

        studentID = "STD-" + String(highestID + 1).padStart(3, "0");

    }

    else {

        studentID = studentData[editIndex].id;

    }


    // Create Student Object

    const student = {

        id: studentID,

        first_name: firstName,

        last_name: lastName,

        email: email,

        level: selectedBatch.level,

        course: selectedCourse.name,

        course_id: selectedCourse.id,

        batch_id: batchID,

        admission_date: admissionDate,

        contact: contact,

        address: address,

        status: editIndex === -1
            ? "Active"
            : studentData[editIndex].status

    };


    // Add New Student

    if (editIndex === -1) {

        studentData.push(student);

        alert("Student Added Successfully!");

    }


    // Update Existing Student

    else {

        studentData[editIndex] = student;

        alert("Student Updated Successfully!");

        editIndex = -1;

    }


    // Save Data

    saveStudents();


    // Refresh Table

    showStudents();


    // Reset Form

    studentForm.reset();

    submitButton.value = "Add Student";


    // Close Popup

    studentPopup.style.display = "none";

};




function showStudents() {

    getCurrentData();

    studentTable.innerHTML = "";


    // Get Filter Values

    const selectedLevel = levelFilter.value;

    const selectedCourse = courseFilter.value;

    const selectedBatch = batchFilter.value;


    // Get Search Value

    const searchTerm = searchInput.value.trim().toLowerCase();


    // Loop Through Student Array

    for (let i = 0; i < studentData.length; i++) {

        const student = studentData[i];


        // Level Filter

        if (selectedLevel !== "" && student.level !== selectedLevel) {

            continue;

        }


        // Course Filter

        if (
            selectedCourse !== "" &&
            String(student.course_id) !== String(selectedCourse)
        ) {

            continue;

        }


        // Batch Filter

        if (
            selectedBatch !== "" &&
            String(student.batch_id) !== String(selectedBatch)
        ) {

            continue;

        }


        // Search Filter

        const searchableText = (

            student.id + " " +
            student.first_name + " " +
            student.last_name + " " +
            student.email + " " +
            student.contact + " " +
            student.level + " " +
            student.course + " " +
            student.batch_id

        ).toLowerCase();


        if (!searchableText.includes(searchTerm)) {

            continue;

        }


        // Create Table Row

        const row = document.createElement("tr");


        // Create Cells

        const values = [

            student.id,
            student.first_name,
            student.last_name,
            student.email,
            student.level,
            student.course,
            student.batch_id,
            student.admission_date,
            student.contact,
            student.address,
            student.status

        ];


        values.forEach(function (value) {

            const cell = document.createElement("td");

            cell.textContent = value || "";

            row.appendChild(cell);

        });


        // Action Cell

        const actionCell = document.createElement("td");


        // Edit Button

        const editButton = document.createElement("input");

        editButton.type = "button";

        editButton.value = "Edit";

        editButton.onclick = function () {

            editStudent(i);

        };


        // Delete Button

        const deleteButton = document.createElement("input");

        deleteButton.type = "button";

        deleteButton.value = "Delete";

        deleteButton.onclick = function () {

            deleteStudent(i);

        };


        actionCell.appendChild(editButton);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        studentTable.appendChild(row);

    }


    // No Student Found Message

    if (studentTable.children.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 12;

        cell.textContent = "No Student Found";

        cell.style.textAlign = "center";

        cell.style.padding = "20px";

        row.appendChild(cell);

        studentTable.appendChild(row);

    }

}




function editStudent(index) {

    getCurrentData();

    editIndex = index;

    const student = studentData[index];


    // Refresh Course Dropdown

    populatePopupCourseDropdown();


    // Put Existing Data Into Form

    document.getElementById("first_name").value = student.first_name;

    document.getElementById("last_name").value = student.last_name;

    document.getElementById("email").value = student.email;


    // Select Existing Course

    courseDropdown.value = student.course_id || "";


    // Load All Batches

    populatePopupBatchDropdown();


    // Select Existing Batch

    batchDropdown.value = student.batch_id;


    document.getElementById("admission_date").value = student.admission_date;

    document.getElementById("contact").value = student.contact;

    document.getElementById("address").value = student.address;


    // Change Submit Button Text

    submitButton.value = "Update Student";


    // Open Popup

    studentPopup.style.display = "block";

}




function deleteStudent(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );


    if (confirmDelete === true) {

        studentData.splice(index, 1);

        // Save Updated Data

        saveStudents();

        // Refresh Table

        showStudents();

        alert("Student Deleted Successfully!");

    }

}



levelFilter.onchange = function () {

    showStudents();

};


batchFilter.onchange = function () {

    showStudents();

};




searchInput.oninput = function () {

    showStudents();

};



window.addEventListener("storage", function (event) {

    if (
        event.key === COURSE_STORAGE_KEY ||
        event.key === BATCH_STORAGE_KEY
    ) {

        refreshDropdowns();

        showStudents();

    }

});




refreshDropdowns();

showStudents();
