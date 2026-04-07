// Adi-CodeVerse - Developer Platform JavaScript

// Utility Functions
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Theme Toggle Function
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update theme toggle icon
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = newTheme === 'dark' ? '🌙' : '☀️';
    }
    
    showToast(`Switched to ${newTheme} mode`, 'success');
}

// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set theme toggle icon
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = savedTheme === 'dark' ? '🌙' : '☀️';
    }
}

// Authentication Functions
function signup() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!username || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('adiCodeverseUsers') || '[]');
    
    // Check if username already exists
    if (users.find(user => user.username === username)) {
        showToast('Username already exists', 'error');
        return;
    }

    // Add new user
    const newUser = {
        username,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('adiCodeverseUsers', JSON.stringify(users));
    
    showToast('Account created successfully! Redirecting to login...', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        showToast('Please enter username and password', 'error');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('adiCodeverseUsers') || '[]');
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Set login session
        localStorage.setItem('adiCodeverseCurrentUser', JSON.stringify({
            username: user.username,
            loginTime: new Date().toISOString()
        }));
        
        showToast('Login successful! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showToast('Invalid username or password', 'error');
    }
}

function logout() {
    localStorage.removeItem('adiCodeverseCurrentUser');
    showToast('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

function checkAuth() {
    const currentUser = localStorage.getItem('adiCodeverseCurrentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// Code Editor Functions
function runFullCode() {
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;
    
    const outputFrame = document.getElementById('outputFrame');
    
    if (!htmlCode && !cssCode && !jsCode) {
        showToast('Please write some code first', 'error');
        return;
    }
    
    const fullCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Output</title>
    <style>
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    <script>
        try {
            ${jsCode}
        } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<div style="color: red; font-family: monospace; padding: 10px; background: #ffe6e6; margin: 10px; border-radius: 5px;">JavaScript Error: ' + error.message + '</div>';
        }
    </script>
</body>
</html>`;
    
    outputFrame.srcdoc = fullCode;
    showToast('Code executed successfully!', 'success');
}

// Project Management Functions
function saveProject() {
    const user = checkAuth();
    if (!user) {
        showToast('Please login to save projects', 'error');
        return;
    }

    const projectName = prompt('Enter project name:');
    if (!projectName || !projectName.trim()) {
        showToast('Project name cannot be empty', 'error');
        return;
    }

    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;

    if (!htmlCode && !cssCode && !jsCode) {
        showToast('Cannot save empty project', 'error');
        return;
    }

    const project = {
        id: Date.now(),
        name: projectName.trim(),
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        username: user.username
    };

    const projects = JSON.parse(localStorage.getItem('adiCodeverseProjects') || '[]');
    projects.push(project);
    localStorage.setItem('adiCodeverseProjects', JSON.stringify(projects));

    showToast(`Project "${projectName}" saved successfully!`, 'success');
}

function loadProjects() {
    const user = checkAuth();
    if (!user) return;

    const projects = JSON.parse(localStorage.getItem('adiCodeverseProjects') || '[]');
    const userProjects = projects.filter(p => p.username === user.username);

    const projectsContainer = document.getElementById('projectsList');
    if (projectsContainer) {
        if (userProjects.length === 0) {
            projectsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📁</div>
                    <h3>No projects yet</h3>
                    <p>Create your first project in the editor!</p>
                </div>
            `;
        } else {
            projectsContainer.innerHTML = userProjects.map(project => `
                <div class="project-item" data-project-id="${project.id}">
                    <div class="project-info">
                        <h4>${project.name}</h4>
                        <p>Created: ${new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-secondary" onclick="openProject(${project.id})">Open</button>
                        <button class="delete-btn" onclick="deleteProject(${project.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function openProject(projectId) {
    const projects = JSON.parse(localStorage.getItem('adiCodeverseProjects') || '[]');
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
        // Store project in sessionStorage to load on editor page
        sessionStorage.setItem('projectToLoad', JSON.stringify(project));
        window.location.href = 'editor.html';
    }
}

function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    const projects = JSON.parse(localStorage.getItem('adiCodeverseProjects') || '[]');
    const updatedProjects = projects.filter(p => p.id !== projectId);
    localStorage.setItem('adiCodeverseProjects', JSON.stringify(updatedProjects));

    showToast('Project deleted successfully', 'success');
    loadProjects(); // Refresh the projects list
}

function loadProjectFromSession() {
    const projectToLoad = sessionStorage.getItem('projectToLoad');
    if (projectToLoad) {
        const project = JSON.parse(projectToLoad);
        
        if (document.getElementById('htmlCode')) {
            document.getElementById('htmlCode').value = project.html || '';
            document.getElementById('cssCode').value = project.css || '';
            document.getElementById('jsCode').value = project.js || '';
            
            showToast(`Project "${project.name}" loaded successfully!`, 'success');
            
            // Clear from sessionStorage
            sessionStorage.removeItem('projectToLoad');
        }
    }
}

// Search Function
function searchProjects() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        const projectName = item.querySelector('h4').textContent.toLowerCase();
        if (projectName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Enhanced Session Protection
function checkAuth() {
    const currentUser = localStorage.getItem('adiCodeverseCurrentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Check authentication on protected pages
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html' || currentPage === 'editor.html' || currentPage === 'community.html' || currentPage === 'learn.html' || currentPage === 'jobs.html' || currentPage === 'profile.html') {
        loadUserData();
        loadProjects();
        
        // Load project from session if coming from dashboard
        if (currentPage === 'editor.html') {
            loadProjectFromSession();
        }
        
        // Load profile data if on profile page
        if (currentPage === 'profile.html') {
            // Profile loading is handled in profile.html
        }
    }
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchProjects);
    }
    
    // Add enter key support for forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            signup();
        });
    }
});

// Enhanced Navigation functions
function navigateTo(page) {
    window.location.href = page;
}

// Profile Management Functions
function updateProfile() {
    const user = checkAuth();
    if (!user) {
        showToast('Please login to update profile', 'error');
        return;
    }

    const profileData = {
        bio: document.getElementById('userBio').value.trim(),
        skills: document.getElementById('userSkills').value.trim(),
        github: document.getElementById('githubProfile').value.trim(),
        linkedin: document.getElementById('linkedinProfile').value.trim(),
        location: document.getElementById('userLocation').value.trim(),
        updatedAt: new Date().toISOString()
    };

    // Save profile data
    const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
    profiles[user.username] = profileData;
    localStorage.setItem('profiles', JSON.stringify(profiles));

    showToast('Profile updated successfully! ✨', 'success');
}

function loadProfile() {
    const user = checkAuth();
    if (!user) return;

    // Load profile data
    const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
    const profile = profiles[user.username] || {
        bio: '',
        skills: '',
        github: '',
        linkedin: '',
        location: ''
    };

    // Update UI
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.textContent = user.username;
    
    const userBio = document.getElementById('userBio');
    if (userBio) userBio.value = profile.bio;
    
    const userSkills = document.getElementById('userSkills');
    if (userSkills) userSkills.value = profile.skills;
    
    const githubProfile = document.getElementById('githubProfile');
    if (githubProfile) githubProfile.value = profile.github;
    
    const linkedinProfile = document.getElementById('linkedinProfile');
    if (linkedinProfile) linkedinProfile.value = profile.linkedin;
    
    const userLocation = document.getElementById('userLocation');
    if (userLocation) userLocation.value = profile.location;

    // Load statistics
    loadUserStats();
}

function loadUserStats() {
    const user = JSON.parse(localStorage.getItem('adiCodeverseCurrentUser') || '{}');
    if (!user.username) return;

    // Count projects
    const projects = JSON.parse(localStorage.getItem('adiCodeverseProjects') || '[]');
    const userProjects = projects.filter(p => p.username === user.username);
    const projectsCount = document.getElementById('projectsCount');
    if (projectsCount) projectsCount.textContent = userProjects.length;

    // Count posts
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const userPosts = posts.filter(p => p.author === user.username);
    const postsCount = document.getElementById('postsCount');
    if (postsCount) postsCount.textContent = userPosts.length;

    // Count job applications
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const userApplications = applications.filter(a => a.username === user.username);
    const applicationsCount = document.getElementById('applicationsCount');
    if (applicationsCount) applicationsCount.textContent = userApplications.length;
}

// Community Functions
function addPost() {
    const user = checkAuth();
    if (!user) {
        showToast('Please login to post', 'error');
        return;
    }

    const content = document.getElementById('postContent');
    if (content && content.value.trim()) {
        const post = {
            id: Date.now(),
            content: content.value.trim(),
            author: user.username,
            timestamp: new Date().toISOString(),
            likes: 0,
            liked: false
        };

        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        posts.unshift(post);
        localStorage.setItem('posts', JSON.stringify(posts));

        content.value = '';
        showToast('Post shared successfully!', 'success');
        loadPosts();
    }
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const container = document.getElementById('postsContainer');
    
    if (container) {
        if (posts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <h3>No posts yet</h3>
                    <p>Be the first to share something with the community!</p>
                </div>
            `;
        } else {
            container.innerHTML = posts.map(post => `
                <div class="post-item" data-post-id="${post.id}">
                    <div class="post-header">
                        <div>
                            <span class="post-author">${post.author}</span>
                            <span class="post-time">${new Date(post.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="post-content">${post.content}</div>
                    <div class="post-actions">
                        <button class="like-button ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                            ${post.liked ? '❤️' : '🤍'} ${post.likes}
                        </button>
                        ${post.author === JSON.parse(localStorage.getItem('adiCodeverseCurrentUser') || '{}').username ? 
                            `<button class="delete-post-btn" onclick="deletePost(${post.id})">Delete</button>` : ''}
                    </div>
                </div>
            `).join('');
        }
    }
}

function toggleLike(postId) {
    const user = checkAuth();
    if (!user) {
        showToast('Please login to like posts', 'error');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        if (!posts[postIndex].liked) {
            posts[postIndex].likes++;
            posts[postIndex].liked = true;
        } else {
            posts[postIndex].likes--;
            posts[postIndex].liked = false;
        }
        
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}

function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = posts.filter(p => p.id !== postId);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    showToast('Post deleted successfully', 'success');
    loadPosts();
}

// Jobs Functions
function applyForJob(jobId) {
    const user = checkAuth();
    if (!user) {
        showToast('Please login to apply for jobs', 'error');
        return;
    }

    const jobsData = [
        { id: 1, title: "Frontend Developer", company: "TechCorp Solutions" },
        { id: 2, title: "Full Stack Developer", company: "Digital Innovations Inc" },
        { id: 3, title: "JavaScript Developer", company: "StartupHub" },
        { id: 4, title: "React Developer", company: "WebCraft Agency" },
        { id: 5, title: "UI/UX Designer", company: "Creative Studios" },
        { id: 6, title: "Backend Developer", company: "DataFlow Systems" }
    ];
    
    const job = jobsData.find(j => j.id === jobId);
    if (job) {
        const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
        const application = {
            id: Date.now(),
            jobId: jobId,
            jobTitle: job.title,
            company: job.company,
            username: user.username,
            appliedAt: new Date().toISOString()
        };
        
        if (applications.some(app => app.jobId === jobId && app.username === user.username)) {
            showToast('You have already applied for this position', 'error');
            return;
        }
        
        applications.push(application);
        localStorage.setItem('jobApplications', JSON.stringify(applications));
        
        showToast(`Successfully applied for ${job.title} at ${job.company}! 🎉`, 'success');
    }
}

// Learning Functions
function toggleCourse(courseId) {
    const content = document.getElementById(`${courseId}-content`);
    const allContents = document.querySelectorAll('.course-content');
    
    if (content) {
        // Hide all other course contents
        allContents.forEach(c => {
            if (c !== content) {
                c.classList.remove('visible');
                c.classList.add('hidden');
            }
        });
        
        // Toggle selected course content
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            content.classList.add('visible');
            updateProgress(courseId);
        } else {
            content.classList.remove('visible');
            content.classList.add('hidden');
        }
    }
}

function updateProgress(courseId) {
    const user = checkAuth();
    if (!user) return;

    const progress = JSON.parse(localStorage.getItem('learningProgress') || '{}');
    if (!progress[user.username]) {
        progress[user.username] = {};
    }
    
    if (!progress[user.username][courseId]) {
        progress[user.username][courseId] = {
            started: true,
            startDate: new Date().toISOString(),
            completed: false
        };
    }
    
    localStorage.setItem('learningProgress', JSON.stringify(progress));
    showToast(`Started learning ${courseId.toUpperCase()}! 📚`, 'success');
}

// Dashboard Functions
function loadUserData() {
    const user = checkAuth();
    if (user) {
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement) {
            welcomeElement.textContent = `Welcome, ${user.username}!`;
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to run code in editor
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const runButton = document.getElementById('runButton');
        if (runButton) {
            runFullCode();
        }
    }
    
    // Ctrl/Cmd + S to save project
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveButton = document.getElementById('saveButton');
        if (saveButton) {
            saveProject();
        }
    }
});

