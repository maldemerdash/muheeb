const initIcons = () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
};

const state = {
    admin: null,
    leads: [],
    leadNotes: [],
    events: [],
    siteContent: [],
    siteImages: [],
    interestOptions: [],
    users: [],
    notifications: [],
    activeView: "overviewView",
    editingEvent: null,
    editingInterestOption: null,
    editingUser: null,
    activeLeadId: null,
    coverPath: "",
};

const labels = {
    new: "جديد",
    contacted: "تم التواصل",
    done: "مكتمل",
    archived: "مؤرشف",
    event: "فعاليات",
    marketing: "تسويق",
    identity: "هوية",
    operation: "تشغيل",
};

const statusClasses = {
    new: "lead-status-new",
    contacted: "lead-status-contacted",
    done: "lead-status-done",
    archived: "lead-status-archived",
};

const siteImagePageOrder = {
    hero_main: 10,
    hero_logo: 11,
    identity_gallery_1: 20,
    identity_gallery_2: 21,
    identity_gallery_3: 22,
    identity_gallery_4: 23,
    identity_gallery_5: 24,
    service_1_image: 30,
    service_2_image: 31,
    service_3_image: 32,
    execution_image: 50,
    interest_background: 60,
    footer_logo: 70,
};

const siteImageGroupOrder = {
    identity_gallery: 25,
    services: 40,
    site_core: 80,
    custom: 90,
};

const permissionItems = [
    { key: "overview", label: "نظرة عامة" },
    { key: "leads", label: "طلبات العملاء" },
    { key: "content", label: "محتوى الموقع" },
    { key: "site_images", label: "صور الموقع" },
    { key: "interest_options", label: "اختيارات النموذج" },
    { key: "events", label: "الفعاليات والمعرض" },
    { key: "users", label: "المستخدمون والصلاحيات" },
    { key: "security", label: "الأمان" },
    { key: "delete_leads", label: "حذف طلبات العملاء" },
    { key: "assign_notes", label: "إسناد ملاحظات المتابعة" },
];

const loginView = document.getElementById("loginView");
const adminShell = document.getElementById("adminShell");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const globalMessage = document.getElementById("globalMessage");
const pageTitle = document.getElementById("pageTitle");
const toastStack = document.getElementById("toastStack");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileButton = document.getElementById("profileButton");
const profileMenu = document.getElementById("profileMenu");
const notificationsButton = document.getElementById("notificationsButton");
const notificationsMenu = document.getElementById("notificationsMenu");
const notificationList = document.getElementById("notificationList");
const notificationBadge = document.getElementById("notificationBadge");
const notificationCount = document.getElementById("notificationCount");
const leadsTable = document.getElementById("leadsTable");
const latestLeads = document.getElementById("latestLeads");
const activityChart = document.getElementById("activityChart");
const eventsList = document.getElementById("eventsList");
const eventForm = document.getElementById("eventForm");
const eventFormTitle = document.getElementById("eventFormTitle");
const eventFormMessage = document.getElementById("eventFormMessage");
const passwordForm = document.getElementById("passwordForm");
const passwordMessage = document.getElementById("passwordMessage");
const eventIdInput = document.getElementById("eventId");
const coverInput = document.getElementById("coverInput");
const galleryInput = document.getElementById("galleryInput");
const coverName = document.getElementById("coverName");
const galleryName = document.getElementById("galleryName");
const coverPreview = document.getElementById("coverPreview");
const galleryPreview = document.getElementById("galleryPreview");
const leadStatusFilter = document.getElementById("leadStatusFilter");
const leadSearch = document.getElementById("leadSearch");
const contentEditor = document.getElementById("contentEditor");
const contentMessage = document.getElementById("contentMessage");
const saveContentButton = document.getElementById("saveContentButton");
const siteImageList = document.getElementById("siteImageList");
const siteImageForm = document.getElementById("siteImageForm");
const newSiteImageFile = document.getElementById("newSiteImageFile");
const siteImageFormMessage = document.getElementById("siteImageFormMessage");
const restoreSiteImagesButton = document.getElementById("restoreSiteImagesButton");
const interestOptionForm = document.getElementById("interestOptionForm");
const interestOptionFormTitle = document.getElementById("interestOptionFormTitle");
const interestOptionMessage = document.getElementById("interestOptionMessage");
const interestOptionList = document.getElementById("interestOptionList");
const leadModal = document.getElementById("leadModal");
const leadModalTitle = document.getElementById("leadModalTitle");
const leadDetailGrid = document.getElementById("leadDetailGrid");
const leadNotesList = document.getElementById("leadNotesList");
const leadNoteForm = document.getElementById("leadNoteForm");
const leadNoteAssignee = document.getElementById("leadNoteAssignee");
const leadModalProgress = document.getElementById("leadModalProgress");
const userForm = document.getElementById("userForm");
const userFormTitle = document.getElementById("userFormTitle");
const userFormMessage = document.getElementById("userFormMessage");
const permissionsGrid = document.getElementById("permissionsGrid");
const usersList = document.getElementById("usersList");

const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[char]));

const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("ar-SA", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

const parseLeadNotes = (value) => {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
            return parsed.map((note, index) => ({
                id: note.id || `note-${index}`,
                text: String(note.text || "").trim(),
                done: Boolean(note.done),
                createdAt: note.createdAt || "",
                doneAt: note.doneAt || "",
                createdBy: note.createdBy || "",
                createdByName: note.createdByName || "",
                assignedTo: note.assignedTo || "",
                assignedToName: note.assignedToName || "",
                legacy: false,
            })).filter((note) => note.text);
        }
    } catch (error) {
        return [{
            id: "legacy-note",
            text: String(value).trim(),
            done: false,
            createdAt: "",
            doneAt: "",
            createdBy: "",
            createdByName: "",
            assignedTo: "",
            assignedToName: "",
            legacy: true,
        }].filter((note) => note.text);
    }
    return [];
};

const stringifyLeadNotes = (notes) => JSON.stringify(notes);

const getActiveLead = () => state.leads.find((lead) => lead.id === state.activeLeadId);

const isOwner = () => state.admin?.role === "owner";

const can = (permission) => (
    isOwner() ||
    state.admin?.permissions?.all === true ||
    state.admin?.permissions?.[permission] === true
);

const getDisplayName = (user = state.admin) => user?.fullName || user?.username || user?.email || user?.authEmail || "مستخدم";

const getUserById = (userId) => state.users.find((user) => user.userId === userId);

