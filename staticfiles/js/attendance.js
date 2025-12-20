document.addEventListener('DOMContentLoaded', function() {
    const departmentSelect = document.getElementById('department-select');
    const semesterSelect = document.getElementById('semester-select');
    const subjectSelect = document.getElementById('subject-select');
    const loadStudentsBtn = document.querySelector('.btn-load-students');
    const studentsBody = document.getElementById('attendance-students-body');
    const submitBtn = document.querySelector('.btn-submit-attendance');
    const attendanceForm = document.getElementById('attendance-form');
    const attendanceDate = document.getElementById('attendance-date');
    const studentAttendanceList = document.querySelector('.student-attendance-list');

    // Initially hide the student attendance list
    studentAttendanceList.style.display = 'none';

    // Fetch subjects based on selected department and semester
    function fetchSubjects() {
        const departmentId = departmentSelect.value;
        const semesterId = semesterSelect.value;
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';

        if (departmentId && semesterId) {
            fetch(`${get_subjects_url}?department_id=${departmentId}&semester_id=${semesterId}`)
                .then(response => response.json())
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

    // Fetch students based on selected department and semester
    function fetchStudents() {
        const departmentId = departmentSelect.value;
        const semesterId = semesterSelect.value;
        studentsBody.innerHTML = '';

        if (departmentId && semesterId) {
            fetch(`${get_students_url}?department_id=${departmentId}&semester_id=${semesterId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        studentAttendanceList.style.display = 'block';
                        submitBtn.style.display = 'block';
                        attendanceForm.style.display = 'block';
                    } else {
                        studentAttendanceList.style.display = 'none';
                        submitBtn.style.display = 'none';
                        attendanceForm.style.display = 'none';
                    }

                    data.forEach(student => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${student.id}</td>
                            <td>${student.name}</td>
                            <td>
                                <input type="radio" name="student_${student.id}" value="present" checked> Present
                                <input type="radio" name="student_${student.id}" value="absent"> Absent
                            </td>
                        `;
                        studentsBody.appendChild(row);
                    });
                })
                .catch(err => console.error('Error fetching students:', err));
        }
    }

    // Event listeners
    departmentSelect.addEventListener('change', fetchSubjects);
    semesterSelect.addEventListener('change', fetchSubjects);
    loadStudentsBtn.addEventListener('click', fetchStudents);

    // Submit attendance
    attendanceForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const subjectId = subjectSelect.value;
        const date = attendanceDate.value;
        const attendanceData = {};

        const studentRows = studentsBody.querySelectorAll('tr');
        studentRows.forEach(row => {
            const studentId = row.querySelector('td:first-child').textContent;
            const status = row.querySelector('input[type="radio"]:checked').value;
            attendanceData[studentId] = status;
        });

        if (!subjectId || !date) {
            alert('Please select a subject and a date.');
            return;
        }

        fetch(save_attendance_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
            },
            body: JSON.stringify({
                subject_id: subjectId,
                date: date,
                attendance_data: attendanceData,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Attendance submitted successfully.');
                window.location.reload();
            } else {
                alert('Error saving attendance.');
            }
        })
        .catch(err => console.error('Error submitting attendance:', err));
    });
});
