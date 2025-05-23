/**
 * Local Community Event Portal - Main JavaScript File
 * Author: Community Events Team
 * Description: Complete JavaScript functionality for the event portal application
 * Features: Event handling, form validation, geolocation, localStorage, and interactive components
 */

/* ==========================================================================
   Section: Global Variables and Configuration
   ========================================================================== */

// Mock event data for listings (as required - no backend)
const mockEventData = [
    {
        id: 1,
        title: "Summer Music Festival 2024",
        category: "music",
        date: "2024-07-15",
        time: "18:00",
        location: "Community Park",
        description: "Join us for an amazing evening of live music featuring local bands and artists. Food trucks, family-friendly activities, and great entertainment await!",
        fee: 25,
        image: "https://picsum.photos/400/300?random=1",
        organizer: "Music Lovers Association",
        capacity: 500,
        registered: 234
    },
    {
        id: 2,
        title: "Community Food Fair",
        category: "food",
        date: "2024-06-20",
        time: "11:00",
        location: "Downtown Square",
        description: "Taste delicious cuisines from around the world prepared by local chefs and community members. Cooking demonstrations and food contests included!",
        fee: 15,
        image: "https://picsum.photos/400/300?random=2",
        organizer: "Culinary Community",
        capacity: 300,
        registered: 156
    },
    {
        id: 3,
        title: "Local Art Exhibition",
        category: "art",
        date: "2024-06-10",
        time: "14:00",
        location: "Community Art Center",
        description: "Explore beautiful artwork created by talented local artists. Interactive workshops, artist meet-and-greets, and art for sale.",
        fee: 10,
        image: "https://picsum.photos/400/300?random=3",
        organizer: "Artists Guild",
        capacity: 150,
        registered: 89
    },
    {
        id: 4,
        title: "Annual Sports Tournament",
        category: "sports",
        date: "2024-08-05",
        time: "09:00",
        location: "Sports Complex",
        description: "Competitive sports events for all ages including basketball, soccer, tennis, and swimming. Prizes for winners and participation certificates for all!",
        fee: 20,
        image: "https://picsum.photos/400/300?random=4",
        organizer: "Sports Association",
        capacity: 400,
        registered: 267
    },
    {
        id: 5,
        title: "Educational Workshop Series",
        category: "workshop",
        date: "2024-07-01",
        time: "10:00",
        location: "Community Learning Center",
        description: "Learn new skills in technology, crafts, cooking, and more. Expert instructors and hands-on learning experiences for all skill levels.",
        fee: 35,
        image: "https://picsum.photos/400/300?random=5",
        organizer: "Learning Foundation",
        capacity: 80,
        registered: 42
    },
    {
        id: 6,
        title: "Community Cleanup Day",
        category: "community",
        date: "2024-06-30",
        time: "08:00",
        location: "Various Locations",
        description: "Help keep our community clean and beautiful! Join neighbors in cleaning parks, streets, and public spaces. Refreshments and supplies provided.",
        fee: 0,
        image: "https://picsum.photos/400/300?random=6",
        organizer: "Environmental Group",
        capacity: 200,
        registered: 98
    }
];

// Global state variables
let currentFilterCategory = 'all';
let userLocation = null;
let registrationFormData = {};

/* ==========================================================================
   Section: DOM Content Loaded Event Handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Community Event Portal - JavaScript Loaded Successfully');
    
    // Initialize application components
    initializeApplication();
    
    // Load saved preferences from localStorage
    loadUserPreferences();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize page-specific functionality
    initializePageSpecificFeatures();
});

/* ==========================================================================
   Section: Application Initialization
   ========================================================================== */

function initializeApplication() {
    console.log('Initializing Community Event Portal...');
    
    // Check if user has completed registration before
    const hasRegistered = localStorage.getItem('userRegistered');
    if (hasRegistered === 'true') {
        console.log('Welcome back! Previous registration found.');
    }
    
    // Initialize responsive navbar behavior
    initializeNavbar();
    
    // Set up form validation
    initializeFormValidation();
    
    // Initialize date constraints
    setDateConstraints();
}

function initializeNavbar() {
    const navbar = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarToggler && navbar) {
        // Close navbar when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navbar.contains(event.target);
            const isClickOnToggler = navbarToggler.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggler && navbar.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }
}

