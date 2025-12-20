document.addEventListener('DOMContentLoaded', function () {
    const departmentSelect = document.getElementById('department-select');
    const semesterSelect = document.getElementById('semester-select');
    const subjectSelect = document.getElementById('subject-select');
    const studentsBody = document.getElementById('attendance-students-body');
    const attendanceForm = document.getElementById('attendance-form');
    const attendanceDate = document.getElementById('attendance-date');
    const loadStudentsBtn = document.querySelector('.btn-load-students');
    const submitBtn = document.querySelector('.btn-submit-attendance');
    const studentListContainer = document.querySelector('.student-attendance-list');

    // Hide student list initially and disable submit button
    studentListContainer.style.display = 'none';

    // Fetch subjects based on department and semester
    function fetchSubjects() {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';

        if (departmentSelect.value && semesterSelect.value) {
            fetch(`${get_subjects_url}?department_id=${departmentSelect.value}&semester_id=${semesterSelect.value}`)
                .then(res => res.json())
                .then(data => {
                    data.forEach(subject => {
                        const option = document.createElement('option');
                        option.value = subject.id;
                        option.textContent = subject.name;
                        subjectSelect.appendChild(option);
                    });
                })
                .catch(err => console.error('Error fetching subjects:', err));
        }
    }

    // Fetch students based on department and semester
    function fetchStudents() {
        if (!departmentSelect.value || !semesterSelect.value) {
            alert('Please select both Department and Semester');
            return;
        }

        // Show the student list table and set loading state
        studentListContainer.style.display = 'block';
        studentsBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
        submitBtn.disabled = true; // Disable button while loading

        fetch(`${get_students_url}?department_id=${departmentSelect.value}&semester_id=${semesterSelect.value}`)
            .then(res => res.json())
            .then(data => {
                studentsBody.innerHTML = '';

                if (data.length === 0) {
                    studentsBody.innerHTML = '<tr><td colspan="3">No students found.</td></tr>';
                    submitBtn.disabled = true; // Keep disabled if no students
                    return;
                }

                data.forEach(student => {
                    const row = document.createElement('tr');
                    row.dataset.studentId = student.student_id; // Store student ID in a data attribute
                    row.innerHTML = `
                        <td>${student.student_id}</td>
                        <td>${student.name}</td>
                        <td>
                            <label>
                                <input type="radio" name="student_${student.student_id}" value="present" checked> Present
                            </label>
                            <label>
                                <input type="radio" name="student_${student.student_id}" value="absent"> Absent
                            </label>
                        </td>
                    `;
                    studentsBody.appendChild(row);
                });

                submitBtn.disabled = false; // Enable button now that students are loaded
            })
            .catch(err => {
                console.error('Error fetching students:', err);
                studentsBody.innerHTML = '<tr><td colspan="3">Failed to load students.</td></tr>';
                submitBtn.disabled = true; // Keep disabled on error
            });
    }

    // Submit attendance
    attendanceForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!subjectSelect.value || !attendanceDate.value) {
            alert('Please select a subject and a date.');
            return;
        }

        const attendanceData = {};
        document.querySelectorAll('#attendance-students-body tr').forEach(row => {
            const studentId = row.dataset.studentId; // Retrieve student ID from data attribute
            if (studentId) {
                const status = row.querySelector('input[type="radio"]:checked').value;
                attendanceData[studentId] = status;
            }
        });

        // Disable button during submission
        submitBtn.disabled = true;

        fetch(save_attendance_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({
                subject_id: subjectSelect.value,
                date: attendanceDate.value,
                attendance_data: attendanceData
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Attendance saved successfully!');
                location.reload();
            } else {
                alert(`Error saving attendance: ${data.message || 'Unknown error'}`);
                submitBtn.disabled = false; // Re-enable on failure
            }
        })
        .catch(err => {
            console.error('Error submitting attendance:', err);
            submitBtn.disabled = false; // Re-enable on network error
        });
    });

    // Event listeners
    departmentSelect.addEventListener('change', fetchSubjects);
    semesterSelect.addEventListener('change', fetchSubjects);
    loadStudentsBtn.addEventListener('click', fetchStudents);
});