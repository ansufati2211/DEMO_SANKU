// --- BASE DE DATOS FALSA (Simulación de Backend) ---
// Nota: Esto es temporal. Para integración con backend real en Spring Boot, reemplazar con llamadas fetch a API (e.g., /api/users, /api/pacientes, /api/personal, /api/reportes).
const FAKE_DB = {
    users: {
        'admin@sanku.com': { password: 'admin', role: 'ADMIN', nombre: 'Dr. Administrador', initials: 'DA', email: 'admin@sanku.com' },
        'psi@sanku.com': { password: 'psi', role: 'PSICOLOGO', nombre: 'Dr. Psicólogo', initials: 'DP', email: 'psi@sanku.com' },
        'paciente@sanku.com': { password: 'paciente', role: 'PACIENTE', nombre: 'Ana Torres', initials: 'AT', email: 'paciente@sanku.com' }
    },
    pacientes: [
        { id: 1, nombre: 'Maria', apellido: 'García López', fechaNacimiento: '2014-05-20', genero: 'Femenino', numeroDocumento: '71234567' },
        { id: 2, nombre: 'Juan', apellido: 'Rodriguez Pérez', fechaNacimiento: '1978-11-15', genero: 'Masculino', numeroDocumento: '12345678' },
        { id: 3, nombre: 'Carmen', apellido: 'Sánchez Villa', fechaNacimiento: '1991-03-10', genero: 'Femenino', numeroDocumento: '45678901' },
    ],
    historias: [
        { id: 101, pacienteId: 1, pacienteNombre: 'Maria García López', fecha: '2024-01-14', diagnostico: 'Trastorno de Ansiedad Generalizada', estado: 'En Tratamiento'},
        { id: 102, pacienteId: 2, pacienteNombre: 'Juan Rodriguez Pérez', fecha: '2023-11-11', diagnostico: 'Depresión Mayor', estado: 'Activo'},
        { id: 103, pacienteId: 3, pacienteNombre: 'Carmen Sánchez Villa', fecha: '2024-01-09', diagnostico: 'Trastorno Bipolar', estado: 'En Tratamiento'},
        { id: 104, pacienteId: 1, pacienteNombre: 'Maria García López', fecha: '2023-12-19', diagnostico: 'Seguimiento Ansiedad', estado: 'Dado de Alta'},
    ],
    citas: [
        { id: 201, pacienteNombre: 'Maria González', fechaHora: '2025-09-02T09:00:00', duracion: 60, estado: 'Confirmada', tipo: 'Individual'},
        { id: 202, pacienteNombre: 'Carlos Ruiz', fechaHora: '2025-09-02T10:30:00', duracion: 50, estado: 'Programada', tipo: 'Individual'},
        { id: 203, pacienteNombre: 'Familia López', fechaHora: '2025-09-02T14:00:00', duracion: 90, estado: 'Confirmada', tipo: 'Familiar'},
        { id: 204, pacienteNombre: 'Juan Rodriguez', fechaHora: '2025-09-03T11:00:00', duracion: 60, estado: 'Cancelada', tipo: 'Individual'},
    ],
    pagos: [
        { id: 301, pacienteNombre: 'Maria González Pérez', fecha: '2025-01-15', descripcion: 'Terapia Familiar - Paquete 8 sesiones', monto: 480, estado: 'Pagado'},
        { id: 302, pacienteNombre: 'Carlos Ramírez López', fecha: '2025-01-16', descripcion: 'Terapia Individual - Adultos', monto: 80, estado: 'Pendiente'},
        { id: 303, pacienteNombre: 'Ana López Torres', fecha: '2025-01-10', descripcion: 'Evaluación Psicológica Completa', monto: 160, estado: 'Vencida'},
    ],
    // Nuevos datos para RRHH (Personal)
    personal: [
        { id: 1, nombre: 'Dr. Juan Pérez', rol: 'Psicólogo', email: 'juan.perez@sanku.com', salario: 3500.00, fechaIngreso: '2023-01-15' },
        { id: 2, nombre: 'Ana López', rol: 'Administrador', email: 'ana.lopez@sanku.com', salario: 2800.00, fechaIngreso: '2022-06-20' },
        { id: 3, nombre: 'Carlos Ramírez', rol: 'Asistente', email: 'carlos.ramirez@sanku.com', salario: 1500.00, fechaIngreso: '2024-03-10' },
    ],
    siguientePersonalId: 4,
    // Datos para reportes contables (simulados)
    reportes: {
        ingresosMensuales: [480, 80, 160, 3500, 2800], // Ejemplo de datos mensuales
        egresosMensuales: [2000, 1500, 1200, 1800, 2200],
        balance: 4500 // Balance general simulado
    },
    siguientePacienteId: 4,
};

