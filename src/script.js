const { createApp, ref, computed, reactive, onMounted, onUnmounted } = Vue;

createApp({
    setup() {
        // ==========================================
        // 1. ESTADO GLOBAL & NAVEGACIÓN
        // ==========================================
        const currentView = ref('login');
        const rolSeleccionado = ref(null);
        const currentUser = reactive({ nombre: '', rol: '' });
        const mobileMenuOpen = ref(false);

        // Estado de navegación interna del Admin (Secretaría)
        const adminSubView = ref('dashboard');

        // ==========================================
        // 2. ESTADO DE MODALES Y VISTAS DETALLE
        // ==========================================
        const isModalOpen = ref(false);
        const modalType = ref('');
        const modalData = ref(null);

        // Contexto para gestión de carreras
        const selectedCarrera = ref(null);

        // Contexto para LEGAJO ALUMNO
        const selectedStudent = ref(null);

        const careerTab = ref('plan');
        const fixedContextCarrera = ref(false);
        const fixedContextDocente = ref(false);

        // ==========================================
        // 3. LOGIN & UI GENERAL
        // ==========================================
        const activeForm = ref(null);
        const loginData = reactive({ user: '', pass: '' });
        const authError = ref(false);
        const cargandoLogin = ref(false);
        const recuperacionEnviada = ref(false);

        // Timer simulado para barras de progreso
        const timerProgress = ref(0);
        let timerInterval;

        onMounted(() => {
            timerInterval = setInterval(() => {
                if (timerProgress.value >= 100) timerProgress.value = 0;
                else timerProgress.value += 1;
            }, 100);
        });
        onUnmounted(() => { if (timerInterval) clearInterval(timerInterval); });

        // ==========================================
        // 4. VARIABLES CERTIFICADOS & CONFIG
        // ==========================================
        const certSearch = ref('');
        const selectedStudentForCert = ref(null);
        const configData = reactive({
            inscripcionInicio: '2025-11-01',
            inscripcionFin: '2025-12-20',
            inscripcionAbierta: true
        });

        // ==========================================
        // 5. FORMULARIO ASPIRANTE
        // ==========================================
        const aspForm = reactive({ nombre: '', apellido: '', dni: '', email: '', codigo: '', carrera: '' });
        const errors = reactive({ nombre: null, apellido: null, dni: null, email: null, codigo: null, file: null, fileFrontal: null, fileDorso: null, captcha: null });
        const aspiranteEnviado = ref(false);
        const estadoEmail = ref('idle');
        const mostrarInputCodigo = ref(false);

        const archivoNombre = ref(null);
        const archivoDniFrontal = ref(null);
        const archivoDniDorso = ref(null);
        const captchaChecked = ref(false);
        const fileInput = ref(null);
        const fileInputFrontal = ref(null);
        const fileInputDorso = ref(null);

        // ==========================================
        // 6. DATOS FICTICIOS (MOCKS)
        // ==========================================
        const carrerasData = reactive([
            {
                id: 1,
                nombre: 'Tecnicatura Sup. en Desarrollo de Software',
                duracion: '3 Años',
                materias: [
                    { id: 101, n: 'Programación I', t: 'Anual', correlativas: [] },
                    { id: 102, n: 'Sistemas de Información', t: 'Cuatrimestral', correlativas: [] },
                    { id: 103, n: 'Matemática', t: 'Cuatrimestral', correlativas: [] },
                    { id: 104, n: 'Inglés Técnico I', t: 'Anual', correlativas: [] },
                    { id: 105, n: 'Práctica Profesional I', t: 'Anual', correlativas: [] }
                ]
            },
            {
                id: 2,
                nombre: 'Tecnicatura Sup. en Administración',
                duracion: '3 Años',
                materias: [
                    { id: 201, n: 'Contabilidad Básica', t: 'Anual', correlativas: [] },
                    { id: 202, n: 'Administración General', t: 'Cuatrimestral', correlativas: [] },
                    { id: 203, n: 'Derecho Privado', t: 'Cuatrimestral', correlativas: [] },
                    { id: 204, n: 'Economía I', t: 'Anual', correlativas: [] }
                ]
            }
        ]);

        const adminData = reactive([
            // Pendientes
            { id: 101, fechaSolicitud: '18/11/2025', dni: '42.123.456', nombre: 'Gómez, María', email: 'maria.g@gmail.com', carrera: 'Tecnicatura Sup. en Desarrollo de Software', estado: 'Pendiente', pasos: { db: 'pending', moodle: 'pending', sage: 'pending', email: 'pending' }, materiasInscriptas: [] },
            { id: 102, fechaSolicitud: '18/11/2025', dni: '40.987.654', nombre: 'Pérez, Juan', email: 'juan.p@hotmail.com', carrera: 'Tecnicatura Sup. en Administración', estado: 'Pendiente', pasos: { db: 'pending', moodle: 'pending', sage: 'pending', email: 'pending' }, materiasInscriptas: [] },
            { id: 105, fechaSolicitud: '16/11/2025', dni: '43.888.999', nombre: 'Sosa, Elena', email: 'elena.s@yahoo.com', carrera: 'Tecnicatura Sup. en Desarrollo de Software', estado: 'Pendiente', pasos: { db: 'pending', moodle: 'pending', sage: 'pending', email: 'pending' }, materiasInscriptas: [] },

            // Aprobados (Alumnos)
            { id: 103, fechaSolicitud: '17/11/2025', dni: '39.555.111', nombre: 'López, Ana', email: 'ana.l@gmail.com', carrera: 'Tecnicatura Sup. en Desarrollo de Software', estado: 'Aprobado', pasos: { db: 'done', moodle: 'done', sage: 'done', email: 'done' }, materiasInscriptas: ['Programación I', 'Matemática'] },
            { id: 104, fechaSolicitud: '17/11/2025', dni: '41.222.333', nombre: 'Romero, Carlos', email: 'carlos.r@gmail.com', carrera: 'Tecnicatura Sup. en Administración', estado: 'Aprobado', pasos: { db: 'done', moodle: 'done', sage: 'done', email: 'done' }, materiasInscriptas: ['Contabilidad Básica'] },
            // Más alumnos
            { id: 107, fechaSolicitud: '10/11/2025', dni: '35.111.222', nombre: 'Alvarez, Sofia', email: 'sofia.a@gmail.com', carrera: 'Tecnicatura Sup. en Desarrollo de Software', estado: 'Aprobado', pasos: { db: 'done', moodle: 'done', sage: 'done', email: 'done' }, materiasInscriptas: ['Inglés Técnico I', 'Programación I'] },
            { id: 108, fechaSolicitud: '11/11/2025', dni: '36.333.444', nombre: 'Benitez, Lucas', email: 'lucas.b@hotmail.com', carrera: 'Tecnicatura Sup. en Administración', estado: 'Aprobado', pasos: { db: 'done', moodle: 'done', sage: 'done', email: 'done' }, materiasInscriptas: ['Administración General', 'Contabilidad Básica'] },
            { id: 109, fechaSolicitud: '12/11/2025', dni: '37.555.666', nombre: 'Castro, Lucia', email: 'lucia.c@yahoo.com', carrera: 'Tecnicatura Sup. en Desarrollo de Software', estado: 'Aprobado', pasos: { db: 'done', moodle: 'done', sage: 'done', email: 'done' }, materiasInscriptas: ['Programación I', 'Sistemas de Información'] },
            { id: 110, fechaSolicitud: '13/11/2025', dni: '38.777.888', nombre: 'Dominguez, Marcos', email: 'marcos.d@gmail.com', carrera: 'Tecnicatura Sup. en Administración', estado: 'Aprobado', pasos: { db: 'done', moodle: 'done', sage: 'done', email: 'done' }, materiasInscriptas: ['Contabilidad Básica'] },
            { id: 111, fechaSolicitud: '14/11/2025', dni: '39.999.000', nombre: 'Fernandez, Clara', email: 'clara.f@hotmail.com', carrera: 'Tecnicatura Sup. en Desarrollo de Software', estado: 'Aprobado', pasos: { db: 'done', moodle: 'done', sage: 'done', email: 'done' }, materiasInscriptas: ['Práctica Profesional I', 'Matemática'] },
            { id: 112, fechaSolicitud: '14/11/2025', dni: '40.111.222', nombre: 'Garcia, Diego', email: 'diego.g@yahoo.com', carrera: 'Tecnicatura Sup. en Administración', estado: 'Aprobado', pasos: { db: 'done', moodle: 'done', sage: 'done', email: 'done' }, materiasInscriptas: ['Economía I'] }
        ]);

        const docentesData = reactive([
            { id: 1, nombre: 'Prof. Martinez, Jorge', dni: '20.111.222', email: 'j.martinez@instituto.edu.ar', asignaciones: [{ carreraId: 1, materiaId: 101 }] },
            { id: 2, nombre: 'Prof. Sanchez, Laura', dni: '21.333.444', email: 'l.sanchez@instituto.edu.ar', asignaciones: [{ carreraId: 1, materiaId: 102 }, { carreraId: 1, materiaId: 103 }] },
            { id: 3, nombre: 'Prof. Rodriguez, Pablo', dni: '22.555.666', email: 'p.rodriguez@instituto.edu.ar', asignaciones: [{ carreraId: 2, materiaId: 201 }] },
            { id: 4, nombre: 'Prof. Lopez, Maria', dni: '23.777.888', email: 'm.lopez@instituto.edu.ar', asignaciones: [{ carreraId: 2, materiaId: 202 }, { carreraId: 2, materiaId: 204 }] },
            { id: 5, nombre: 'Prof. Gomez, Carlos', dni: '24.999.000', email: 'c.gomez@instituto.edu.ar', asignaciones: [{ carreraId: 1, materiaId: 105 }] },
            { id: 6, nombre: 'Prof. Diaz, Ana', dni: '25.111.222', email: 'a.diaz@instituto.edu.ar', asignaciones: [{ carreraId: 2, materiaId: 203 }] }
        ]);

        // Variables gestión Admin
        const adminSearch = ref('');
        const adminFilterEstado = ref('');
        const adminPage = ref(1);
        const adminItemsPerPage = 5;
        const ordenCol = ref('');
        const ordenAsc = ref(true);

        const newDocente = reactive({ nombre: '', dni: '', email: '' });
        const newMateria = reactive({ id: null, nombre: '', tipo: 'Anual', correlativas: [] });
        const isEditingMateria = ref(false);
        const assignData = reactive({ docenteId: '', carreraId: '', materiaId: '' });

        // ==========================================
        // 7. PROPIEDADES COMPUTADAS
        // ==========================================

        const nombreRolDisplay = computed(() => rolSeleccionado.value === 'admin' ? 'Secretaría' : rolSeleccionado.value);
        const userInitial = computed(() => currentUser.nombre ? currentUser.nombre.charAt(0).toUpperCase() : 'U');
        const pageTitle = computed(() => {
            if (rolSeleccionado.value === 'admin') return 'Gestión Académica';
            if (rolSeleccionado.value === 'aspirante') return 'Trámites de Ingreso';
            return 'Panel de Gestión';
        });

        const pendingCount = computed(() => adminData.filter(i => i.estado === 'Pendiente').length);
        const approvedCount = computed(() => adminData.filter(i => i.estado === 'Aprobado').length);
        const docentesCount = computed(() => docentesData.length);
        const carrerasCount = computed(() => carrerasData.length);

        // Tabla Inscripciones - MODIFICADO EL ORDENAMIENTO
        const adminProcessedData = computed(() => {
            let data = [...adminData];
            const txt = adminSearch.value.toLowerCase();
            data = data.filter(item => {
                const matchText = item.nombre.toLowerCase().includes(txt) || item.dni.includes(txt);
                const matchState = adminFilterEstado.value === '' || item.estado === adminFilterEstado.value;
                return matchText && matchState;
            });
            if (ordenCol.value) {
                data.sort((a, b) => {
                    let valA = a[ordenCol.value]; let valB = b[ordenCol.value];
                    if (ordenCol.value === 'fechaSolicitud') {
                        const pA = valA.split('/'); const pB = valB.split('/');
                        valA = new Date(pA[2], pA[1] - 1, pA[0]).getTime(); valB = new Date(pB[2], pB[1] - 1, pB[0]).getTime();
                    } else { valA = valA.toString().toLowerCase(); valB = valB.toString().toLowerCase(); }
                    if (valA < valB) return ordenAsc.value ? -1 : 1;
                    if (valA > valB) return ordenAsc.value ? 1 : -1;
                    return 0;
                });
            } else {
                // AQUÍ ESTÁ EL CAMBIO: 'Procesando' tiene la misma prioridad (1) que 'Pendiente' (1)
                // Esto evita que salte hacia arriba (antes Procesando era 0)
                const priority = { 'Procesando': 1, 'Pendiente': 1, 'Aprobado': 2 };
                data.sort((a, b) => priority[a.estado] - priority[b.estado]);
            }
            return data;
        });

        const adminPaginatedData = computed(() => {
            const start = (adminPage.value - 1) * adminItemsPerPage;
            return adminProcessedData.value.slice(start, start + adminItemsPerPage);
        });

        const alumnosList = computed(() => adminData.filter(s => s.estado === 'Aprobado'));
        const filteredAlumnosByCareer = computed(() => selectedCarrera.value ? alumnosList.value.filter(a => a.carrera === selectedCarrera.value.nombre) : []);
        const filteredDocentesByCareer = computed(() => selectedCarrera.value ? docentesData.filter(d => d.asignaciones.some(a => a.carreraId === selectedCarrera.value.id)) : []);
        const availableCorrelatives = computed(() => selectedCarrera.value ? selectedCarrera.value.materias.filter(m => m.id !== newMateria.id) : []);

        const filteredStudentsForCert = computed(() => {
            if (!certSearch.value) return alumnosList.value;
            const txt = certSearch.value.toLowerCase();
            return alumnosList.value.filter(a => a.nombre.toLowerCase().includes(txt) || a.dni.includes(txt));
        });

        // ==========================================
        // 8. MÉTODOS
        // ==========================================

        const seleccionarRol = (rol) => {
            if (rolSeleccionado.value === rol && rol !== 'aspirante') return;
            rolSeleccionado.value = rol; activeForm.value = null; loginData.user = ''; loginData.pass = ''; authError.value = false;
            if (rol === 'aspirante') { setTimeout(() => { currentUser.nombre = 'Aspirante Nuevo'; currentView.value = 'app'; }, 200); }
            else { setTimeout(() => { activeForm.value = 'login'; }, 100); setTimeout(() => { const el = document.querySelector('.collapsible-form-container'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 300); }
        };
        const cambiarFormulario = (destino) => { activeForm.value = null; setTimeout(() => { activeForm.value = destino; }, 500); };
        const changeAdminView = (viewName) => { adminSubView.value = viewName; mobileMenuOpen.value = false; };
        const getRoleClass = (rol) => { if (rolSeleccionado.value === rol) return 'border-siga-orange bg-orange-50 text-siga-blue-dark shadow-lg scale-[1.02]'; if (rolSeleccionado.value && rolSeleccionado.value !== rol) return 'opacity-50 scale-95'; return 'border-gray-100 bg-white text-siga-text-light hover:border-siga-blue-mid hover:-translate-y-1'; };
        const login = () => {
            cargandoLogin.value = true;
            setTimeout(() => {
                const r = rolSeleccionado.value; const u = loginData.user; const p = loginData.pass;
                if ((r === 'admin' && u === 'secretaria' && p === 'secretaria') || (r === 'alumno' && u === 'estudiante' && p === 'estudiante') || (r === 'docente' && u === 'docente' && p === 'docente')) {
                    currentUser.nombre = r === 'admin' ? 'Secretaría Académica' : (r === 'docente' ? 'Profesor Demo' : 'Estudiante Demo');
                    currentUser.rol = r; currentView.value = 'app'; adminSubView.value = 'dashboard';
                } else { authError.value = true; }
                cargandoLogin.value = false;
            }, 1000);
        };
        const logout = () => {
            rolSeleccionado.value = null; currentView.value = 'login'; activeForm.value = null; aspiranteEnviado.value = false;
            archivoNombre.value = null; archivoDniFrontal.value = null; archivoDniDorso.value = null; captchaChecked.value = false;
            estadoEmail.value = 'idle'; mostrarInputCodigo.value = false; aspForm.nombre = ''; aspForm.apellido = ''; aspForm.dni = ''; aspForm.email = ''; aspForm.codigo = ''; aspForm.carrera = '';
        };
        const ordenar = (col) => { if (ordenCol.value === col) { ordenAsc.value = !ordenAsc.value; } else { ordenCol.value = col; ordenAsc.value = true; } };

        // FUNCIÓN DE PROCESAMIENTO ASÍNCRONO
        const procesar = async (id) => {
            const sol = adminData.find(s => s.id === id); if (!sol) return;
            sol.estado = 'Procesando';

            // 1. Ponemos TODOS los estados en 'loading' inmediatamente
            sol.pasos.db = 'loading';
            sol.pasos.moodle = 'loading';
            sol.pasos.sage = 'loading';
            sol.pasos.email = 'loading';

            // 2. Tiempos de espera paralelos (no secuenciales)
            const dbTask = new Promise(resolve => {
                setTimeout(() => {
                    sol.pasos.db = 'done';
                    resolve();
                }, 1500); // DB tarda 1.5s
            });

            const emailTask = new Promise(resolve => {
                setTimeout(() => {
                    sol.pasos.email = 'done';
                    resolve();
                }, 1000); // Email es rápido, tarda 1s
            });

            const moodleTask = new Promise(resolve => {
                setTimeout(() => {
                    sol.pasos.moodle = 'done';
                    resolve();
                }, 2500); // Moodle tarda 2.5s
            });

            const sageTask = new Promise(resolve => {
                setTimeout(() => {
                    sol.pasos.sage = 'done';
                    resolve();
                }, 4000); // SAGE es el más lento, tarda 4s
            });

            // 3. Esperamos a que TODAS las tareas terminen
            await Promise.all([dbTask, emailTask, moodleTask, sageTask]);

            // 4. Aprobamos
            sol.estado = 'Aprobado';
        };

        // --- GESTIÓN DE MODALES Y VISTAS DETALLE ---

        // 1. Modal Detalle (Popup en Inscripciones)
        const verDetalleInscripcion = (solicitud) => {
            modalData.value = solicitud;
            modalType.value = 'alumno'; // Reutilizamos el diseño del modal
            isModalOpen.value = true;
        };

        // NUEVA FUNCIÓN: Ir al legajo desde el modal
        const goToLegajo = (solicitud) => {
            closeModal();
            openStudentLegajo(solicitud);
        };

        // 2. Vista Completa Legajo (Menu Alumnos)
        const openStudentLegajo = (alumno) => {
            selectedStudent.value = alumno;

            // Inyectar datos simulados si faltan (Mocks para el legajo completo)
            if (!selectedStudent.value.historialFinales) {
                selectedStudent.value.historialFinales = [
                    { fecha: '15/07/2024', materia: 'Inglés Técnico I', nota: 9, notaStr: 'Nueve' },
                    { fecha: '20/12/2024', materia: 'Programación I', nota: 8, notaStr: 'Ocho' }
                ];
            }
            if (!selectedStudent.value.historialCertificados) {
                selectedStudent.value.historialCertificados = [
                    { tipo: 'Alumno Regular', fecha: '10/03/2025', estado: 'Entregado' },
                    { tipo: 'Constancia de Examen', fecha: '16/07/2024', estado: 'Entregado' }
                ];
            }
            // Simular documentación validada
            if (!selectedStudent.value.documentacion) {
                selectedStudent.value.documentacion = { dniFrente: true, dniDorso: true, titulo: true };
            }

            adminSubView.value = 'detalle_alumno';
        };

        const desinscribirAlumno = (alumno, idx) => { if (confirm('¿Desinscribir al alumno de esta materia?')) alumno.materiasInscriptas.splice(idx, 1); };

        const openAddDocente = () => { newDocente.nombre = ''; newDocente.dni = ''; newDocente.email = ''; modalType.value = 'new_docente'; isModalOpen.value = true; };
        const saveDocente = () => { if (!newDocente.nombre || !newDocente.dni) return; docentesData.push({ id: Date.now(), ...newDocente, asignaciones: [] }); closeModal(); };
        const deleteDocente = (id) => { if (confirm('¿Eliminar docente?')) { const idx = docentesData.findIndex(d => d.id === id); if (idx !== -1) docentesData.splice(idx, 1); } };
        const openAssignDocente = (fromCareer = false) => { assignData.docenteId = ''; assignData.carreraId = ''; assignData.materiaId = ''; if (fromCareer && selectedCarrera.value) { assignData.carreraId = selectedCarrera.value.id; fixedContextCarrera.value = true; fixedContextDocente.value = false; } else { fixedContextCarrera.value = false; fixedContextDocente.value = false; } modalType.value = 'assign_docente'; isModalOpen.value = true; };
        const getMateriasByCarrera = (cId) => { const c = carrerasData.find(x => x.id === cId); return c ? c.materias : []; };
        const confirmAssignment = () => { if (!assignData.docenteId || !assignData.carreraId || !assignData.materiaId) return; const doc = docentesData.find(d => d.id === assignData.docenteId); if (doc) { const exists = doc.asignaciones.find(a => a.carreraId === assignData.carreraId && a.materiaId === assignData.materiaId); if (!exists) doc.asignaciones.push({ carreraId: assignData.carreraId, materiaId: assignData.materiaId }); } closeModal(); };
        const unassignDocente = (docId, cId, mId) => { if (!confirm('¿Quitar asignación?')) return; const doc = docentesData.find(d => d.id === docId); if (doc) { const idx = doc.asignaciones.findIndex(a => a.carreraId === cId && a.materiaId === mId); if (idx !== -1) doc.asignaciones.splice(idx, 1); } };
        const getDocentesAssignedToCareer = (cId) => { const res = []; docentesData.forEach(d => { d.asignaciones.forEach(a => { if (a.carreraId === cId) { const car = carrerasData.find(c => c.id === cId); const mat = car ? car.materias.find(m => m.id === a.materiaId) : null; if (mat) res.push({ docente: d, materia: mat }); } }); }); return res; };
        const getMateriaName = (cId, mId) => { const car = carrerasData.find(c => c.id === cId); const mat = car ? car.materias.find(m => m.id === mId) : null; return mat ? mat.n : 'Desc.'; };
        const getAlumnosCount = (cName) => adminData.filter(a => a.estado === 'Aprobado' && a.carrera === cName).length;
        const getDocentesCount = (cId) => { const set = new Set(); docentesData.forEach(d => { if (d.asignaciones.some(a => a.carreraId === cId)) set.add(d.id); }); return set.size; };
        const openCareerDetail = (carrera) => { selectedCarrera.value = carrera; adminSubView.value = 'detalle_carrera'; careerTab.value = 'plan'; };
        const deleteCarrera = (id) => { if (confirm('¿Eliminar Carrera y todo su plan?')) { const idx = carrerasData.findIndex(c => c.id === id); if (idx !== -1) carrerasData.splice(idx, 1); } };
        const openAddMateria = () => { newMateria.id = null; newMateria.nombre = ''; newMateria.tipo = 'Anual'; newMateria.correlativas = []; isEditingMateria.value = false; modalType.value = 'new_materia'; isModalOpen.value = true; };
        const openEditMateria = (m) => { newMateria.id = m.id; newMateria.nombre = m.n; newMateria.tipo = m.t; newMateria.correlativas = [...m.correlativas]; isEditingMateria.value = true; modalType.value = 'new_materia'; isModalOpen.value = true; };
        const saveMateria = () => { if (!newMateria.nombre) return; if (isEditingMateria.value) { const m = selectedCarrera.value.materias.find(x => x.id === newMateria.id); if (m) { m.n = newMateria.nombre; m.t = newMateria.tipo; m.correlativas = [...newMateria.correlativas]; } } else { selectedCarrera.value.materias.push({ id: Date.now(), n: newMateria.nombre, t: newMateria.tipo, correlativas: [...newMateria.correlativas] }); } closeModal(); };
        const deleteMateria = (idx) => { if (confirm('¿Eliminar materia?')) selectedCarrera.value.materias.splice(idx, 1); };
        const generateCert = (type) => { if (!selectedStudentForCert.value) return; alert(`Generando certificado: ${type}\nPara: ${selectedStudentForCert.value.nombre}\n\n(El archivo se descargaría aquí en un sistema real)`); };
        const saveConfig = () => { alert(`Configuración guardada.\nPeríodo: ${configData.inscripcionInicio} al ${configData.inscripcionFin}\nEstado: ${configData.inscripcionAbierta ? 'Abierto' : 'Cerrado'}`); };

        const closeModal = () => { isModalOpen.value = false; modalData.value = null; modalType.value = ''; fixedContextCarrera.value = false; fixedContextDocente.value = false; };
        const getNodeClass = (status) => { if (status === 'done') return 'bg-siga-success border-siga-success text-white scale-110'; if (status === 'loading') return 'bg-white border-siga-blue-mid text-siga-blue-mid animate-pulse-blue'; return 'bg-gray-50 border-gray-200 text-gray-300'; };
        const getNodeIcon = (status) => { if (status === 'done') return 'ri-check-line'; if (status === 'loading') return 'ri-loader-4-line animate-spin'; return 'ri-checkbox-blank-circle-line'; };
        const validarEmail = () => { if (!aspForm.email.includes('@')) { errors.email = "Email inválido."; return; } errors.email = null; estadoEmail.value = 'loading'; setTimeout(() => { estadoEmail.value = 'sent'; mostrarInputCodigo.value = true; alert("Código Demo: 123456"); }, 1500); };
        const enviarRecuperacion = () => { recuperacionEnviada.value = true; };
        const triggerFileInput = () => { if (fileInput.value) fileInput.value.click(); };
        const seleccionarArchivo = (e) => { const file = e.target.files[0]; if (file) { archivoNombre.value = file.name; errors.file = null; } };
        const triggerDniFrontal = () => { if (fileInputFrontal.value) fileInputFrontal.value.click(); };
        const seleccionarDniFrontal = (e) => { const file = e.target.files[0]; if (file) { archivoDniFrontal.value = file.name; errors.fileFrontal = null; } };
        const triggerDniDorso = () => { if (fileInputDorso.value) fileInputDorso.value.click(); };
        const seleccionarDniDorso = (e) => { const file = e.target.files[0]; if (file) { archivoDniDorso.value = file.name; errors.fileDorso = null; } };
        const toggleCaptcha = () => { captchaChecked.value = !captchaChecked.value; if (captchaChecked.value) errors.captcha = null; };
        const validarAspirante = () => { Object.keys(errors).forEach(k => errors[k] = null); let isValid = true; if (!aspForm.nombre) { errors.nombre = "Requerido"; isValid = false; } if (!aspForm.apellido) { errors.apellido = "Requerido"; isValid = false; } if (!aspForm.dni) { errors.dni = "Requerido"; isValid = false; } if (estadoEmail.value !== 'sent') { errors.email = "Validar Email"; isValid = false; } else if (aspForm.codigo !== '123456') { errors.codigo = "Incorrecto"; isValid = false; } if (!archivoDniFrontal.value) { errors.fileFrontal = "Adjuntar DNI Frente"; isValid = false; } if (!archivoDniDorso.value) { errors.fileDorso = "Adjuntar DNI Dorso"; isValid = false; } if (!archivoNombre.value) { errors.file = "Adjuntar Título"; isValid = false; } if (!captchaChecked.value) { errors.captcha = "Requerido"; isValid = false; } if (isValid) aspiranteEnviado.value = true; };

        return {
            currentView, rolSeleccionado, currentUser, mobileMenuOpen, activeForm, loginData, authError, cargandoLogin, recuperacionEnviada, adminSubView,
            aspForm, errors, aspiranteEnviado, adminSearch, adminFilterEstado, adminPage, adminPaginatedData, adminItemsPerPage, ordenCol, ordenAsc,
            pendingCount, approvedCount, docentesCount, carrerasCount, timerProgress, carrerasData, alumnosList, docentesData,
            nombreRolDisplay, userInitial, pageTitle, estadoEmail, mostrarInputCodigo, archivoNombre, archivoDniFrontal, archivoDniDorso, captchaChecked, fileInput, fileInputFrontal, fileInputDorso,
            isModalOpen, modalData, modalType, newDocente, newMateria, selectedCarrera, careerTab, isEditingMateria, availableCorrelatives, assignData,
            filteredAlumnosByCareer, filteredDocentesByCareer, fixedContextCarrera, fixedContextDocente,
            certSearch, selectedStudentForCert, filteredStudentsForCert, configData, selectedStudent,
            seleccionarRol, cambiarFormulario, changeAdminView, getRoleClass, login, logout, ordenar, procesar, getNodeClass, getNodeIcon, validarEmail, enviarRecuperacion,
            triggerFileInput, seleccionarArchivo, triggerDniFrontal, seleccionarDniFrontal, triggerDniDorso, seleccionarDniDorso, toggleCaptcha, validarAspirante,
            verDetalleInscripcion, openStudentLegajo, desinscribirAlumno, closeModal, openAddDocente, saveDocente, deleteDocente, openCareerDetail, deleteCarrera, openAddMateria, openEditMateria, saveMateria, deleteMateria,
            openAssignDocente, getMateriasByCarrera, confirmAssignment, getDocentesAssignedToCareer, unassignDocente, getMateriaName, getAlumnosCount, getDocentesCount,
            generateCert, saveConfig, goToLegajo
        };
    }
}).mount('#app');