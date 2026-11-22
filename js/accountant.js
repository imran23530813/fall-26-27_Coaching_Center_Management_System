

function getData(key, defaultData = []) {

    const savedData = localStorage.getItem(key);

    if (savedData === null) {
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    }

    try {
        return JSON.parse(savedData);
    } catch (error) {
        return defaultData;
    }
}


function saveData(key, data) {

    localStorage.setItem(key, JSON.stringify(data));

}


// Generate unique ID

function generateID(prefix) {

    return prefix + Date.now();

}



const initialExpenses = [
    {
        id: "EXP-101",
        name: "Electricity Bill",
        category: "Utilities",
        amount: 3500,
        date: "2026-10-05",
        note: ""
    },
    {
        id: "EXP-102",
        name: "Stationery",
        category: "Stationery",
        amount: 1200,
        date: "2026-10-10",
        note: ""
    }
];


const initialFees = [
    {
        id: "REC-101",
        studentId: "STU-101",
        studentName: "Rahim Ahmed",
        studentClass: "Class 10",
        month: "October",
        amount: 2000,
        date: "2026-10-05",
        method: "Cash"
    },
    {
        id: "REC-102",
        studentId: "STU-102",
        studentName: "Sumaiya Akter",
        studentClass: "Class 11",
        month: "October",
        amount: 2500,
        date: "2026-10-10",
        method: "bKash"
    }
];


const initialSalaries = [
    {
        id: "SAL-101",
        staffId: "TEA-101",
        staffName: "Mr. Rahman",
        role: "Teacher",
        month: "October",
        amount: 18000,
        status: "Paid"
    },
    {
        id: "SAL-102",
        staffId: "TEA-102",
        staffName: "Ms. Sultana",
        role: "Teacher",
        month: "October",
        amount: 20000,
        status: "Pending"
    }
];




function setupCRUD(config) {

    const form = document.getElementById(config.formID);

    // Check whether this form exists on current page

    if (!form) {
        return;
    }

    const tableBody = document.getElementById(config.tableID);

    const submitButton = document.getElementById(config.submitID);

    let records = getData(config.storageKey, config.initialData);

    let editID = null;



    function displayData() {

        tableBody.innerHTML = "";

        records.forEach(function (record) {

            const row = document.createElement("tr");

            config.columns.forEach(function (column) {

                const cell = document.createElement("td");

                cell.textContent = record[column];

                row.appendChild(cell);

            });


            // Action column

            const actionCell = document.createElement("td");


            // Edit button

            const editButton = document.createElement("button");

            editButton.type = "button";

            editButton.textContent = "Edit";

            editButton.addEventListener("click", function () {

                editRecord(record.id);

            });


            // Delete button

            const deleteButton = document.createElement("button");

            deleteButton.type = "button";

            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {

                deleteRecord(record.id);

            });


            actionCell.appendChild(editButton);

            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);

            tableBody.appendChild(row);

        });

    }




    form.addEventListener("submit", function (event) {

        event.preventDefault();


        // HTML form validation

        if (!form.reportValidity()) {

            return;

        }


        // Get form values

        const newRecord = {};


        for (const field in config.fields) {

            const input = document.getElementById(field);

            const value = input.value.trim();


            // Check empty values

            if (input.required && value === "") {

                alert("Please fill in all required fields.");

                input.focus();

                return;

            }


            newRecord[config.fields[field]] = value;

        }


        // Check amount

        const amount = Number(newRecord.amount);

        if (!Number.isFinite(amount) || amount <= 0) {

            alert("Amount must be greater than zero.");

            return;

        }

        newRecord.amount = amount;


        // UPDATE operation

        if (editID !== null) {

            const index = records.findIndex(function (item) {

                return item.id === editID;

            });


            if (index !== -1) {

                records[index] = {

                    ...records[index],

                    ...newRecord

                };

            }

            alert("Record updated successfully!");

            editID = null;

            submitButton.value = config.addText;

        }


        // CREATE operation

        else {

            newRecord.id = generateID(config.prefix);

            records.push(newRecord);

            alert("Record added successfully!");

        }


        // Save data

        saveData(config.storageKey, records);


        // Update table using DOM

        displayData();


        // Clear form

        form.reset();

    });





    function editRecord(id) {

        const record = records.find(function (item) {

            return item.id === id;

        });


        if (!record) {

            return;

        }


        for (const field in config.fields) {

            const input = document.getElementById(field);

            input.value = record[config.fields[field]];

        }


        editID = id;

        submitButton.value = config.updateText;

        form.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }





    function deleteRecord(id) {

        const confirmDelete = confirm(

            "Are you sure you want to delete this record?"

        );


        if (confirmDelete) {

            records = records.filter(function (item) {

                return item.id !== id;

            });


            saveData(config.storageKey, records);

            displayData();

            alert("Record deleted successfully!");

        }

    }




    form.addEventListener("reset", function () {

        editID = null;

        submitButton.value = config.addText;

    });


    // Display saved data when page opens

    displayData();

}





