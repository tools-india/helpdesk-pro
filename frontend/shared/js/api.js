// ============================================
// HELPDESK SYSTEM - SHARED API UTILITIES
// ============================================

const API_BASE_URL = '/api';

// ========== API Request Helper ==========
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge options
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
        delete finalOptions.headers['Content-Type'];
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ========== Authentication APIs ==========
const AuthAPI = {
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    verifyOTP: (data) => apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    resendOTP: (userId) => apiRequest('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ userId }),
    }),

    verifyEmail: (token) => apiRequest(`/auth/verify-email/${token}`),

    getMe: () => apiRequest('/auth/me'),
};

// ========== Employee Authentication APIs ==========
const EmployeeAuthAPI = {
    login: (credentials) => apiRequest('/employees/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    signup: (employeeData) => apiRequest('/employees/signup', {
        method: 'POST',
        body: JSON.stringify(employeeData),
    }),
};

// ========== Employee APIs ==========
const EmployeeAPI = {
    create: (employeeData) => apiRequest('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
    }),

    getAll: () => apiRequest('/employees'),

    getOne: (id) => apiRequest(`/employees/${id}`),

    getByEmpId: (employeeId) => apiRequest(`/employees/by-emp-id/${employeeId}`),

    update: (id, data) => apiRequest(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => apiRequest(`/employees/${id}`, {
        method: 'DELETE',
    }),

    bulkImport: (employees) => apiRequest('/employees/bulk-import', {
        method: 'POST',
        body: JSON.stringify({ employees }),
    }),
};

// ========== Project APIs ==========
const ProjectAPI = {
    create: (projectData) => apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
    }),

    getAll: () => apiRequest('/projects'),

    getPublic: () => apiRequest('/projects/public'),

    update: (id, data) => apiRequest(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => apiRequest(`/projects/${id}`, {
        method: 'DELETE',
    }),
};

// ========== Ticket APIs ==========
const TicketAPI = {
    create: (formData) => apiRequest('/tickets', {
        method: 'POST',
        body: formData, // FormData with files
    }),

    getByEmployeeId: (employeeId) => apiRequest(`/tickets/employee/${employeeId}`),

    getByTicketId: (ticketId) => apiRequest(`/tickets/by-ticket-id/${ticketId}`),

    getAll: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/tickets?${queryString}`);
    },

    update: (id, formData) => apiRequest(`/tickets/${id}`, {
        method: 'PUT',
        body: formData, // FormData with files
    }),

    getStatistics: () => apiRequest('/tickets/stats'),

    updateByEmployee: (ticketId, data) => apiRequest(`/tickets/employee-update/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
};

// ========== Announcement APIs ==========
const AnnouncementAPI = {
    create: (data) => apiRequest('/announcements', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    getAll: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/announcements?${queryString}`);
    },

    update: (id, data) => apiRequest(`/announcements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => apiRequest(`/announcements/${id}`, {
        method: 'DELETE',
    }),
};

// ========== Storage Helper Functions ==========
const Storage = {
    setToken: (token) => localStorage.setItem('token', token),
    getToken: () => localStorage.getItem('token'),
    removeToken: () => localStorage.removeItem('token'),

    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    removeUser: () => localStorage.removeItem('user'),



    clear: () => localStorage.clear(),
};

// ========== UI Helper Functions ==========
const UI = {
    showLoading: () => {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loadingOverlay';
        overlay.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(overlay);
    },

    hideLoading: () => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.remove();
        }
    },

    showAlert: (message, type = 'info') => {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} fade-in`;
        alert.textContent = message;

        const container = document.querySelector('.container') || document.body;
        container.insertBefore(alert, container.firstChild);

        setTimeout(() => {
            alert.remove();
        }, 5000);
    },

    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    },

    getStatusBadgeClass: (status) => {
        const statusMap = {
            'Open': 'badge-open',
            'Under Review': 'badge-under-review',
            'Assigned': 'badge-assigned',
            'In Progress': 'badge-in-progress',
            'Pending': 'badge-pending',
            'Resolved': 'badge-resolved',
            'Closed': 'badge-closed',
        };
        return statusMap[status] || 'badge-secondary';
    },

    getPriorityBadgeClass: (priority) => {
        const priorityMap = {
            'Low': 'badge-low',
            'Medium': 'badge-medium',
            'High': 'badge-high',
            'Urgent': 'badge-urgent',
        };
        return priorityMap[priority] || 'badge-secondary';
    },
};

// ========== Validation Helper Functions ==========
const Validator = {
    email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),

    mobile: (mobile) => /^[6-9]\d{9}$/.test(mobile),

    required: (value) => value !== null && value !== undefined && value.trim() !== '',

    minLength: (value, length) => value.length >= length,

    maxLength: (value, length) => value.length <= length,
};

// ========== Router Helper ==========
const Router = {
    navigate: (path) => {
        window.location.href = path;
    },

    getQueryParam: (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    getPathSegment: (index) => {
        const segments = window.location.pathname.split('/').filter(s => s);
        return segments[index] || null;
    },
};

// ========== Logout Helper ==========
function logout(redirectUrl = '/admin/') {
    Storage.clear();
    Router.navigate(redirectUrl);
}

// ========== Check Authentication ==========
function checkAuth(redirectUrl = '/admin/') {
    const token = Storage.getToken();
    const user = Storage.getUser();

    if (!token || !user) {
        Router.navigate(redirectUrl);
        return false;
    }

    return true;
}