const canViewNote = (note) => {
    if (isOwner() || can("users")) return true;
    if (!note.assignedTo) return true;
    return note.assignedTo === state.admin?.userId;
};

const enrichLeadNote = (note) => {
    const assignee = getUserById(note.assignedTo);
    const creator = getUserById(note.createdBy);
    return {
        ...note,
        assignedToName: note.assignedToName || (assignee ? getDisplayName(assignee) : "غير محدد"),
        createdByName: note.createdByName || (creator ? getDisplayName(creator) : ""),
    };
};

const getLeadNotes = (lead) => [
    ...parseLeadNotes(lead.adminNotes),
    ...state.leadNotes
        .filter((note) => Number(note.leadId) === Number(lead.id))
        .map(enrichLeadNote),
];

const getVisibleNotes = (lead) => getLeadNotes(lead).filter(canViewNote);

const getProgress = (lead) => {
    const notes = getVisibleNotes(lead);
    const total = notes.length;
    const done = notes.filter((note) => note.done).length;
    return {
        total,
        done,
        percent: total ? Math.round((done / total) * 100) : 0,
    };
};

const getLatestNoteText = (lead) => {
    const notes = getVisibleNotes(lead);
    if (!notes.length) return "لا توجد ملاحظات";
    const latest = notes[notes.length - 1];
    return `${latest.done ? "تم: " : ""}${latest.text}`;
};

const renderProgressBar = (lead, compact = false) => {
    const progress = getProgress(lead);
    return `
        <div class="progress-wrap ${compact ? "compact-progress" : ""}">
            <div class="progress-meta">
                <span>${progress.done} من ${progress.total} منجزة</span>
                <strong>${progress.percent}%</strong>
            </div>
            <div class="progress-track">
                <span style="width: ${progress.percent}%"></span>
            </div>
        </div>
    `;
};

const getSiteImagePageRank = (image) => {
    if (Object.prototype.hasOwnProperty.call(siteImagePageOrder, image.imageKey)) {
        return siteImagePageOrder[image.imageKey];
    }
    return siteImageGroupOrder[image.groupName] || 100;
};

const sortSiteImagesByPageOrder = (images) => [...(images || [])].sort((a, b) => {
    const rankDiff = getSiteImagePageRank(a) - getSiteImagePageRank(b);
    if (rankDiff) return rankDiff;
    const sortDiff = (a.sortOrder || 0) - (b.sortOrder || 0);
    if (sortDiff) return sortDiff;
    return (a.id || 0) - (b.id || 0);
});

const showMessage = (message, target = globalMessage, type = "success") => {
    if (!message) return;
    if (target) {
        target.textContent = message;
        window.setTimeout(() => {
            if (target.textContent === message) target.textContent = "";
        }, 3000);
    }
    if (!toastStack) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "is-error" : "is-success"}`;
    toast.innerHTML = `
        <i data-lucide="${type === "error" ? "alert-circle" : "check-circle-2"}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    toastStack.appendChild(toast);
    initIcons();
    window.setTimeout(() => {
        toast.classList.add("is-leaving");
        window.setTimeout(() => toast.remove(), 260);
    }, 3000);
};

const showError = (message, target = globalMessage) => showMessage(message || "حدث خطأ غير متوقع.", target, "error");

const showApp = () => {
    loginView.classList.add("is-hidden");
    adminShell.classList.remove("is-hidden");
    profileName.textContent = getDisplayName();
    profileEmail.textContent = state.admin?.email || state.admin?.authEmail || "";
    applyPermissions();
};

const showLogin = () => {
    adminShell.classList.add("is-hidden");
    loginView.classList.remove("is-hidden");
};

const setView = (viewId) => {
    const targetButton = document.querySelector(`[data-view="${viewId}"]`);
    const permission = targetButton?.dataset.permission;
    if (permission && !can(permission)) {
        const fallback = getFirstAllowedView();
        if (fallback && fallback !== viewId) {
            setView(fallback);
        }
        return;
    }
    state.activeView = viewId;
    document.querySelectorAll(".admin-view").forEach((view) => {
        view.classList.toggle("active", view.id === viewId);
    });
    document.querySelectorAll(".nav-item").forEach((button) => {
        button.classList.toggle("active", button.dataset.view === viewId);
    });
    pageTitle.textContent = document.querySelector(`[data-view="${viewId}"] span`)?.textContent || "لوحة التحكم";
};

const getFirstAllowedView = () => {
    const button = Array.from(document.querySelectorAll(".nav-item")).find((item) => {
        const permission = item.dataset.permission;
        return !permission || can(permission);
    });
    return button?.dataset.view || "overviewView";
};

const applyPermissions = () => {
    document.querySelectorAll("[data-permission]").forEach((element) => {
        element.classList.toggle("is-hidden", !can(element.dataset.permission));
    });
    document.querySelectorAll("[data-requires-delete-leads]").forEach((element) => {
        element.classList.toggle("is-hidden", !can("delete_leads"));
    });
    if (!can(document.querySelector(`[data-view="${state.activeView}"]`)?.dataset.permission || "overview")) {
        setView(getFirstAllowedView());
    }
};

const loadAll = async () => {
    const [stats, leads, events] = await Promise.all([
        window.MuheebData.getStats(),
        window.MuheebData.listLeads(),
        window.MuheebData.listAdminEvents(),
    ]);
    let siteContent = [];
    let siteImages = [];
    let interestOptions = [];
    let users = [];
    let notifications = [];
    let leadNotes = [];
    try {
        [siteContent, siteImages, interestOptions] = await Promise.all([
            window.MuheebData.listSiteContent(),
            window.MuheebData.listSiteImages(),
            window.MuheebData.listInterestOptions(),
        ]);
    } catch (error) {
        showMessage("لتفعيل إدارة المحتوى والصور والاختيارات شغّل ملف supabase/cms_upgrade.sql في Supabase.");
    }
    try {
        [users, notifications, leadNotes] = await Promise.all([
            window.MuheebData.listAdminUsers(),
            window.MuheebData.listNotifications(),
            window.MuheebData.listLeadNotes(),
        ]);
    } catch (error) {
        users = state.admin ? [state.admin] : [];
        notifications = [];
        leadNotes = [];
        showMessage("لتفعيل المستخدمين والصلاحيات شغّل ملف supabase/team_permissions_upgrade.sql في Supabase.", globalMessage, "error");
    }
    state.leads = leads || [];
    state.leadNotes = leadNotes || [];
    state.events = events || [];
    state.siteContent = siteContent || [];
    state.siteImages = sortSiteImagesByPageOrder(siteImages);
    state.interestOptions = interestOptions || [];
    state.users = users || [];
    state.notifications = notifications || [];
    renderStats(stats || {});
    renderLeads();
    renderEvents();
    renderContentEditor();
    renderSiteImages();
    renderInterestOptions();
    renderUsers();
    renderNotifications();
    applyPermissions();
    initIcons();
};

