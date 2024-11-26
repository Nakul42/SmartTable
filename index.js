const firstName = document.getElementById('name');
const surName = document.getElementById('surname');
const emailInput = document.getElementById('emails'); // Consistent variable naming
const submitButton = document.getElementById('btn');
const tableBody = document.querySelector('.table tbody');

// Validate email
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate name and surname (only alphabets allowed)
const validateText = (text) => /^[a-zA-Z\s]+$/.test(text.trim());

// Check and display "No data available" if table is empty
const checkEmptyTable = () => {
    if (tableBody.children.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.classList.add('empty-row');
        emptyRow.innerHTML = `<td colspan="4" style="text-align:center;">No data available</td>`;
        tableBody.appendChild(emptyRow);
    }
};

// Remove "No data available" row
const removeEmptyRow = () => {
    const emptyRow = document.querySelector('.empty-row');
    if (emptyRow) emptyRow.remove();
};

// Save table data to localStorage
const saveTableData = () => {
    const rows = Array.from(tableBody.children);
    const tableData = rows.map((row) => {
        const cells = row.querySelectorAll('td');
        return {
            name: cells[0].textContent,
            surname: cells[1].textContent,
            email: cells[2].textContent,
        };
    });
    localStorage.setItem('tableData', JSON.stringify(tableData));
};


// Load table data from localStorage
const loadTableData = () => {
    const savedData = localStorage.getItem('tableData');
    if (savedData) {
        const tableData = JSON.parse(savedData);
        tableData.forEach(({ name, surname, email }) => addRow(name, surname, email));
    }
    checkEmptyTable();
};

const isDuplicateEmail = (email) => {
    const rows = Array.from(tableBody.children);
    return rows.some(row => row.children[2].textContent === email);
};