function setDateConstraints() {
    // Set minimum dates for forms
    const today = new Date().toISOString().split('T')[0];
    
    const eventDateInput = document.getElementById('eventDate');
    const birthDateInput = document.getElementById('birthDate');
    
    if (eventDateInput) {
        eventDateInput.min = today;
    }
    
    if (birthDateInput) {
        birthDateInput.max = today;
    }
}

/* ==========================================================================
   Section: Event Listeners Setup
   ========================================================================== */

function setupEventListeners() {
    // Phone validation event listener (onblur)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            validatePhone(this);
        });
    }
    
    // Event type change listener (onchange)
    const eventTypeSelect = document.getElementById('eventType');
    if (eventTypeSelect) {
        eventTypeSelect.addEventListener('change', function() {
            updateEventFee(this);
            // Save preference to localStorage
            localStorage.setItem('preferredEventType', this.value);
        });
    }
    
    // Registration form submission (onclick equivalent)
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            confirmRegistration();
        });
    }
    
    // Feedback form submission
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitFeedback();
        });
    }
    
    // Textarea input tracking (keyboard events)
    const specialRequestsTextarea = document.getElementById('specialRequests');
    if (specialRequestsTextarea) {
        specialRequestsTextarea.addEventListener('keyup', function() {
            trackTextareaInput(this);
        });
    }
    
    // Setup image enlargement for gallery (ondblclick)
    setupImageEnlargement();
    
    // Setup before unload warning
    setupBeforeUnloadWarning();
}

function setupImageEnlargement() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(image => {
        image.addEventListener('dblclick', function() {
            enlargeImage(this);
        });
    });
}

function setupBeforeUnloadWarning() {
    window.addEventListener('beforeunload', function(e) {
        const hasCompletedRegistration = localStorage.getItem('userRegistered');
        const isOnRegistrationPage = window.location.pathname.includes('register.html');
        
        if (isOnRegistrationPage && !hasCompletedRegistration) {
            const form = document.getElementById('registrationForm');
            if (form && isFormPartiallyFilled(form)) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes in your registration form. Are you sure you want to leave?';
                return e.returnValue;
            }
        }
    });
}

function isFormPartiallyFilled(form) {
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="date"], select, textarea');
    return Array.from(inputs).some(input => input.value.trim() !== '');
}

/* ==========================================================================
   Section: User Preferences and localStorage Management
   ========================================================================== */

function loadUserPreferences() {
    // Load saved event type preference
    const savedEventType = localStorage.getItem('preferredEventType');
    const eventTypeSelect = document.getElementById('eventType');
    
    if (savedEventType && eventTypeSelect) {
        eventTypeSelect.value = savedEventType;
        updateEventFee(eventTypeSelect);
    }
    
    // Load other saved preferences
    const savedFilters = localStorage.getItem('eventFilters');
    if (savedFilters) {
        currentFilterCategory = savedFilters;
    }
    
    console.log('User preferences loaded from localStorage');
}

function saveUserPreferences() {
    localStorage.setItem('eventFilters', currentFilterCategory);
    localStorage.setItem('lastVisit', new Date().toISOString());
    
    console.log('User preferences saved to localStorage');
}

/* ==========================================================================
   Section: Geolocation API Integration
   ========================================================================== */