const renderStats = (stats) => {
    document.getElementById("leadTotal").textContent = stats.leadTotal || 0;
    document.getElementById("leadNew").textContent = stats.leadNew || 0;
    document.getElementById("eventTotal").textContent = stats.eventTotal || 0;
    document.getElementById("eventPublished").textContent = stats.eventPublished || 0;

    latestLeads.innerHTML = state.leads.slice(0, 5).map((lead) => `
        <button class="compact-item clickable-compact" type="button" data-open-lead="${lead.id}">
            <strong>${escapeHtml(lead.name)}</strong>
            <span>${escapeHtml(lead.countryCode)} ${escapeHtml(lead.phone)} - ${escapeHtml(lead.service)}</span>
            <span>${formatDate(lead.createdAt)}</span>
            ${renderProgressBar(lead, true)}
        </button>
    `).join("") || `<div class="compact-item"><span>لا توجد طلبات حتى الآن.</span></div>`;

    const chartRows = [
        { label: "طلبات العملاء", value: stats.leadTotal || 0, color: "var(--burgundy)" },
        { label: "طلبات جديدة", value: stats.leadNew || 0, color: "var(--gold)" },
        { label: "الفعاليات", value: stats.eventTotal || 0, color: "var(--charcoal)" },
        { label: "منشورة", value: stats.eventPublished || 0, color: "var(--success)" },
    ];
    const maxValue = Math.max(...chartRows.map((row) => row.value), 1);
    activityChart.innerHTML = chartRows.map((row) => `
        <div class="chart-row">
            <span>${escapeHtml(row.label)}</span>
            <div class="chart-track">
                <strong style="width: ${Math.max(8, Math.round((row.value / maxValue) * 100))}%; background: ${row.color};"></strong>
            </div>
            <b>${row.value}</b>
        </div>
    `).join("");
};

const renderLeads = () => {
    const filter = leadStatusFilter.value || "all";
    const term = String(leadSearch?.value || "").trim().toLowerCase();
    const leads = (filter === "all" ? state.leads : state.leads.filter((lead) => lead.status === filter))
        .filter((lead) => {
            if (!term) return true;
            return [
                lead.name,
                lead.phone,
                lead.countryCode,
                lead.service,
                lead.source,
                lead.message,
            ].some((value) => String(value || "").toLowerCase().includes(term));
        });
    leadsTable.innerHTML = leads.map((lead) => `
        <tr class="${escapeHtml(statusClasses[lead.status] || "")}">
            <td><strong>#${lead.id}</strong></td>
            <td>
                <div class="lead-name">
                    <button class="lead-link" type="button" data-open-lead="${lead.id}">${escapeHtml(lead.name)}</button>
                    <small>${escapeHtml(labels[lead.status] || lead.status)}</small>
                </div>
            </td>
            <td>
                <a href="tel:+${escapeHtml(lead.countryCode)}${escapeHtml(lead.phone)}">+${escapeHtml(lead.countryCode)} ${escapeHtml(lead.phone)}</a>
            </td>
            <td>${escapeHtml(lead.service)}</td>
            <td>${escapeHtml(lead.source)}</td>
            <td class="message-cell">${escapeHtml(lead.message || "لا توجد رسالة")}</td>
            <td>
                <select class="status-select ${escapeHtml(statusClasses[lead.status] || "")}" data-lead-status="${lead.id}">
                    ${Object.entries(labels).filter(([key]) => ["new", "contacted", "done", "archived"].includes(key)).map(([key, label]) => `
                        <option value="${key}" ${lead.status === key ? "selected" : ""}>${label}</option>
                    `).join("")}
                </select>
            </td>
            <td class="message-cell">
                <span>${escapeHtml(getLatestNoteText(lead))}</span>
                ${renderProgressBar(lead, true)}
            </td>
            <td>${formatDate(lead.createdAt)}</td>
            <td>
                <div class="lead-actions">
                    <a class="ghost-btn" href="https://wa.me/${escapeHtml(lead.countryCode)}${escapeHtml(lead.phone)}" target="_blank" rel="noopener">
                        <i data-lucide="message-circle"></i>
                        <span>واتساب</span>
                    </a>
                    ${can("delete_leads") ? `
                        <button class="danger-btn icon-only small-icon" type="button" data-delete-lead="${lead.id}" title="حذف الطلب">
                            <i data-lucide="trash-2"></i>
                        </button>
                    ` : ""}
                </div>
            </td>
        </tr>
    `).join("") || `<tr><td colspan="10">لا توجد طلبات بهذه الحالة.</td></tr>`;
    initIcons();
};

const renderLeadModal = () => {
    const lead = getActiveLead();
    if (!lead || !leadModal) return;
    leadModalTitle.textContent = lead.name;
    leadModalProgress.innerHTML = renderProgressBar(lead);
    leadDetailGrid.innerHTML = `
        <article>
            <span>رقم الطلب</span>
            <strong>#${escapeHtml(lead.id)}</strong>
        </article>
        <article>
            <span>اسم العميل</span>
            <strong>${escapeHtml(lead.name)}</strong>
        </article>
        <article>
            <span>الجوال</span>
            <a href="tel:+${escapeHtml(lead.countryCode)}${escapeHtml(lead.phone)}">+${escapeHtml(lead.countryCode)} ${escapeHtml(lead.phone)}</a>
        </article>
        <article>
            <span>واتساب</span>
            <a href="https://wa.me/${escapeHtml(lead.countryCode)}${escapeHtml(lead.phone)}" target="_blank" rel="noopener">فتح واتساب</a>
        </article>
        <article>
            <span>مجال الاهتمام</span>
            <strong>${escapeHtml(lead.service)}</strong>
        </article>
        <article>
            <span>المصدر</span>
            <strong>${escapeHtml(lead.source)}</strong>
        </article>
        <article>
            <span>الحالة</span>
            <select class="status-select ${escapeHtml(statusClasses[lead.status] || "")}" data-modal-lead-status="${lead.id}">
                ${Object.entries(labels).filter(([key]) => ["new", "contacted", "done", "archived"].includes(key)).map(([key, label]) => `
                    <option value="${key}" ${lead.status === key ? "selected" : ""}>${label}</option>
                `).join("")}
            </select>
        </article>
        <article>
            <span>تاريخ الإرسال</span>
            <strong>${formatDate(lead.createdAt)}</strong>
        </article>
        <article class="detail-wide">
            <span>رسالة العميل</span>
            <p>${escapeHtml(lead.message || "لا توجد رسالة")}</p>
        </article>
    `;
    const assignableUsers = can("assign_notes") ? state.users.filter((user) => user.active) : [state.admin];
    leadNoteAssignee.innerHTML = assignableUsers
        .filter((user) => user.active)
        .map((user) => `
            <option value="${escapeHtml(user.userId)}">${escapeHtml(getDisplayName(user))}</option>
        `).join("") || `<option value="">لا يوجد مستخدمون</option>`;
    leadNoteAssignee.disabled = !can("assign_notes");
    if (state.admin?.userId) {
        leadNoteAssignee.value = state.admin.userId;
    }
    renderLeadNotes(lead);
    leadModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    initIcons();
};