// --- DEFINICIONES DE NAVEGACIÓN Y ROLES ---
// Actualizado con nuevos módulos: RRHH y Contable
const ROLES = {
    ADMIN: ['view_dashboard', 'view_pacientes', 'view_historias', 'view_agenda', 'view_pagos', 'view_rrhh', 'view_contable'],
    PSICOLOGO: ['view_dashboard', 'view_pacientes', 'view_historias', 'view_agenda'],
    PACIENTE: ['view_historias', 'view_agenda']
};
const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bar-chart-outline', permission: 'view_dashboard' },
    { id: 'pacientes', label: 'Pacientes', icon: 'people-outline', permission: 'view_pacientes' },
    { id: 'historias', label: 'Historias Clínicas', icon: 'clipboard-outline', permission: 'view_historias' },
    { id: 'agenda', label: 'Agenda de Citas', icon: 'calendar-outline', permission: 'view_agenda' },
    { id: 'pagos', label: 'Módulo de Pagos', icon: 'card-outline', permission: 'view_pagos' },
    { id: 'rrhh', label: 'RRHH', icon: 'construct-outline', permission: 'view_rrhh' },
    { id: 'contable', label: 'Contable', icon: 'calculator-outline', permission: 'view_contable' }
];

// --- Objeto Principal de la Aplicación ---
const app = {
    currentUser: null,
    currentPage: 'dashboard',
    chartInstance: null,

    // --- 1. LÓGICA DE AUTENTICACIÓN ---
    handleLogin: (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('loginError');

        if (!email || !password) {
            errorEl.textContent = 'Por favor, ingrese correo y contraseña.';
            errorEl.classList.remove('hidden');
            return;
        }

        const user = FAKE_DB.users[email];
        if (user && user.password === password) {
            app.currentUser = user;
            localStorage.setItem('sankuUser', JSON.stringify(user));
            app.initMainApp();
            errorEl.classList.add('hidden');
        } else {
            errorEl.textContent = 'Credenciales incorrectas. Intente de nuevo.';
            errorEl.classList.remove('hidden');
        }
    },

    handleLogout: () => {
        app.currentUser = null;
        localStorage.removeItem('sankuUser');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        if (app.chartInstance) {
            app.chartInstance.destroy();
            app.chartInstance = null;
        }
    },

    initMainApp: () => {
        if (!app.currentUser) return;

        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');

        document.getElementById('userName').textContent = app.currentUser.nombre;
        document.getElementById('userRole').textContent = app.currentUser.role.toLowerCase();
        document.getElementById('userAvatar').textContent = app.currentUser.initials || app.currentUser.nombre[0];

        const firstAllowedPage = NAV_ITEMS.find(item => app.can(item.permission));
        const currentConfig = NAV_ITEMS.find(item => item.id === app.currentPage);

        if (!currentConfig || !app.can(currentConfig.permission)) {
            app.currentPage = firstAllowedPage ? firstAllowedPage.id : 'dashboard';
        }

        app.renderSidebar();
        app.renderMainContent();
    },

    // --- 2. LÓGICA DE RENDERIZADO ---
    renderSidebar: () => {
        const navLinks = document.getElementById('navLinks');
        navLinks.innerHTML = '';

        NAV_ITEMS.forEach(item => {
            if (app.can(item.permission)) {
                const link = document.createElement('a');
                link.href = '#';
                link.className = `nav-item ${app.currentPage === item.id ? 'active' : ''}`;
                link.onclick = (e) => {
                    e.preventDefault();
                    app.navigate(item.id);
                };
                link.innerHTML = `
                    <ion-icon name="${item.icon}" class="h-6 w-6"></ion-icon>
                    <span>${item.label}</span>
                `;
                navLinks.appendChild(link);
            }
        });
    },

    renderMainContent: () => {
        const mainContent = document.getElementById('mainContent');
        const pageTitle = document.getElementById('pageTitle');
        const currentPageConfig = NAV_ITEMS.find(item => item.id === app.currentPage);

        pageTitle.textContent = currentPageConfig ? currentPageConfig.label : "Página no encontrada";
        mainContent.innerHTML = '';
        
        if (app.chartInstance) {
            app.chartInstance.destroy();
            app.chartInstance = null;
        }

        let contentHTML = '';
        switch(app.currentPage) {
            case 'dashboard': contentHTML = app.getDashboardHTML(); break;
            case 'pacientes': contentHTML = app.getPacientesHTML(); break;
            case 'historias': contentHTML = app.getHistoriasHTML(); break;
            case 'agenda': contentHTML = app.getAgendaHTML(); break;
            case 'pagos': contentHTML = app.getPagosHTML(); break;
            case 'rrhh': contentHTML = app.getRRHHHTML(); break;
            case 'contable': contentHTML = app.getContableHTML(); break;
            default: contentHTML = `<div class="bg-white p-6 rounded-xl shadow-md"><h1>Error</h1><p>No tienes permiso para ver esta página o no existe.</p></div>`;
        }
        mainContent.innerHTML = contentHTML;

        if (app.currentPage === 'dashboard') {
            app.renderChart();
        }
    },

    // --- 3. NAVEGACIÓN Y PERMISOS ---
    navigate: (pageId) => {
        const permission = NAV_ITEMS.find(item => item.id === pageId)?.permission;
        if (app.currentPage !== pageId && app.can(permission)) {
            app.currentPage = pageId;
            app.renderSidebar();
            app.renderMainContent();
        }
    },

    can: (permission) => {
        if (!app.currentUser || !permission) return false;
        return ROLES[app.currentUser.role]?.includes(permission) || false;
    },

    // --- 4. LÓGICA DE PACIENTES (CRUD) ---
    handleSavePaciente: (event) => {
        event.preventDefault();
        const form = event.target;
        const id = form.pacienteId.value;

        const pacienteData = {
            nombre: form.nombre.value.trim(),
            apellido: form.apellido.value.trim(),
            fechaNacimiento: form.fechaNacimiento.value,
            numeroDocumento: form.numeroDocumento.value.trim(),
            genero: form.genero.value,
        };

        if (!pacienteData.nombre || !pacienteData.apellido || !pacienteData.fechaNacimiento || !pacienteData.numeroDocumento) {
            alert("Por favor, complete todos los campos requeridos.");
            return;
        }
        if (!/^\d{8}$/.test(pacienteData.numeroDocumento)) {
            alert("El número de documento debe contener exactamente 8 dígitos.");
            return;
        }
        if (new Date(pacienteData.fechaNacimiento) > new Date()) {
            alert("La fecha de nacimiento no puede ser futura.");
            return;
        }

        if (id) {
            const index = FAKE_DB.pacientes.findIndex(p => p.id == id);
            if (index !== -1) {
                FAKE_DB.pacientes[index] = { id: parseInt(id), ...pacienteData };
            }
        } else {
            pacienteData.id = FAKE_DB.siguientePacienteId++;
            FAKE_DB.pacientes.push(pacienteData);
        }

        app.closeModal();
        if (app.currentPage === 'pacientes') {
            app.renderMainContent();
        }
    },

    handleDeletePaciente: (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar a este paciente?')) {
            FAKE_DB.pacientes = FAKE_DB.pacientes.filter(p => p.id !== id);
            if (app.currentPage === 'pacientes') {
                app.renderMainContent();
            }
        }
    },

    // --- 5. LÓGICA DE PERSONAL (CRUD para RRHH) ---
    handleSavePersonal: (event) => {
        event.preventDefault();
        const form = event.target;
        const id = form.personalId.value;

        const personalData = {
            nombre: form.personalNombre.value.trim(),
            rol: form.personalRol.value,
            email: form.personalEmail.value.trim(),
            salario: parseFloat(form.personalSalario.value),
            fechaIngreso: new Date().toISOString().split('T')[0],
        };

        if (!personalData.nombre || !personalData.rol || !personalData.email || isNaN(personalData.salario)) {
            alert("Por favor, complete todos los campos requeridos correctamente.");
            return;
        }

        if (id) {
            const index = FAKE_DB.personal.findIndex(p => p.id == id);
            if (index !== -1) {
                FAKE_DB.personal[index] = { id: parseInt(id), ...personalData };
            }
        } else {
            personalData.id = FAKE_DB.siguientePersonalId++;
            FAKE_DB.personal.push(personalData);
        }

        app.closePersonalModal();
        if (app.currentPage === 'rrhh') {
            app.renderMainContent();
        }
    },

    handleDeletePersonal: (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar a este miembro del personal?')) {
            FAKE_DB.personal = FAKE_DB.personal.filter(p => p.id !== id);
            if (app.currentPage === 'rrhh') {
                app.renderMainContent();
            }
        }
    },

    openPersonalModal: (personal = null) => {
        const modal = document.getElementById('personalModal');
        const title = document.getElementById('personalModalTitle');
        const form = document.getElementById('personalForm');

        form.reset();

        if (personal) {
            title.textContent = 'Editar Personal';
            form.personalId.value = personal.id;
            form.personalNombre.value = personal.nombre;
            form.personalRol.value = personal.rol;
            form.personalEmail.value = personal.email;
            form.personalSalario.value = personal.salario;
        } else {
            title.textContent = 'Nuevo Personal';
            form.personalId.value = '';
        }
        modal.classList.remove('hidden');
    },

    closePersonalModal: () => {
        document.getElementById('personalModal').classList.add('hidden');
    },

    // --- 6. LÓGICA DEL MODAL DE PACIENTES ---
    openModal: (paciente = null) => {
        const modal = document.getElementById('pacienteModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('pacienteForm');

        form.reset();

        if (paciente) {
            title.textContent = 'Editar Paciente';
            form.pacienteId.value = paciente.id;
            form.nombre.value = paciente.nombre;
            form.apellido.value = paciente.apellido;
            form.fechaNacimiento.value = paciente.fechaNacimiento;
            form.numeroDocumento.value = paciente.numeroDocumento;
            form.genero.value = paciente.genero;
        } else {
            title.textContent = 'Nuevo Paciente';
            form.pacienteId.value = '';
        }
        modal.classList.remove('hidden');
    },

    closeModal: () => {
        document.getElementById('pacienteModal').classList.add('hidden');
    },

    // --- 7. GENERADORES DE HTML ---
    getDashboardHTML: () => {
        const pacientesCount = FAKE_DB.pacientes.length;
        const pagosPendientes = FAKE_DB.pagos.filter(p => p.estado === 'Pendiente').reduce((sum, p) => sum + p.monto, 0);
        const pagosVencidos = FAKE_DB.pagos.filter(p => p.estado === 'Vencida').reduce((sum, p) => sum + p.monto, 0);
        const ingresosMes = FAKE_DB.pagos.filter(p => p.estado === 'Pagado').reduce((sum, p) => sum + p.monto, 0);

        return `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="dashboard-card">
                    <h3 class="dashboard-card-title">Pacientes Activos</h3>
                    <p class="dashboard-card-value">${pacientesCount}</p>
                </div>
                <div class="dashboard-card">
                    <h3 class="dashboard-card-title">Ingresos del Mes</h3>
                    <p class="dashboard-card-value value-green">S/ ${ingresosMes.toFixed(2)}</p>
                </div>
                <div class="dashboard-card">
                    <h3 class="dashboard-card-title">Pagos Pendientes</h3>
                    <p class="dashboard-card-value value-yellow">S/ ${pagosPendientes.toFixed(2)}</p>
                </div>
                <div class="dashboard-card">
                    <h3 class="dashboard-card-title">Pagos Vencidos</h3>
                    <p class="dashboard-card-value value-red">S/ ${pagosVencidos.toFixed(2)}</p>
                </div>
            </div>
            <div class="dashboard-card">
                <h3 class="dashboard-card-title mb-4">Evolución de Ingresos</h3>
                <div id="chartContainer">
                    <canvas id="dashboardChart"></canvas>
                </div>
            </div>
        `;
    },

    renderChart: () => {
        const ctx = document.getElementById('dashboardChart').getContext('2d');
        app.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Ingresos Mensuales',
                    data: [1200, 1900, 3000, 5000, 2300, 3400],
                    borderColor: 'rgba(44, 82, 130, 0.8)',
                    backgroundColor: 'rgba(44, 82, 130, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    },

    getPacientesHTML: () => {
        const calculateAge = (birthDateStr) => {
            const today = new Date();
            const birthDate = new Date(birthDateStr);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
            return age >= 0 ? age : 0;
        };

        let rows = '';
        if (FAKE_DB.pacientes.length === 0) {
            rows = '<tr><td colspan="5" class="text-center text-gray-500 py-6">No hay pacientes registrados.</td></tr>';
        } else {
            const sortedPacientes = [...FAKE_DB.pacientes].sort((a, b) => a.apellido.localeCompare(b.apellido));
            sortedPacientes.forEach(paciente => {
                const initials = `${paciente.nombre[0] || ''}${paciente.apellido[0] || ''}`.toUpperCase();
                const pacienteJson = JSON.stringify(paciente).replace(/"/g, '&quot;');
                rows += `
                    <tr>
                        <td class="table-cell-avatar">
                            <div class="table-avatar-icon"><span class="table-avatar-initials">${initials}</span></div>
                            <div class="table-cell-text"><div class="table-cell-primary-text">${paciente.nombre} ${paciente.apellido}</div></div>
                        </td>
                        <td class="table-cell-secondary-text">${calculateAge(paciente.fechaNacimiento)} años</td>
                        <td><span class="table-cell-badge ${paciente.genero === 'Femenino' ? 'badge-pink' : paciente.genero === 'Masculino' ? 'badge-blue' : 'badge-gray'}">${paciente.genero}</span></td>
                        <td class="table-cell-secondary-text">${paciente.numeroDocumento}</td>
                        <td class="table-cell-action">
                            <button onclick='app.openModal(${pacienteJson})' title="Editar Paciente"><ion-icon name="pencil-outline"></ion-icon></button>
                            <button onclick="app.handleDeletePaciente(${paciente.id})" class="delete" title="Eliminar Paciente"><ion-icon name="trash-outline"></ion-icon></button>
                        </td>
                    </tr>
                `;
            });
        }

        return `
            <div class="table-container">
                <div class="table-header">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">Gestión de Pacientes</h3>
                        <p class="text-sm text-gray-500 mt-1">Administra y consulta información médica</p>
                    </div>
                    <button onclick="app.openModal()" class="btn btn-primary btn-add">
                        <ion-icon name="add-outline"></ion-icon>Nuevo Paciente
                    </button>
                </div>
                <div class="table-content">
                    <table class="table">
                        <thead><tr><th>Paciente</th><th>Edad</th><th>Género</th><th>Documento</th><th>Acciones</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    getHistoriasHTML: () => {
        let rows = '';
        if (FAKE_DB.historias.length === 0) {
            rows = '<tr><td colspan="5" class="text-center text-gray-500 py-6">No hay historias clínicas registradas.</td></tr>';
        } else {
            [...FAKE_DB.historias].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(historia => {
                const estadoBadge = historia.estado === 'En Tratamiento' ? 'badge-blue' : historia.estado === 'Activo' ? 'badge-green' : historia.estado === 'Dado de Alta' ? 'badge-gray' : 'badge-yellow';
                rows += `
                    <tr>
                        <td class="table-cell-primary-text">${historia.pacienteNombre}</td>
                        <td class="table-cell-secondary-text">${new Date(historia.fecha).toLocaleDateString('es-PE')}</td>
                        <td class="table-cell-secondary-text">${historia.diagnostico}</td>
                        <td><span class="table-cell-badge ${estadoBadge}">${historia.estado}</span></td>
                        <td class="table-cell-action">
                            <button title="Ver Detalles (No implementado)" class="disabled"><ion-icon name="eye-outline"></ion-icon></button>
                            <button title="Editar (No implementado)" class="disabled ml-2"><ion-icon name="pencil-outline"></ion-icon></button>
                        </td>
                    </tr>
                `;
            });
        }

        return `
            <div class="table-container">
                <div class="table-header">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">Historias Clínicas</h3>
                        <p class="text-sm text-gray-500 mt-1">Seguimiento integral de pacientes</p>
                    </div>
                    <button onclick="alert('Funcionalidad no implementada')" class="btn btn-primary btn-add">
                        <ion-icon name="add-outline"></ion-icon>Nueva Historia
                    </button>
                </div>
                <div class="table-content">
                    <table class="table">
                        <thead><tr><th>Paciente</th><th>Última Actualización</th><th>Diagnóstico</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    getAgendaHTML: () => {
        let rows = '';
        const citasFuturas = FAKE_DB.citas
                            .filter(cita => new Date(cita.fechaHora) >= new Date())
                            .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

        if (citasFuturas.length === 0) {
            rows = `<tr><td colspan="7" class="text-center text-gray-500 py-6">No hay citas programadas.</td></tr>`;
        } else {
            citasFuturas.forEach(cita => {
                const estadoBadge = cita.estado === 'Confirmada' ? 'badge-green' : cita.estado === 'Programada' ? 'badge-yellow' : 'badge-red';
                const fechaHora = new Date(cita.fechaHora);
                const fechaStr = fechaHora.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const horaStr = fechaHora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true });
                rows += `
                    <tr>
                        <td class="table-cell-primary-text">${cita.pacienteNombre}</td>
                        <td class="table-cell-secondary-text">${fechaStr}</td>
                        <td class="table-cell-secondary-text">${horaStr}</td>
                        <td class="table-cell-secondary-text">${cita.duracion} min</td>
                        <td><span class="table-cell-badge ${cita.tipo === 'Familiar' ? 'badge-pink' : 'badge-blue'}">${cita.tipo}</span></td>
                        <td><span class="table-cell-badge ${estadoBadge}">${cita.estado}</span></td>
                        <td class="table-cell-action">
                            <button title="Reprogramar (No implementado)" class="disabled"><ion-icon name="calendar-outline"></ion-icon></button>
                            <button title="Cancelar (No implementado)" class="disabled ml-2"><ion-icon name="close-circle-outline"></ion-icon></button>
                        </td>
                    </tr>
                `;
            });
        }

        return `
            <div class="table-container">
                <div class="table-header">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">Agenda de Citas</h3>
                        <p class="text-sm text-gray-500 mt-1">Próximas citas programadas</p>
                    </div>
                    <button onclick="alert('Funcionalidad no implementada')" class="btn btn-primary btn-add">
                        <ion-icon name="add-outline"></ion-icon>Nueva Cita
                    </button>
                </div>
                <div class="table-content">
                    <table class="table">
                        <thead><tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Duración</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    getPagosHTML: () => {
        let rows = '';
        if (FAKE_DB.pagos.length === 0) {
            rows = '<tr><td colspan="6" class="text-center text-gray-500 py-6">No hay transacciones registradas.</td></tr>';
        } else {
            [...FAKE_DB.pagos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(pago => {
                const estadoBadge = pago.estado === 'Pagado' ? 'badge-green' : pago.estado === 'Pendiente' ? 'badge-yellow' : 'badge-red';
                rows += `
                    <tr>
                        <td class="table-cell-primary-text">${pago.pacienteNombre}</td>
                        <td class="table-cell-secondary-text">${new Date(pago.fecha).toLocaleDateString('es-PE')}</td>
                        <td class="table-cell-secondary-text">${pago.descripcion}</td>
                        <td class="table-cell-secondary-text font-medium text-right">S/ ${pago.monto.toFixed(2)}</td>
                        <td><span class="table-cell-badge ${estadoBadge}">${pago.estado}</span></td>
                        <td class="table-cell-action">
                            <button title="Registrar Pago (No implementado)" class="disabled"><ion-icon name="cash-outline"></ion-icon></button>
                            <button title="Ver Factura (No implementado)" class="disabled ml-2"><ion-icon name="document-text-outline"></ion-icon></button>
                        </td>
                    </tr>
                `;
            });
        }
        const ingresosMes = FAKE_DB.pagos.filter(p => p.estado === 'Pagado').reduce((sum, p) => sum + p.monto, 0);
        const pagosPendientes = FAKE_DB.pagos.filter(p => p.estado === 'Pendiente').reduce((sum, p) => sum + p.monto, 0);
        const pagosVencidos = FAKE_DB.pagos.filter(p => p.estado === 'Vencida').reduce((sum, p) => sum + p.monto, 0);

        return `
            <div class="table-container">
                <div class="table-header">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">Módulo de Pagos</h3>
                        <p class="text-sm text-gray-500 mt-1">Control de ingresos y transacciones</p>
                    </div>
                    <button onclick="alert('Funcionalidad no implementada')" class="btn btn-primary btn-add">
                        <ion-icon name="add-outline"></ion-icon>Registrar Pago
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border-b bg-gray-50">
                    <div class="payment-card payment-card-blue"><h4 class="payment-card-title">Ingresos del Mes</h4><p class="payment-card-value">S/ ${ingresosMes.toFixed(2)}</p></div>
                    <div class="payment-card payment-card-yellow"><h4 class="payment-card-title">Pagos Pendientes</h4><p class="payment-card-value">S/ ${pagosPendientes.toFixed(2)}</p></div>
                    <div class="payment-card payment-card-red"><h4 class="payment-card-title">Pagos Vencidos</h4><p class="payment-card-value">S/ ${pagosVencidos.toFixed(2)}</p></div>
                </div>
                <div class="table-content">
                    <h4 class="table-inner-title px-6 pt-4">Transacciones Recientes</h4>
                    <table class="table">
                        <thead><tr><th>Paciente</th><th>Fecha</th><th>Descripción</th><th class="text-right">Monto</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // --- 8. NUEVO: MÓDULO DE RRHH ---
    getRRHHHTML: () => {
        let rows = '';
        if (FAKE_DB.personal.length === 0) {
            rows = '<tr><td colspan="5" class="text-center text-gray-500 py-6">No hay personal registrado.</td></tr>';
        } else {
            const sortedPersonal = [...FAKE_DB.personal].sort((a, b) => a.nombre.localeCompare(b.nombre));
            sortedPersonal.forEach(persona => {
                const rolBadge = persona.rol === 'Psicólogo' ? 'badge-blue' : persona.rol === 'Administrador' ? 'badge-green' : 'badge-gray';
                const personaJson = JSON.stringify(persona).replace(/"/g, '&quot;');
                rows += `
                    <tr>
                        <td class="table-cell-primary-text">${persona.nombre}</td>
                        <td><span class="table-cell-badge ${rolBadge}">${persona.rol}</span></td>
                        <td class="table-cell-secondary-text">${persona.email}</td>
                        <td class="table-cell-secondary-text text-right">S/ ${persona.salario.toFixed(2)}</td>
                        <td class="table-cell-action">
                            <button onclick='app.openPersonalModal(${personaJson})' title="Editar Personal"><ion-icon name="pencil-outline"></ion-icon></button>
                            <button onclick="app.handleDeletePersonal(${persona.id})" class="delete" title="Eliminar Personal"><ion-icon name="trash-outline"></ion-icon></button>
                        </td>
                    </tr>
                `;
            });
        }

        const totalPersonal = FAKE_DB.personal.length;
        const totalSalarios = FAKE_DB.personal.reduce((sum, p) => sum + p.salario, 0);

        return `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="dashboard-card">
                    <h3 class="dashboard-card-title">Personal Total</h3>
                    <p class="dashboard-card-value">${totalPersonal}</p>
                </div>
                <div class="dashboard-card">
                    <h3 class="dashboard-card-title">Gasto en Salarios</h3>
                    <p class="dashboard-card-value value-red">S/ ${totalSalarios.toFixed(2)}</p>
                </div>
            </div>
            <div class="table-container">
                <div class="table-header">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">Gestión de Personal</h3>
                        <p class="text-sm text-gray-500 mt-1">Control y administración de recursos humanos</p>
                    </div>
                    <button onclick="app.openPersonalModal()" class="btn btn-primary btn-add">
                        <ion-icon name="add-outline"></ion-icon>Nuevo Personal
                    </button>
                </div>
                <div class="table-content">
                    <table class="table">
                        <thead><tr><th>Nombre</th><th>Rol</th><th>Email</th><th class="text-right">Salario</th><th>Acciones</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // --- 9. NUEVO: MÓDULO CONTABLE ---
    getContableHTML: () => {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May'];
        const ingresos = FAKE_DB.reportes.ingresosMensuales;
        const egresos = FAKE_DB.reportes.egresosMensuales;

        return `
            <div class="report-section">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Generación de Reportes Contables</h3>
                <p class="text-gray-600 mb-6">Automatiza y estandariza la generación de reportes financieros para el centro psicológico SANKU.</p>
                <div class="report-controls">
                    <select id="reportPeriodo">
                        <option value="mensual">Mensual</option>
                        <option value="trimestral">Trimestral</option>
                        <option value="anual">Anual</option>
                    </select>
                    <input type="date" id="reportFechaInicio" class="modal-input">
                    <input type="date" id="reportFechaFin" class="modal-input">
                    <button onclick="app.generateReporte()" class="btn btn-primary">Generar Reporte</button>
                    <button onclick="app.exportarReporte()" class="btn btn-secondary">Exportar PDF/Excel</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div class="dashboard-card">
                        <h3 class="dashboard-card-title">Balance General</h3>
                        <p class="dashboard-card-value value-green">S/ ${FAKE_DB.reportes.balance.toFixed(2)}</p>
                    </div>
                    <div class="dashboard-card">
                        <h3 class="dashboard-card-title">Ingresos Totales</h3>
                        <p class="dashboard-card-value value-green">S/ ${ingresos.reduce((sum, i) => sum + i, 0).toFixed(2)}</p>
                    </div>
                    <div class="dashboard-card">
                        <h3 class="dashboard-card-title">Egresos Totales</h3>
                        <p class="dashboard-card-value value-red">S/ ${egresos.reduce((sum, e) => sum + e, 0).toFixed(2)}</p>
                    </div>
                </div>
                <div id="reporteChartContainer" class="report-section">
                    <h4 class="text-lg font-semibold text-gray-800 mb-2">Gráfico de Ingresos vs Egresos</h4>
                    <canvas id="contableChart" width="400" height="200"></canvas>
                </div>
            </div>
            <script>
                // Renderizar gráfico contable localmente
                const contableCtx = document.getElementById('contableChart').getContext('2d');
                new Chart(contableCtx, {
                    type: 'bar',
                    data: {
                        labels: meses,
                        datasets: [
                            { label: 'Ingresos', data: ingresos, backgroundColor: 'rgba(39, 103, 73, 0.6)' },
                            { label: 'Egresos', data: egresos, backgroundColor: 'rgba(155, 44, 44, 0.6)' }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: { y: { beginAtZero: true } }
                    }
                });
            </script>
        `;
    },

    // Funciones para reportes (simuladas para backend)
    generateReporte: () => {
        const periodo = document.getElementById('reportPeriodo').value;
        alert(`Reporte ${periodo} generado. En integración con Spring Boot, esto llamaría a /api/reportes/generar con parámetros de fecha.`);
    },

    exportarReporte: () => {
        alert('Exportando reporte en PDF/Excel. En backend, invocaría /api/reportes/exportar.');
    }
};

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = localStorage.getItem('sankuUser');
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && FAKE_DB.users[parsedUser.email]) {
                app.currentUser = parsedUser;
                app.initMainApp();
                return;
            } else {
                localStorage.removeItem('sankuUser');
            }
        } catch (e) {
            console.error("Error parsing stored user:", e);
            localStorage.removeItem('sankuUser');
        }
    }
    // Asegura que el login se muestre al cargar la página
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
});