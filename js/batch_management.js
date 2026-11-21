const STORAGE_KEY = "coachEaseBatches";
const COURSE_STORAGE_KEY = "coachEaseCourses";
const TEACHER_STORAGE_KEY = "coachEaseTeachers";




let courseData = [];


// Get Courses From LocalStorage

function getCourses() {

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

    return courseData;

}


// Get Course Name By ID

function getCourseName(courseID) {

    const course = courseData.find(function (item) {

        return item.id === courseID;

    });

    return course ? course.name : courseID;

}


// Populate Course Dropdown

function populateCourseDropdown() {

    const selectedCourse = courseInput.value;

    getCourses();

    courseInput.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "Select Batch Name";

    defaultOption.disabled = true;

    defaultOption.selected = true;

    courseInput.appendChild(defaultOption);


    courseData.forEach(function (course) {

        const option = document.createElement("option");

        option.value = course.id;

        option.textContent = course.name + " Batch";

        courseInput.appendChild(option);

    });


    if (courseData.some(course => course.id === selectedCourse)) {

        courseInput.value = selectedCourse;

    }

}





// Get Teachers From LocalStorage

function getTeachers() {

    try {

        const savedTeachers = localStorage.getItem(
            TEACHER_STORAGE_KEY
        );

        const teachers = JSON.parse(savedTeachers) || [];

        return Array.isArray(teachers) ? teachers : [];

    }
    catch (error) {

        return [];

    }

}


// Get Teacher Name By ID

function getTeacherName(teacherID) {

    const teachers = getTeachers();

    const teacher = teachers.find(function (item) {

        return item.id === teacherID;

    });

    if (teacher) {

        return teacher.first_name + " " + teacher.last_name;

    }

    return teacherID || "Not Assigned";

}


// Get Teacher ID From Old Teacher Name

function findTeacherIDByName(teacherName) {

    const teachers = getTeachers();

    const teacher = teachers.find(function (item) {

        const fullName =
            item.first_name + " " + item.last_name;

        return fullName.toLowerCase() ===
            String(teacherName || "").toLowerCase();

    });

    return teacher ? teacher.id : "";

}


// Populate Teacher Dropdown

function populateTeacherDropdown() {

    const selectedTeacher = teacherInput.value;

    const teachers = getTeachers();

    teacherInput.innerHTML = "";


    // Default Option

    const defaultOption = document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent = "Select Teacher";

    defaultOption.disabled = true;

    defaultOption.selected = true;

    teacherInput.appendChild(defaultOption);


    // Add Dynamic Teachers

    teachers.forEach(function (teacher) {

        const option = document.createElement("option");

        option.value = teacher.id;

        option.textContent =
            teacher.first_name + " " +
            teacher.last_name + " (" +
            teacher.id + ")";

        teacherInput.appendChild(option);

    });


    // Restore Previous Selection

    if (teachers.some(teacher => teacher.id === selectedTeacher)) {

        teacherInput.value = selectedTeacher;

    }

}





function getBatches() {

    const savedBatches = localStorage.getItem(STORAGE_KEY);

    if (savedBatches === null) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultBatches)
        );

        return [...defaultBatches];

    }

    try {

        const batches = JSON.parse(savedBatches);

        return Array.isArray(batches)
            ? batches
            : [...defaultBatches];

    }
    catch (error) {

        return [...defaultBatches];

    }

}




function saveBatches(batches) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(batches)
    );

}




function generateBatchID(batches) {

    let highestNumber = 100;

    batches.forEach(batch => {

        const number = parseInt(
            String(batch.id || "").replace("BAT-", "")
        );

        if (!isNaN(number) && number > highestNumber) {

            highestNumber = number;

        }

    });

    return "BAT-" + (highestNumber + 1);

}




const batchPopup = document.getElementById("batch_popup");

const openPopupButton = document.getElementById("open_batch_popup");

const closePopupButton = document.getElementById("close_batch_popup");

const batchForm = document.getElementById("batch_form");

const batchTableBody = document.getElementById("batch_table_body");

const searchInput = document.getElementById("batch_search");

const batchTypeFilter = document.getElementById("batch_type");

const batchTypeInput = document.getElementById("batch_type_form");

const courseInput = document.getElementById("course_id");

const levelInput = document.getElementById("level");

const dayInput = document.getElementById("batch_day");

const startTimeInput = document.getElementById("start_time");

const endTimeInput = document.getElementById("end_time");

const teacherInput = document.getElementById("teacher");

const submitButton = document.getElementById("batch_submit");

const popupTitle = document.getElementById("batch_popup_title");


// Currently Editing Batch ID

let editingBatchID = null;