const renderLeadNotes = (lead) => {
    const notes = getVisibleNotes(lead);
    leadNotesList.innerHTML = notes.map((note) => `
        <article class="lead-note ${note.done ? "is-done" : ""}">
            <div>
                <p>${escapeHtml(note.text)}</p>
                <span>${note.createdAt ? formatDate(note.createdAt) : "ملاحظة سابقة"}</span>
                <span>مسندة إلى: ${escapeHtml(note.assignedToName || getUserById(note.assignedTo)?.fullName || "غير محدد")}</span>
                ${note.createdByName ? `<span>أضيفت بواسطة: ${escapeHtml(note.createdByName)}</span>` : ""}
                ${note.doneAt ? `<span>أُنجزت: ${formatDate(note.doneAt)}</span>` : ""}
            </div>
            <button class="${note.done ? "ghost-btn" : "primary-btn"}" type="button" data-complete-note="${escapeHtml(note.id)}" ${note.legacy || note.done || (note.assignedTo && note.assignedTo !== state.admin?.userId && !isOwner() && !can("users")) ? "disabled" : ""}>
                <i data-lucide="check"></i>
                <span>${note.legacy ? "قديمة" : note.done ? "تم" : "إنجاز"}</span>
            </button>
        </article>
    `).join("") || `<div class="compact-item"><span>لا توجد ملاحظات متابعة حتى الآن.</span></div>`;
    initIcons();
};

const openLeadModal = (leadId) => {
    state.activeLeadId = leadId;
    renderLeadModal();
};

const closeLeadModal = () => {
    state.activeLeadId = null;
    leadModal?.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
    leadNoteForm?.reset();
};

const saveLeadNotes = async (lead, notes) => {
    await window.MuheebData.updateLead(lead.id, {
        status: lead.status,
        adminNotes: stringifyLeadNotes(notes),
    });
    await loadAll();
    state.activeLeadId = lead.id;
    renderLeadModal();
};

const addLeadNote = async (text, assignedTo = "") => {
    const lead = getActiveLead();
    if (!lead || !text.trim()) return;
    const assignee = getUserById(assignedTo) || state.admin;
    await window.MuheebData.createLeadNote({
        leadId: lead.id,
        text: text.trim(),
        assignedTo: assignee?.userId || state.admin?.userId || "",
    });
    await loadAll();
    state.activeLeadId = lead.id;
    renderLeadModal();
};

const completeLeadNote = async (noteId) => {
    const lead = getActiveLead();
    if (!lead) return;
    const completedNote = await window.MuheebData.completeLeadNote(noteId);
    if (completedNote) {
        await window.MuheebData.createNotification({
            targetUserId: completedNote.createdBy || null,
            leadId: lead.id,
            noteId,
            kind: "note_done",
            title: "تم إنجاز ملاحظة متابعة",
            message: `${getDisplayName()} أنجز ملاحظة على طلب ${lead.name}.`,
        }).catch(() => null);
        await loadAll();
        state.activeLeadId = lead.id;
        renderLeadModal();
    }
};

const renderEvents = () => {
    eventsList.innerHTML = state.events.map((event) => `
        <article class="event-item">
            <img src="${escapeHtml(event.coverImage || "assets/logo-meheib.png")}" alt="">
            <div>
                <strong>${escapeHtml(event.title)}</strong>
                <div class="meta-text">${escapeHtml(labels[event.category] || event.category)} - ${escapeHtml(event.location || "بدون موقع")}</div>
                <span class="badge ${event.published ? "" : "is-dim"}">${event.published ? "منشور" : "مخفي"}</span>
                <div class="event-actions">
                    <button class="ghost-btn" type="button" data-edit-event="${event.id}">
                        <i data-lucide="pencil"></i>
                        <span>تعديل</span>
                    </button>
                    <button class="danger-btn" type="button" data-delete-event="${event.id}">
                        <i data-lucide="trash-2"></i>
                        <span>حذف</span>
                    </button>
                </div>
            </div>
        </article>
    `).join("") || `<div class="compact-item"><span>لا توجد فعاليات حتى الآن.</span></div>`;
    initIcons();
};

const groupBy = (items, key) => items.reduce((groups, item) => {
    const groupName = item[key] || "عام";
    if (!groups[groupName]) groups[groupName] = [];
    groups[groupName].push(item);
    return groups;
}, {});

const renderContentEditor = () => {
    if (!contentEditor) return;
    const groups = groupBy(state.siteContent, "groupName");
    contentEditor.innerHTML = Object.entries(groups).map(([groupName, rows]) => `
        <section class="content-group">
            <h3>${escapeHtml(groupName)}</h3>
            <div class="content-fields">
                ${rows.map((row) => {
                    const tag = row.inputType === "textarea" ? "textarea" : "input";
                    const input = tag === "textarea"
                        ? `<textarea rows="4" data-content-input="${escapeHtml(row.contentKey)}">${escapeHtml(row.value)}</textarea>`
                        : `<input type="${row.inputType === "email" ? "email" : row.inputType === "url" ? "url" : "text"}" value="${escapeHtml(row.value)}" data-content-input="${escapeHtml(row.contentKey)}">`;
                    return `
                        <label>
                            <span>${escapeHtml(row.label)}</span>
                            ${input}
                        </label>
                    `;
                }).join("")}
            </div>
        </section>
    `).join("") || `<div class="compact-item"><span>لم يتم تجهيز جدول محتوى الموقع بعد. شغّل ملف ترقية Supabase أولًا.</span></div>`;
};

