// Get HTML elements
const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("search");
const filterDepartment = document.getElementById("filterDepartment");

const totalStudents = document.getElementById("totalStudents");
const emptyMessage = document.getElementById("emptyMessage");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Load saved students from localStorage
let students = JSON.parse(localStorage.getItem("students")) || [];

// Save student data
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Display students in the table
function displayStudents() {
    studentTable.replaceChildren();

    const searchText = searchInput.value.toLowerCase();
    const selectedDepartment = filterDepartment.value;

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchText) ||
            student.roll.toLowerCase().includes(searchText);

        const matchesDepartment =
            selectedDepartment === "" ||
            student.department === selectedDepartment;

        return matchesSearch && matchesDepartment;
    });

    totalStudents.textContent = students.length;

    emptyMessage.style.display =
        filteredStudents.length === 0 ? "block" : "none";

    filteredStudents.forEach(student => {
        const row = document.createElement("tr");

        const values = [
            student.roll,
            student.name,
            student.department,
            student.year,
            student.email,
            student.gpa
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => {
            editStudent(student.id);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => {
            deleteStudent(student.id);
        });

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);

        studentTable.appendChild(row);
    });
}

// Add or update student
studentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("editId").value;

    const roll = document.getElementById("roll").value.trim();
    const name = document.getElementById("name").value.trim();
    const department = document.getElementById("department").value;
    const year = document.getElementById("year").value;
    const email = document.getElementById("email").value.trim();
    const gpa = document.getElementById("gpa").value;

    // Check for duplicate roll numbers
    const duplicate = students.some(student =>
        student.roll.toLowerCase() === roll.toLowerCase() &&
        student.id !== id
    );

    if (duplicate) {
        alert("This roll number already exists!");
        return;
    }

    const studentData = {
        id: id || Date.now().toString(),
        roll,
        name,
        department,
        year,
        email,
        gpa: Number(gpa).toFixed(2)
    };

    if (id) {
        // Update existing student
        students = students.map(student =>
            student.id === id ? studentData : student
        );

        alert("Student updated successfully!");
    } else {
        // Add new student
        students.push(studentData);

        alert("Student added successfully!");
    }

    saveStudents();
    displayStudents();
    resetForm();
});

// Edit student
function editStudent(id) {
    const student = students.find(student => student.id === id);

    if (!student) return;

    document.getElementById("editId").value = student.id;
    document.getElementById("roll").value = student.roll;
    document.getElementById("name").value = student.name;
    document.getElementById("department").value = student.department;
    document.getElementById("year").value = student.year;
    document.getElementById("email").value = student.email;
    document.getElementById("gpa").value = student.gpa;

    formTitle.textContent = "Edit Student Details";
    submitBtn.textContent = "Update Student";
    cancelBtn.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete student
function deleteStudent(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
        students = students.filter(student => student.id !== id);

        saveStudents();
        displayStudents();

        alert("Student deleted successfully!");

        if (document.getElementById("editId").value === id) {
            resetForm();
        }
    }
}

// Reset form
function resetForm() {
    studentForm.reset();

    document.getElementById("editId").value = "";

    formTitle.textContent = "Add New Student";
    submitBtn.textContent = "Add Student";
    cancelBtn.hidden = true;
}

// Cancel editing
cancelBtn.addEventListener("click", resetForm);

// Search students
searchInput.addEventListener("input", displayStudents);

// Filter by department
filterDepartment.addEventListener("change", displayStudents);

// Show saved records when page opens
displayStudents();