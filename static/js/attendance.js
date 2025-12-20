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

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    studentListContainer.style.display = 'none';
    submitBtn.disabled = true;

    function fetchSubjects() {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';

        if (!departmentSelect.value || !semesterSelect.value) return;

        fetch(`${get_subjects_url}?department_id=${departmentSelect.value}&semester_id=${semesterSelect.value}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch subjects');
                return res.json();
            })
            .then(data => {
                data.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject.id;
                    option.textContent = subject.name;
                    subjectSelect.appendChild(option);
                });
            })
            .catch(err => {
                console.error(err);
                alert('Failed to load subjects');
            });
    }

    function fetchStudents() {

        if (!departmentSelect.value || !semesterSelect.value) {
            alert('Please select both Department and Semester');
            return;
        }

        studentListContainer.style.display = 'block';
        studentsBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
        submitBtn.disabled = true;

        fetch(`${get_students_url}?department_id=${departmentSelect.value}&semester_id=${semesterSelect.value}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch students');
                return res.json();
            })
            .then(data => {
                studentsBody.innerHTML = '';

                if (!data.length) {
                    studentsBody.innerHTML = '<tr><td colspan="3">No students found.</td></tr>';
                    return;
                }

                data.forEach(student => {
                    const tr = document.createElement('tr');
                    tr.dataset.studentId = student.student_id;

                    tr.innerHTML = `
                        <td>${student.student_id}</td>
                        <td>${student.name}</td>
                        <td>
                            <label>
                                <input type="radio" name="status_${student.student_id}" value="P" checked>
                                Present
                            </label>
                            &nbsp;&nbsp;
                            <label>
                                <input type="radio" name="status_${student.student_id}" value="A">
                                Absent
                            </label>
                        </td>
                    `;

                    studentsBody.appendChild(tr);
                });

                submitBtn.disabled = false;
            })
            .catch(err => {
                console.error(err);
                studentsBody.innerHTML = '<tr><td colspan="3">Error loading students.</td></tr>';
            });
    }


    attendanceForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!subjectSelect.value || !attendanceDate.value) {
            alert('Please select Subject and Date');
            return;
        }

        const attendanceData = {};

        document.querySelectorAll('#attendance-students-body tr').forEach(row => {
            const studentId = row.dataset.studentId;
            if (!studentId) return;

            const checked = row.querySelector(`input[name="status_${studentId}"]:checked`);
            if (checked) {
                attendanceData[studentId] = checked.value;
            }
        });

        submitBtn.disabled = true;

        fetch(save_attendance_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                subject_id: subjectSelect.value,
                date: attendanceDate.value,
                attendance_data: attendanceData
            })
        })
        .then(res => {
            if (!res.ok) throw new Error('Attendance save failed');
            return res.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Attendance saved successfully!');
                window.location.reload();
            } else {
                alert(data.message || 'Something went wrong');
                submitBtn.disabled = false;
            }
        })
        .catch(err => {
            console.error(err);
            alert('Server error while saving attendance');
            submitBtn.disabled = false;
        });
    });

    departmentSelect.addEventListener('change', fetchSubjects);
    semesterSelect.addEventListener('change', fetchSubjects);
    loadStudentsBtn.addEventListener('click', fetchStudents);

});