const renderSiteImages = () => {
    if (!siteImageList) return;
    siteImageList.innerHTML = state.siteImages.map((image) => `
        <article class="site-image-card" data-site-image-card="${image.id}">
            <img src="${escapeHtml(image.imagePath || "assets/logo-meheib.png")}" alt="">
            <div class="site-image-fields">
                <div class="form-grid">
                    <label>
                        <span>مفتاح الصورة</span>
                        <input type="text" data-site-image-key value="${escapeHtml(image.imageKey)}">
                    </label>
                    <label>
                        <span>اسم الصورة</span>
                        <input type="text" data-site-image-label value="${escapeHtml(image.label)}">
                    </label>
                    <label>
                        <span>المجموعة</span>
                        <input type="text" data-site-image-group value="${escapeHtml(image.groupName)}">
                    </label>
                    <label>
                        <span>الترتيب</span>
                        <input type="number" data-site-image-sort value="${escapeHtml(image.sortOrder)}">
                    </label>
                </div>
                <label>
                <span>وصف الصورة</span>
                    <input type="text" data-site-image-alt value="${escapeHtml(image.altText)}">
                </label>
                <label class="upload-box">
                    <span>استبدال الصورة</span>
                    <input type="file" data-site-image-file accept="image/png,image/jpeg,image/webp,image/gif">
                </label>
                <label class="toggle-field compact-toggle">
                    <input type="checkbox" data-site-image-published ${image.published ? "checked" : ""}>
                    <span>ظاهرة في الموقع</span>
                </label>
                <div class="event-actions">
                    <button class="ghost-btn" type="button" data-save-site-image="${image.id}">
                        <i data-lucide="save"></i>
                        <span>حفظ</span>
                    </button>
                    <button class="ghost-btn" type="button" data-toggle-site-image="${image.id}">
                        <i data-lucide="${image.published ? "eye-off" : "eye"}"></i>
                        <span>${image.published ? "إخفاء" : "إظهار"}</span>
                    </button>
                </div>
            </div>
        </article>
    `).join("") || `<div class="compact-item"><span>لا توجد صور في المكتبة.</span></div>`;
    initIcons();
};

const resetInterestOptionForm = () => {
    state.editingInterestOption = null;
    interestOptionForm.reset();
    interestOptionForm.elements.optionId.value = "";
    interestOptionForm.elements.published.checked = true;
    interestOptionForm.elements.sortOrder.value = "0";
    interestOptionFormTitle.textContent = "إضافة اختيار اهتمام";
};

const renderInterestOptions = () => {
    if (!interestOptionList) return;
    interestOptionList.innerHTML = state.interestOptions.map((option) => `
        <article class="interest-option-item">
            <div>
                <strong>${escapeHtml(option.label)}</strong>
                <span>${escapeHtml(option.value)} - ترتيب ${escapeHtml(option.sortOrder)}</span>
                <span class="badge ${option.published ? "" : "is-dim"}">${option.published ? "ظاهر" : "مخفي"}</span>
            </div>
            <div class="event-actions">
                <button class="ghost-btn" type="button" data-edit-interest-option="${option.id}">
                    <i data-lucide="pencil"></i>
                    <span>تعديل</span>
                </button>
                <button class="ghost-btn" type="button" data-toggle-interest-option="${option.id}">
                    <i data-lucide="${option.published ? "eye-off" : "eye"}"></i>
                    <span>${option.published ? "إخفاء" : "إظهار"}</span>
                </button>
            </div>
        </article>
    `).join("") || `<div class="compact-item"><span>لا توجد اختيارات بعد.</span></div>`;
    initIcons();
};

const resetEventForm = () => {
    state.editingEvent = null;
    state.coverPath = "";
    eventForm.reset();
    eventIdInput.value = "";
    eventFormTitle.textContent = "إضافة فعالية";
    coverName.textContent = "لم يتم اختيار صورة جديدة";
    galleryName.textContent = "يمكن اختيار أكثر من صورة";
    coverPreview.removeAttribute("src");
    galleryPreview.innerHTML = "";
    eventForm.elements.published.checked = true;
    eventForm.elements.sortOrder.value = "0";
};

const editEvent = (eventId) => {
    const event = state.events.find((item) => item.id === eventId);
    if (!event) return;
    state.editingEvent = event;
    state.coverPath = event.coverImage || "";
    eventIdInput.value = event.id;
    eventFormTitle.textContent = "تعديل فعالية";
    eventForm.elements.title.value = event.title || "";
    eventForm.elements.category.value = event.category || "event";
    eventForm.elements.location.value = event.location || "";
    eventForm.elements.eventDate.value = event.eventDate || "";
    eventForm.elements.description.value = event.description || "";
    eventForm.elements.highlights.value = (event.highlights || []).join("\n");
    eventForm.elements.sortOrder.value = event.sortOrder || 0;
    eventForm.elements.published.checked = Boolean(event.published);
    coverName.textContent = event.coverImage ? event.coverImage : "لم يتم اختيار صورة جديدة";
    if (event.coverImage) {
        coverPreview.src = event.coverImage;
    } else {
        coverPreview.removeAttribute("src");
    }
    renderGallery(event.gallery || []);
    setView("eventsView");
};

const renderGallery = (gallery) => {
    galleryPreview.innerHTML = gallery.map((image) => `
        <div class="gallery-thumb">
            <img src="${escapeHtml(image.imagePath)}" alt="">
            <button type="button" title="حذف الصورة" data-delete-image="${image.id}">×</button>
        </div>
    `).join("") || `<span class="meta-text">لا توجد صور إضافية.</span>`;
};

const uploadFiles = async (files, folder = "events") => {
    return window.MuheebData.uploadFiles(files, folder);
};