function getLocation() {
    const locationDisplay = document.getElementById('locationDisplay');
    
    if (!navigator.geolocation) {
        displayLocationError('Geolocation is not supported by this browser.');
        return;
    }
    
    // Show loading state
    if (locationDisplay) {
        locationDisplay.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary me-2" role="status" style="width: 1rem; height: 1rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span class="text-muted">Getting your location...</span>
            </div>
        `;
    }
    
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
    };
    
    navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        handleLocationError,
        options
    );
}

function handleLocationSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;
    
    userLocation = {
        lat: latitude,
        lng: longitude,
        accuracy: accuracy,
        timestamp: new Date().toISOString()
    };
    
    // Save location to localStorage
    localStorage.setItem('userLocation', JSON.stringify(userLocation));
    
    displayLocationSuccess(latitude, longitude, accuracy);
    
    console.log('Location retrieved successfully:', userLocation);
}

function handleLocationError(error) {
    let errorMessage = 'Unable to retrieve your location.';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        default:
            errorMessage = 'An unknown error occurred while retrieving location.';
            break;
    }
    
    displayLocationError(errorMessage);
    console.error('Geolocation error:', error);
}

function displayLocationSuccess(lat, lng, accuracy) {
    const locationDisplay = document.getElementById('locationDisplay');
    if (locationDisplay) {
        locationDisplay.innerHTML = `
            <div class="alert alert-success">
                <h6 class="alert-heading">
                    <i class="bi bi-geo-alt-fill me-2"></i>
                    Location Found Successfully!
                </h6>
                <p class="mb-1"><strong>Latitude:</strong> ${lat.toFixed(6)}</p>
                <p class="mb-1"><strong>Longitude:</strong> ${lng.toFixed(6)}</p>
                <p class="mb-0"><small class="text-muted">Accuracy: ±${Math.round(accuracy)} meters</small></p>
            </div>
        `;
    }
}

function displayLocationError(message) {
    const locationDisplay = document.getElementById('locationDisplay');
    if (locationDisplay) {
        locationDisplay.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
    }
}

/* ==========================================================================
   Section: Form Validation Functions
   ========================================================================== */

function initializeFormValidation() {
    // Bootstrap form validation setup
    const forms = document.querySelectorAll('.needs-validation, form');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

function validatePhone(phoneInput) {
    const phoneValue = phoneInput.value.replace(/\D/g, ''); // Remove non-digits
    const isValid = phoneValue.length >= 10;
    
    if (!isValid && phoneInput.value.length > 0) {
        phoneInput.setCustomValidity('Please enter a valid phone number (at least 10 digits)');
        phoneInput.classList.add('is-invalid');
        
        // Show custom error message
        let feedback = phoneInput.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = 'Please enter a valid phone number (at least 10 digits)';
        }
    } else {
        phoneInput.setCustomValidity('');
        phoneInput.classList.remove('is-invalid');
        if (isValid) {
            phoneInput.classList.add('is-valid');
        }
    }
    
    return isValid;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date >= today;
}

/* ==========================================================================
   Section: Event Management Functions
   ========================================================================== */

function updateEventFee(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const fee = selectedOption.getAttribute('data-fee') || '0';
    const feeDisplay = document.getElementById('eventFeeDisplay');
    
    if (feeDisplay) {
        const feeAmount = parseInt(fee);
        if (feeAmount === 0) {
            feeDisplay.textContent = 'Free';
            feeDisplay.className = 'text-success fw-bold';
        } else {
            feeDisplay.textContent = `$${feeAmount}`;
            feeDisplay.className = 'text-primary fw-bold';
        }
    }
    
    // Save preference
    localStorage.setItem('preferredEventType', selectElement.value);
    
    console.log('Event fee updated:', fee);
}

function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;
    
    // Filter events based on current category
    const filteredEvents = currentFilterCategory === 'all' 
        ? mockEventData 
        : mockEventData.filter(event => event.category === currentFilterCategory);
    
    // Clear existing content
    eventsGrid.innerHTML = '';
    
    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle me-2"></i>
                    No events found for the selected category. Try browsing all events.
                </div>
            </div>
        `;
        return;
    }
    
    // Generate event cards
    filteredEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
    
    console.log(`Loaded ${filteredEvents.length} events for category: ${currentFilterCategory}`);
}

