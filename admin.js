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
    noteInquiries: [],
    profileRequests: [],
    activeView: "overviewView",
    editingEvent: null,
    editingInterestOption: null,
    editingUser: null,
    activeLeadId: null,
    coverPath: "",
    pendingSupportLogos: [],
    imageEditor: {
        input: null,
        file: null,
        objectUrl: "",
    },
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

const defaultSiteContentRows = [
    { contentKey: "contact_page_eyebrow", label: "عنوان صغير لصفحة التواصل", value: "تواصل معنا", inputType: "text", groupName: "صفحة التواصل", sortOrder: 130 },
    { contentKey: "contact_page_title", label: "العنوان الكبير لصفحة التواصل", value: "نسعد بتواصلكم والإجابة على استفساراتكم ومساعدتكم", inputType: "textarea", groupName: "صفحة التواصل", sortOrder: 131 },
    { contentKey: "contact_calls_title", label: "عنوان أوقات المكالمات", value: "أوقات استقبال المكالمات:", inputType: "text", groupName: "صفحة التواصل", sortOrder: 132 },
    { contentKey: "contact_calls_text", label: "نص أوقات المكالمات", value: "من الساعة 8 صباحًا وحتى الساعة 12 عند منتصف الليل", inputType: "textarea", groupName: "صفحة التواصل", sortOrder: 133 },
    { contentKey: "contact_visits_title", label: "عنوان أوقات تنسيق الفعاليات", value: "أوقات تنسيق الفعاليات:", inputType: "text", groupName: "صفحة التواصل", sortOrder: 134 },
    { contentKey: "contact_visits_text", label: "نص أوقات تنسيق الفعاليات", value: "من الساعة 4 مساءً وحتى الساعة 11 مساءً على مدار الأسبوع", inputType: "textarea", groupName: "صفحة التواصل", sortOrder: 135 },
    { contentKey: "contact_location_title", label: "عنوان الموقع في صفحة التواصل", value: "الموقع:", inputType: "text", groupName: "صفحة التواصل", sortOrder: 136 },
    { contentKey: "contact_channel_whatsapp", label: "اسم قناة واتساب", value: "واتساب المبيعات", inputType: "text", groupName: "صفحة التواصل", sortOrder: 137 },
    { contentKey: "contact_channel_instagram", label: "اسم قناة الانستقرام", value: "الانستقرام", inputType: "text", groupName: "صفحة التواصل", sortOrder: 138 },
    { contentKey: "social_instagram_label", label: "وصف الانستقرام", value: "تابع أعمالنا اليومية", inputType: "text", groupName: "صفحة التواصل", sortOrder: 139 },
    { contentKey: "social_instagram_url", label: "رابط الانستقرام", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 140 },
    { contentKey: "contact_channel_x", label: "اسم قناة أكس", value: "أكس", inputType: "text", groupName: "صفحة التواصل", sortOrder: 141 },
    { contentKey: "social_x_label", label: "وصف أكس", value: "آخر الأخبار والتحديثات", inputType: "text", groupName: "صفحة التواصل", sortOrder: 142 },
    { contentKey: "social_x_url", label: "رابط أكس", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 143 },
    { contentKey: "contact_channel_youtube", label: "اسم قناة اليوتيوب", value: "اليوتيوب", inputType: "text", groupName: "صفحة التواصل", sortOrder: 144 },
    { contentKey: "social_youtube_label", label: "وصف اليوتيوب", value: "مشاهد من الفعاليات", inputType: "text", groupName: "صفحة التواصل", sortOrder: 145 },
    { contentKey: "social_youtube_url", label: "رابط اليوتيوب", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 146 },
    { contentKey: "contact_channel_tiktok", label: "اسم قناة تيك توك", value: "تيك توك", inputType: "text", groupName: "صفحة التواصل", sortOrder: 147 },
    { contentKey: "social_tiktok_label", label: "وصف تيك توك", value: "لقطات قصيرة من التجارب", inputType: "text", groupName: "صفحة التواصل", sortOrder: 148 },
    { contentKey: "social_tiktok_url", label: "رابط تيك توك", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 149 },
    { contentKey: "contact_channel_snapchat", label: "اسم قناة سناب شات", value: "سناب شات", inputType: "text", groupName: "صفحة التواصل", sortOrder: 150 },
    { contentKey: "social_snapchat_label", label: "وصف سناب شات", value: "تغطيات مباشرة ومقاطع سريعة", inputType: "text", groupName: "صفحة التواصل", sortOrder: 151 },
    { contentKey: "social_snapchat_url", label: "رابط سناب شات", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 152 },
    { contentKey: "contact_channel_email", label: "اسم قناة البريد الإلكتروني", value: "البريد الإلكتروني", inputType: "text", groupName: "صفحة التواصل", sortOrder: 153 },
    { contentKey: "contact_channel_location", label: "اسم قناة الموقع", value: "موقعنا", inputType: "text", groupName: "صفحة التواصل", sortOrder: 154 },
    { contentKey: "contact_maps_url", label: "رابط موقع خرائط جوجل", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 155 },
    { contentKey: "commercial_registration", label: "رقم السجل التجاري", value: "يضاف من لوحة التحكم", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 156 },
    { contentKey: "tax_number", label: "الرقم الضريبي", value: "يضاف من لوحة التحكم", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 157 },
    { contentKey: "bank_account", label: "رقم الحساب البنكي", value: "يضاف من لوحة التحكم", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 158 },
];

const ensureSiteContentRows = (rows = []) => {
    const byKey = new Map(rows.map((row) => [row.contentKey, row]));
    defaultSiteContentRows.forEach((row) => {
        if (!byKey.has(row.contentKey)) {
            byKey.set(row.contentKey, row);
        }
    });
    return Array.from(byKey.values()).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
};