// Navigation functions
function navigateTo(page) {
    window.location.href = page;
}

// Project management (for future features)
function saveProject() {
    const user = checkAuth();
    if (!user) return;
    
    const projectName = prompt('Enter project name:');
    if (!projectName) return;
    
    const project = {
        name: projectName,
        html: document.getElementById('htmlCode').value,
        css: document.getElementById('cssCode').value,
        js: document.getElementById('jsCode').value,
        createdAt: new Date().toISOString(),
        username: user.username
    };
    
    const projects = JSON.parse(localStorage.getItem('adiCodeverseProjects') || '[]');
    projects.push(project);
    localStorage.setItem('adiCodeverseProjects', JSON.stringify(projects));
    
    showToast('Project saved successfully!', 'success');
}

function loadProjects() {
    const user = checkAuth();
    if (!user) return;
    
    const projects = JSON.parse(localStorage.getItem('adiCodeverseProjects') || '[]');
    const userProjects = projects.filter(p => p.username === user.username);
    
    const projectsContainer = document.getElementById('projectsList');
    if (projectsContainer) {
        if (userProjects.length === 0) {
            projectsContainer.innerHTML = '<p>No projects yet. Create your first project in the editor!</p>';
        } else {
            projectsContainer.innerHTML = userProjects.map(project => `
                <div class="project-item">
                    <h4>${project.name}</h4>
                    <p>Created: ${new Date(project.createdAt).toLocaleDateString()}</p>
                    <button class="btn btn-secondary" onclick="loadProject('${project.name}')">Load</button>
                </div>
            `).join('');
        }
    }
}

function loadProject(projectName) {
    const projects = JSON.parse(localStorage.getItem('adiCodeverseProjects') || '[]');
    const project = projects.find(p => p.name === projectName);
    
    if (project) {
        if (document.getElementById('htmlCode')) {
            document.getElementById('htmlCode').value = project.html || '';
            document.getElementById('cssCode').value = project.css || '';
            document.getElementById('jsCode').value = project.js || '';
            showToast('Project loaded successfully!', 'success');
        } else {
            showToast('Please go to the editor to load this project', 'error');
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to run code in editor
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const runButton = document.getElementById('runButton');
        if (runButton) {
            runFullCode();
        }
    }
    
    // Ctrl/Cmd + S to save project
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveButton = document.getElementById('saveButton');
        if (saveButton) {
            saveProject();
        }
    }
});
