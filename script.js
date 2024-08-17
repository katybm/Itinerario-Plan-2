document.addEventListener('DOMContentLoaded', () => {
    const courses = document.querySelectorAll('.course');

    // Cargar el estado de los cursos desde localStorage
    loadCourseStates();

    // Manejar el clic en los cursos para marcarlos como completados
    courses.forEach(course => {
        course.addEventListener('click', () => {
            const checkbox = course.querySelector('input[type="checkbox"]');
            const isChecked = checkbox.checked;

            if (isChecked) {
                // Si el curso ya está completado, desmarcarlo
                course.classList.remove('completed');
                checkbox.checked = false;
            } else {
                // Marcar el curso como completado
                course.classList.add('completed');
                checkbox.checked = true;
                markPrerequisitesAsCompleted(course);
            }
            updateAvailableCourses(); // Actualizar disponibilidad de cursos después del cambio
            saveCourseStates(); // Guardar el estado de los cursos en localStorage
        });
    });

    function markPrerequisitesAsCompleted(course) {
        const prerequisites = course.getAttribute('data-prereqs').split(',');
        prerequisites.forEach(prereqId => {
            const prereqCheckbox = document.getElementById(prereqId);
            if (prereqCheckbox) {
                // Marcar los prerequisitos como completados si no están ya marcados
                if (!prereqCheckbox.checked) {
                    prereqCheckbox.checked = true;
                    const prereqCourse = prereqCheckbox.closest('.course');
                    if (prereqCourse) {
                        prereqCourse.classList.add('completed');
                    }
                }
            }
        });
    }

    function updateAvailableCourses() {
        courses.forEach(course => {
            const prerequisites = course.getAttribute('data-prereqs').split(',');
            const allPrerequisitesCompleted = prerequisites.every(prereqId => {
                const prereqCheckbox = document.getElementById(prereqId);
                return prereqCheckbox && prereqCheckbox.checked;
            });

            if (allPrerequisitesCompleted) {
                course.classList.add('available');
                course.classList.remove('not-available');
                course.querySelector('input[type="checkbox"]').disabled = false;
            } else {
                course.classList.remove('available');
                course.classList.add('not-available');
                course.querySelector('input[type="checkbox"]').disabled = true;
            }
        });
    }

    function saveCourseStates() {
        const courseStates = {};
        courses.forEach(course => {
            const checkbox = course.querySelector('input[type="checkbox"]');
            courseStates[checkbox.id] = checkbox.checked;
        });
        localStorage.setItem('courseStates', JSON.stringify(courseStates));
    }

    function loadCourseStates() {
        const savedStates = JSON.parse(localStorage.getItem('courseStates'));
        if (savedStates) {
            Object.keys(savedStates).forEach(courseId => {
                const checkbox = document.getElementById(courseId);
                if (checkbox) {
                    checkbox.checked = savedStates[courseId];
                    const course = checkbox.closest('.course');
                    if (course) {
                        if (checkbox.checked) {
                            course.classList.add('completed');
                        } else {
                            course.classList.remove('completed');
                        }
                    }
                }
            });
            updateAvailableCourses(); // Asegúrate de actualizar la disponibilidad después de cargar el estado
        }
    } 

});