const saveEvent = async (event) => {
    event.preventDefault();
    showMessage("جاري حفظ الفعالية...", eventFormMessage);
    try {
        const coverFiles = coverInput.files;
        const galleryFiles = galleryInput.files;
        if (coverFiles && coverFiles.length) {
            const uploadedCover = await uploadFiles(coverFiles);
            state.coverPath = uploadedCover[0]?.path || state.coverPath;
        }
        const uploadedGallery = await uploadFiles(galleryFiles);
        const payload = {
            title: eventForm.elements.title.value,
            category: eventForm.elements.category.value,
            location: eventForm.elements.location.value,
            eventDate: eventForm.elements.eventDate.value,
            description: eventForm.elements.description.value,
            highlights: eventForm.elements.highlights.value.split("\n").map((item) => item.trim()).filter(Boolean),
            sortOrder: Number(eventForm.elements.sortOrder.value || 0),
            published: eventForm.elements.published.checked,
            coverImage: state.coverPath,
            galleryImages: uploadedGallery.map((file) => file.path),
        };
        const eventId = Number(eventIdInput.value || 0);
        await window.MuheebData.saveEvent(payload, eventId || null);
        resetEventForm();
        await loadAll();
        showMessage("تم حفظ الفعالية بنجاح.", eventFormMessage);
    } catch (error) {
        showError(error.message, eventFormMessage);
    }
};

const saveSiteContent = async () => {
    showMessage("جاري حفظ النصوص...", contentMessage);
    try {
        const rows = Array.from(contentEditor.querySelectorAll("[data-content-input]")).map((input) => {
            const source = state.siteContent.find((item) => item.contentKey === input.dataset.contentInput) || {};
            return {
                ...source,
                contentKey: input.dataset.contentInput,
                value: input.value,
            };
        });
        state.siteContent = await window.MuheebData.saveSiteContent(rows);
        await loadAll();
        showMessage("تم حفظ نصوص الموقع بنجاح.", contentMessage);
    } catch (error) {
        showError(error.message, contentMessage);
    }
};

const readSiteImageCardPayload = async (imageId) => {
    const card = siteImageList.querySelector(`[data-site-image-card="${imageId}"]`);
    const existing = state.siteImages.find((image) => image.id === imageId);
    if (!card || !existing) return null;
    let imagePath = existing.imagePath;
    const fileInput = card.querySelector("[data-site-image-file]");
    if (fileInput?.files?.length) {
        const uploaded = await uploadFiles(fileInput.files, "site");
        imagePath = uploaded[0]?.path || imagePath;
    }
    return {
        imageKey: card.querySelector("[data-site-image-key]")?.value,
        label: card.querySelector("[data-site-image-label]")?.value,
        groupName: card.querySelector("[data-site-image-group]")?.value,
        imagePath,
        altText: card.querySelector("[data-site-image-alt]")?.value,
        sortOrder: Number(card.querySelector("[data-site-image-sort]")?.value || 0),
        published: card.querySelector("[data-site-image-published]")?.checked,
    };
};

const saveExistingSiteImage = async (imageId) => {
    showMessage("جاري حفظ الصورة...");
    try {
        const payload = await readSiteImageCardPayload(imageId);
        if (!payload) return;
        await window.MuheebData.saveSiteImage(payload, imageId);
        await loadAll();
        showMessage("تم حفظ الصورة.");
    } catch (error) {
        showError(error.message);
    }
};

const saveNewSiteImage = async (event) => {
    event.preventDefault();
    showMessage("جاري إضافة الصورة...", siteImageFormMessage);
    try {
        const formData = new FormData(siteImageForm);
        const uploaded = await uploadFiles(newSiteImageFile.files, "site");
        await window.MuheebData.saveSiteImage({
            imageKey: formData.get("imageKey"),
            label: formData.get("label"),
            groupName: formData.get("groupName"),
            imagePath: uploaded[0]?.path || "",
            altText: formData.get("altText"),
            sortOrder: Number(formData.get("sortOrder") || 0),
            published: siteImageForm.elements.published.checked,
        });
        siteImageForm.reset();
        siteImageForm.elements.published.checked = true;
        await loadAll();
        showMessage("تمت إضافة الصورة بنجاح.", siteImageFormMessage);
    } catch (error) {
        showError(error.message, siteImageFormMessage);
    }
};

const toggleSiteImage = async (imageId) => {
    const image = state.siteImages.find((item) => item.id === imageId);
    if (!image) return;
    try {
        await window.MuheebData.saveSiteImage({
            ...image,
            published: !image.published,
        }, imageId);
        await loadAll();
        showMessage(image.published ? "تم إخفاء الصورة." : "تم إظهار الصورة.");
    } catch (error) {
        showError(error.message);
    }
};

const restoreDefaultSiteImages = async () => {
    showMessage("جاري استعادة الصور الافتراضية...");
    try {
        await window.MuheebData.restoreDefaultSiteImages();
        await loadAll();
        showMessage("تمت استعادة الصور الافتراضية للمكتبة.");
    } catch (error) {
        showError(error.message);
    }
};

const editInterestOption = (optionId) => {
    const option = state.interestOptions.find((item) => item.id === optionId);
    if (!option) return;
    state.editingInterestOption = option;
    interestOptionForm.elements.optionId.value = option.id;
    interestOptionForm.elements.label.value = option.label || "";
    interestOptionForm.elements.value.value = option.value || "";
    interestOptionForm.elements.sortOrder.value = option.sortOrder || 0;
    interestOptionForm.elements.published.checked = Boolean(option.published);
    interestOptionFormTitle.textContent = "تعديل اختيار اهتمام";
    setView("interestOptionsView");
};

const saveInterestOption = async (event) => {
    event.preventDefault();
    showMessage("جاري حفظ الاختيار...", interestOptionMessage);
    try {
        const formData = new FormData(interestOptionForm);
        const optionId = Number(formData.get("optionId") || 0);
        await window.MuheebData.saveInterestOption({
            label: formData.get("label"),
            value: formData.get("value"),
            sortOrder: Number(formData.get("sortOrder") || 0),
            published: interestOptionForm.elements.published.checked,
        }, optionId || null);
        resetInterestOptionForm();
        await loadAll();
        showMessage("تم حفظ الاختيار بنجاح.", interestOptionMessage);
    } catch (error) {
        showError(error.message, interestOptionMessage);
    }
};

const toggleInterestOption = async (optionId) => {
    const option = state.interestOptions.find((item) => item.id === optionId);
    if (!option) return;
    try {
        await window.MuheebData.saveInterestOption({
            ...option,
            published: !option.published,
        }, optionId);
        await loadAll();
        showMessage(option.published ? "تم إخفاء الاختيار من النموذج." : "تم إظهار الاختيار في النموذج.");
    } catch (error) {
        showError(error.message);
    }
};

const resetUserForm = () => {
    state.editingUser = null;
    userForm?.reset();
    if (!userForm) return;
    userForm.elements.userId.value = "";
    userForm.elements.email.disabled = false;
    userForm.elements.password.required = true;
    userForm.elements.active.checked = true;
    userFormTitle.textContent = "إضافة مستخدم";
    renderPermissionsGrid({});
};

