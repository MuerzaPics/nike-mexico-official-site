// Recruitment page functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const deptButtons = document.querySelectorAll('.dept-btn');
    const challengeList = document.querySelector('.challenge-list');
    const selectedDepartmentTitle = document.getElementById('selectedDepartment');
    const departmentDescription = document.getElementById('departmentDescription');
    const modal = document.getElementById('challengeModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // State
    let challengesData = {};
    let currentDepartment = null;
    
    // Department descriptions
    const departmentDescriptions = {
        'Finanzas': 'Explora retos financieros que evalúan tu capacidad de análisis, proyección y optimización de recursos en el contexto deportivo global de Nike.',
        'Marketing': 'Demuestra tu creatividad y visión estratégica con campañas que conecten con audiencias diversas y reflejen los valores de Nike.',
        'Análisis de Datos': 'Utiliza datos para generar insights accionables que impulsen decisiones estratégicas en productos, marketing y operaciones.',
        'Desarrollo de Producto': 'Innova en el diseño y desarrollo de productos deportivos que combinen performance, sostenibilidad y tecnología.',
        'Tecnologías de la Información': 'Desarrolla soluciones tecnológicas escalables que soporten el crecimiento digital y la transformación de Nike.',
        'Operaciones': 'Optimiza procesos globales de supply chain, distribución y manufactura para mejorar eficiencia y sostenibilidad.',
        'Recursos Humanos': 'Crea estrategias de talento que fomenten la diversidad, inclusión y desarrollo profesional en la cultura Nike.'
    };
    
    // Initialize
    loadChallengesData();
    setupEventListeners();
    
    // Load challenges data from JSON
    async function loadChallengesData() {
        try {
            showLoading();
            const response = await fetch('data/challenges.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            challengesData = await response.json();
            hideLoading();
            
        } catch (error) {
            console.error('Error loading challenges data:', error);
            hideLoading();
            showError('Error al cargar los retos. Por favor, intenta nuevamente.');
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Department button clicks
        deptButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const department = this.dataset.dept;
                selectDepartment(department, this);
            });
        });
        
        // Modal close events
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }
    
    // Select department and show challenges
    function selectDepartment(department, buttonElement) {
        // Update active button
        deptButtons.forEach(btn => btn.classList.remove('active'));
        buttonElement.classList.add('active');
        
        // Update current department
        currentDepartment = department;
        
        // Update header
        if (selectedDepartmentTitle) {
            selectedDepartmentTitle.textContent = `Retos de ${department}`;
        }
        
        if (departmentDescription) {
            departmentDescription.textContent = departmentDescriptions[department] || 
                'Selecciona un reto para comenzar tu evaluación.';
        }
        
        // Show challenges
        renderChallenges(department);
        
        // Scroll to challenges section
        const challengeSection = document.querySelector('.challenge-section');
        if (challengeSection) {
            challengeSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
    
    // Render challenges for selected department
    function renderChallenges(department) {
        if (!challengeList) return;
        
        const challenges = challengesData[department];
        
        if (!challenges || challenges.length === 0) {
            challengeList.innerHTML = `
                <div class="error-message">
                    <h3>No hay retos disponibles</h3>
                    <p>Los retos para ${department} estarán disponibles próximamente.</p>
                </div>
            `;
            return;
        }
        
        // Clear existing content
        challengeList.innerHTML = '';
        
        // Create challenge cards
        challenges.forEach(challenge => {
            const challengeCard = createChallengeCard(challenge);
            challengeList.appendChild(challengeCard);
        });
        
        // Add animation
        const cards = challengeList.querySelectorAll('.challenge-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Create challenge card element
    function createChallengeCard(challenge) {
        const card = document.createElement('div');
        card.className = 'challenge-card';
        
        const difficultyClass = challenge.difficulty || 'medium';
        const difficultyText = {
            'easy': 'Principiante',
            'medium': 'Intermedio',
            'hard': 'Avanzado'
        };
        
        card.innerHTML = `
            <div class="challenge-difficulty ${difficultyClass}">
                ${difficultyText[difficultyClass] || 'Intermedio'}
            </div>
            <h3>${challenge.title}</h3>
            <p>${challenge.brief}</p>
            <button class="challenge-cta">Ver Reto Completo</button>
        `;
        
        // Add click event to show challenge detail
        card.addEventListener('click', () => showChallengeDetail(challenge));
        
        return card;
    }
    
    // Show challenge detail in modal
    function showChallengeDetail(challenge) {
        if (!modal) return;
        
        const modalTitle = document.getElementById('modalTitle');
        const challengeDetail = document.getElementById('challengeDetail');
        
        if (modalTitle) {
            modalTitle.textContent = challenge.title;
        }
        
        if (challengeDetail) {
            const instructionsList = challenge.instructions 
                ? challenge.instructions.map(instruction => `<li>${instruction}</li>`).join('')
                : '<li>Instrucciones detalladas serán proporcionadas al contactar.</li>';
            
            challengeDetail.innerHTML = `
                <div class="challenge-overview">
                    <h3>Descripción del Reto</h3>
                    <p>${challenge.description}</p>
                </div>
                
                <div class="challenge-instructions">
                    <h4>Instrucciones</h4>
                    <ul>
                        ${instructionsList}
                    </ul>
                </div>
                
                <div class="contact-info">
                    <h4>¿Listo para el desafío?</h4>
                    <p>Envía tu propuesta y demuestra tu potencial en Nike.</p>
                    <a href="mailto:${challenge.contact}?subject=Aplicación para ${encodeURIComponent(challenge.title)}" 
                       class="contact-email">
                        Enviar Propuesta
                    </a>
                </div>
            `;
        }
        
        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
    
    // Show loading state
    function showLoading() {
        if (challengeList) {
            challengeList.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>Cargando retos...</p>
                </div>
            `;
        }
    }
    
    // Hide loading state
    function hideLoading() {
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    
    // Show error message
    function showError(message) {
        if (challengeList) {
            challengeList.innerHTML = `
                <div class="error-message">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="cta-button">
                        Reintentar
                    </button>
                </div>
            `;
        }
    }
});