function convertTimeToMinutes(time) {

    const parts = time.match(/(\d+):(\d+)\s(AM|PM)/);

    if (!parts) return null;

    let hours = parseInt(parts[1]);

    const minutes = parseInt(parts[2]);

    const period = parts[3];

    if (period === "AM" && hours === 12) {

        hours = 0;

    }

    if (period === "PM" && hours !== 12) {

        hours += 12;

    }

    return (hours * 60) + minutes;

}



function calculateDuration(startTime, endTime) {

    const start = convertTimeToMinutes(startTime);

    const end = convertTimeToMinutes(endTime);

    const difference = end - start;

    if (difference <= 0) {

        return "";

    }

    const hours = Math.floor(difference / 60);

    const minutes = difference % 60;

    let result = "";

    if (hours > 0) {

        result += hours + (hours === 1 ? " Hour" : " Hours");

    }

    if (minutes > 0) {

        if (result !== "") result += " ";

        result += minutes + " Minutes";

    }

    return result;

}




function generateBatchName(courseID) {

    return getCourseName(courseID) + " Batch";

}




openPopupButton.addEventListener("click", function () {

    editingBatchID = null;

    batchForm.reset();

    populateCourseDropdown();

    populateTeacherDropdown();

    submitButton.value = "Create Batch";

    popupTitle.textContent = "➕ Create Batch";

    batchPopup.style.display = "block";

});




function closeBatchPopup() {

    batchPopup.style.display = "none";

    batchForm.reset();

    editingBatchID = null;

    submitButton.value = "Create Batch";

    popupTitle.textContent = "➕ Create Batch";

}


closePopupButton.addEventListener("click", function () {

    closeBatchPopup();

});


window.addEventListener("click", function (event) {

    if (event.target === batchPopup) {

        closeBatchPopup();

    }

});




function displayBatches() {

    getCourses();

    const batches = getBatches();

    const searchText = searchInput.value.toLowerCase().trim();

    const selectedType = batchTypeFilter.value;

    batchTableBody.innerHTML = "";


    // Search and Filter

    const filteredBatches = batches.filter(batch => {

        const teacherName = batch.teacher_id
            ? getTeacherName(batch.teacher_id)
            : (batch.teacher || "");


        const matchesSearch =

            String(batch.id || "").toLowerCase().includes(searchText) ||

            String(batch.batch_name || "").toLowerCase().includes(searchText) ||

            String(batch.batch_type || "").toLowerCase().includes(searchText) ||

            String(batch.level || "").toLowerCase().includes(searchText) ||

            String(batch.batch_day || "").toLowerCase().includes(searchText) ||

            String(batch.start_time || "").toLowerCase().includes(searchText) ||

            String(batch.end_time || "").toLowerCase().includes(searchText) ||

            String(teacherName).toLowerCase().includes(searchText) ||

            String(batch.teacher_id || "").toLowerCase().includes(searchText) ||

            String(getCourseName(batch.course_id) || "").toLowerCase().includes(searchText);


        const matchesType =

            selectedType === "" ||

            batch.batch_type === selectedType;


        return matchesSearch && matchesType;

    });


    // No Batch Found

    if (filteredBatches.length === 0) {

        const row = document.createElement("tr");

        const cell = document.createElement("td");

        cell.colSpan = 10;

        cell.textContent = "No Batch Found!";

        cell.style.textAlign = "center";

        row.appendChild(cell);

        batchTableBody.appendChild(row);

        return;

    }


    // Create Table Rows

    filteredBatches.forEach(batch => {

        const row = document.createElement("tr");


        // Get Teacher Name

        const teacherName = batch.teacher_id
            ? getTeacherName(batch.teacher_id)
            : (batch.teacher || "");


        const values = [

            batch.id,

            batch.batch_name,

            batch.batch_type,

            batch.level,

            batch.batch_day,

            batch.start_time,

            batch.end_time,

            batch.duration,

            teacherName

        ];


        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value || "";

            row.appendChild(cell);

        });


        // Action Buttons

        const actionCell = document.createElement("td");


        const editButton = document.createElement("input");

        editButton.type = "button";

        editButton.value = "Edit";


        const deleteButton = document.createElement("input");

        deleteButton.type = "button";

        deleteButton.value = "Delete";


        // Edit Button

        editButton.addEventListener("click", function () {

            editBatch(batch.id);

        });


        // Delete Button

        deleteButton.addEventListener("click", function () {

            deleteBatch(batch.id);

        });


        actionCell.appendChild(editButton);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);


        batchTableBody.appendChild(row);

    });

}




batchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    getCourses();


    // Get Form Values

    const batchType = batchTypeInput.value;

    const courseID = courseInput.value;

    const level = levelInput.value;

    const batchDay = dayInput.value;

    const startTime = startTimeInput.value;

    const endTime = endTimeInput.value;

    const teacherID = teacherInput.value;


    // Batch Type Validation

    if (!["Fall", "Spring", "Summer"].includes(batchType)) {

        alert("Please select a valid batch type.");

        return;

    }


    // Course Validation

    if (!courseData.some(course => course.id === courseID)) {

        alert("Please select a valid course.");

        return;

    }


    // Level Validation

    if (!["L-1", "L-2", "L-3"].includes(level)) {

        alert("Please select a valid level.");

        return;

    }


    // Day Validation

    const validDays = [

        "Saturday",

        "Sunday",

        "Monday",

        "Tuesday",

        "Wednesday",

        "Thursday",

        "Friday"

    ];

    if (!validDays.includes(batchDay)) {

        alert("Please select a valid day.");

        return;

    }


    // Time Validation

    const startMinutes = convertTimeToMinutes(startTime);

    const endMinutes = convertTimeToMinutes(endTime);

    if (
        startMinutes === null ||
        endMinutes === null ||
        endMinutes <= startMinutes
    ) {

        alert("End Time must be later than Start Time.");

        return;

    }


    // Teacher Validation

    const teachers = getTeachers();

    const selectedTeacher = teachers.find(function (teacher) {

        return teacher.id === teacherID;

    });


    if (!selectedTeacher) {

        alert("Please select a valid teacher.");

        return;

    }


    // Calculate Duration

    const duration = calculateDuration(startTime, endTime);


    // Generate Batch Name

    const batchName = generateBatchName(courseID);


    const batches = getBatches();


    // Get Teacher Full Name

    const teacherName =
        selectedTeacher.first_name + " " +
        selectedTeacher.last_name;




    if (editingBatchID !== null) {

        const index = batches.findIndex(batch =>

            batch.id === editingBatchID

        );

        if (index === -1) return;


        batches[index].batch_type = batchType;

        batches[index].course_id = courseID;

        batches[index].batch_name = batchName;

        batches[index].level = level;

        batches[index].batch_day = batchDay;

        batches[index].start_time = startTime;

        batches[index].end_time = endTime;

        batches[index].duration = duration;

        batches[index].teacher_id = teacherID;

        batches[index].teacher = teacherName;


        saveBatches(batches);

        displayBatches();

        closeBatchPopup();

        alert("Batch updated successfully!");

    }





    else {

        const newBatch = {

            id: generateBatchID(batches),

            batch_name: batchName,

            batch_type: batchType,

            course_id: courseID,

            level: level,

            batch_day: batchDay,

            start_time: startTime,

            end_time: endTime,

            duration: duration,

            teacher_id: teacherID,

            teacher: teacherName

        };


        batches.push(newBatch);

        saveBatches(batches);

        displayBatches();

        closeBatchPopup();

        alert("Batch created successfully!");

    }

});




function editBatch(batchID) {

    const batches = getBatches();

    const batch = batches.find(item =>

        item.id === batchID

    );

    if (!batch) return;


    // Store Editing ID

    editingBatchID = batchID;


    // Load Latest Courses and Teachers

    populateCourseDropdown();

    populateTeacherDropdown();


    // Fill Existing Information

    batchTypeInput.value = batch.batch_type;

    courseInput.value = batch.course_id;

    levelInput.value = batch.level;

    dayInput.value = batch.batch_day;

    startTimeInput.value = batch.start_time;

    endTimeInput.value = batch.end_time;


    // Restore Teacher Selection

    let teacherID = batch.teacher_id || "";


    // Find Teacher ID for Old Batch Data

    if (!teacherID && batch.teacher) {

        teacherID = findTeacherIDByName(batch.teacher);

    }


    teacherInput.value = teacherID;


    // Change Popup Title and Button

    popupTitle.textContent = "✏️ Edit Batch";

    submitButton.value = "Update Batch";


    // Open Popup

    batchPopup.style.display = "block";

}



function deleteBatch(batchID) {

    const confirmDelete = confirm(

        "Are you sure you want to delete this batch?"

    );

    if (!confirmDelete) return;


    let batches = getBatches();


    batches = batches.filter(batch =>

        batch.id !== batchID

    );


    saveBatches(batches);

    displayBatches();


    alert("Batch deleted successfully!");

}




searchInput.addEventListener("input", function () {

    displayBatches();

});




batchTypeFilter.addEventListener("change", function () {

    displayBatches();

});




window.addEventListener("storage", function (event) {

    if (event.key === COURSE_STORAGE_KEY) {

        populateCourseDropdown();

        displayBatches();

    }


    // Update when teachers change

    if (event.key === TEACHER_STORAGE_KEY) {

        populateTeacherDropdown();

        displayBatches();

    }

});




window.addEventListener("focus", function () {

    populateCourseDropdown();

    populateTeacherDropdown();

    displayBatches();

});



getCourses();

populateCourseDropdown();

populateTeacherDropdown();

displayBatches();