function createEventCard(event) {
    const cardCol = document.createElement('div');
    cardCol.className = 'col-lg-4 col-md-6 mb-4';
    
    const progressPercentage = Math.round((event.registered / event.capacity) * 100);
    const isFull = event.registered >= event.capacity;
    
    cardCol.innerHTML = `
        <div class="card h-100 shadow-sm eventCard" data-event-id="${event.id}">
            <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-primary">${getCategoryDisplayName(event.category)}</span>
                    <span class="badge ${event.fee === 0 ? 'bg-success' : 'bg-warning'}">${event.fee === 0 ? 'Free' : '$' + event.fee}</span>
                </div>
                
                <h5 class="card-title fw-bold">${event.title}</h5>
                <p class="card-text text-muted flex-grow-1">${event.description}</p>
                
                <div class="mt-auto">
                    <div class="row mb-3">
                        <div class="col-6">
                            <small class="text-muted">
                                <i class="bi bi-calendar me-1"></i>
                                ${new Date(event.date).toLocaleDateString()}
                            </small>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">
                                <i class="bi bi-clock me-1"></i>
                                ${event.time}
                            </small>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <small class="text-muted">
                            <i class="bi bi-geo-alt me-1"></i>
                            ${event.location}
                        </small>
                    </div>
                    
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <small class="text-muted">Registration Progress</small>
                            <small class="text-muted">${event.registered}/${event.capacity}</small>
                        </div>
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar ${isFull ? 'bg-danger' : 'bg-success'}" 
                                 style="width: ${progressPercentage}%"></div>
                        </div>
                    </div>
                    
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-outline-primary btn-sm" 
                                onclick="showEventDetails(${event.id})">
                            View Details
                        </button>
                        <a href="register.html" class="btn btn-primary btn-sm ${isFull ? 'disabled' : ''}">
                            ${isFull ? 'Event Full' : 'Register Now'}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return cardCol;
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'music': 'Music & Arts',
        'food': 'Food & Dining',
        'art': 'Arts & Culture',
        'sports': 'Sports & Fitness',
        'workshop': 'Workshops',
        'community': 'Community Service'
    };
    
    return categoryNames[category] || category;
}

function filterEvents(category) {
    currentFilterCategory = category;
    loadEvents();
    saveUserPreferences();
    
    // Update active category in sidebar
    const categoryLinks = document.querySelectorAll('.category-list a');
    categoryLinks.forEach(link => {
        link.classList.remove('text-primary', 'fw-bold');
        if (link.getAttribute('onclick').includes(category)) {
            link.classList.add('text-primary', 'fw-bold');
        }
    });
    
    console.log('Events filtered by category:', category);
}

function showEventDetails(eventId) {
    const event = mockEventData.find(e => e.id === eventId);
    if (!event) return;
    
    // Populate modal with event details
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('eventModalTitle');
    const modalImage = document.getElementById('eventModalImage');
    const modalContent = document.getElementById('eventModalContent');
    
    if (modalTitle) modalTitle.textContent = event.title;
    if (modalImage) {
        modalImage.src = event.image;
        modalImage.alt = event.title;
    }
    
    if (modalContent) {
        modalContent.innerHTML = `
            <h6 class="fw-bold text-primary">${getCategoryDisplayName(event.category)}</h6>
            <p class="mb-3">${event.description}</p>
            
            <div class="mb-3">
                <h6 class="fw-bold">Event Details</h6>
                <p class="mb-1"><i class="bi bi-calendar me-2"></i><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                <p class="mb-1"><i class="bi bi-clock me-2"></i><strong>Time:</strong> ${event.time}</p>
                <p class="mb-1"><i class="bi bi-geo-alt me-2"></i><strong>Location:</strong> ${event.location}</p>
                <p class="mb-1"><i class="bi bi-person me-2"></i><strong>Organizer:</strong> ${event.organizer}</p>
                <p class="mb-1"><i class="bi bi-currency-dollar me-2"></i><strong>Fee:</strong> ${event.fee === 0 ? 'Free' : '$' + event.fee}</p>
            </div>
            
            <div class="mb-3">
                <h6 class="fw-bold">Availability</h6>
                <p class="mb-1">Capacity: ${event.capacity} people</p>
                <p class="mb-1">Registered: ${event.registered} people</p>
                <p class="mb-0">Available spots: ${event.capacity - event.registered}</p>
            </div>
        `;
    }
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

/* ==========================================================================
   Section: Registration Form Functions
   ========================================================================== */

function confirmRegistration() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    // Validate form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const registrationData = {};
    
    for (let [key, value] of formData.entries()) {
        registrationData[key] = value;
    }
    
    // Additional validation
    if (!validatePhone(document.getElementById('phone'))) {
        return false;
    }
    
    if (!validateEmail(registrationData.email)) {
        showValidationError('email', 'Please enter a valid email address');
        return false;
    }
    
    if (registrationData.eventDate && !validateDate(registrationData.eventDate)) {
        showValidationError('eventDate', 'Event date must be in the future');
        return false;
    }
    
    // Save registration data
    localStorage.setItem('registrationData', JSON.stringify(registrationData));
    localStorage.setItem('userRegistered', 'true');
    localStorage.setItem('registrationDate', new Date().toISOString());
    
    // Show confirmation
    displayRegistrationConfirmation(registrationData);
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Reset form
    form.reset();
    form.classList.remove('was-validated');
    
    console.log('Registration completed successfully:', registrationData);
    
    return true;
}

function displayRegistrationConfirmation(data) {
    const confirmationElement = document.getElementById('registrationConfirmation');
    if (confirmationElement) {
        confirmationElement.innerHTML = `
            <div class="alert alert-success">
                <h6 class="alert-heading">Registration Confirmation</h6>
                <p class="mb-1"><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p class="mb-1"><strong>Email:</strong> ${data.email}</p>
                <p class="mb-1"><strong>Event:</strong> ${data.eventType}</p>
                <p class="mb-0"><strong>Date:</strong> ${data.eventDate}</p>
            </div>
        `;
    }
}

function showValidationError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.setCustomValidity(message);
        field.classList.add('is-invalid');
        
        const feedback = field.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
        }
    }
}

/* ==========================================================================
   Section: Feedback Form Functions
   ========================================================================== */

function submitFeedback() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return false;
    }
    
    // Collect feedback data
    const formData = new FormData(form);
    const feedbackData = {};
    
    for (let [key, value] of formData.entries()) {
        if (feedbackData[key]) {
            // Handle multiple values (checkboxes)
            if (Array.isArray(feedbackData[key])) {
                feedbackData[key].push(value);
            } else {
                feedbackData[key] = [feedbackData[key], value];
            }
        } else {
            feedbackData[key] = value;
        }
    }
    
    // Save feedback data
    const existingFeedback = JSON.parse(localStorage.getItem('feedbackSubmissions') || '[]');
    feedbackData.timestamp = new Date().toISOString();
    feedbackData.id = Date.now();
    
    existingFeedback.push(feedbackData);
    localStorage.setItem('feedbackSubmissions', JSON.stringify(existingFeedback));
    localStorage.setItem('feedbackSubmitted', 'true');
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('feedbackSuccessModal'));
    successModal.show();
    
    // Reset form
    form.reset();
    form.classList.remove('was-validated');
    
    console.log('Feedback submitted successfully:', feedbackData);
    
    return true;
}

/* ==========================================================================
   Section: Interactive Element Functions
   ========================================================================== */

function enlargeImage(imageElement) {
    const modal = document.getElementById('imageModal');
    const enlargedImage = document.getElementById('enlargedImage');
    const modalTitle = document.getElementById('imageModalTitle');
    
    if (enlargedImage && modal) {
        enlargedImage.src = imageElement.src;
        enlargedImage.alt = imageElement.alt;
        
        if (modalTitle) {
            modalTitle.textContent = imageElement.alt || 'Event Image';
        }
        
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

function trackTextareaInput(textarea) {
    const counter = document.getElementById('textareaCounter');
    if (counter) {
        const length = textarea.value.length;
        counter.textContent = `${length} characters typed`;
        
        // Add visual feedback based on length
        if (length > 500) {
            counter.className = 'text-warning';
        } else if (length > 1000) {
            counter.className = 'text-danger';
        } else {
            counter.className = 'text-muted';
        }
    }
}

/* ==========================================================================
   Section: Page-Specific Initialization
   ========================================================================== */

function initializePageSpecificFeatures() {
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'events':
            initializeEventsPage();
            break;
        case 'register':
            initializeRegisterPage();
            break;
        case 'feedback':
            initializeFeedbackPage();
            break;
        case 'video':
            initializeVideoPage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('events.html')) return 'events';
    if (path.includes('register.html')) return 'register';
    if (path.includes('feedback.html')) return 'feedback';
    if (path.includes('video.html')) return 'video';
    return 'index';
}

function initializeHomePage() {
    console.log('Initializing home page features...');
    
    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize image gallery hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function initializeEventsPage() {
    console.log('Initializing events page features...');
    
    // Load events when page loads
    loadEvents();
    
    // Update current date
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString();
    }
    
    // Initialize category filter active state
    const allEventsLink = document.querySelector('a[onclick*="all"]');
    if (allEventsLink) {
        allEventsLink.classList.add('text-primary', 'fw-bold');
    }
}

function initializeRegisterPage() {
    console.log('Initializing registration page features...');
    
    // Load saved preferences
    const savedEventType = localStorage.getItem('preferredEventType');
    const eventTypeSelect = document.getElementById('eventType');
    
    if (savedEventType && eventTypeSelect) {
        eventTypeSelect.value = savedEventType;
        updateEventFee(eventTypeSelect);
    }
    
    // Set focus on first input
    const firstNameInput = document.getElementById('firstName');
    if (firstNameInput) {
        setTimeout(() => firstNameInput.focus(), 100);
    }
}

function initializeFeedbackPage() {
    console.log('Initializing feedback page features...');
    
    // Set maximum date for event date to today
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        const today = new Date().toISOString().split('T')[0];
        eventDateInput.max = today;
    }
    
    // Load saved event preference for feedback
    const savedEvent = localStorage.getItem('preferredEventType');
    const attendedEventSelect = document.getElementById('attendedEvent');
    
    if (savedEvent && attendedEventSelect) {
        // Map registration event types to feedback event types
        const eventMapping = {
            'music-festival': 'music-festival',
            'food-fair': 'food-fair',
            'art-exhibition': 'art-exhibition',
            'sports-tournament': 'sports-tournament',
            'workshop-series': 'workshop-series',
            'community-cleanup': 'community-cleanup'
        };
        
        const mappedEvent = eventMapping[savedEvent];
        if (mappedEvent) {
            attendedEventSelect.value = mappedEvent;
        }
    }
}

function initializeVideoPage() {
    console.log('Initializing video page features...');
    
    // Setup video event handlers
    const promoVideo = document.getElementById('promoVideo');
    if (promoVideo) {
        promoVideo.addEventListener('canplay', function() {
            videoReadyHandler(this);
        });
        
        promoVideo.addEventListener('loadstart', function() {
            const statusDiv = document.getElementById('videoStatus');
            const statusText = document.getElementById('videoStatusText');
            
            if (statusDiv && statusText) {
                statusDiv.classList.remove('d-none');
                statusText.textContent = 'Loading video...';
            }
        });
        
        promoVideo.addEventListener('error', function() {
            const statusDiv = document.getElementById('videoStatus');
            const statusText = document.getElementById('videoStatusText');
            
            if (statusDiv && statusText) {
                statusDiv.classList.remove('d-none', 'alert-info');
                statusDiv.classList.add('alert-warning');
                statusText.textContent = 'Error loading video. Please try again later.';
            }
        });
    }
}

/* ==========================================================================
   Section: Video Handler Functions
   ========================================================================== */

function videoReadyHandler(video) {
    const statusDiv = document.getElementById('videoStatus');
    const statusText = document.getElementById('videoStatusText');
    
    if (statusDiv && statusText) {
        statusDiv.classList.remove('d-none', 'alert-info');
        statusDiv.classList.add('alert-success');
        statusText.textContent = 'Video ready to play!';
        
        // Hide status after 3 seconds
        setTimeout(() => {
            statusDiv.classList.add('d-none');
        }, 3000);
    }
    
    console.log('Video is ready to play');
}

/* ==========================================================================
   Section: Utility Functions
   ========================================================================== */

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/* ==========================================================================
   Section: Error Handling and Logging
   ========================================================================== */

function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    // Log error to localStorage for debugging
    const errors = JSON.parse(localStorage.getItem('applicationErrors') || '[]');
    errors.push({
        error: error.message,
        context: context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    });
    
    // Keep only last 10 errors
    if (errors.length > 10) {
        errors.splice(0, errors.length - 10);
    }
    
    localStorage.setItem('applicationErrors', JSON.stringify(errors));
}

function logUserAction(action, data = {}) {
    const userActions = JSON.parse(localStorage.getItem('userActions') || '[]');
    userActions.push({
        action: action,
        data: data,
        timestamp: new Date().toISOString(),
        page: getCurrentPage()
    });
    
    // Keep only last 50 actions
    if (userActions.length > 50) {
        userActions.splice(0, userActions.length - 50);
    }
    
    localStorage.setItem('userActions', JSON.stringify(userActions));
}

/* ==========================================================================
   Section: Performance Monitoring
   ========================================================================== */

function measurePerformance(operationName, operation) {
    const startTime = performance.now();
    
    try {
        const result = operation();
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`${operationName} took ${duration.toFixed(2)} milliseconds`);
        
        // Log performance data
        const perfData = JSON.parse(localStorage.getItem('performanceData') || '[]');
        perfData.push({
            operation: operationName,
            duration: duration,
            timestamp: new Date().toISOString()
        });
        
        if (perfData.length > 20) {
            perfData.splice(0, perfData.length - 20);
        }
        
        localStorage.setItem('performanceData', JSON.stringify(perfData));
        
        return result;
    } catch (error) {
        handleError(error, operationName);
        throw error;
    }
}

/* ==========================================================================
   Section: Module Export (for testing purposes)
   ========================================================================== */

// Make functions available globally for testing and debugging
window.CommunityEventPortal = {
    getLocation,
    validatePhone,
    updateEventFee,
    loadEvents,
    filterEvents,
    confirmRegistration,
    submitFeedback,
    enlargeImage,
    trackTextareaInput,
    handleError,
    logUserAction,
    measurePerformance
};

console.log('Community Event Portal JavaScript loaded successfully!');
