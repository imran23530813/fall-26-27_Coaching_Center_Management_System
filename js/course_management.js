
let courseData;

if (localStorage.getItem("coachEaseCourses") === null) {

    courseData = defaultCourses;

    localStorage.setItem(
        "coachEaseCourses",
        JSON.stringify(courseData)
    );

}

else {

    try {

        courseData = JSON.parse(
            localStorage.getItem("coachEaseCourses")
        ) || [];

        if (!Array.isArray(courseData)) {
            courseData = [];
        }

    }

    catch (error) {

        courseData = [...defaultCourses];

    }

}




function saveCourses() {

    localStorage.setItem(
        "coachEaseCourses",
        JSON.stringify(courseData)
    );

}




let coursePopup = document.getElementById("course_popup");

let openCoursePopup = document.getElementById("open_course_popup");

let closeCoursePopup = document.getElementById("close_course_popup");

let courseForm = document.getElementById("course_form");

let courseTable = document.getElementById("course_table_body");

let courseSearch = document.getElementById("course_search");

let courseName = document.getElementById("cname");

let courseDescription = document.getElementById("cdesc");

let courseFee = document.getElementById("cfee");

let courseSubmit = document.getElementById("course_submit");

let coursePopupTitle = document.getElementById("course_popup_title");


// Edit Index
// -1 means Add New Course

let editIndex = -1;




function generateCourseID() {

    let highestID = 100;

    for (let i = 0; i < courseData.length; i++) {

        let number = parseInt(
            String(courseData[i].id || "").replace("CRS-", "")
        );

        if (!isNaN(number) && number > highestID) {

            highestID = number;

        }

    }

    return "CRS-" + String(highestID + 1).padStart(3, "0");

}




openCoursePopup.onclick = function () {

    editIndex = -1;

    courseForm.reset();

    courseSubmit.value = "Add Course";

    coursePopupTitle.textContent = "➕ Add Course Information";

    coursePopup.style.display = "block";

};




closeCoursePopup.onclick = function () {

    coursePopup.style.display = "none";

    courseForm.reset();

    editIndex = -1;

    courseSubmit.value = "Add Course";

    coursePopupTitle.textContent = "➕ Add Course Information";

};


window.addEventListener("click", function (event) {

    if (event.target === coursePopup) {

        coursePopup.style.display = "none";

        courseForm.reset();

        editIndex = -1;

        courseSubmit.value = "Add Course";

        coursePopupTitle.textContent = "➕ Add Course Information";

    }

});


courseForm.onsubmit = function (event) {

    event.preventDefault();


    // Get Form Values

    let name = courseName.value.trim();

    let description = courseDescription.value.trim();

    let fee = Number(courseFee.value);




    if (name.length < 3) {

        alert("Course Name must contain at least 3 characters!");

        courseName.focus();

        return;

    }




    if (description.length < 5) {

        alert("Course Description must contain at least 5 characters!");

        courseDescription.focus();

        return;

    }



    if (!Number.isInteger(fee) || fee <= 0) {

        alert("Monthly Course Fee must be a positive whole number!");

        courseFee.focus();

        return;

    }




    let duplicateCourse = courseData.some(function (course, index) {

        return course.name.toLowerCase() === name.toLowerCase()
            && index !== editIndex;

    });

    if (duplicateCourse) {

        alert("This Course Name Already Exists!");

        courseName.focus();

        return;

    }



    let course = {

        id: editIndex === -1
            ? generateCourseID()
            : courseData[editIndex].id,

        name: name,

        description: description,

        fee: fee

    };




    if (editIndex === -1) {

        courseData.push(course);

        alert("Course Added Successfully!");

    }




    else {

        courseData[editIndex] = course;

        alert("Course Updated Successfully!");

        editIndex = -1;

    }


    // Save Data

    saveCourses();


    // Refresh Table

    showCourses();


    // Reset Form

    courseForm.reset();

    courseSubmit.value = "Add Course";

    coursePopupTitle.textContent = "➕ Add Course Information";


    // Close Popup

    coursePopup.style.display = "none";

};




function showCourses() {

    courseTable.innerHTML = "";


    // Get Search Value

    let searchTerm = courseSearch.value.trim().toLowerCase();


    // Loop Through Course Array

    for (let i = 0; i < courseData.length; i++) {

        let course = courseData[i];


        // Search Filter

        let searchableText = (

            course.id + " " +
            course.name + " " +
            course.description + " " +
            course.fee

        ).toLowerCase();


        if (!searchableText.includes(searchTerm)) {

            continue;

        }


        // Create Table Row

        let row = document.createElement("tr");


        // Course ID

        let idCell = document.createElement("td");

        idCell.textContent = course.id;

        row.appendChild(idCell);


        // Course Name

        let nameCell = document.createElement("td");

        nameCell.textContent = course.name;

        row.appendChild(nameCell);


        // Course Description

        let descriptionCell = document.createElement("td");

        descriptionCell.textContent = course.description;

        row.appendChild(descriptionCell);


        // Monthly Fee

        let feeCell = document.createElement("td");

        feeCell.textContent = course.fee;

        row.appendChild(feeCell);


        // Action Buttons

        let actionCell = document.createElement("td");


        // Edit Button

        let editButton = document.createElement("input");

        editButton.type = "button";

        editButton.value = "Edit";

        editButton.onclick = function () {

            editCourse(i);

        };

        actionCell.appendChild(editButton);


        // Delete Button

        let deleteButton = document.createElement("input");

        deleteButton.type = "button";

        deleteButton.value = "Delete";

        deleteButton.onclick = function () {

            deleteCourse(i);

        };

        actionCell.appendChild(deleteButton);


        row.appendChild(actionCell);


        // Add Row to Table

        courseTable.appendChild(row);

    }




    if (courseTable.children.length === 0) {

        let row = document.createElement("tr");

        let cell = document.createElement("td");

        cell.colSpan = 5;

        cell.textContent = "No Course Found";

        cell.style.textAlign = "center";

        cell.style.padding = "20px";

        row.appendChild(cell);

        courseTable.appendChild(row);

    }

}




function editCourse(index) {

    editIndex = index;


    // Get Course Information

    let course = courseData[index];


    // Put Existing Data into Form

    courseName.value = course.name;

    courseDescription.value = course.description;

    courseFee.value = course.fee;


    // Change Popup Title

    coursePopupTitle.textContent = "✏️ Update Course Information";


    // Change Submit Button

    courseSubmit.value = "Update Course";


    // Open Popup

    coursePopup.style.display = "block";

}




function deleteCourse(index) {

    let confirmDelete = confirm(
        "Are you sure you want to delete this course?"
    );


    if (confirmDelete === true) {

        courseData.splice(index, 1);


        // Save Updated Data

        saveCourses();


        // Refresh Table

        showCourses();


        alert("Course Deleted Successfully!");

    }

}




courseSearch.oninput = function () {

    showCourses();

};




courseForm.onreset = function () {

    if (editIndex !== -1) {

        editIndex = -1;

        courseSubmit.value = "Add Course";

        coursePopupTitle.textContent = "➕ Add Course Information";

    }

};




showCourses();
