// Project Data Structure
let projectsData = {
    projects: []
};

// Function to save project data
function saveProjectData(projectData) {
    // Get existing data from localStorage or initialize empty array
    const existingData = JSON.parse(localStorage.getItem('projectsData')) || { projects: [] };
    
    // Generate unique ID for the project
    projectData.id = Date.now().toString();
    projectData.createdAt = new Date().toISOString();
    
    // Add new project
    existingData.projects.push(projectData);
    
    // Save back to localStorage
    localStorage.setItem('projectsData', JSON.stringify(existingData));
    
    return projectData;
}

// Show toast notification
function showToast(message, type = "success", duration = 5000) {
    const toastContainer = document.querySelector(".toast-container")
    const toastHtml = `
        <div class="toast ${type}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">
                    ${
                      type === "success"
                        ? '<i class="fas fa-check-circle me-2"></i>Success'
                        : '<i class="fas fa-exclamation-circle me-2"></i>Error'
                    }
                </strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `
    toastContainer.insertAdjacentHTML("beforeend", toastHtml)

    const toastElement = toastContainer.lastElementChild
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: duration,
    })

    toast.show()

    // Remove toast after it's hidden
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.remove()
    })
}


// Updated form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createProjectForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.spinner-border');

    // Set minimum date for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').min = today;
    document.getElementById('dueDate').min = today;


    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        try {
            // Show loading state
            submitButton.disabled = true;
            spinner.classList.remove('d-none');

            // Collect form data
            const projectData = {
                projectName: document.getElementById('projectName').value,
                projectType: document.getElementById('projectType').value,
                description: document.getElementById('description').value,
                clientInfo: {
                    name: document.getElementById('clientName').value,
                    email: document.getElementById('clientEmail').value,
                    phone: document.getElementById('clientPhone').value
                },
                location: document.getElementById('location').value,
                dates: {
                    start: document.getElementById('startDate').value,
                    due: document.getElementById('dueDate').value
                },
                price: parseFloat(document.getElementById('price').value),
                status: document.getElementById('status').value,
                progress: 0 // Initial progress
            };

            // Save project data
            saveProjectData(projectData);

            // Show success message
            showToast('Project created successfully!', 'success');

            // Reset form
            form.reset();
            form.classList.remove('was-validated');

            // Redirect after delay
            setTimeout(() => {
                window.location.href = `/projects.html`;
            }, 1500);

        } catch (error) {
            console.error('Error creating project:', error);
            showToast('Error creating project. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            spinner.classList.add('d-none');
        }
    });


    // Date validation
    document.getElementById('dueDate').addEventListener('change', function() {
        const startDate = document.getElementById('startDate').value;
        if (startDate && this.value < startDate) {
            this.value = startDate;
            showToast('Due date cannot be earlier than start date', 'error');
        }
    });

    // Price input validation
    document.getElementById('price').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
});

// Function to get all projects
// function getAllProjects() {
//     const data = localStorage.getItem('projectsData');
//     return data ? JSON.parse(data).projects : [];
// }

// // Function to get a single project by ID
// function getProjectById(projectId) {
//     const projects = getAllProjects();
//     return projects.find(project => project.id === projectId);
// }