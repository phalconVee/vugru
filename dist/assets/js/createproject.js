document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectSetupForm');
    const sections = document.querySelectorAll('.form-section');
    const steps = document.querySelectorAll('.step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressLine = document.querySelector('.progress-line');
    let currentStep = 1;

    // Dynamic form templates
    const projectTypeFields = {
        wedding: `
            <h3 class="mb-4">Wedding Details</h3>
            <div class="mb-4">
                <div class="form-floating">
                    <input type="text" class="form-control" id="ceremonyLocation" placeholder="Ceremony Location" required>
                    <label for="ceremonyLocation">Ceremony Location</label>
                </div>
            </div>
            <div class="mb-4">
                <div class="form-floating">
                    <textarea class="form-control" id="keyMoments" style="height: 100px" placeholder="Key Moments"></textarea>
                    <label for="keyMoments">Key Moments to Capture</label>
                </div>
            </div>
        `,
        corporate: `
            <h3 class="mb-4">Corporate Video Details</h3>
            <div class="mb-4">
                <div class="form-floating">
                    <input type="text" class="form-control" id="companyName" placeholder="Company Name" required>
                    <label for="companyName">Company Name</label>
                </div>
            </div>
            <div class="mb-4">
                <div class="form-floating">
                    <select class="form-control" id="videoType" required>
                        <option value="">Select video type</option>
                        <option value="promotional">Promotional</option>
                        <option value="training">Training</option>
                        <option value="product">Product Demo</option>
                    </select>
                    <label for="videoType">Video Type</label>
                </div>
            </div>
        `
    };

    // Update progress line
    function updateProgressLine() {
        const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
        progressLine.style.width = `${progress}%`;
    }

    // Validate current section
    function validateSection(section) {
        let isValid = true;
        const inputs = section.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    // Handle next button click
    nextBtn.addEventListener('click', () => {
        const currentSection = document.querySelector(`.form-section[data-step="${currentStep}"]`);
        
        if (!validateSection(currentSection)) {
            return;
        }

        if (currentStep === 1) {
            // Load dynamic fields based on project type
            const projectType = document.getElementById('projectType').value;
            const detailsSection = document.querySelector('.form-section[data-step="2"]');
            detailsSection.innerHTML = projectTypeFields[projectType] || '<h3 class="mb-4">Project Details</h3>';
        }

        currentSection.classList.remove('active');
        steps[currentStep - 1].classList.add('completed');
        currentStep++;
        
        if (currentStep > 1) {
            prevBtn.style.display = 'block';
        }
        
        if (currentStep === 3) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        }

        document.querySelector(`.form-section[data-step="${currentStep}"]`).classList.add('active');
        steps[currentStep - 1].classList.add('active');
        updateProgressLine();
    });

    // Handle previous button click
    prevBtn.addEventListener('click', () => {
        document.querySelector(`.form-section[data-step="${currentStep}"]`).classList.remove('active');
        steps[currentStep - 1].classList.remove('active');
        currentStep--;
        
        if (currentStep === 1) {
            prevBtn.style.display = 'none';
        }
        
        if (currentStep < 3) {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }

        document.querySelector(`.form-section[data-step="${currentStep}"]`).classList.add('active');
        steps[currentStep - 1].classList.remove('completed');
        updateProgressLine();
    });

    // Handle client invitation toggle
    document.getElementById('inviteClient').addEventListener('change', function() {
        const emailSection = document.getElementById('clientEmailSection');
        emailSection.classList.toggle('d-none', !this.checked);
        
        const emailInput = document.getElementById('clientEmail');
        emailInput.required = this.checked;
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateSection(document.querySelector('.form-section[data-step="3"]'))) {
            // Show success message
            const alert = document.createElement('div');
            alert.className = 'alert alert-success mt-3 animate__animated animate__fadeIn';
            alert.textContent = 'Project created successfully! Redirecting to project overview...';

            if (document.getElementById('clientEmail') !== '') {
                alert.textContent = 'Project created successfully! Email has been sent to the client with the project details for collaboration or updates';
            }

            form.appendChild(alert);

            // // Simulate redirect
            // setTimeout(() => {
            //     alert.textContent = 'Redirecting...';
            // }, 2000);
        }
    });

    // Set minimum date for start date
    const startDateInput = document.getElementById('startDate');
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
});