const renderPermissionsGrid = (permissions = {}) => {
    if (!permissionsGrid) return;
    permissionsGrid.innerHTML = permissionItems.map((permission) => `
        <label class="permission-item">
            <input type="checkbox" name="permission_${escapeHtml(permission.key)}" ${permissions[permission.key] ? "checked" : ""}>
            <span>${escapeHtml(permission.label)}</span>
        </label>
    `).join("");
};

const readUserPermissions = () => Object.fromEntries(permissionItems.map((permission) => [
    permission.key,
    Boolean(userForm.elements[`permission_${permission.key}`]?.checked),
]));

const renderUsers = () => {
    renderPermissionsGrid(state.editingUser?.permissions || {});
    if (!usersList) return;
    usersList.innerHTML = state.users.map((user) => `
        <article class="user-card ${user.active ? "" : "is-disabled"}">
            <div>
                <strong>${escapeHtml(getDisplayName(user))}</strong>
                <span>${escapeHtml(user.email || "-")}</span>
                <span>${escapeHtml(user.phone || "لا يوجد رقم")}</span>
                <span class="badge ${user.role === "owner" ? "" : "is-dim"}">${user.role === "owner" ? "مالك" : user.active ? "مستخدم مفعل" : "مستخدم موقوف"}</span>
            </div>
            <div class="event-actions">
                <button class="ghost-btn" type="button" data-edit-user="${escapeHtml(user.userId)}">
                    <i data-lucide="pencil"></i>
                    <span>تعديل</span>
                </button>
                ${user.userId !== state.admin?.userId && user.role !== "owner" ? `
                    <button class="danger-btn icon-only small-icon" type="button" data-delete-user="${escapeHtml(user.userId)}" title="إزالة الصلاحية">
                        <i data-lucide="trash-2"></i>
                    </button>
                ` : ""}
            </div>
        </article>
    `).join("") || `<div class="compact-item"><span>لا يوجد مستخدمون بعد.</span></div>`;
    initIcons();
};

const editUser = (userId) => {
    const user = state.users.find((item) => item.userId === userId);
    if (!user || !userForm) return;
    state.editingUser = user;
    userForm.elements.userId.value = user.userId;
    userForm.elements.fullName.value = user.fullName || "";
    userForm.elements.phone.value = user.phone || "";
    userForm.elements.email.value = user.email || "";
    userForm.elements.email.disabled = true;
    userForm.elements.password.value = "";
    userForm.elements.password.required = false;
    userForm.elements.active.checked = user.active !== false;
    userFormTitle.textContent = "تعديل مستخدم";
    renderPermissionsGrid(user.permissions || {});
    setView("usersView");
};

const saveUser = async (event) => {
    event.preventDefault();
    showMessage("جاري حفظ المستخدم...", userFormMessage);
    try {
        const formData = new FormData(userForm);
        const userId = formData.get("userId") || "";
        await window.MuheebData.saveAdminUser({
            fullName: formData.get("fullName"),
            phone: formData.get("phone"),
            email: formData.get("email") || state.editingUser?.email,
            password: formData.get("password"),
            active: userForm.elements.active.checked,
            permissions: readUserPermissions(),
        }, userId || null);
        resetUserForm();
        await loadAll();
        showMessage("تم حفظ المستخدم بنجاح.", userFormMessage);
    } catch (error) {
        showError(error.message, userFormMessage);
    }
};

const deleteUser = async (userId) => {
    if (!window.confirm("هل تريد إزالة صلاحيات هذا المستخدم من لوحة التحكم؟")) return;
    try {
        await window.MuheebData.deleteAdminUser(userId);
        await loadAll();
        showMessage("تمت إزالة المستخدم من لوحة التحكم.");
    } catch (error) {
        showError(error.message);
    }
};

const renderNotifications = () => {
    const count = state.notifications.length;
    notificationBadge.textContent = String(count);
    notificationBadge.classList.toggle("is-hidden", !count);
    notificationCount.textContent = String(count);
    notificationList.innerHTML = state.notifications.map((notification) => `
        <button class="notification-item" type="button" data-open-lead="${escapeHtml(notification.leadId || "")}">
            <strong>${escapeHtml(notification.title)}</strong>
            <span>${escapeHtml(notification.message)}</span>
            <small>${formatDate(notification.createdAt)}</small>
        </button>
    `).join("") || `<div class="compact-item"><span>لا توجد إشعارات حتى الآن.</span></div>`;
};

const toggleDropdown = (menu) => {
    const shouldOpen = menu.classList.contains("is-hidden");
    document.querySelectorAll(".dropdown-panel").forEach((panel) => panel.classList.add("is-hidden"));
    menu.classList.toggle("is-hidden", !shouldOpen);
};

const updateLead = async (leadId, statusOverride = "") => {
    const currentLead = state.leads.find((lead) => lead.id === leadId);
    const modalIsActive = state.activeLeadId === leadId && !leadModal?.classList.contains("is-hidden");
    const status =
        statusOverride ||
        (modalIsActive ? document.querySelector(`[data-modal-lead-status="${leadId}"]`)?.value : "") ||
        document.querySelector(`[data-lead-status="${leadId}"]`)?.value ||
        currentLead?.status ||
        "new";
    const notes = currentLead?.adminNotes || "";
    try {
        await window.MuheebData.updateLead(leadId, { status, adminNotes: notes });
        await loadAll();
        if (state.activeLeadId === leadId) {
            state.activeLeadId = leadId;
            renderLeadModal();
        }
        showMessage("تم تحديث الطلب.");
    } catch (error) {
        showError(error.message);
    }
};

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginMessage.textContent = "جاري تسجيل الدخول...";
    const formData = new FormData(loginForm);
    try {
        state.admin = await window.MuheebData.signInAdmin(
            formData.get("username"),
            formData.get("password")
        );
        showApp();
        await loadAll();
    } catch (error) {
        loginMessage.textContent = error.message;
    }
});

document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
});

document.getElementById("logoutButton").addEventListener("click", async () => {
    await window.MuheebData.logout().catch(() => null);
    state.admin = null;
    showLogin();
});

document.getElementById("refreshButton").addEventListener("click", async () => {
    await loadAll();
    showMessage("تم تحديث البيانات.");
});

profileButton?.addEventListener("click", () => toggleDropdown(profileMenu));
notificationsButton?.addEventListener("click", () => toggleDropdown(notificationsMenu));