const permissionItems = [
    { key: "overview", label: "نظرة عامة" },
    { key: "leads", label: "طلبات العملاء" },
    { key: "leads_view_all", label: "الاطلاع على كامل طلبات العملاء" },
    { key: "leads_assigned_only", label: "إظهار الطلبات المسندة فقط" },
    { key: "leads_view_phone", label: "إظهار رقم الجوال والواتساب" },
    { key: "content", label: "محتوى الموقع" },
    { key: "site_images", label: "صور الموقع" },
    { key: "interest_options", label: "اختيارات النموذج" },
    { key: "events", label: "الفعاليات والمعرض" },
    { key: "users", label: "المستخدمون والصلاحيات" },
    { key: "security", label: "الأمان" },
    { key: "delete_leads", label: "حذف طلبات العملاء" },
    { key: "assign_notes", label: "إسناد ملاحظات المتابعة" },
    { key: "manage_note_inquiries", label: "متابعة استفسارات الملاحظات" },
    { key: "profile_requests", label: "مراجعة طلبات تعديل البيانات" },
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
const openUserModalButton = document.getElementById("openUserModalButton");
const userModal = document.getElementById("userModal");
const closeUserModalButton = document.getElementById("closeUserModal");
const profileModal = document.getElementById("profileModal");
const closeProfileModalButton = document.getElementById("closeProfileModal");
const profileDetailGrid = document.getElementById("profileDetailGrid");
const profileRequestForm = document.getElementById("profileRequestForm");
const profileRequestMessage = document.getElementById("profileRequestMessage");
const profileRequestsList = document.getElementById("profileRequestsList");
const imageEditorModal = document.getElementById("imageEditorModal");
const imageEditorPreview = document.getElementById("imageEditorPreview");
const imageEditorCanvas = document.getElementById("imageEditorCanvas");
const imageEditorForm = document.getElementById("imageEditorForm");
const imageEditorFileName = document.getElementById("imageEditorFileName");
const imageEditorOutput = document.getElementById("imageEditorOutput");
const closeImageEditorButton = document.getElementById("closeImageEditor");
const cancelImageEditorButton = document.getElementById("cancelImageEditor");
const eventSupportLogosInput = document.getElementById("supportLogosInput");
const supportLogosName = document.getElementById("supportLogosName");

const editedFiles = new WeakMap();

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

const hasPermissionFlag = (permission) => (
    isOwner() ||
    state.admin?.permissions?.all === true ||
    state.admin?.permissions?.[permission] === true
);

const can = (permission) => {
    if (permission === "leads") {
        return hasPermissionFlag("leads") || hasPermissionFlag("leads_view_all") || hasPermissionFlag("leads_assigned_only");
    }
    return hasPermissionFlag(permission);
};

const canViewAllLeads = () => hasPermissionFlag("leads") || hasPermissionFlag("leads_view_all");

const canViewAssignedLeads = () => canViewAllLeads() || hasPermissionFlag("leads_assigned_only");

const canViewLeadPhone = () => hasPermissionFlag("leads_view_phone") || canViewAllLeads();

const getDisplayName = (user = state.admin) => user?.fullName || user?.username || user?.email || user?.authEmail || "مستخدم";

const getUserById = (userId) => state.users.find((user) => user.userId === userId);

const getLeadAssignedNotes = (leadId) => state.leadNotes.filter((note) => (
    Number(note.leadId) === Number(leadId) &&
    note.assignedTo === state.admin?.userId
));

const canAccessLead = (lead) => (
    canViewAllLeads() ||
    getLeadAssignedNotes(lead.id).length > 0
);

const getVisibleLeads = () => (state.leads || []).filter(canAccessLead);

const formatLeadPhone = (lead) => `+${lead.countryCode || ""} ${lead.phone || ""}`.trim();

const renderPhoneValue = (lead) => {
    if (!canViewLeadPhone()) return `<span class="muted-text">مخفي حسب الصلاحية</span>`;
    return `<span class="phone-ltr">${escapeHtml(formatLeadPhone(lead))}</span>`;
};

const canViewNote = (note) => {
    if (isOwner() || can("users") || can("assign_notes") || canViewAllLeads()) return true;
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

const getNoteInquiries = (noteId) => state.noteInquiries
    .filter((inquiry) => inquiry.noteId === noteId)
    .map((inquiry) => ({
        ...inquiry,
        createdByName: getDisplayName(getUserById(inquiry.createdBy) || {}),
    }));

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
    let noteInquiries = [];
    let profileRequests = [];
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
    try {
        [noteInquiries, profileRequests] = await Promise.all([
            window.MuheebData.listLeadNoteInquiries(),
            window.MuheebData.listProfileChangeRequests(),
        ]);
    } catch (error) {
        noteInquiries = [];
        profileRequests = [];
    }
    state.leads = leads || [];
    state.leadNotes = leadNotes || [];
    state.noteInquiries = noteInquiries || [];
    state.events = events || [];
    state.siteContent = ensureSiteContentRows(siteContent || []);
    state.siteImages = sortSiteImagesByPageOrder(siteImages);
    state.interestOptions = interestOptions || [];
    state.users = users || [];
    state.notifications = notifications || [];
    state.profileRequests = profileRequests || [];
    renderStats(stats || {});
    renderLeads();
    renderEvents();
    renderContentEditor();
    renderSiteImages();
    renderInterestOptions();
    renderUsers();
    renderProfileRequests();
    renderNotifications();
    applyPermissions();
    initIcons();
};

const renderStats = (stats) => {
    document.getElementById("leadTotal").textContent = stats.leadTotal || 0;
    document.getElementById("leadNew").textContent = stats.leadNew || 0;
    document.getElementById("eventTotal").textContent = stats.eventTotal || 0;
    document.getElementById("eventPublished").textContent = stats.eventPublished || 0;

    latestLeads.innerHTML = getVisibleLeads().slice(0, 5).map((lead) => `
        <button class="compact-item clickable-compact" type="button" data-open-lead="${lead.id}">
            <strong>${escapeHtml(lead.name)}</strong>
            <span>${canViewLeadPhone() ? `${escapeHtml(lead.countryCode)} ${escapeHtml(lead.phone)} - ` : ""}${escapeHtml(lead.service)}</span>
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
    const leads = (filter === "all" ? getVisibleLeads() : getVisibleLeads().filter((lead) => lead.status === filter))
        .filter((lead) => {
            if (!term) return true;
            return [
                lead.name,
                canViewLeadPhone() ? lead.phone : "",
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
                </div>
            </td>
            <td>
                ${canViewLeadPhone()
                    ? `<a class="phone-ltr" href="tel:+${escapeHtml(lead.countryCode)}${escapeHtml(lead.phone)}">${escapeHtml(formatLeadPhone(lead))}</a>`
                    : `<span class="muted-text">مخفي</span>`}
            </td>
            <td>${escapeHtml(lead.service)}</td>
            <td>${formatDate(lead.createdAt)}</td>
            <td>
                <div class="lead-actions">
                    ${canViewLeadPhone() ? `
                    <a class="ghost-btn icon-only small-icon" href="https://wa.me/${escapeHtml(lead.countryCode)}${escapeHtml(lead.phone)}" target="_blank" rel="noopener" title="واتساب" aria-label="واتساب">
                        <i data-lucide="message-circle"></i>
                    </a>
                    ` : ""}
                    ${can("delete_leads") ? `
                        <button class="danger-btn icon-only small-icon" type="button" data-delete-lead="${lead.id}" title="حذف الطلب">
                            <i data-lucide="trash-2"></i>
                        </button>
                    ` : ""}
                </div>
            </td>
        </tr>
        <tr class="lead-progress-row ${escapeHtml(statusClasses[lead.status] || "")}">
            <td colspan="6">${renderProgressBar(lead, true)}</td>
        </tr>
    `).join("") || `<tr><td colspan="6">لا توجد طلبات بهذه الحالة.</td></tr>`;
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
            ${canViewLeadPhone()
                ? `<a class="phone-ltr" href="tel:+${escapeHtml(lead.countryCode)}${escapeHtml(lead.phone)}">${escapeHtml(formatLeadPhone(lead))}</a>`
                : `<strong class="muted-text">مخفي حسب الصلاحية</strong>`}
        </article>
        <article>
            <span>واتساب</span>
            ${canViewLeadPhone()
                ? `<a href="https://wa.me/${escapeHtml(lead.countryCode)}${escapeHtml(lead.phone)}" target="_blank" rel="noopener">فتح واتساب</a>`
                : `<strong class="muted-text">غير متاح</strong>`}
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
            <select class="status-select ${escapeHtml(statusClasses[lead.status] || "")}" data-modal-lead-status="${lead.id}" ${canViewAllLeads() ? "" : "disabled"}>
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
    const canComposeLeadNote = can("assign_notes") || canViewAllLeads();
    leadNoteForm?.classList.toggle("is-hidden", !canComposeLeadNote);
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
    leadNotesList.innerHTML = notes.map((note) => {
        const inquiries = getNoteInquiries(note.id);
        const canCompleteNote = !note.legacy && !note.done && (
            note.assignedTo === state.admin?.userId ||
            isOwner() ||
            can("users") ||
            can("assign_notes")
        );
        const canAskInquiry = !note.legacy && !note.done && note.assignedTo === state.admin?.userId;
        return `
        <article class="lead-note ${note.done ? "is-done" : ""}">
            <div>
                <p>${escapeHtml(note.text)}</p>
                <span>${note.createdAt ? formatDate(note.createdAt) : "ملاحظة سابقة"}</span>
                <span>مسندة إلى: ${escapeHtml(note.assignedToName || getUserById(note.assignedTo)?.fullName || "غير محدد")}</span>
                ${note.createdByName ? `<span>أضيفت بواسطة: ${escapeHtml(note.createdByName)}</span>` : ""}
                ${note.doneAt ? `<span>أُنجزت: ${formatDate(note.doneAt)}</span>` : ""}
                ${inquiries.length ? `
                    <div class="note-inquiries">
                        ${inquiries.map((inquiry) => `
                            <div class="note-inquiry">
                                <i data-lucide="message-square-text"></i>
                                <div>
                                    <strong>${escapeHtml(inquiry.createdByName || "مستخدم")}</strong>
                                    <p>${escapeHtml(inquiry.body)}</p>
                                    <span>${formatDate(inquiry.createdAt)}</span>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                ` : ""}
            </div>
            <div class="note-actions">
                ${canAskInquiry ? `
                    <button class="ghost-btn icon-only small-icon" type="button" data-inquire-note="${escapeHtml(note.id)}" title="إضافة استفسار">
                        <i data-lucide="circle-help"></i>
                    </button>
                ` : ""}
                <button class="${note.done ? "ghost-btn" : "primary-btn"} icon-only small-icon" type="button" data-complete-note="${escapeHtml(note.id)}" title="${note.done ? "تم الإنجاز" : "تم الإنجاز"}" ${canCompleteNote ? "" : "disabled"}>
                    <i data-lucide="${note.done ? "check-check" : "check"}"></i>
                </button>
            </div>
        </article>
    `;
    }).join("") || `<div class="compact-item"><span>لا توجد ملاحظات متابعة حتى الآن.</span></div>`;
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
    const note = await window.MuheebData.createLeadNote({
        leadId: lead.id,
        text: text.trim(),
        assignedTo: assignee?.userId || state.admin?.userId || "",
    });
    if (note?.assignedTo && note.assignedTo !== state.admin?.userId) {
        await window.MuheebData.createNotification({
            targetUserId: note.assignedTo,
            leadId: lead.id,
            noteId: note.id,
            kind: "note_assigned",
            title: "مهمة مسندة إليك",
            message: `${getDisplayName()} أسند إليك ملاحظة على طلب ${lead.name}.`,
        }).catch(() => null);
    }
    await loadAll();
    state.activeLeadId = lead.id;
    renderLeadModal();
};

const completeLeadNote = async (noteId) => {
    const lead = getActiveLead();
    if (!lead) return;
    const completedNote = await window.MuheebData.completeLeadNote(noteId);
    if (completedNote) {
        if (completedNote.createdBy && completedNote.createdBy !== state.admin?.userId) {
            await window.MuheebData.createNotification({
                targetUserId: completedNote.createdBy,
                leadId: lead.id,
                noteId,
                kind: "note_done",
                title: "تم إنجاز ملاحظة متابعة",
                message: `${getDisplayName()} أنجز ملاحظة على طلب ${lead.name}.`,
            }).catch(() => null);
        }
        await loadAll();
        state.activeLeadId = lead.id;
        renderLeadModal();
    }
};

const addNoteInquiry = async (noteId, body) => {
    const lead = getActiveLead();
    const note = state.leadNotes.find((item) => item.id === noteId);
    if (!lead || !note || !body.trim()) return;
    await window.MuheebData.createLeadNoteInquiry({
        leadId: lead.id,
        noteId,
        body: body.trim(),
    });
    if (note.createdBy && note.createdBy !== state.admin?.userId) {
        await window.MuheebData.createNotification({
            targetUserId: note.createdBy,
            leadId: lead.id,
            noteId,
            kind: "note_inquiry",
            title: "استفسار على ملاحظة متابعة",
            message: `${getDisplayName()} أضاف استفسارًا على طلب ${lead.name}.`,
        }).catch(() => null);
    }
    await loadAll();
    state.activeLeadId = lead.id;
    renderLeadModal();
};

const splitLines = (value) => String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const parseEventSections = (value) => splitLines(value).map((line) => {
    const [title = "", text = "", image = ""] = line.split("|").map((part) => part.trim());
    return { title, text, image };
}).filter((section) => section.title || section.text || section.image);

const stringifyEventSections = (sections) => (sections || []).map((section) => [
    section.title || "",
    section.text || "",
    section.image || "",
].join(" | ")).join("\n");

const renderEvents = () => {
    eventsList.innerHTML = state.events.map((event) => `
        <article class="event-item">
            <img src="${escapeHtml(event.coverImage || "assets/logo-meheib.png")}" alt="">
            <div>
                <strong>${escapeHtml(event.title)}</strong>
                <div class="meta-text">${escapeHtml(labels[event.category] || event.category)} - ${escapeHtml(event.venueName || event.location || "بدون موقع")}</div>
                <div class="meta-text">${escapeHtml(event.dateFrom || event.eventDate || "بدون تاريخ")}${event.dateTo ? ` إلى ${escapeHtml(event.dateTo)}` : ""}</div>
                <span class="badge ${event.published ? "" : "is-dim"}">${event.published ? "منشور" : "مخفي"}</span>
                <div class="event-actions">
                    <button class="ghost-btn icon-only small-icon" type="button" data-edit-event="${event.id}" title="تعديل" aria-label="تعديل الفعالية">
                        <i data-lucide="pencil"></i>
                    </button>
                    <button class="danger-btn icon-only small-icon" type="button" data-delete-event="${event.id}" title="حذف" aria-label="حذف الفعالية">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join("") || `<div class="compact-item"><span>لا توجد فعاليات حتى الآن.</span></div>`;
    initIcons();
};

const visualContentDefaults = [
    { contentKey: "hero_badge_small", label: "عبارة بطاقة الهيرو الصغيرة", value: "من الفكرة إلى التجربة", inputType: "text", groupName: "الصفحة الرئيسية", sortOrder: 10 },
    { contentKey: "hero_badge_title", label: "عبارة بطاقة الهيرو الكبيرة", value: "حضور مؤثر لا يُنسى", inputType: "text", groupName: "الصفحة الرئيسية", sortOrder: 11 },
    { contentKey: "hero_eyebrow", label: "وصف أعلى العنوان الرئيسي", value: "مهيب للتسويق وتنظيم الفعاليات", inputType: "text", groupName: "الصفحة الرئيسية", sortOrder: 12 },
    { contentKey: "hero_title", label: "العنوان الرئيسي", value: "نصنع تجارب مؤثرة بحضور يليق باسمك", inputType: "textarea", groupName: "الصفحة الرئيسية", sortOrder: 13 },
    { contentKey: "hero_copy", label: "نص العنوان الرئيسي", value: "تعكس هوية مهيب مزيجًا من الهيبة والابتكار، وتحول الفكرة إلى حملة أو فعالية متقنة تترك أثرًا قويًا وذكرى لا تُنسى.", inputType: "textarea", groupName: "الصفحة الرئيسية", sortOrder: 14 },
    { contentKey: "hero_primary_button", label: "زر الطلب الرئيسي", value: "اطلب استشارة", inputType: "text", groupName: "الصفحة الرئيسية", sortOrder: 15 },
    { contentKey: "hero_secondary_button", label: "زر استعراض الأعمال", value: "استعرض الأعمال", inputType: "text", groupName: "الصفحة الرئيسية", sortOrder: 16 },
    { contentKey: "about_eyebrow", label: "عنوان صغير لقسم عن مهيب", value: "عن مهيب", inputType: "text", groupName: "عن مهيب", sortOrder: 20 },
    { contentKey: "about_title", label: "عنوان قسم عن مهيب", value: "هوية مبنية على الهيبة، الاتزان، والابتكار.", inputType: "textarea", groupName: "عن مهيب", sortOrder: 21 },
    { contentKey: "about_text", label: "نص تعريف مهيب", value: "يمتد خط مهيب بانسيابية عربية متزنة ليجسد رحلة الفعالية أو الحملة من الفكرة إلى التجربة، مع حضور بصري محترف يعزز الثقة ويصنع انطباعًا ثابتًا.", inputType: "textarea", groupName: "عن مهيب", sortOrder: 22 },
    { contentKey: "metric_1_number", label: "رقم الإحصائية الأولى", value: "01", inputType: "text", groupName: "عن مهيب", sortOrder: 23 },
    { contentKey: "metric_1_label", label: "نص الإحصائية الأولى", value: "تسويق وتجارب", inputType: "text", groupName: "عن مهيب", sortOrder: 24 },
    { contentKey: "metric_2_number", label: "رقم الإحصائية الثانية", value: "02", inputType: "text", groupName: "عن مهيب", sortOrder: 25 },
    { contentKey: "metric_2_label", label: "نص الإحصائية الثانية", value: "تنظيم فعاليات", inputType: "text", groupName: "عن مهيب", sortOrder: 26 },
    { contentKey: "metric_3_number", label: "رقم الإحصائية الثالثة", value: "03", inputType: "text", groupName: "عن مهيب", sortOrder: 27 },
    { contentKey: "metric_3_label", label: "نص الإحصائية الثالثة", value: "هوية وتطبيقات", inputType: "text", groupName: "عن مهيب", sortOrder: 28 },
    { contentKey: "identity_eyebrow", label: "عنوان صغير لمعرض الهوية", value: "تطبيقات الهوية", inputType: "text", groupName: "معرض الهوية", sortOrder: 30 },
    { contentKey: "identity_title", label: "عنوان معرض الهوية", value: "تفاصيل بصرية تعزز حضور العلامة", inputType: "textarea", groupName: "معرض الهوية", sortOrder: 31 },
    { contentKey: "services_eyebrow", label: "عنوان صغير للخدمات", value: "خدمات مهيب", inputType: "text", groupName: "الخدمات", sortOrder: 40 },
    { contentKey: "services_title", label: "عنوان الخدمات", value: "حلول متكاملة للحملات والفعاليات", inputType: "textarea", groupName: "الخدمات", sortOrder: 41 },
    { contentKey: "service_1_title", label: "عنوان الخدمة الأولى", value: "تنظيم الفعاليات", inputType: "text", groupName: "الخدمات", sortOrder: 42 },
    { contentKey: "service_1_text", label: "وصف الخدمة الأولى", value: "تخطيط، تشغيل، تنسيق موردين، وإدارة تفاصيل التجربة من البداية حتى لحظة الختام.", inputType: "textarea", groupName: "الخدمات", sortOrder: 43 },
    { contentKey: "service_2_title", label: "عنوان الخدمة الثانية", value: "الحملات التسويقية", inputType: "text", groupName: "الخدمات", sortOrder: 44 },
    { contentKey: "service_2_text", label: "وصف الخدمة الثانية", value: "تصميم الفكرة، الرسالة، المسار البصري، وخطة الظهور بما يخدم أهداف الحملة.", inputType: "textarea", groupName: "الخدمات", sortOrder: 45 },
    { contentKey: "service_3_title", label: "عنوان الخدمة الثالثة", value: "الهوية والتطبيقات", inputType: "text", groupName: "الخدمات", sortOrder: 46 },
    { contentKey: "service_3_text", label: "وصف الخدمة الثالثة", value: "تحويل الهوية إلى أدوات ملموسة: بطاقات، مطبوعات، أجنحة، ولوحات تعريفية.", inputType: "textarea", groupName: "الخدمات", sortOrder: 47 },
    { contentKey: "service_button", label: "نص زر الخدمة", value: "عرض التفاصيل", inputType: "text", groupName: "الخدمات", sortOrder: 48 },
    { contentKey: "projects_eyebrow", label: "عنوان صغير للأعمال", value: "مجالات العمل", inputType: "text", groupName: "الأعمال والفعاليات", sortOrder: 50 },
    { contentKey: "projects_title", label: "عنوان الأعمال", value: "ما الذي يمكن أن تصنعه مهيب؟", inputType: "textarea", groupName: "الأعمال والفعاليات", sortOrder: 51 },
    { contentKey: "features_eyebrow", label: "عنوان صغير للمميزات", value: "مميزات مهيب", inputType: "text", groupName: "المميزات", sortOrder: 60 },
    { contentKey: "features_title", label: "عنوان المميزات", value: "تفاصيل صغيرة تصنع حضورًا أكبر", inputType: "textarea", groupName: "المميزات", sortOrder: 61 },
    { contentKey: "feature_1_title", label: "عنوان الميزة الأولى", value: "احترافية التنفيذ", inputType: "text", groupName: "المميزات", sortOrder: 62 },
    { contentKey: "feature_1_text", label: "نص الميزة الأولى", value: "تخطيط واضح، أدوار منظمة، ومخرجات تليق باسم الجهة.", inputType: "textarea", groupName: "المميزات", sortOrder: 63 },
    { contentKey: "feature_2_title", label: "عنوان الميزة الثانية", value: "تجربة منسجمة", inputType: "text", groupName: "المميزات", sortOrder: 64 },
    { contentKey: "feature_2_text", label: "نص الميزة الثانية", value: "رسالة واحدة تنتقل من الإعلان إلى مساحة الفعالية.", inputType: "textarea", groupName: "المميزات", sortOrder: 65 },
    { contentKey: "feature_3_title", label: "عنوان الميزة الثالثة", value: "هوية راقية", inputType: "text", groupName: "المميزات", sortOrder: 66 },
    { contentKey: "feature_3_text", label: "نص الميزة الثالثة", value: "ألوان وخطوط وتطبيقات تحافظ على الطابع العام للعلامة.", inputType: "textarea", groupName: "المميزات", sortOrder: 67 },
    { contentKey: "feature_4_title", label: "عنوان الميزة الرابعة", value: "رحلة واضحة", inputType: "text", groupName: "المميزات", sortOrder: 68 },
    { contentKey: "feature_4_text", label: "نص الميزة الرابعة", value: "من الفكرة الأولية إلى التنفيذ والتوثيق النهائي.", inputType: "textarea", groupName: "المميزات", sortOrder: 69 },
    { contentKey: "execution_eyebrow", label: "عنوان صغير لرحلة التنفيذ", value: "رحلة التنفيذ", inputType: "text", groupName: "رحلة التنفيذ", sortOrder: 70 },
    { contentKey: "execution_title", label: "عنوان رحلة التنفيذ", value: "لا نترك التجربة للصدفة.", inputType: "textarea", groupName: "رحلة التنفيذ", sortOrder: 71 },
    { contentKey: "execution_text", label: "نص رحلة التنفيذ", value: "نبدأ بفهم الهدف، ثم نبني فكرة قابلة للتنفيذ، ونحوّلها إلى تفاصيل تشغيلية وبصرية تحفظ جودة الحضور من أول إعلان حتى آخر لحظة في الحدث.", inputType: "textarea", groupName: "رحلة التنفيذ", sortOrder: 72 },
    { contentKey: "execution_step_1", label: "خطوة التنفيذ الأولى", value: "تخطيط الفكرة", inputType: "text", groupName: "رحلة التنفيذ", sortOrder: 73 },
    { contentKey: "execution_step_2", label: "خطوة التنفيذ الثانية", value: "تشغيل وتنفيذ", inputType: "text", groupName: "رحلة التنفيذ", sortOrder: 74 },
    { contentKey: "execution_step_3", label: "خطوة التنفيذ الثالثة", value: "توثيق واعتماد", inputType: "text", groupName: "رحلة التنفيذ", sortOrder: 75 },
    { contentKey: "interest_eyebrow", label: "عنوان صغير لنموذج الطلب", value: "سجل اهتمامك", inputType: "text", groupName: "نموذج الطلب", sortOrder: 80 },
    { contentKey: "interest_title", label: "عنوان نموذج الطلب", value: "حدثنا عن فكرتك، ونحوّلها إلى تجربة قابلة للتنفيذ.", inputType: "textarea", groupName: "نموذج الطلب", sortOrder: 81 },
    { contentKey: "interest_text", label: "نص نموذج الطلب", value: "املأ النموذج وسيتم التواصل معك لمناقشة نوع الفعالية أو الحملة، نطاق العمل، والاحتياجات البصرية والتشغيلية.", inputType: "textarea", groupName: "نموذج الطلب", sortOrder: 82 },
    { contentKey: "form_name_label", label: "حقل الاسم", value: "الاسم", inputType: "text", groupName: "نموذج الطلب", sortOrder: 83 },
    { contentKey: "form_country_label", label: "حقل رمز الدولة", value: "رمز الدولة", inputType: "text", groupName: "نموذج الطلب", sortOrder: 84 },
    { contentKey: "form_phone_label", label: "حقل الجوال", value: "رقم الجوال", inputType: "text", groupName: "نموذج الطلب", sortOrder: 85 },
    { contentKey: "form_interest_label", label: "حقل الاهتمام", value: "مجال الاهتمام", inputType: "text", groupName: "نموذج الطلب", sortOrder: 86 },
    { contentKey: "form_source_label", label: "حقل مصدر المعرفة", value: "كيف سمعت عن مهيب؟", inputType: "text", groupName: "نموذج الطلب", sortOrder: 87 },
    { contentKey: "form_message_label", label: "حقل الملاحظات", value: "ملاحظاتك", inputType: "text", groupName: "نموذج الطلب", sortOrder: 88 },
    { contentKey: "form_message_placeholder", label: "تلميح حقل الملاحظات", value: "اكتب نوع الفعالية، موعدها التقريبي، أو الهدف من الحملة", inputType: "textarea", groupName: "نموذج الطلب", sortOrder: 89 },
    { contentKey: "form_submit_button", label: "زر إرسال الطلب", value: "إرسال الطلب", inputType: "text", groupName: "نموذج الطلب", sortOrder: 90 },
    { contentKey: "contact_phone", label: "رقم الاتصال", value: "+966 59 957 5691", inputType: "phone", groupName: "التواصل والفوتر", sortOrder: 100 },
    { contentKey: "contact_whatsapp_number", label: "رقم واتساب بدون علامة +", value: "966599575691", inputType: "phone", groupName: "التواصل والفوتر", sortOrder: 101 },
    { contentKey: "contact_whatsapp_label", label: "نص رابط واتساب", value: "واتساب", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 102 },
    { contentKey: "contact_email", label: "البريد الإلكتروني", value: "info.muheeb0@gmail.com", inputType: "email", groupName: "التواصل والفوتر", sortOrder: 103 },
    { contentKey: "contact_location", label: "الموقع النصي", value: "المدينة المنورة، السعودية", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 104 },
    { contentKey: "footer_text", label: "نص الفوتر", value: "مهيب - حضور بصري وتجارب مؤثرة في التسويق وتنظيم الفعاليات.", inputType: "textarea", groupName: "التواصل والفوتر", sortOrder: 105 },
    { contentKey: "footer_contact_title", label: "عنوان بيانات التواصل في الفوتر", value: "تواصل معنا", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 106 },
    { contentKey: "footer_copyright", label: "حقوق النشر", value: "جميع الحقوق محفوظة لمهيب 2026 ©", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 107 },
    { contentKey: "commercial_registration", label: "رقم السجل التجاري", value: "يضاف من لوحة التحكم", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 156 },
    { contentKey: "tax_number", label: "الرقم الضريبي", value: "يضاف من لوحة التحكم", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 157 },
    { contentKey: "bank_account", label: "رقم الحساب البنكي", value: "يضاف من لوحة التحكم", inputType: "text", groupName: "التواصل والفوتر", sortOrder: 158 },
    { contentKey: "contact_page_eyebrow", label: "عنوان صغير لصفحة التواصل", value: "تواصل معنا", inputType: "text", groupName: "صفحة التواصل", sortOrder: 130 },
    { contentKey: "contact_page_title", label: "العنوان الكبير لصفحة التواصل", value: "نسعد بتواصلكم والإجابة على استفساراتكم ومساعدتكم", inputType: "textarea", groupName: "صفحة التواصل", sortOrder: 131 },
    { contentKey: "contact_calls_title", label: "عنوان أوقات المكالمات", value: "أوقات استقبال المكالمات:", inputType: "text", groupName: "صفحة التواصل", sortOrder: 132 },
    { contentKey: "contact_calls_text", label: "نص أوقات المكالمات", value: "من الساعة 8 صباحًا وحتى الساعة 12 عند منتصف الليل", inputType: "textarea", groupName: "صفحة التواصل", sortOrder: 133 },
    { contentKey: "contact_visits_title", label: "عنوان أوقات تنسيق الفعاليات", value: "أوقات تنسيق الفعاليات:", inputType: "text", groupName: "صفحة التواصل", sortOrder: 134 },
    { contentKey: "contact_visits_text", label: "نص أوقات تنسيق الفعاليات", value: "من الساعة 4 مساءً وحتى الساعة 11 مساءً على مدار الأسبوع", inputType: "textarea", groupName: "صفحة التواصل", sortOrder: 135 },
    { contentKey: "contact_location_title", label: "عنوان الموقع في صفحة التواصل", value: "الموقع:", inputType: "text", groupName: "صفحة التواصل", sortOrder: 136 },
    { contentKey: "contact_channel_whatsapp", label: "اسم قناة واتساب", value: "واتساب المبيعات", inputType: "text", groupName: "صفحة التواصل", sortOrder: 137 },
    { contentKey: "contact_channel_instagram", label: "اسم قناة الانستقرام", value: "الانستقرام", inputType: "text", groupName: "صفحة التواصل", sortOrder: 138 },
    { contentKey: "social_instagram_label", label: "وصف الانستقرام", value: "تابع أعمالنا اليومية", inputType: "text", groupName: "صفحة التواصل", sortOrder: 139 },
    { contentKey: "social_instagram_url", label: "رابط الانستقرام", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 140 },
    { contentKey: "contact_channel_x", label: "اسم قناة أكس", value: "أكس", inputType: "text", groupName: "صفحة التواصل", sortOrder: 141 },
    { contentKey: "social_x_label", label: "وصف أكس", value: "آخر الأخبار والتحديثات", inputType: "text", groupName: "صفحة التواصل", sortOrder: 142 },
    { contentKey: "social_x_url", label: "رابط أكس", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 143 },
    { contentKey: "contact_channel_youtube", label: "اسم قناة اليوتيوب", value: "اليوتيوب", inputType: "text", groupName: "صفحة التواصل", sortOrder: 144 },
    { contentKey: "social_youtube_label", label: "وصف اليوتيوب", value: "مشاهد من الفعاليات", inputType: "text", groupName: "صفحة التواصل", sortOrder: 145 },
    { contentKey: "social_youtube_url", label: "رابط اليوتيوب", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 146 },
    { contentKey: "contact_channel_tiktok", label: "اسم قناة تيك توك", value: "تيك توك", inputType: "text", groupName: "صفحة التواصل", sortOrder: 147 },
    { contentKey: "social_tiktok_label", label: "وصف تيك توك", value: "لقطات قصيرة من التجارب", inputType: "text", groupName: "صفحة التواصل", sortOrder: 148 },
    { contentKey: "social_tiktok_url", label: "رابط تيك توك", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 149 },
    { contentKey: "contact_channel_snapchat", label: "اسم قناة سناب شات", value: "سناب شات", inputType: "text", groupName: "صفحة التواصل", sortOrder: 150 },
    { contentKey: "social_snapchat_label", label: "وصف سناب شات", value: "تغطيات مباشرة ومقاطع سريعة", inputType: "text", groupName: "صفحة التواصل", sortOrder: 151 },
    { contentKey: "social_snapchat_url", label: "رابط سناب شات", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 152 },
    { contentKey: "contact_channel_email", label: "اسم قناة البريد الإلكتروني", value: "البريد الإلكتروني", inputType: "text", groupName: "صفحة التواصل", sortOrder: 153 },
    { contentKey: "contact_channel_location", label: "اسم قناة الموقع", value: "موقعنا", inputType: "text", groupName: "صفحة التواصل", sortOrder: 154 },
    { contentKey: "contact_maps_url", label: "رابط موقع خرائط جوجل", value: "#contact", inputType: "url", groupName: "صفحة التواصل", sortOrder: 155 },
];

const contentDefaultMap = new Map([...defaultSiteContentRows, ...visualContentDefaults].map((row) => [row.contentKey, row]));
const visualContentKeys = new Set(visualContentDefaults.map((row) => row.contentKey));

const getContentRow = (key) => {
    const fallback = contentDefaultMap.get(key) || {};
    const source = state.siteContent.find((item) => item.contentKey === key) || {};
    return {
        ...fallback,
        ...source,
        contentKey: key,
        label: source.label || fallback.label || key,
        value: source.value ?? fallback.value ?? "",
        inputType: source.inputType || fallback.inputType || "text",
        groupName: source.groupName || fallback.groupName || "عام",
        sortOrder: Number(source.sortOrder ?? fallback.sortOrder ?? 999),
    };
};

const getContentInputType = (row) => {
    if (row.inputType === "email") return "email";
    if (row.inputType === "url") return "url";
    if (row.inputType === "phone") return "tel";
    return "text";
};

const renderVisualField = (key, options = {}) => {
    const row = getContentRow(key);
    const multiline = options.multiline ?? row.inputType === "textarea";
    const label = options.label || row.label;
    const rows = options.rows || (multiline ? 3 : 1);
    const classes = ["visual-field", options.className || "", multiline ? "is-multiline" : ""].filter(Boolean).join(" ");
    const direction = options.ltr || ["email", "phone", "url"].includes(row.inputType) ? "ltr" : "rtl";
    const input = multiline
        ? `<textarea rows="${rows}" dir="${direction}" data-content-input="${escapeHtml(row.contentKey)}">${escapeHtml(row.value)}</textarea>`
        : `<input type="${getContentInputType(row)}" dir="${direction}" value="${escapeHtml(row.value)}" data-content-input="${escapeHtml(row.contentKey)}">`;
    return `
        <label class="${classes}">
            <span>${escapeHtml(label)}</span>
            ${input}
        </label>
    `;
};

const renderContentSectionHeader = (number, eyebrow, title, icon) => `
    <div class="visual-section-heading">
        <span class="visual-section-number">${escapeHtml(number)}</span>
        <div>
            <p class="eyebrow"><i data-lucide="${escapeHtml(icon)}"></i>${escapeHtml(eyebrow)}</p>
            <h3>${escapeHtml(title)}</h3>
        </div>
    </div>
`;

const renderServicePreviewCard = (index, icon) => `
    <article class="visual-service-card">
        <i data-lucide="${escapeHtml(icon)}"></i>
        ${renderVisualField(`service_${index}_title`, { label: `عنوان الخدمة ${index}`, className: "is-card-title" })}
        ${renderVisualField(`service_${index}_text`, { label: `وصف الخدمة ${index}`, multiline: true, rows: 3, className: "is-card-copy" })}
    </article>
`;

const renderFeaturePreviewCard = (index, icon) => `
    <article class="visual-feature-card">
        <i data-lucide="${escapeHtml(icon)}"></i>
        ${renderVisualField(`feature_${index}_title`, { label: `عنوان الميزة ${index}`, className: "is-card-title" })}
        ${renderVisualField(`feature_${index}_text`, { label: `نص الميزة ${index}`, multiline: true, rows: 3, className: "is-card-copy" })}
    </article>
`;

const renderContactChannel = (titleKey, labelKey, urlKey, icon) => `
    <article class="visual-contact-channel">
        <i data-lucide="${escapeHtml(icon)}"></i>
        ${renderVisualField(titleKey, { className: "is-card-title" })}
        ${labelKey ? renderVisualField(labelKey, { className: "is-card-copy" }) : ""}
        ${urlKey ? renderVisualField(urlKey, { label: "الرابط", ltr: true }) : ""}
    </article>
`;

const renderExtraContentFields = () => {
    const extras = state.siteContent
        .filter((row) => !visualContentKeys.has(row.contentKey))
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    if (!extras.length) return "";
    return `
        <details class="visual-extra-fields">
            <summary>
                <i data-lucide="settings-2"></i>
                <span>حقول إضافية متقدمة</span>
            </summary>
            <div class="content-fields">
                ${extras.map((row) => renderVisualField(row.contentKey, {
                    multiline: row.inputType === "textarea",
                    rows: 4,
                })).join("")}
            </div>
        </details>
    `;
};

const renderContentEditor = () => {
    if (!contentEditor) return;
    contentEditor.innerHTML = `
        <div class="visual-content-editor">
            <div class="visual-editor-intro">
                <div>
                    <p class="eyebrow">طريقة التعديل الجديدة</p>
                    <h3>عدّل العبارة في مكانها الطبيعي داخل شكل قريب من الموقع.</h3>
                </div>
                <span>بعد التعديل اضغط زر حفظ النصوص في أعلى الصفحة.</span>
            </div>
            <nav class="visual-editor-nav" aria-label="أقسام محرر محتوى الموقع">
                <a href="#visualHero"><i data-lucide="layout-template"></i><span>الواجهة</span></a>
                <a href="#visualAbout"><i data-lucide="badge-info"></i><span>عن مهيب</span></a>
                <a href="#visualServices"><i data-lucide="sparkles"></i><span>الخدمات</span></a>
                <a href="#visualWorks"><i data-lucide="layers-3"></i><span>الأعمال</span></a>
                <a href="#visualJourney"><i data-lucide="route"></i><span>الرحلة</span></a>
                <a href="#visualForm"><i data-lucide="send"></i><span>النموذج</span></a>
                <a href="#visualContact"><i data-lucide="messages-square"></i><span>التواصل</span></a>
                <a href="#visualFooter"><i data-lucide="panel-bottom"></i><span>التذييل</span></a>
            </nav>

            <section class="visual-preview-section visual-hero-editor" id="visualHero">
                ${renderContentSectionHeader("01", "الصفحة الرئيسية", "الواجهة الأولى للموقع", "layout-template")}
                <div class="visual-hero-surface">
                    <div class="visual-hero-media">
                        <div class="visual-logo-word">مُهيب</div>
                        <div class="visual-badge-editor">
                            ${renderVisualField("hero_badge_small", { label: "نص البطاقة الصغير" })}
                            ${renderVisualField("hero_badge_title", { label: "نص البطاقة الكبير" })}
                        </div>
                    </div>
                    <div class="visual-hero-copy">
                        ${renderVisualField("hero_eyebrow", { label: "العنوان الصغير أعلى الهيرو" })}
                        ${renderVisualField("hero_title", { label: "العنوان الرئيسي", multiline: true, rows: 3, className: "is-main-title" })}
                        ${renderVisualField("hero_copy", { label: "النص التعريفي", multiline: true, rows: 4 })}
                        <div class="visual-button-row">
                            ${renderVisualField("hero_primary_button", { label: "زر الطلب" })}
                            ${renderVisualField("hero_secondary_button", { label: "زر الأعمال" })}
                        </div>
                    </div>
                </div>
            </section>

            <section class="visual-preview-section" id="visualAbout">
                ${renderContentSectionHeader("02", "عن مهيب", "التعريف والإحصائيات", "badge-info")}
                <div class="visual-about-grid">
                    <div class="visual-copy-block">
                        ${renderVisualField("about_eyebrow", { label: "العنوان الصغير" })}
                        ${renderVisualField("about_title", { label: "عنوان التعريف", multiline: true, rows: 3, className: "is-section-title" })}
                        ${renderVisualField("about_text", { label: "نص التعريف", multiline: true, rows: 5 })}
                    </div>
                    <div class="visual-metrics-grid">
                        ${[1, 2, 3].map((index) => `
                            <article class="visual-metric-card">
                                ${renderVisualField(`metric_${index}_number`, { label: `رقم ${index}`, className: "is-metric-number" })}
                                ${renderVisualField(`metric_${index}_label`, { label: `وصف ${index}` })}
                            </article>
                        `).join("")}
                    </div>
                </div>
            </section>

            <section class="visual-preview-section" id="visualServices">
                ${renderContentSectionHeader("03", "الخدمات", "بطاقات الخدمات كما يراها الزائر", "sparkles")}
                <div class="visual-copy-block visual-copy-wide">
                    ${renderVisualField("services_eyebrow", { label: "العنوان الصغير" })}
                    ${renderVisualField("services_title", { label: "عنوان الخدمات", multiline: true, rows: 2, className: "is-section-title" })}
                    ${renderVisualField("service_button", { label: "نص زر تفاصيل الخدمة" })}
                </div>
                <div class="visual-card-grid">
                    ${renderServicePreviewCard(1, "calendar-check")}
                    ${renderServicePreviewCard(2, "megaphone")}
                    ${renderServicePreviewCard(3, "palette")}
                </div>
            </section>

            <section class="visual-preview-section" id="visualWorks">
                ${renderContentSectionHeader("04", "الأعمال والمميزات", "العناوين ومربعات نقاط القوة", "layers-3")}
                <div class="visual-two-column">
                    <div class="visual-copy-block">
                        ${renderVisualField("identity_eyebrow", { label: "عنوان صغير لمعرض الهوية" })}
                        ${renderVisualField("identity_title", { label: "عنوان معرض الهوية", multiline: true, rows: 2 })}
                        ${renderVisualField("projects_eyebrow", { label: "عنوان صغير للأعمال" })}
                        ${renderVisualField("projects_title", { label: "عنوان الأعمال", multiline: true, rows: 2 })}
                    </div>
                    <div class="visual-copy-block">
                        ${renderVisualField("features_eyebrow", { label: "عنوان صغير للمميزات" })}
                        ${renderVisualField("features_title", { label: "عنوان المميزات", multiline: true, rows: 2, className: "is-section-title" })}
                    </div>
                </div>
                <div class="visual-card-grid visual-card-grid-four">
                    ${renderFeaturePreviewCard(1, "badge-check")}
                    ${renderFeaturePreviewCard(2, "smartphone")}
                    ${renderFeaturePreviewCard(3, "sparkles")}
                    ${renderFeaturePreviewCard(4, "handshake")}
                </div>
            </section>

            <section class="visual-preview-section visual-journey-editor" id="visualJourney">
                ${renderContentSectionHeader("05", "رحلة التنفيذ", "من الفكرة إلى التوثيق", "route")}
                <div class="visual-two-column">
                    <div class="visual-stamp-preview">
                        <span>تخطيط</span>
                        <strong>تنفيذ</strong>
                        <em>توثيق</em>
                    </div>
                    <div class="visual-copy-block">
                        ${renderVisualField("execution_eyebrow", { label: "العنوان الصغير" })}
                        ${renderVisualField("execution_title", { label: "عنوان الرحلة", multiline: true, rows: 2, className: "is-section-title" })}
                        ${renderVisualField("execution_text", { label: "نص الرحلة", multiline: true, rows: 5 })}
                        <div class="visual-chip-grid">
                            ${renderVisualField("execution_step_1", { label: "الخطوة الأولى" })}
                            ${renderVisualField("execution_step_2", { label: "الخطوة الثانية" })}
                            ${renderVisualField("execution_step_3", { label: "الخطوة الثالثة" })}
                        </div>
                    </div>
                </div>
            </section>

            <section class="visual-preview-section" id="visualForm">
                ${renderContentSectionHeader("06", "نموذج الطلب", "النصوص التي يراها العميل قبل الإرسال", "send")}
                <div class="visual-form-editor">
                    <div class="visual-copy-block">
                        ${renderVisualField("interest_eyebrow", { label: "العنوان الصغير" })}
                        ${renderVisualField("interest_title", { label: "عنوان نموذج الطلب", multiline: true, rows: 3, className: "is-section-title" })}
                        ${renderVisualField("interest_text", { label: "نص قبل النموذج", multiline: true, rows: 4 })}
                        ${renderVisualField("contact_whatsapp_label", { label: "نص زر واتساب في النموذج" })}
                    </div>
                    <div class="visual-form-card">
                        ${renderVisualField("form_name_label", { label: "اسم حقل الاسم" })}
                        <div class="visual-button-row">
                            ${renderVisualField("form_country_label", { label: "حقل رمز الدولة" })}
                            ${renderVisualField("form_phone_label", { label: "حقل الجوال" })}
                        </div>
                        ${renderVisualField("form_interest_label", { label: "حقل الاهتمام" })}
                        ${renderVisualField("form_source_label", { label: "حقل مصدر المعرفة" })}
                        ${renderVisualField("form_message_label", { label: "حقل الملاحظات" })}
                        ${renderVisualField("form_message_placeholder", { label: "النص المساعد داخل الملاحظات", multiline: true, rows: 2 })}
                        ${renderVisualField("form_submit_button", { label: "زر الإرسال" })}
                    </div>
                </div>
            </section>

            <section class="visual-preview-section visual-contact-editor" id="visualContact">
                ${renderContentSectionHeader("07", "صفحة تواصل معنا", "محتوى الصفحة المستقلة", "messages-square")}
                <div class="visual-contact-hero">
                    <div>
                        ${renderVisualField("contact_page_eyebrow", { label: "العنوان الصغير" })}
                        ${renderVisualField("contact_page_title", { label: "العنوان الكبير", multiline: true, rows: 3, className: "is-main-title" })}
                    </div>
                    <div class="visual-contact-details">
                        ${renderVisualField("contact_calls_title", { label: "عنوان أوقات المكالمات" })}
                        ${renderVisualField("contact_calls_text", { label: "نص أوقات المكالمات", multiline: true, rows: 2 })}
                        ${renderVisualField("contact_visits_title", { label: "عنوان أوقات تنسيق الفعاليات" })}
                        ${renderVisualField("contact_visits_text", { label: "نص أوقات تنسيق الفعاليات", multiline: true, rows: 2 })}
                        ${renderVisualField("contact_location_title", { label: "عنوان الموقع" })}
                        ${renderVisualField("contact_maps_url", { label: "رابط خرائط جوجل", ltr: true })}
                    </div>
                </div>
                <div class="visual-channel-grid">
                    ${renderContactChannel("contact_channel_whatsapp", null, null, "message-circle")}
                    ${renderContactChannel("contact_channel_instagram", "social_instagram_label", "social_instagram_url", "instagram")}
                    ${renderContactChannel("contact_channel_x", "social_x_label", "social_x_url", "twitter")}
                    ${renderContactChannel("contact_channel_youtube", "social_youtube_label", "social_youtube_url", "youtube")}
                    ${renderContactChannel("contact_channel_tiktok", "social_tiktok_label", "social_tiktok_url", "music-2")}
                    ${renderContactChannel("contact_channel_snapchat", "social_snapchat_label", "social_snapchat_url", "ghost")}
                    ${renderContactChannel("contact_channel_email", null, null, "mail")}
                    ${renderContactChannel("contact_channel_location", null, null, "map-pin")}
                </div>
            </section>

            <section class="visual-preview-section visual-footer-editor" id="visualFooter">
                ${renderContentSectionHeader("08", "التذييل والبيانات الرسمية", "النصوص الصغيرة أسفل الموقع", "panel-bottom")}
                <div class="visual-footer-surface">
                    <div class="visual-footer-brand">
                        <div class="visual-logo-word is-light">مُهيب</div>
                        ${renderVisualField("footer_text", { label: "جملة أسفل الشعار", multiline: true, rows: 3 })}
                        ${renderVisualField("footer_copyright", { label: "حقوق النشر" })}
                    </div>
                    <div class="visual-footer-lines">
                        ${renderVisualField("contact_phone", { label: "رقم الاتصال", ltr: true })}
                        ${renderVisualField("contact_whatsapp_number", { label: "رقم الواتساب", ltr: true })}
                        ${renderVisualField("contact_email", { label: "البريد الإلكتروني", ltr: true })}
                        ${renderVisualField("contact_location", { label: "الموقع" })}
                    </div>
                    <div class="visual-footer-lines">
                        ${renderVisualField("commercial_registration", { label: "رقم السجل التجاري", ltr: true })}
                        ${renderVisualField("tax_number", { label: "الرقم الضريبي", ltr: true })}
                        ${renderVisualField("bank_account", { label: "رقم الحساب البنكي", ltr: true })}
                        ${renderVisualField("footer_contact_title", { label: "عنوان بيانات التواصل" })}
                    </div>
                </div>
            </section>

            ${renderExtraContentFields()}
        </div>
    `;
    initIcons();
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
    if (supportLogosName) supportLogosName.textContent = "يمكن اختيار أكثر من شعار";
    state.pendingSupportLogos = [];
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
    if (eventForm.elements.venueName) eventForm.elements.venueName.value = event.venueName || "";
    if (eventForm.elements.mapUrl) eventForm.elements.mapUrl.value = event.mapUrl || "";
    eventForm.elements.eventDate.value = event.eventDate || "";
    if (eventForm.elements.dateFrom) eventForm.elements.dateFrom.value = event.dateFrom || "";
    if (eventForm.elements.dateTo) eventForm.elements.dateTo.value = event.dateTo || "";
    if (eventForm.elements.timeFrom) eventForm.elements.timeFrom.value = event.timeFrom || "";
    if (eventForm.elements.timeTo) eventForm.elements.timeTo.value = event.timeTo || "";
    eventForm.elements.description.value = event.description || "";
    eventForm.elements.highlights.value = (event.highlights || []).join("\n");
    if (eventForm.elements.participants) eventForm.elements.participants.value = (event.participants || []).join("\n");
    if (eventForm.elements.achievements) eventForm.elements.achievements.value = (event.achievements || []).join("\n");
    if (eventForm.elements.detailSections) eventForm.elements.detailSections.value = stringifyEventSections(event.detailSections || []);
    eventForm.elements.sortOrder.value = event.sortOrder || 0;
    eventForm.elements.published.checked = Boolean(event.published);
    state.pendingSupportLogos = event.supportLogos || [];
    if (supportLogosName) supportLogosName.textContent = state.pendingSupportLogos.length ? `${state.pendingSupportLogos.length} شعار محفوظ` : "يمكن اختيار أكثر من شعار";
    coverName.textContent = event.coverImage ? "صورة محفوظة حاليًا" : "لم يتم اختيار صورة جديدة";
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

const getInputFiles = (input) => editedFiles.get(input) || input?.files || [];

const getFriendlyFileLabel = (label, fallback = "تم تجهيز الصورة") => {
    const value = String(label || "").trim();
    if (!value) return fallback;
    if (/^(https?:|data:|assets\/|event-images\/|storage\/)/i.test(value) || value.length > 72) {
        return fallback;
    }
    return value;
};

const setInputFileLabel = (input, label) => {
    if (!input) return;
    const box = input.closest(".upload-box");
    let labelElement = box?.querySelector("[data-file-label]");
    if (!labelElement && box) {
        labelElement = document.createElement("small");
        labelElement.dataset.fileLabel = "true";
        box.appendChild(labelElement);
    }
    const friendlyLabel = getFriendlyFileLabel(label);
    if (labelElement) labelElement.textContent = friendlyLabel;
    if (input === coverInput && coverName) coverName.textContent = friendlyLabel;
};

const getImageEditorValues = () => {
    const elements = imageEditorForm?.elements || {};
    return {
        aspect: elements.aspect?.value || "16:9",
        zoom: Number(elements.zoom?.value || 1),
        brightness: Number(elements.brightness?.value || 100),
        contrast: Number(elements.contrast?.value || 100),
        grayscale: Number(elements.grayscale?.value || 0),
        sepia: Number(elements.sepia?.value || 0),
    };
};

const getAspectRatio = (aspect) => {
    if (aspect === "1:1") return 1;
    if (aspect === "4:3") return 4 / 3;
    if (aspect === "free") return null;
    return 16 / 9;
};

const updateImageEditorPreview = () => {
    if (!imageEditorPreview || !state.imageEditor.objectUrl) return;
    const values = getImageEditorValues();
    imageEditorPreview.src = state.imageEditor.objectUrl;
    imageEditorPreview.style.transform = `scale(${values.zoom})`;
    imageEditorPreview.style.filter = `brightness(${values.brightness}%) contrast(${values.contrast}%) grayscale(${values.grayscale}%) sepia(${values.sepia}%)`;
    if (imageEditorOutput) {
        imageEditorOutput.textContent = `تكبير ${values.zoom.toFixed(1)}x - سطوع ${values.brightness}% - تباين ${values.contrast}%`;
    }
};

const openImageEditor = (input, file) => {
    if (!imageEditorModal || !file || !file.type?.startsWith("image/")) return;
    if (state.imageEditor.objectUrl) URL.revokeObjectURL(state.imageEditor.objectUrl);
    state.imageEditor = {
        input,
        file,
        objectUrl: URL.createObjectURL(file),
    };
    if (imageEditorFileName) imageEditorFileName.textContent = file.name;
    imageEditorForm?.reset();
    if (imageEditorForm?.elements.zoom) imageEditorForm.elements.zoom.value = "1";
    if (imageEditorForm?.elements.brightness) imageEditorForm.elements.brightness.value = "100";
    if (imageEditorForm?.elements.contrast) imageEditorForm.elements.contrast.value = "100";
    if (imageEditorForm?.elements.grayscale) imageEditorForm.elements.grayscale.value = "0";
    if (imageEditorForm?.elements.sepia) imageEditorForm.elements.sepia.value = "0";
    updateImageEditorPreview();
    imageEditorModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    initIcons();
};

const closeImageEditor = (clearInput = false) => {
    if (clearInput && state.imageEditor.input) {
        state.imageEditor.input.value = "";
        editedFiles.delete(state.imageEditor.input);
    }
    if (state.imageEditor.objectUrl) URL.revokeObjectURL(state.imageEditor.objectUrl);
    state.imageEditor = { input: null, file: null, objectUrl: "" };
    imageEditorModal?.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
};

const loadImage = (src) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
});

const createEditedImageFile = async () => {
    const values = getImageEditorValues();
    const image = await loadImage(state.imageEditor.objectUrl);
    const ratio = getAspectRatio(values.aspect) || (image.width / image.height);
    const outputWidth = Math.min(1600, Math.max(900, image.width));
    const outputHeight = Math.round(outputWidth / ratio);
    const canvas = imageEditorCanvas;
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext("2d");
    const sourceRatio = image.width / image.height;
    let sourceWidth = image.width;
    let sourceHeight = image.height;
    if (sourceRatio > ratio) {
        sourceWidth = image.height * ratio;
    } else {
        sourceHeight = image.width / ratio;
    }
    sourceWidth = Math.max(1, sourceWidth / values.zoom);
    sourceHeight = Math.max(1, sourceHeight / values.zoom);
    const sourceX = Math.max(0, (image.width - sourceWidth) / 2);
    const sourceY = Math.max(0, (image.height - sourceHeight) / 2);
    ctx.filter = `brightness(${values.brightness}%) contrast(${values.contrast}%) grayscale(${values.grayscale}%) sepia(${values.sepia}%)`;
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const original = state.imageEditor.file;
            const cleanName = original.name.replace(/\.[^.]+$/, "");
            resolve(new File([blob], `${cleanName}-edited.jpg`, { type: "image/jpeg" }));
        }, "image/jpeg", 0.9);
    });
};

