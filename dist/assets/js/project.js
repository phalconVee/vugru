class ProjectManager {
    constructor() {
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.initializeElements();
        this.initializeModals();
        this.attachEventListeners();
        this.loadProjects();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            tableBody: document.getElementById('projectsTableBody'),
            pagination: document.getElementById('pagination'),
            pageInfo: document.getElementById('pageInfo'),
            emptyState: document.getElementById('emptyState'),
            searchInput: document.getElementById('searchInput'),
            statusFilter: document.getElementById('statusFilter'),
            sortFilter: document.getElementById('sortFilter'),
            editForm: document.getElementById('editProjectForm'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn')
        };
    }

    // Initialize Bootstrap modals
    initializeModals() {
        this.modals = {
            view: new bootstrap.Modal(document.getElementById('viewProjectModal')),
            edit: new bootstrap.Modal(document.getElementById('editProjectModal')),
            delete: new bootstrap.Modal(document.getElementById('deleteConfirmModal'))
        };
    }

    // Get all projects from localStorage
    getAllProjects() {
        const data = localStorage.getItem('projectsData');
        return data ? JSON.parse(data).projects : [];
    }

    // Save project to localStorage
    saveProject(projectData) {
        let existingData = JSON.parse(localStorage.getItem('projectsData')) || { projects: [] };
        existingData.projects.push(projectData);
        localStorage.setItem('projectsData', JSON.stringify(existingData));
    }

    // Update project in localStorage
    updateProject(projectId, updatedData) {
        let existingData = JSON.parse(localStorage.getItem('projectsData'));
        const projectIndex = existingData.projects.findIndex(p => p.id === projectId);
        
        if (projectIndex !== -1) {
            existingData.projects[projectIndex] = {
                ...existingData.projects[projectIndex],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('projectsData', JSON.stringify(existingData));
            return true;
        }
        return false;
    }

    // Delete project from localStorage
    deleteProject(projectId) {
        let existingData = JSON.parse(localStorage.getItem('projectsData'));
        existingData.projects = existingData.projects.filter(p => p.id !== projectId);
        localStorage.setItem('projectsData', JSON.stringify(existingData));
    }

    // Load projects with pagination
    loadProjects() {
        let projects = this.getAllProjects();
        
        // Apply filters
        const searchTerm = this.elements.searchInput.value.toLowerCase();
        const statusFilter = this.elements.statusFilter.value;
        const sortFilter = this.elements.sortFilter.value;

        // Filter projects
        if (searchTerm) {
            projects = projects.filter(project => 
                project.projectName.toLowerCase().includes(searchTerm) ||
                project.clientInfo.name.toLowerCase().includes(searchTerm)
            );
        }

        if (statusFilter) {
            projects = projects.filter(project => project.status === statusFilter);
        }

        // Sort projects
        if (sortFilter) {
            projects.sort((a, b) => {
                switch (sortFilter) {
                    case 'date':
                        return new Date(a.dates.start) - new Date(b.dates.start);
                    case 'price':
                        return b.price - a.price;
                    case 'progress':
                        return b.progress - a.progress;
                    default:
                        return 0;
                }
            });
        }

        // Pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedProjects = projects.slice(startIndex, endIndex);

        this.renderProjects(paginatedProjects, projects.length);
    }

    // Render projects to table
    renderProjects(projects, totalCount) {
        if (totalCount === 0) {
            this.showEmptyState();
            return;
        }

        this.elements.emptyState.classList.add('d-none');
        this.elements.tableBody.innerHTML = projects.map(project => this.generateProjectRow(project)).join('');
        this.updatePagination(totalCount);
        this.updatePageInfo(
            (this.currentPage - 1) * this.itemsPerPage + 1,
            Math.min(this.currentPage * this.itemsPerPage, totalCount),
            totalCount
        );
    }

    // Generate table row HTML
    generateProjectRow(project) {
        return `
            <tr data-project-id="${project.id}">
                <td>
                    <div class="d-flex align-items-center">
                        <div>
                            <h6 class="mb-1">${project.projectName}</h6>
                            <small class="text-muted">${project.description || 'No description'}</small>
                        </div>
                    </div>
                </td>
                <td>${project.clientInfo.name}</td>
                <td>${formatPrice(project.price)}</td>
                <td><span class="status-badge status-${project.status.toLowerCase()}">${project.status}</span></td>
                <td>${formatDate(project.dates.start)}</td>
                <td>${formatDate(project.dates.due)}</td>
                <td>
                    <div class="progress" title="${project.progress}% Complete">
                        <div class="progress-bar" role="progressbar" style="width: ${project.progress}%" 
                             aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100"></div>
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

    // Show empty state
    showEmptyState() {
        this.elements.tableBody.innerHTML = '';
        this.elements.emptyState.classList.remove('d-none');
        this.elements.pagination.innerHTML = '';
        this.elements.pageInfo.textContent = '0-0 of 0';
    }

    // Update pagination
    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        let paginationHtml = '';

        if (totalPages > 1) {
            // Previous button
            paginationHtml += `
                <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${this.currentPage - 1}">Previous</a>
                </li>
            `;

            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                if (
                    i === 1 || 
                    i === totalPages || 
                    (i >= this.currentPage - 1 && i <= this.currentPage + 1)
                ) {
                    paginationHtml += `
                        <li class="page-item ${this.currentPage === i ? 'active' : ''}">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                        </li>
                    `;
                } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                    paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                }
            }

            // Next button
            paginationHtml += `
                <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${this.currentPage + 1}">Next</a>
                </li>
            `;
        }

        this.elements.pagination.innerHTML = paginationHtml;
    }

    // Update page info text
    updatePageInfo(start, end, total) {
        this.elements.pageInfo.textContent = `${start}-${end} of ${total}`;
    }

    // Handle project actions
    handleProjectAction(action, projectId) {
        const project = this.getAllProjects().find(p => p.id === projectId);
        if (!project) return;

        switch (action) {
            case 'view':
                this.showProjectDetails(project);
                break;
            case 'edit':
                this.showEditForm(project);
                break;
            case 'delete':
                this.showDeleteConfirmation(projectId);
                break;
        }
    }

    // Show project details in modal
    showProjectDetails(project) {
        const modalContent = document.getElementById('projectDetailsContent');
        modalContent.innerHTML = `
        <div class="row g-4">
            <!-- Project Basic Info -->
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Project Name</h6>
                    <p>${project.projectName}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Project Type</h6>
                    <p>${project.projectType}</p>
                </div>
            </div>

            <!-- Client Information -->
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Client Name</h6>
                    <p>${project.clientInfo.name}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Client Email</h6>
                    <p>${project.clientInfo.email}</p>
                </div>
            </div>

            <!-- Dates -->
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Start Date</h6>
                    <p>${formatDate(project.dates.start)}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Due Date</h6>
                    <p>${formatDate(project.dates.due)}</p>
                </div>
            </div>

            <!-- Status and Progress -->
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Status</h6>
                    <p><span class="status-badge status-${project.status.toLowerCase()}">${project.status}</span></p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="project-detail-card">
                    <h6>Price</h6>
                    <p>${formatPrice(project.price)}</p>
                </div>
            </div>

            <!-- Progress -->
            <div class="col-12">
                <div class="project-detail-card">
                    <h6>Progress</h6>
                    <div class="progress mt-2" style="height: 8px;">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${project.progress}%" 
                             aria-valuenow="${project.progress}" 
                             aria-valuemin="0" 
                             aria-valuemax="100"></div>
                    </div>
                    <p class="text-end mt-1 text-muted">${project.progress}% Complete</p>
                </div>
            </div>

            <!-- Description -->
            <div class="col-12">
                <div class="project-detail-card">
                    <h6>Description</h6>
                    <p>${project.description || 'No description provided'}</p>
                </div>
            </div>

            <!-- Timeline -->
            <div class="col-12">
                <div class="project-detail-card">
                    <h6>Timeline</h6>
                    <div class="d-flex justify-content-between text-muted mt-2">
                        <small>Start: ${formatDate(project.dates.start)}</small>
                        <small>Due: ${formatDate(project.dates.due)}</small>
                    </div>
                    <div class="progress mt-2" style="height: 4px;">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${this.calculateTimeProgress(project.dates.start, project.dates.due)}%" 
                             aria-valuenow="${this.calculateTimeProgress(project.dates.start, project.dates.due)}" 
                             aria-valuemin="0" 
                             aria-valuemax="100"></div>
                    </div>
                </div>
            </div>

            <!-- Additional Info -->
            ${project.location ? `
                <div class="col-12">
                    <div class="project-detail-card">
                        <h6>Location</h6>
                        <p>${project.location}</p>
                    </div>
                </div>
            ` : ''}

            <!-- Metadata -->
            <div class="col-12">
                <div class="project-detail-card">
                    <h6>Project Details</h6>
                    <div class="row g-3">
                        <div class="col-6">
                            <small class="text-muted d-block">Created</small>
                            <span>${formatDate(project.createdAt)}</span>
                        </div>
                        ${project.updatedAt ? `
                            <div class="col-6">
                                <small class="text-muted d-block">Last Updated</small>
                                <span>${formatDate(project.updatedAt)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

        // Initialize any tooltips or popovers
        const tooltipTriggerList = [].slice.call(modalContent.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

        
        this.modals.view.show();
    }

    // Helper function to calculate timeline progress
    calculateTimeProgress(startDate, dueDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(dueDate).getTime();
        const now = new Date().getTime();

        if (now <= start) return 0;
        if (now >= end) return 100;

        const total = end - start;
        const current = now - start;
        return Math.round((current / total) * 100);
    }

    // Show edit form with project data
    showEditForm(project) {
        // Populate form fields
        document.getElementById('editProjectId').value = project.id;
        document.getElementById('editProjectName').value = project.projectName;
        document.getElementById('editProjectType').value = project.projectType;
        document.getElementById('editDescription').value = project.description || '';
        document.getElementById('editStartDate').value = project.dates.start;
        document.getElementById('editDueDate').value = project.dates.due;
        document.getElementById('editPrice').value = project.price;
        document.getElementById('editStatus').value = project.status;
        document.getElementById('editProgress').value = project.progress || 0;

        // Update progress value display
        document.getElementById('progressValue').textContent = `${project.progress || 0}%`;

        // Add event listener for progress slider
        const progressSlider = document.getElementById('editProgress');
        progressSlider.addEventListener('input', function() {
            document.getElementById('progressValue').textContent = `${this.value}%`;
        });

        // Add form submission handler
        const form = document.getElementById('editProjectForm');
        form.onsubmit = async (e) => {
            e.preventDefault();

            // const submitButton = form.querySelector('button[type="submit"]');
            // const spinner = form.querySelector('.spinner-border');
            
            try {
                // Show loading state
                // submitButton.disabled = true;
                // spinner.classList.remove('d-none');

                // Gather form data
                const updatedProject = {
                    id: project.id,
                    projectName: document.getElementById('editProjectName').value,
                    projectType: document.getElementById('editProjectType').value,
                    description: document.getElementById('editDescription').value,
                    dates: {
                        start: document.getElementById('editStartDate').value,
                        due: document.getElementById('editDueDate').value
                    },
                    price: parseFloat(document.getElementById('editPrice').value),
                    status: document.getElementById('editStatus').value,
                    progress: parseInt(document.getElementById('editProgress').value),
                    updatedAt: new Date().toISOString()
                };

                // Update project in localStorage
                this.updateProject(project.id, updatedProject);

                // Show success message
                showToast('Project updated successfully', 'success');

                // Close modal and refresh table
                this.modals.edit.hide();
                this.loadProjects();

            } catch (error) {
                console.error('Error updating project:', error);
                showToast('Error updating project', 'error');
            }
        };

        // Add date validation
        const startDateInput = document.getElementById('editStartDate');
        const dueDateInput = document.getElementById('editDueDate');

        startDateInput.addEventListener('change', function() {
            if (dueDateInput.value && this.value > dueDateInput.value) {
                dueDateInput.value = this.value;
                showToast('Due date cannot be earlier than start date', 'error');
            }
        });

        dueDateInput.addEventListener('change', function() {
            if (startDateInput.value && this.value < startDateInput.value) {
                this.value = startDateInput.value;
                showToast('Due date cannot be earlier than start date', 'error');
            }
        });

        // Add price validation
        const priceInput = document.getElementById('editPrice');
        priceInput.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });


        this.modals.edit.show();
    }

    // Show delete confirmation
    showDeleteConfirmation(projectId) {
        this.elements.confirmDeleteBtn.dataset.projectId = projectId;
        this.modals.delete.show();
    }

    // Attach event listeners
    attachEventListeners() {
        // Pagination clicks
        this.elements.pagination.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('page-link')) {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.loadProjects();
                }
            }
        });

        // Search input
        this.elements.searchInput.addEventListener('input', () => {
            this.currentPage = 1;
            this.loadProjects();
        });

        // Filters
        this.elements.statusFilter.addEventListener('change', () => this.loadProjects());
        this.elements.sortFilter.addEventListener('change', () => this.loadProjects());

        // Table actions
        this.elements.tableBody.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.action-btn');
            if (!actionBtn) return;

            const projectId = actionBtn.closest('tr').dataset.projectId;
            if (actionBtn.classList.contains('view-project')) {
                this.handleProjectAction('view', projectId);
            } else if (actionBtn.classList.contains('edit-project')) {
                this.handleProjectAction('edit', projectId);
            } else if (actionBtn.classList.contains('delete-project')) {
                this.handleProjectAction('delete', projectId);
            }
        });

        // Confirm delete
        this.elements.confirmDeleteBtn.addEventListener('click', (e) => {
            const projectId = e.target.dataset.projectId;
            this.deleteProject(projectId);
            this.modals.delete.hide();
            this.loadProjects();
            showToast('Project deleted successfully', 'success');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectManager();
});