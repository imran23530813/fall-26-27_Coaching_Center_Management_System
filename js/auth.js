

const USERS_KEY = "coachEaseUsers";
const TEACHERS_KEY = "lmpTeachers";
const SESSION_KEY = "coachEaseCurrentUser";


const adminAccount = {
    fullName: "System Administrator",
    role: "Admin",
    username: "admin",
    password: "Admin@123"
};

let users = JSON.parse(
    localStorage.getItem(USERS_KEY) || "[]"
);

const adminIndex = users.findIndex(
    user => user.role === "Admin"
);

if (adminIndex === -1) {
    users.push(adminAccount);
} else {
    users[adminIndex] = {
        ...users[adminIndex],
        ...adminAccount
    };
}

localStorage.setItem(USERS_KEY, JSON.stringify(users));


const dashboardPaths = {
    Admin: "dashboard_admin.html",
    Student: "dashboard_student.html",
    Teacher: "teacher-dashboard.html",
    Accountant: "dashboard_accountant.html"
};


function usernameExists(username, excludeUser = null) {

    const registeredUsers = JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
    );

    const teachers = JSON.parse(
        localStorage.getItem(TEACHERS_KEY) || "[]"
    );

    const userExists = registeredUsers.some(user =>
        user.username &&
        user.username.toLowerCase() === username &&
        user !== excludeUser
    );

    const teacherExists = teachers.some(teacher =>
        teacher.username &&
        teacher.username.toLowerCase() === username &&
        teacher.id !== excludeUser
    );

    return userExists || teacherExists;
}



const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();

        const role = document.getElementById("regRole").value;

        const username = document.getElementById("regUsername")
            .value.trim().toLowerCase();

        const password = document.getElementById("regPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");

        message.style.color = "red";

        if (fullName.length < 3) {
            message.textContent =
                "Name must contain at least 3 characters.";
            return;
        }

        if (!["Student", "Accountant"].includes(role)) {
            message.textContent = "Please select a valid role.";
            return;
        }

        const usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;

        if (!usernamePattern.test(username)) {
            message.textContent =
                "Username must be 4-20 characters.";
            return;
        }

        if (password.length < 6) {
            message.textContent =
                "Password must contain at least 6 characters.";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            return;
        }

        if (usernameExists(username)) {
            message.textContent =
                "This username is already taken.";
            return;
        }

        const newUser = {
            fullName: fullName,
            role: role,
            username: username,
            password: password
        };

        users = JSON.parse(
            localStorage.getItem(USERS_KEY) || "[]"
        );

        users.push(newUser);

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

        message.style.color = "green";

        message.textContent =
            "Registration successful! Redirecting to login...";

        registerForm.reset();

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1200);

    });

}



const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const role = document.getElementById("role").value;

        const username = document.getElementById("username")
            .value.trim().toLowerCase();

        const password = document.getElementById("password").value;

        const message = document.getElementById("loginMessage");

        message.style.color = "red";
        message.textContent = "";

        if (!role || !username || !password) {
            message.textContent = "Please fill in all fields.";
            return;
        }

        let loggedInUser = null;



        if (role === "Teacher") {

            const teachers = JSON.parse(
                localStorage.getItem(TEACHERS_KEY) || "[]"
            );

            const teacher = teachers.find(function (item) {

                return (
                    item.username &&
                    item.username.toLowerCase() === username &&
                    item.password === password &&
                    item.status === "Active"
                );

            });

            if (teacher) {

                loggedInUser = {

                    fullName:
                        teacher.name ||
                        (teacher.first_name + " " + teacher.last_name),

                    role: "Teacher",

                    username: teacher.username,

                    teacherID: teacher.id,

                    email: teacher.email || ""

                };

            }

        }


        else {

            users = JSON.parse(
                localStorage.getItem(USERS_KEY) || "[]"
            );

            loggedInUser = users.find(function (user) {

                return (
                    user.role === role &&
                    user.username &&
                    user.username.toLowerCase() === username &&
                    user.password === password
                );

            });

        }



        if (!loggedInUser) {

            message.textContent =
                "Invalid role, username or password.";

            return;

        }



        const sessionUser = {

            fullName: loggedInUser.fullName,

            role: loggedInUser.role,

            username: loggedInUser.username,

            teacherID: loggedInUser.teacherID || null,

            email: loggedInUser.email || ""

        };

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(sessionUser)
        );


        message.style.color = "green";

        message.textContent =
            "Login successful! Redirecting to dashboard...";

        setTimeout(function () {

            window.location.href =
                dashboardPaths[loggedInUser.role];

        }, 800);

    });

}