setupCRUD({

    formID: "expenseForm",

    tableID: "expenseList",

    submitID: "expenseSubmit",

    storageKey: "coachEaseExpenses",

    prefix: "EXP-",

    addText: "Add Expense",

    updateText: "Update Expense",

    initialData: initialExpenses,


    fields: {

        expense_name: "name",

        expense_category: "category",

        expense_amount: "amount",

        expense_date: "date",

        expense_note: "note"

    },


    columns: [

        "id",

        "name",

        "category",

        "amount",

        "date"

    ]

});





setupCRUD({

    formID: "feeForm",

    tableID: "feeList",

    submitID: "feeSubmit",

    storageKey: "coachEaseFees",

    prefix: "REC-",

    addText: "Collect Fee",

    updateText: "Update Fee",

    initialData: initialFees,


    fields: {

        student_id: "studentId",

        student_name: "studentName",

        fee_class: "studentClass",

        fee_month: "month",

        fee_amount: "amount",

        payment_date: "date",

        payment_method: "method"

    },


    columns: [

        "id",

        "studentId",

        "studentName",

        "studentClass",

        "month",

        "amount",

        "method"

    ]

});





setupCRUD({

    formID: "salaryForm",

    tableID: "salaryList",

    submitID: "salarySubmit",

    storageKey: "coachEaseSalaries",

    prefix: "SAL-",

    addText: "Save Salary",

    updateText: "Update Salary",

    initialData: initialSalaries,


    fields: {

        staff_id: "staffId",

        staff_name: "staffName",

        staff_role: "role",

        salary_month: "month",

        salary_amount: "amount",

        salary_status: "status"

    },


    columns: [

        "id",

        "staffId",

        "staffName",

        "role",

        "month",

        "amount",

        "status"

    ]

});




function updateDashboard() {

    const totalFeesElement = document.getElementById("totalFees");

    const totalExpensesElement = document.getElementById("totalExpenses");

    const totalSalariesElement = document.getElementById("totalSalaries");

    const pendingSalariesElement = document.getElementById("pendingSalaries");


    // Check whether dashboard page is open

    if (!totalFeesElement) {

        return;

    }


    const fees = getData("coachEaseFees", initialFees);

    const expenses = getData("coachEaseExpenses", initialExpenses);

    const salaries = getData("coachEaseSalaries", initialSalaries);


    // Calculate total fees

    const totalFees = fees.reduce(function (sum, item) {

        return sum + Number(item.amount);

    }, 0);


    // Calculate total expenses

    const totalExpenses = expenses.reduce(function (sum, item) {

        return sum + Number(item.amount);

    }, 0);


    // Calculate total salaries

    const totalSalaries = salaries.reduce(function (sum, item) {

        return sum + Number(item.amount);

    }, 0);


    // Calculate pending salaries

    const pendingSalaries = salaries

        .filter(function (item) {

            return item.status === "Pending";

        })

        .reduce(function (sum, item) {

            return sum + Number(item.amount);

        }, 0);


    // Display values using DOM manipulation

    totalFeesElement.textContent = totalFees;

    totalExpensesElement.textContent = totalExpenses;

    totalSalariesElement.textContent = totalSalaries;

    pendingSalariesElement.textContent = pendingSalaries;

}




updateDashboard();




window.addEventListener("storage", updateDashboard);