// Add a new row
const addRow = (name, surname, email) => {
    removeEmptyRow();

    if (isDuplicateEmail(email)) {
        alert('This email is already added!');
        return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${name}</td>
        <td>${surname}</td>
        <td>${email}</td>
        <td>
            <button class="edit-btn" aria-label="Edit row">Edit</button>
            <button class="delete-btn" aria-label="Delete row">Delete</button>
        </td>
    `;

    const editButton = newRow.querySelector('.edit-btn');
    const deleteButton = newRow.querySelector('.delete-btn');

    editButton.addEventListener('click', () => {

        if (firstName.value.trim() !== '' && surName.value.trim() !== '' && emailInput.value.trim() !== '') {
            alert('Already One Data is being edited. Please complete it first.');
        } else {
            firstName.value = name;
            surName.value = surname;
            emailInput.value = email;
            newRow.remove();
            saveTableData();
            checkEmptyTable();

            name = '';
            surname = '';
            email = '';
        }
    });

    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this row?')) {
            newRow.remove();
            saveTableData();
            checkEmptyTable();
        }
    });

    tableBody.appendChild(newRow);
    saveTableData();
};

// Handle form submission
const handleSubmit = () => {
    const name = firstName.value.trim();
    const surname = surName.value.trim();
    const emailValue = emailInput.value.trim();

    if (name === '' && surname === '' && emailValue === '') {
        alert('Name, Surname, and Email cannot be empty');
        return;
    } else if (!validateText(name) || !validateText(surname)) {
        alert('Name and Surname must only contain alphabets.');
        return;
    } else if (!validateEmail(emailValue)) {
        alert('Please enter a valid email address.');
        return;
    }

    addRow(name, surname, emailValue);

    firstName.value = '';
    surName.value = '';
    emailInput.value = '';
    saveTableData();
};

// Sort table rows by name
const sortByName = () => {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const sortedRows = rows.sort((a, b) => {
        const nameA = a.children[0].textContent.toLowerCase();
        const nameB = b.children[0].textContent.toLowerCase();
        return nameA.localeCompare(nameB);
    });

    tableBody.innerHTML = '';
    sortedRows.forEach((row) => tableBody.appendChild(row));
    saveTableData();
};

// Sort table rows by surname
const sortBySurname = () => {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const sortedRows = rows.sort((a, b) => {
        const surnameA = a.children[1].textContent.toLowerCase();
        const surnameB = b.children[1].textContent.toLowerCase();
        return surnameA.localeCompare(surnameB);
    });

    tableBody.innerHTML = '';
    sortedRows.forEach((row) => tableBody.appendChild(row));
    saveTableData();
};

// Sort table rows by email
const sortByEmail = () => {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const sortedRows = rows.sort((a, b) => {
        const emailA = a.children[2].textContent.toLowerCase();
        const emailB = b.children[2].textContent.toLowerCase();
        return emailA.localeCompare(emailB);
    });

    tableBody.innerHTML = '';
    sortedRows.forEach((row) => tableBody.appendChild(row));
    saveTableData();
};

const sortByColumn = (columnIndex, key) => {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const sortedRows = rows.sort((a, b) => {
        const textA = a.children[columnIndex].textContent.toLowerCase();
        const textB = b.children[columnIndex].textContent.toLowerCase();
        if (sortDirections[key]) {
            return textA.localeCompare(textB);
        } else {
            return textB.localeCompare(textA);
        }
    });

    sortDirections[key] = !sortDirections[key]; // Toggle sort direction

    tableBody.innerHTML = '';
    sortedRows.forEach(row => tableBody.appendChild(row));
    saveTableData();

    // Update header classes
    const headers = document.querySelectorAll('th');
    headers.forEach((th, index) => {
        th.classList.remove('sorted-asc', 'sorted-desc');
        if (index === columnIndex) {
            th.classList.add(sortDirections[key] ? 'sorted-asc' : 'sorted-desc');
        }
    });
};

// Attach event listeners to sort buttons
const sortDiv = document.getElementById('sort-buttons');
sortDiv.innerHTML = `
    <button id="sort-by-name" class="sort-btn">Sort by Name</button>
    <button id="sort-by-surname" class="sort-btn">Sort by Surname</button>
    <button id="sort-by-email" class="sort-btn">Sort by Email</button>
`;
document.getElementById('sort-by-name').addEventListener('click', sortByName);
document.getElementById('sort-by-surname').addEventListener('click', sortBySurname);
document.getElementById('sort-by-email').addEventListener('click', sortByEmail);

// Add event listener for the submit button
submitButton.addEventListener('click', handleSubmit);

// Handle form submission on Enter key press
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
    }
});

// Implement CSV export functionality
const exportButton = document.getElementById('export-btn');

const exportToCSV = () => {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    if (rows.length === 0) {
        alert('No data to export.');
        return;
    }

    // Generate CSV content
    const csvContent = [
        ['Name', 'Surname', 'Email'], // Table headers
        ...rows.map(row => {
            const cells = row.querySelectorAll('td');
            return [
                cells[0]?.textContent.trim(), // Name
                cells[1]?.textContent.trim(), // Surname
                cells[2]?.textContent.trim()  // Email
            ];
        })
    ];
    const csvString = csvContent.map(row => row.join(',')).join('\n');

    // Prompt for the filename
    let csvName;
    do {
        csvName = prompt('Enter a name for your file:');
        if (csvName === null) return; // Cancel clicked, exit function
        if (!csvName.trim()) {
            alert('File name cannot be empty.');
        }
    } while (!csvName.trim()); 

    // Create a Blob with CSV data
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${csvName}.csv`; // Set the filename for the CSV

    // Trigger the download
    link.click();

    // Clean up the object URL
    URL.revokeObjectURL(link.href);
};

// Add event listener to export button
exportButton.addEventListener('click', exportToCSV);


// Initialize table with saved data
window.addEventListener('load', loadTableData);

// Check if the table is empty on load
checkEmptyTable();
