

function getData(key) {

    let data = localStorage.getItem(key);

    if (data === null) {
        return [];
    }

    try {

        let parsedData = JSON.parse(data);

        return Array.isArray(parsedData) ? parsedData : [];

    } catch (error) {

        console.error("Invalid LocalStorage data:", key);

        return [];

    }
}




function updateDashboard() {

    // Get all management data

    let students = getData("coachEaseStudents");

    let teachers = getData("coachEaseTeachers");

    let batches = getData("coachEaseBatches");

    let courses = getData("coachEaseCourses");


    // Calculate total records

    let totalStudents = students.length;

    let totalTeachers = teachers.length;

    let totalBatches = batches.length;

    let totalCourses = courses.length;


    // Calculate monthly revenue

    let monthlyRevenue = 0;


    students.forEach(function (student) {

        // Check student status

        let studentStatus = String(
            student.status || "Active"
        ).toLowerCase();


        if (studentStatus === "active") {

            // Find student's course using course ID

            let course = courses.find(function (item) {

                return item.id === student.course_id;

            });


            // Find course using course name if ID is unavailable

            if (!course && student.course) {

                course = courses.find(function (item) {

                    return String(item.name).toLowerCase() ===
                        String(student.course).toLowerCase();

                });

            }


            // Add course monthly fee

            if (course) {

                let fee = Number(course.fee) || 0;

                monthlyRevenue += fee;

            }

        }

    });


    // Display total students

    document.getElementById("total_students").textContent =
        totalStudents;


    // Display total teachers

    document.getElementById("total_teachers").textContent =
        totalTeachers;


    // Display total batches

    document.getElementById("total_batches").textContent =
        totalBatches;


    // Display total courses

    document.getElementById("total_courses").textContent =
        totalCourses;


    // Display monthly revenue

    document.getElementById("monthly_revenue").textContent =
        "৳ " + monthlyRevenue.toLocaleString("en-BD");

}



document.addEventListener("DOMContentLoaded", function () {

    updateDashboard();

});




window.addEventListener("storage", function (event) {

    if (

        event.key === "coachEaseStudents" ||

        event.key === "coachEaseTeachers" ||

        event.key === "coachEaseBatches" ||

        event.key === "coachEaseCourses"

    ) {

        updateDashboard();

    }

});




window.addEventListener("focus", function () {

    updateDashboard();

});




document.addEventListener("visibilitychange", function () {

    if (!document.hidden) {

        updateDashboard();

    }

});
