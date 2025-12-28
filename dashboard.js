/**
 * Dashboard Logic for Project Management
 * Handles CRUD operations and synchronization with localStorage
 */
document.addEventListener('DOMContentLoaded', () => {
    const projectForm = document.getElementById('project-form');
    const projectsList = document.getElementById('projects-list');
    const emptyState = document.getElementById('empty-state');
    const formTitle = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const editIdInput = document.getElementById('edit-id');

    // MATCH THIS KEY EXACTLY WITH index.html
    const STORAGE_KEY = 'portfolioProjects';

    // Load projects from localStorage
    let projects = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    /**
     * Renders the list of projects in the admin panel
     */
    function renderProjects() {
        // Clear current list
        projectsList.innerHTML = '';
        
        // Toggle empty state visibility
        if (projects.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        } else {
            emptyState.classList.add('hidden');
        }

        // Generate project cards
        projects.forEach((p) => {
            const card = document.createElement('div');
            card.className = 'glass p-5 rounded-2xl flex items-center justify-between group border border-transparent hover:border-white/10 transition-all';
            card.innerHTML = `
                <div class="flex flex-col">
                    <h3 class="font-bold text-white text-base">${p.title}</h3>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded uppercase font-bold">${p.category}</span>
                        <span class="text-[10px] text-gray-500 font-mono">${new Date(p.id).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="editProject(${p.id})" class="px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-600/20 transition-colors">Edit</button>
                    <button onclick="deleteProject(${p.id})" class="px-3 py-1.5 bg-red-600/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-600/20 transition-colors">Delete</button>
                </div>
            `;
            projectsList.appendChild(card);
        });
        
        // Safety check for Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    /**
     * Create or Update Project
     */
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const projectData = {
            id: editIdInput.value ? parseInt(editIdInput.value) : Date.now(),
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t !== ""),
            liveUrl: document.getElementById('liveUrl').value,
            sourceUrl: document.getElementById('sourceUrl').value,
            isBig: document.getElementById('isBig').checked
        };

        if (editIdInput.value) {
            // Edit Mode
            const idx = projects.findIndex(p => p.id === projectData.id);
            if (idx !== -1) projects[idx] = projectData;
            resetForm();
        } else {
            // Create Mode
            projects.unshift(projectData);
        }

        // Persist and Refresh
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        projectForm.reset();
        renderProjects();
    });

    /**
     * Edit Helper (Attached to window for HTML access)
     */
    window.editProject = (id) => {
        const p = projects.find(proj => proj.id === id);
        if (!p) return;

        formTitle.textContent = "Update Project Entry";
        submitBtn.textContent = "Save Changes";
        cancelBtn.classList.remove('hidden');
        
        editIdInput.value = p.id;
        document.getElementById('title').value = p.title;
        document.getElementById('category').value = p.category;
        document.getElementById('description').value = p.description;
        document.getElementById('tags').value = p.tags.join(', ');
        document.getElementById('liveUrl').value = p.liveUrl;
        document.getElementById('sourceUrl').value = p.sourceUrl;
        document.getElementById('isBig').checked = p.isBig;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Delete Helper (Attached to window for HTML access)
     */
    window.deleteProject = (id) => {
        if (confirm('Are you sure you want to remove this project? This will also remove it from your live portfolio.')) {
            projects = projects.filter(p => p.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            renderProjects();
            // Clear form if the deleted project was being edited
            if (editIdInput.value == id) resetForm();
        }
    };

    // Form Reset
    cancelBtn.addEventListener('click', resetForm);
    function resetForm() {
        projectForm.reset();
        editIdInput.value = "";
        formTitle.textContent = "Add New Project";
        submitBtn.textContent = "Save Project";
        cancelBtn.classList.add('hidden');
    }

    // Initial Load
    renderProjects();
});
