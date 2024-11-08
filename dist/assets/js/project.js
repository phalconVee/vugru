// Sample Data
const sampleProjects = [
    {
        id: 1,
        name: 'Wedding Photoshoot',
        description: 'Smith-Jones Wedding',
        client: 'John Smith',
        price: '$2,500',
        status: 'active',
        startDate: 'Nov 15, 2024',
        dueDate: 'Dec 15, 2024',
        progress: 65,
        details: 'Full day wedding photography coverage including ceremony and reception.',
        location: 'Grand Plaza Hotel'
    },
    {
        id: 2,
        name: 'Corporate Event',
        description: 'Tech Corp Launch',
        client: 'Tech Corporation',
        price: '$5,000',
        status: 'delayed',
        startDate: 'Dec 1, 2024',
        dueDate: 'Dec 30, 2024',
        progress: 25,
        details: 'Product launch event coverage with video production.',
        location: 'Convention Center'
    },
    {
        id: 3,
        name: 'Family Portrait',
        description: 'Williams Family',
        client: 'Sarah Williams',
        price: '$800',
        status: 'completed',
        startDate: 'Nov 1, 2024',
        dueDate: 'Nov 10, 2024',
        progress: 100,
        details: 'Family portrait session with prints package.',
        location: 'City Park'
    }
];

// Utility Functions
function formatCurrency(amount) {
    return amount.startsWith('$') ? amount : `$${amount}`;
}

function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    const toastHtml = `
        <div class="custom-toast ${type}" role="alert">
            <div class="toast-body d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toast = new bootstrap.Toast(toastContainer.lastElementChild);
    toast.show();
    
    // Remove toast after it's hidden
    toastContainer.lastElementChild.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// Table Functions
function generateProjectRow(project) {
    return `
        <tr class="project-row" data-project-id="${project.id}">
            <td>
                <div class="d-flex align-items-center">
                    <div>
                        <h6 class="mb-1">${project.name}</h6>
                        <small class="text-muted">${project.description}</small>
                    </div>
                </div>
            </td>
            <td>${project.client}</td>
            <td>${formatCurrency(project.price)}</td>
            <td><span class="status-badge status-${project.status.toLowerCase()}">${project.status}</span></td>
            <td>${project.startDate}</td>
            <td>${project.dueDate}</td>
            <td>
                <div class="progress" title="${project.progress}% Complete">
                    <div class="progress-bar" role="progressbar" 
                         style="width: ${project.progress}%" 
                         aria-valuenow="${project.progress}" 
                         aria-valuemin="0" 
                         aria-valuemax="100"></div>
                </div>
            </td>
            <td>
                <div class="d-flex gap-2">
                    <button class="action-btn view-project" title="View Details">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="action-btn edit-project" title="Edit Project">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-btn delete-project" title="Delete Project">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function populateProjectsTable(projects) {
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = projects.map(project => generateProjectRow(project)).join('');
    
    // Add event listeners to action buttons
    attachActionListeners();
}

function generateProjectDetails(project) {
    return `
        <div class="row">
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Project Name</h6>
                    <p>${project.name}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Client</h6>
                    <p>${project.client}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Start Date</h6>
                    <p>${project.startDate}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Due Date</h6>
                    <p>${project.dueDate}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Status</h6>
                    <p><span class="status-badge status-${project.status.toLowerCase()}">${project.status}</span></p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Price</h6>
                    <p>${formatCurrency(project.price)}</p>
                </div>
            </div>
            <div class="col-12">
                <div class="project-detail-card">
                    <h6>Description</h6>
                    <p>${project.details}</p>
                </div>
            </div>
            <div class="col-12">
                <div class="project-detail-card">
                    <h6>Progress</h6>
                    <div class="progress mt-2">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${project.progress}%" 
                             aria-valuenow="${project.progress}" 
                             aria-valuemin="0" 
                             aria-valuemax="100"></div>
                    </div>
                    <p class="mt-2 text-muted">${project.progress}% Complete</p>
                </div>
            </div>
        </div>
    `;
}

// Event Listeners
function attachActionListeners() {
    // View Project
    document.querySelectorAll('.view-project').forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.closest('.project-row').dataset.projectId;
            const project = sampleProjects.find(p => p.id === parseInt(projectId));
            if (project) {
                document.getElementById('projectDetailsContent').innerHTML = generateProjectDetails(project);
                new bootstrap.Modal(document.getElementById('projectDetailsModal')).show();
            }
        });
    });

    // Delete Project
    document.querySelectorAll('.delete-project').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this project?')) {
                const row = this.closest('.project-row');
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    showToast('Project deleted successfully');
                }, 300);
            }
        });
    });

    // Edit Project
    document.querySelectorAll('.edit-project').forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.closest('.project-row').dataset.projectId;
            showToast('Edit functionality will be implemented soon', 'info');
        });
    });
}

// Search and Filter Functions
function searchProjects(searchTerm) {
    const projectRows = document.querySelectorAll('.project-row');
    searchTerm = searchTerm.toLowerCase().trim();

    projectRows.forEach(row => {
        const projectName = row.querySelector('h6').textContent.toLowerCase();
        const clientName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const description = row.querySelector('small').textContent.toLowerCase();
        
        if (projectName.includes(searchTerm) || 
            clientName.includes(searchTerm) || 
            description.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterByStatus(status) {
    const projectRows = document.querySelectorAll('.project-row');
    projectRows.forEach(row => {
        const projectStatus = row.querySelector('.status-badge').textContent.toLowerCase();
        row.style.display = !status || projectStatus === status.toLowerCase() ? '' : 'none';
    });
}

function sortProjects(criteria) {
    const tbody = document.getElementById('projectsTableBody');
    const rows = Array.from(tbody.querySelectorAll('.project-row'));

    rows.sort((a, b) => {
        switch (criteria) {
            case 'date':
                const dateA = new Date(a.querySelector('td:nth-child(5)').textContent);
                const dateB = new Date(b.querySelector('td:nth-child(5)').textContent);
                return dateA - dateB;
            case 'price':
                const priceA = parseFloat(a.querySelector('td:nth-child(3)').textContent.replace('$', '').replace(',', ''));
                const priceB = parseFloat(b.querySelector('td:nth-child(3)').textContent.replace('$', '').replace(',', ''));
                return priceB - priceA;
            case 'progress':
                const progressA = parseInt(a.querySelector('.progress-bar').style.width);
                const progressB = parseInt(b.querySelector('.progress-bar').style.width);
                return progressB - progressA;
            default:
                return 0;
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Populate initial data
        populateProjectsTable(sampleProjects);

        // Initialize search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => searchProjects(e.target.value));
        }

        // Initialize status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => filterByStatus(e.target.value));
        }

        // Initialize sort
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => sortProjects(e.target.value));
        }

        // Initialize tooltips
        const tooltips = [].slice.call(document.querySelectorAll('[title]'));
        tooltips.map(el => new bootstrap.Tooltip(el));

        showToast('Projects loaded successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Error loading projects. Please refresh the page.', 'error');
    }
});