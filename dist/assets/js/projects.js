document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const projectRows = document.querySelectorAll('.project-row');

        projectRows.forEach(row => {
            const projectName = row.querySelector('h6').textContent.toLowerCase();
            const clientName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            
            if (projectName.includes(searchTerm) || clientName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Filter functionality
    const statusFilter = document.querySelector('.filter-select');
    statusFilter.addEventListener('change', function(e) {
        const filterValue = e.target.value.toLowerCase();
        const projectRows = document.querySelectorAll('.project-row');

        projectRows.forEach(row => {
            const status = row.querySelector('.status-badge').textContent.toLowerCase();
            
            if (!filterValue || status === filterValue) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});