const saveEvent = async (event) => {
    event.preventDefault();
    showMessage("جاري حفظ الفعالية...", eventFormMessage);
    try {
        const coverFiles = getInputFiles(coverInput);
        const galleryFiles = getInputFiles(galleryInput);
        const supportLogoFiles = getInputFiles(eventSupportLogosInput);
        if (coverFiles && coverFiles.length) {
            const uploadedCover = await uploadFiles(coverFiles);
            state.coverPath = uploadedCover[0]?.path || state.coverPath;
        }
        const uploadedGallery = await uploadFiles(galleryFiles);
        const uploadedSupportLogos = await uploadFiles(supportLogoFiles, "event-logos");
        const payload = {
            title: eventForm.elements.title.value,
            category: eventForm.elements.category.value,
            location: eventForm.elements.location.value,
            venueName: eventForm.elements.venueName?.value || "",
            mapUrl: eventForm.elements.mapUrl?.value || "",
            eventDate: eventForm.elements.eventDate.value,
            dateFrom: eventForm.elements.dateFrom?.value || "",
            dateTo: eventForm.elements.dateTo?.value || "",
            timeFrom: eventForm.elements.timeFrom?.value || "",
            timeTo: eventForm.elements.timeTo?.value || "",
            description: eventForm.elements.description.value,
            highlights: splitLines(eventForm.elements.highlights.value),
            participants: splitLines(eventForm.elements.participants?.value || ""),
            achievements: splitLines(eventForm.elements.achievements?.value || ""),
            supportLogos: [
                ...state.pendingSupportLogos,
                ...uploadedSupportLogos.map((file) => file.path),
            ],
            detailSections: parseEventSections(eventForm.elements.detailSections?.value || ""),
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
        const inputMap = new Map();
        Array.from(contentEditor.querySelectorAll("[data-content-input]")).forEach((input) => {
            inputMap.set(input.dataset.contentInput, input);
        });
        const rows = Array.from(inputMap.values()).map((input) => {
            const source = getContentRow(input.dataset.contentInput);
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
    const selectedFiles = getInputFiles(fileInput);
    if (selectedFiles?.length) {
        const uploaded = await uploadFiles(selectedFiles, "site");
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
        const uploaded = await uploadFiles(getInputFiles(newSiteImageFile), "site");
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

const openUserModal = (mode = "new") => {
    if (mode === "new") resetUserForm();
    userModal?.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    initIcons();
};

const closeUserModal = () => {
    userModal?.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
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
    usersList.innerHTML = `
        <div class="table-wrap">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>رقم الجوال</th>
                        <th>الإيميل</th>
                        <th>الصلاحيات</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.users.map((user) => {
                        const activePermissions = permissionItems
                            .filter((permission) => user.permissions?.[permission.key])
                            .slice(0, 3)
                            .map((permission) => permission.label);
                        return `
                        <tr class="${user.active ? "" : "is-disabled"}">
                            <td><strong>${escapeHtml(getDisplayName(user))}</strong></td>
                            <td><span class="phone-ltr">${escapeHtml(user.phone || "-")}</span></td>
                            <td>${escapeHtml(user.email || "-")}</td>
                            <td>${activePermissions.length ? escapeHtml(activePermissions.join("، ")) : "بدون صلاحيات محددة"}</td>
                            <td><span class="badge ${user.active ? "" : "is-dim"}">${user.role === "owner" ? "مالك" : user.active ? "نشط" : "موقوف"}</span></td>
                            <td>
                                <div class="lead-actions">
                                    <button class="ghost-btn icon-only small-icon" type="button" data-edit-user="${escapeHtml(user.userId)}" title="تعديل">
                                        <i data-lucide="pencil"></i>
                                    </button>
                                    ${user.userId !== state.admin?.userId && user.role !== "owner" ? `
                                        <button class="danger-btn icon-only small-icon" type="button" data-delete-user="${escapeHtml(user.userId)}" title="إزالة الصلاحية">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    ` : ""}
                                </div>
                            </td>
                        </tr>
                    `;
                    }).join("") || `<tr><td colspan="6">لا يوجد مستخدمون بعد.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
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
    openUserModal("edit");
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
        closeUserModal();
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

const openProfileModal = () => {
    if (!profileModal || !state.admin) return;
    profileDetailGrid.innerHTML = `
        <article>
            <span>الاسم</span>
            <strong>${escapeHtml(getDisplayName())}</strong>
        </article>
        <article>
            <span>رقم الجوال</span>
            <strong class="phone-ltr">${escapeHtml(state.admin.phone || "غير مضاف")}</strong>
        </article>
        <article>
            <span>الإيميل</span>
            <strong>${escapeHtml(state.admin.email || state.admin.authEmail || "-")}</strong>
        </article>
        <article>
            <span>نوع الحساب</span>
            <strong>${state.admin.role === "owner" ? "مالك" : "مستخدم"}</strong>
        </article>
    `;
    if (profileRequestForm) {
        profileRequestForm.elements.fullName.value = state.admin.fullName || "";
        profileRequestForm.elements.phone.value = state.admin.phone || "";
        profileRequestForm.elements.email.value = state.admin.email || state.admin.authEmail || "";
    }
    profileModal.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    initIcons();
};

const closeProfileModal = () => {
    profileModal?.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
};

const renderProfileRequests = () => {
    if (!profileRequestsList) return;
    const requests = state.profileRequests || [];
    profileRequestsList.innerHTML = requests.map((request) => {
        const user = getUserById(request.userId);
        return `
            <article class="profile-request-card ${request.status !== "pending" ? "is-muted" : ""}" data-profile-request="${request.id}">
                <div>
                    <strong>${escapeHtml(getDisplayName(user || {}))}</strong>
                    <span>${formatDate(request.createdAt)}</span>
                    <span class="badge ${request.status === "pending" ? "" : "is-dim"}">${request.status === "pending" ? "بانتظار الموافقة" : request.status === "approved" ? "تمت الموافقة" : "مرفوض"}</span>
                </div>
                <div class="form-grid">
                    <label>
                        <span>الاسم المطلوب</span>
                        <input type="text" data-profile-request-full-name value="${escapeHtml(request.requestedFullName)}" ${request.status !== "pending" ? "disabled" : ""}>
                    </label>
                    <label>
                        <span>الجوال المطلوب</span>
                        <input type="text" data-profile-request-phone value="${escapeHtml(request.requestedPhone)}" ${request.status !== "pending" ? "disabled" : ""}>
                    </label>
                    <label>
                        <span>الإيميل المطلوب</span>
                        <input type="email" data-profile-request-email value="${escapeHtml(request.requestedEmail)}" ${request.status !== "pending" ? "disabled" : ""}>
                    </label>
                </div>
                ${request.status === "pending" ? `
                    <div class="event-actions">
                        <button class="primary-btn" type="button" data-approve-profile-request="${request.id}">
                            <i data-lucide="check"></i>
                            <span>قبول</span>
                        </button>
                        <button class="danger-btn" type="button" data-reject-profile-request="${request.id}">
                            <i data-lucide="x"></i>
                            <span>رفض</span>
                        </button>
                    </div>
                ` : ""}
            </article>
        `;
    }).join("") || `<div class="compact-item"><span>لا توجد طلبات تعديل بيانات حتى الآن.</span></div>`;
    initIcons();
};

const renderNotifications = () => {
    const isRead = (notification) => (notification.readBy || []).includes(state.admin?.userId);
    const unreadCount = state.notifications.filter((notification) => !isRead(notification)).length;
    const count = unreadCount;
    notificationBadge.textContent = String(count);
    notificationBadge.classList.toggle("is-hidden", !count);
    notificationCount.textContent = count ? `${count} غير مقروء` : "لا يوجد جديد";
    notificationList.innerHTML = state.notifications.map((notification) => `
        <button class="notification-item ${isRead(notification) ? "is-read" : ""}" type="button" data-open-lead="${escapeHtml(notification.leadId || "")}" data-notification-id="${escapeHtml(notification.id)}">
            <strong>${escapeHtml(notification.title)}</strong>
            <span>${escapeHtml(notification.message)}</span>
            <small>${isRead(notification) ? "مقروء" : "جديد"} - ${formatDate(notification.createdAt)}</small>
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
openUserModalButton?.addEventListener("click", () => openUserModal("new"));
closeUserModalButton?.addEventListener("click", closeUserModal);
userModal?.addEventListener("click", (event) => {
    if (event.target === userModal) closeUserModal();
});

closeProfileModalButton?.addEventListener("click", closeProfileModal);
profileModal?.addEventListener("click", (event) => {
    if (event.target === profileModal) closeProfileModal();
});

profileRequestForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("جاري إرسال طلب التعديل...", profileRequestMessage);
    try {
        await window.MuheebData.createProfileChangeRequest({
            fullName: profileRequestForm.elements.fullName.value,
            phone: profileRequestForm.elements.phone.value,
            email: profileRequestForm.elements.email.value,
        });
        await loadAll();
        closeProfileModal();
        showMessage("تم إرسال طلب تعديل البيانات للمشرف.", profileRequestMessage);
    } catch (error) {
        showError(error.message, profileRequestMessage);
    }
});

profileRequestsList?.addEventListener("click", async (event) => {
    const approveButton = event.target.closest("[data-approve-profile-request]");
    const rejectButton = event.target.closest("[data-reject-profile-request]");
    const button = approveButton || rejectButton;
    if (!button) return;
    const card = button.closest("[data-profile-request]");
    const requestId = Number(button.dataset.approveProfileRequest || button.dataset.rejectProfileRequest || 0);
    try {
        await window.MuheebData.reviewProfileChangeRequest(requestId, {
            status: approveButton ? "approved" : "rejected",
            fullName: card.querySelector("[data-profile-request-full-name]")?.value,
            phone: card.querySelector("[data-profile-request-phone]")?.value,
            email: card.querySelector("[data-profile-request-email]")?.value,
        });
        await loadAll();
        showMessage(approveButton ? "تم قبول طلب تعديل البيانات." : "تم رفض طلب تعديل البيانات.");
    } catch (error) {
        showError(error.message);
    }
});

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
    const button = event.target.closest("[data-notification-id]");
    const leadId = Number(button?.dataset.openLead || 0);
    const notificationId = Number(button?.dataset.notificationId || 0);
    if (notificationId) {
        window.MuheebData.markNotificationRead(notificationId)
            .then(async () => {
                await loadAll();
                if (leadId) openLeadModal(leadId);
            })
            .catch(() => {
                if (leadId) openLeadModal(leadId);
            });
        notificationsMenu.classList.add("is-hidden");
    }
});

profileMenu?.addEventListener("click", (event) => {
    const profileOpen = event.target.closest("[data-profile-open]");
    if (profileOpen) {
        profileMenu.classList.add("is-hidden");
        openProfileModal();
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
    const inquiryButton = event.target.closest("[data-inquire-note]");
    if (inquiryButton) {
        const body = window.prompt("اكتب الاستفسار الذي تريد إرساله للمشرف:");
        if (!body || !body.trim()) return;
        try {
            await addNoteInquiry(inquiryButton.dataset.inquireNote, body);
            showMessage("تم إرسال الاستفسار للمشرف.");
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

siteImageList?.addEventListener("change", (event) => {
    const input = event.target.closest("[data-site-image-file]");
    const file = input?.files?.[0];
    if (input && file) openImageEditor(input, file);
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
        openImageEditor(coverInput, file);
    }
});

newSiteImageFile?.addEventListener("change", () => {
    const file = newSiteImageFile.files?.[0];
    if (file) openImageEditor(newSiteImageFile, file);
});

galleryInput.addEventListener("change", () => {
    const count = galleryInput.files?.length || 0;
    galleryName.textContent = count ? `${count} صور جاهزة للرفع عند الحفظ` : "يمكن اختيار أكثر من صورة";
});

eventSupportLogosInput?.addEventListener("change", () => {
    const count = eventSupportLogosInput.files?.length || 0;
    if (supportLogosName) supportLogosName.textContent = count ? `${count} شعار جاهز للرفع عند الحفظ` : "يمكن اختيار أكثر من شعار";
});

imageEditorForm?.addEventListener("input", updateImageEditorPreview);
imageEditorForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.imageEditor.input) return;
    try {
        const editedFile = await createEditedImageFile();
        editedFiles.set(state.imageEditor.input, [editedFile]);
        setInputFileLabel(state.imageEditor.input, editedFile.name);
        if (state.imageEditor.input === coverInput) {
            coverPreview.src = URL.createObjectURL(editedFile);
        }
        closeImageEditor(false);
        showMessage("تم اعتماد الصورة للتجهيز والرفع عند الحفظ.");
    } catch (error) {
        showError("تعذر تجهيز الصورة. حاول اختيار صورة أخرى.");
    }
});
closeImageEditorButton?.addEventListener("click", () => closeImageEditor(true));
cancelImageEditorButton?.addEventListener("click", () => closeImageEditor(true));
imageEditorModal?.addEventListener("click", (event) => {
    if (event.target === imageEditorModal) closeImageEditor(true);
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