document.addEventListener("click", (event) => {
    if (!event.target.closest(".action-menu")) {
        document.querySelectorAll(".dropdown-panel").forEach((panel) => panel.classList.add("is-hidden"));
    }
});

leadStatusFilter.addEventListener("change", renderLeads);
leadSearch?.addEventListener("input", renderLeads);
saveContentButton?.addEventListener("click", saveSiteContent);
siteImageForm?.addEventListener("submit", saveNewSiteImage);
restoreSiteImagesButton?.addEventListener("click", restoreDefaultSiteImages);
interestOptionForm?.addEventListener("submit", saveInterestOption);
document.getElementById("resetInterestOptionForm")?.addEventListener("click", resetInterestOptionForm);
userForm?.addEventListener("submit", saveUser);
document.getElementById("resetUserForm")?.addEventListener("click", resetUserForm);

usersList?.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-user]");
    const deleteButton = event.target.closest("[data-delete-user]");
    if (editButton) {
        editUser(editButton.dataset.editUser);
    }
    if (deleteButton) {
        await deleteUser(deleteButton.dataset.deleteUser);
    }
});

leadsTable.addEventListener("change", (event) => {
    const leadId = Number(event.target.dataset.leadStatus || 0);
    if (leadId) updateLead(leadId, event.target.value);
});

leadsTable.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-lead]");
    if (deleteButton) {
        const leadId = Number(deleteButton.dataset.deleteLead || 0);
        if (!leadId || !window.confirm("هل تريد حذف هذا الطلب نهائيًا؟")) return;
        window.MuheebData.deleteLead(leadId)
            .then(loadAll)
            .then(() => showMessage("تم حذف الطلب."))
            .catch((error) => showError(error.message));
        return;
    }
    const button = event.target.closest("[data-open-lead]");
    if (button) openLeadModal(Number(button.dataset.openLead));
});

latestLeads?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-lead]");
    if (button) openLeadModal(Number(button.dataset.openLead));
});

notificationList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-lead]");
    const leadId = Number(button?.dataset.openLead || 0);
    if (leadId) {
        notificationsMenu.classList.add("is-hidden");
        openLeadModal(leadId);
    }
});

profileMenu?.addEventListener("click", (event) => {
    const profileOpen = event.target.closest("[data-profile-open]");
    if (profileOpen) {
        profileMenu.classList.add("is-hidden");
        setView(can("security") ? "securityView" : getFirstAllowedView());
    }
});

leadDetailGrid?.addEventListener("change", async (event) => {
    const leadId = Number(event.target.dataset.modalLeadStatus || 0);
    if (leadId) await updateLead(leadId, event.target.value);
});

document.getElementById("closeLeadModal")?.addEventListener("click", closeLeadModal);
leadModal?.addEventListener("click", (event) => {
    if (event.target === leadModal) closeLeadModal();
});

leadNoteForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const noteText = leadNoteForm.elements.note.value;
    try {
        await addLeadNote(noteText, leadNoteForm.elements.assignedTo.value);
        leadNoteForm.reset();
        showMessage("تمت إضافة الملاحظة وإسنادها.");
    } catch (error) {
        showError(error.message);
    }
});

leadNotesList?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-complete-note]");
    if (button) {
        try {
            await completeLeadNote(button.dataset.completeNote);
            showMessage("تم إنجاز الملاحظة.");
        } catch (error) {
            showError(error.message);
        }
    }
});

siteImageList?.addEventListener("click", async (event) => {
    const saveButton = event.target.closest("[data-save-site-image]");
    const toggleButton = event.target.closest("[data-toggle-site-image]");
    if (saveButton) {
        await saveExistingSiteImage(Number(saveButton.dataset.saveSiteImage));
    }
    if (toggleButton) {
        await toggleSiteImage(Number(toggleButton.dataset.toggleSiteImage));
    }
});

interestOptionList?.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-interest-option]");
    const toggleButton = event.target.closest("[data-toggle-interest-option]");
    if (editButton) {
        editInterestOption(Number(editButton.dataset.editInterestOption));
    }
    if (toggleButton) {
        await toggleInterestOption(Number(toggleButton.dataset.toggleInterestOption));
    }
});

eventsList.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-event]");
    const deleteButton = event.target.closest("[data-delete-event]");
    if (editButton) {
        editEvent(Number(editButton.dataset.editEvent));
    }
    if (deleteButton) {
        const eventId = Number(deleteButton.dataset.deleteEvent);
        if (!window.confirm("هل تريد حذف هذه الفعالية؟")) return;
        try {
            await window.MuheebData.deleteEvent(eventId);
            await loadAll();
            showMessage("تم حذف الفعالية.");
        } catch (error) {
            showError(error.message);
        }
    }
});

galleryPreview.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-image]");
    if (!button) return;
    try {
        await window.MuheebData.deleteEventImage(Number(button.dataset.deleteImage));
        await loadAll();
        if (state.editingEvent) {
            const refreshed = state.events.find((item) => item.id === state.editingEvent.id);
            if (refreshed) editEvent(refreshed.id);
        }
        showMessage("تم حذف الصورة من المعرض.");
    } catch (error) {
        showError(error.message);
    }
});

coverInput.addEventListener("change", () => {
    const file = coverInput.files?.[0];
    coverName.textContent = file ? file.name : "لم يتم اختيار صورة جديدة";
    if (file) {
        coverPreview.src = URL.createObjectURL(file);
    }
});

galleryInput.addEventListener("change", () => {
    const count = galleryInput.files?.length || 0;
    galleryName.textContent = count ? `${count} صور جاهزة للرفع عند الحفظ` : "يمكن اختيار أكثر من صورة";
});

eventForm.addEventListener("submit", saveEvent);
document.getElementById("resetEventForm").addEventListener("click", resetEventForm);

passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(passwordForm);
    showMessage("جاري تحديث كلمة المرور...", passwordMessage);
    try {
        await window.MuheebData.changePassword(
            formData.get("currentPassword"),
            formData.get("newPassword")
        );
        passwordForm.reset();
        showMessage("تم تحديث كلمة المرور بنجاح.", passwordMessage);
    } catch (error) {
        showError(error.message, passwordMessage);
    }
});

(async () => {
    initIcons();
    try {
        state.admin = await window.MuheebData.getCurrentAdmin();
        showApp();
        await loadAll();
    } catch (error) {
        showLogin();
    }
})();
