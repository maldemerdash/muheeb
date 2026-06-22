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
    activeInquiry: { mode: "create", noteId: "", inquiryId: "" },
    coverPath: "",
    pendingSupportLogos: [],
    pendingEventSections: [],
    activeEventSectionIndex: null,
};

const hiddenGalleryCaptionPrefix = "__muheeb_hidden_gallery_caption__:";

const parseGalleryCaption = (altText = "") => {
    const raw = String(altText || "");
    if (raw.startsWith(hiddenGalleryCaptionPrefix)) {
        return {
            text: raw.slice(hiddenGalleryCaptionPrefix.length),
            visible: false,
        };
    }
    return {
        text: raw,
        visible: true,
    };
};

const encodeGalleryCaption = (text = "", visible = true) => {
    const safeText = String(text || "").trim();
    return visible ? safeText : `${hiddenGalleryCaptionPrefix}${safeText}`;
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

const dropdownTypeLabels = {
    interest: "مجال الاهتمام في نموذج الطلب",
    event_category: "تصنيف الفعاليات",
};

const defaultEventCategoryOptions = [
    { label: "فعاليات", value: "event", optionType: "event_category", published: true, sortOrder: 1 },
    { label: "تسويق", value: "marketing", optionType: "event_category", published: true, sortOrder: 2 },
    { label: "هوية", value: "identity", optionType: "event_category", published: true, sortOrder: 3 },
    { label: "تشغيل", value: "operation", optionType: "event_category", published: true, sortOrder: 4 },
];

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
    admin_login_background: 80,
};

const siteImageGroupOrder = {
    site_core: 10,
    identity_gallery: 20,
    services: 30,
    footer: 40,
    admin_login: 50,
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
    { contentKey: "event_about_eyebrow", label: "عنوان صغير لقسم عن الفعالية", value: "عن الفعالية", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 170 },
    { contentKey: "event_highlights_eyebrow", label: "عنوان صغير للنقاط المختصرة", value: "نقاط مختصرة للعرض", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 171 },
    { contentKey: "event_highlights_title", label: "عنوان النقاط المختصرة", value: "ملخص سريع لما يميز الفعالية", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 172 },
    { contentKey: "event_achievements_eyebrow", label: "عنوان صغير للإنجازات", value: "الإنجازات المحققة", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 173 },
    { contentKey: "event_achievements_title", label: "عنوان الإنجازات", value: "نتائج ومخرجات الفعالية", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 174 },
    { contentKey: "event_gallery_eyebrow", label: "عنوان صغير لمعرض صور الفعالية", value: "معرض الصور", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 175 },
    { contentKey: "event_gallery_title", label: "عنوان معرض صور الفعالية", value: "مشاهد من الفعالية", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 176 },
    { contentKey: "event_partners_eyebrow", label: "عنوان صغير للجهات المشاركة", value: "الجهات والشركاء", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 177 },
    { contentKey: "event_partners_title", label: "عنوان الجهات المشاركة", value: "الجهات المشاركة أو الداعمة", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 178 },
    { contentKey: "event_sections_eyebrow", label: "عنوان صغير لأقسام الفعالية", value: "تفاصيل إضافية", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 179 },
    { contentKey: "event_sections_title", label: "عنوان أقسام الفعالية", value: "كل ما يتعلق بالفعالية", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 180 },
    { contentKey: "event_default_section_title", label: "عنوان القسم الافتراضي في أسفل الفعالية", value: "تفاصيل التجربة", inputType: "text", groupName: "صفحة الفعالية", sortOrder: 181 },
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
    { key: "interest_options", label: "القوائم المنسدلة" },
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
const eventCategorySelect = document.getElementById("eventCategorySelect");
const passwordForm = document.getElementById("passwordForm");
const passwordMessage = document.getElementById("passwordMessage");
const eventIdInput = document.getElementById("eventId");
const coverInput = document.getElementById("coverInput");
const galleryInput = document.getElementById("galleryInput");
const coverName = document.getElementById("coverName");
const galleryName = document.getElementById("galleryName");
const coverPreview = document.getElementById("coverPreview");
const galleryPreview = document.getElementById("galleryPreview");
const supportLogosPreview = document.getElementById("supportLogosPreview");
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
const openSiteImageModalButton = document.getElementById("openSiteImageModalButton");
const siteImageModal = document.getElementById("siteImageModal");
const closeSiteImageModalButton = document.getElementById("closeSiteImageModal");
const cancelSiteImageModalButton = document.getElementById("cancelSiteImageModal");
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
const noteInquiryModal = document.getElementById("noteInquiryModal");
const noteInquiryForm = document.getElementById("noteInquiryForm");
const noteInquiryTitle = document.getElementById("noteInquiryTitle");
const noteInquiryEyebrow = document.getElementById("noteInquiryEyebrow");
const noteInquiryContext = document.getElementById("noteInquiryContext");
const noteInquiryLabel = document.getElementById("noteInquiryLabel");
const noteInquirySubmitText = document.getElementById("noteInquirySubmitText");
const noteInquiryMessage = document.getElementById("noteInquiryMessage");
const closeNoteInquiryModalButton = document.getElementById("closeNoteInquiryModal");
const cancelNoteInquiryModalButton = document.getElementById("cancelNoteInquiryModal");
const userForm = document.getElementById("userForm");
const userFormTitle = document.getElementById("userFormTitle");
const userFormMessage = document.getElementById("userFormMessage");
const userAvatarInput = document.getElementById("userAvatarInput");
const userAvatarName = document.getElementById("userAvatarName");
const userAvatarPreview = document.getElementById("userAvatarPreview");
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
const supportLogoModal = document.getElementById("supportLogoModal");
const supportLogoForm = document.getElementById("supportLogoForm");
const openSupportLogoModalButton = document.getElementById("openSupportLogoModal");
const closeSupportLogoModalButton = document.getElementById("closeSupportLogoModal");
const cancelSupportLogoModalButton = document.getElementById("cancelSupportLogoModal");
const eventSupportLogosInput = document.getElementById("supportLogosInput");
const supportLogosName = document.getElementById("supportLogosName");
const supportLogoLabelInput = document.getElementById("supportLogoLabel");
const addSupportLogoButton = document.getElementById("addSupportLogoButton");
const eventSectionsPreview = document.getElementById("eventSectionsPreview");
const eventSectionModal = document.getElementById("eventSectionModal");
const eventSectionForm = document.getElementById("eventSectionForm");
const eventSectionModalEyebrow = document.getElementById("eventSectionModalEyebrow");
const eventSectionModalTitle = document.getElementById("eventSectionModalTitle");
const openEventSectionModalButton = document.getElementById("openEventSectionModal");
const closeEventSectionModalButton = document.getElementById("closeEventSectionModal");
const cancelEventSectionModalButton = document.getElementById("cancelEventSectionModal");
const eventSectionSubmitText = document.getElementById("eventSectionSubmitText");
const eventSectionImageInput = document.getElementById("eventSectionImageInput");
const eventSectionImageName = document.getElementById("eventSectionImageName");

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

const userHasPermission = (user, permission) => (
    user?.role === "owner" ||
    user?.permissions?.all === true ||
    user?.permissions?.[permission] === true
);

const getUserAvatar = (user = state.admin) => user?.avatarUrl || user?.permissions?.avatarUrl || "";

const getInitials = (name) => String(name || "م")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("") || "م";

const renderUserAvatar = (user = state.admin, className = "user-avatar") => {
    const avatarUrl = getUserAvatar(user);
    return `
        <span class="${className}">
            ${avatarUrl
                ? `<img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(getDisplayName(user))}">`
                : `<em>${escapeHtml(getInitials(getDisplayName(user)))}</em>`}
        </span>
    `;
};

const updateAvatarPreview = (avatarUrl = "") => {
    if (!userAvatarPreview) return;
    const value = avatarUrl || userForm?.elements.avatarUrl?.value || "";
    userAvatarPreview.innerHTML = value
        ? `<img src="${escapeHtml(value)}" alt="صورة الموظف">`
        : `<i data-lucide="user-round"></i>`;
    initIcons();
};

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

const normalizeWhatsappDigits = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("00")) return digits.slice(2);
    if (digits.startsWith("966")) return digits;
    if (digits.startsWith("05")) return `966${digits.slice(1)}`;
    if (digits.startsWith("5") && digits.length === 9) return `966${digits}`;
    return digits;
};

const buildWhatsappUrl = (phone, message = "") => {
    const digits = normalizeWhatsappDigits(phone);
    if (!digits) return "";
    const text = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${digits}${text}`;
};

const getUserPhone = (user) => user?.phone || user?.permissions?.phone || "";

const getLeadWhatsappUrl = (lead) => buildWhatsappUrl(
    `${lead?.countryCode || ""}${lead?.phone || ""}`,
    "تم الاطلاع على طلبك وسيتم التواصل معك وتسعدني خدمتك"
);

const openPendingExternalWindow = (label = "واتساب") => {
    const popup = window.open("", "_blank");
    if (!popup) return null;
    try {
        popup.document.write(`
            <!doctype html>
            <html lang="ar" dir="rtl">
            <head><meta charset="utf-8"><title>${label}</title></head>
            <body style="font-family: Cairo, Arial, sans-serif; display:grid; min-height:100vh; place-items:center; margin:0; background:#f4f1ed; color:#451216;">
                <strong>جاري تجهيز رسالة ${label}...</strong>
            </body>
            </html>
        `);
        popup.document.close();
    } catch (error) {
        // Some browsers block writing to the newly opened window; navigation still works.
    }
    return popup;
};

const openWhatsappMessage = (phone, message, popup = null, missingMessage = "لا يوجد رقم واتساب للطرف المعني.") => {
    const url = buildWhatsappUrl(phone, message);
    if (!url) {
        popup?.close?.();
        if (missingMessage) showError(missingMessage);
        return null;
    }
    if (popup && !popup.closed) {
        try {
            popup.location.replace(url);
            popup.focus?.();
            return popup;
        } catch (error) {
            console.warn("Unable to reuse pending WhatsApp window:", error);
        }
    }
    const fallbackWindow = window.open(url, "_blank", "noopener");
    if (fallbackWindow) {
        fallbackWindow.focus?.();
        return fallbackWindow;
    }
    try {
        window.location.href = url;
    } catch (error) {
        showError("تم تجهيز رسالة واتساب، لكن المتصفح منع فتح النافذة. اسمح بالنوافذ المنبثقة ثم أعد المحاولة.");
        return null;
    }
    return null;
};

const openWhatsappForUser = (user, message, popup = null) => {
    return openWhatsappMessage(
        getUserPhone(user),
        message,
        popup,
        `لا يوجد رقم جوال محفوظ للمستخدم ${getDisplayName(user)}.`
    );
};

const openWhatsappForLead = (lead, popup = null) => {
    return openWhatsappMessage(
        `${lead?.countryCode || ""}${lead?.phone || ""}`,
        "تم الاطلاع على طلبك وسيتم التواصل معك وتسعدني خدمتك",
        popup,
        "لا يوجد رقم جوال محفوظ لهذا الطلب."
    );
};

const handleLeadWhatsappAction = (leadId) => {
    const lead = state.leads.find((item) => Number(item.id) === Number(leadId));
    if (!lead) return;
    openWhatsappForLead(lead);
};

const getFirstUserWithPhone = (targetIds = []) => (
    targetIds
        .map((id) => getUserById(id))
        .find((user) => user?.userId && user.userId !== state.admin?.userId && getUserPhone(user))
);

const getUsersByPermission = (permission) => state.users.filter((user) => (
    user.active &&
    user.userId !== state.admin?.userId &&
    userHasPermission(user, permission)
));

const getFollowUpManager = (preferredUserId = "") => {
    const preferred = getUserById(preferredUserId);
    if (preferred?.userId && preferred.userId !== state.admin?.userId && getUserPhone(preferred)) {
        return preferred;
    }
    return [
        ...state.users.filter((user) => user.active && user.role === "owner"),
        ...getUsersByPermission("manage_note_inquiries"),
        ...getUsersByPermission("assign_notes"),
        ...getUsersByPermission("leads_view_all"),
    ].find((user) => user.userId !== state.admin?.userId && getUserPhone(user));
};

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
    .filter((inquiry) => String(inquiry.noteId) === String(noteId))
    .map((inquiry) => ({
        ...inquiry,
        createdByName: getDisplayName(getUserById(inquiry.createdBy) || {}),
        replyByName: getDisplayName(getUserById(inquiry.replyBy) || {}),
    }));

const getVisibleNotifications = (notifications) => (notifications || []).filter((notification) => (
    !notification.targetUserId ||
    notification.targetUserId === state.admin?.userId
));

const notificationFailureMessage = "تم حفظ الإجراء، لكن تعذر إرسال الإشعار للطرف المعني. تأكد من تشغيل ملف تحديث Supabase الخاص بالإشعارات.";

const createTargetedNotifications = async (targetIds, payload) => {
    const ids = Array.from(new Set((targetIds || []).filter((id) => id && id !== state.admin?.userId)));
    if (!ids.length) return [];
    const results = await Promise.allSettled(ids.map((targetUserId) => window.MuheebData.createNotification({
        ...payload,
        targetUserId,
    })));
    const rejected = results.filter((result) => result.status === "rejected");
    if (rejected.length) {
        console.error("Muheeb notification delivery failed:", rejected.map((result) => result.reason));
        const details = rejected
            .map((result) => result.reason?.message || String(result.reason || ""))
            .filter(Boolean)
            .join(" | ");
        throw new Error(details ? `${notificationFailureMessage} السبب: ${details}` : notificationFailureMessage);
    }
    return results.map((result) => result.value);
};

const markNotificationReadLocally = (notificationId) => {
    if (!notificationId || !state.admin?.userId) return;
    state.notifications = state.notifications.map((notification) => {
        if (Number(notification.id) !== Number(notificationId)) return notification;
        return {
            ...notification,
            readBy: Array.from(new Set([...(notification.readBy || []), state.admin.userId])),
        };
    });
    renderNotifications();
};

const getInquiryNotificationTargets = (note) => {
    const targetIds = new Set();
    if (note?.createdBy) targetIds.add(note.createdBy);
    state.users
        .filter((user) => user.active && userHasPermission(user, "manage_note_inquiries"))
        .forEach((user) => targetIds.add(user.userId));
    return Array.from(targetIds);
};

const canReplyToInquiry = () => (
    can("manage_note_inquiries") ||
    can("assign_notes") ||
    canViewAllLeads() ||
    isOwner()
);

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

const getPublishedSiteImage = (imageKey) => state.siteImages.find((image) => (
    image.imageKey === imageKey &&
    image.published !== false &&
    image.imagePath
));

const applyAdminSiteImages = () => {
    const loginBackground = getPublishedSiteImage("admin_login_background");
    if (loginBackground?.imagePath) {
        loginView?.style.setProperty("--admin-login-bg", `url("${loginBackground.imagePath}")`);
    }
};

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
    if (profileButton) {
        profileButton.innerHTML = getUserAvatar() ? renderUserAvatar(state.admin, "topbar-avatar") : '<i data-lucide="user-round"></i>';
    }
    applyPermissions();
    initIcons();
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
    const currentAdminRow = state.users.find((user) => user.userId === state.admin?.userId);
    if (currentAdminRow) {
        state.admin = { ...state.admin, ...currentAdminRow };
        showApp();
    }
    state.notifications = getVisibleNotifications(notifications);
    state.profileRequests = profileRequests || [];
    applyAdminSiteImages();
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
                    <button class="ghost-btn icon-only small-icon" type="button" data-whatsapp-lead="${lead.id}" title="واتساب" aria-label="واتساب">
                        <i data-lucide="message-circle"></i>
                    </button>
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
                ? `<button class="text-link-button" type="button" data-whatsapp-lead="${lead.id}">فتح واتساب</button>`
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
        const isStoredNote = state.leadNotes.some((item) => item.id === note.id);
        const canCompleteNote = !note.legacy && !note.done && (
            note.assignedTo === state.admin?.userId ||
            isOwner() ||
            can("users") ||
            can("assign_notes")
        );
        const canAskInquiry = isStoredNote && !note.legacy && !note.done && note.assignedTo === state.admin?.userId;
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
                        ${inquiries.map((inquiry) => {
                            const canReply = canReplyToInquiry() && !inquiry.replyBody && inquiry.createdBy !== state.admin?.userId;
                            return `
                                <div class="note-inquiry ${inquiry.replyBody ? "has-reply" : ""}">
                                    <i data-lucide="message-square-text"></i>
                                    <div class="note-inquiry-content">
                                        <div class="inquiry-head">
                                            <strong>${escapeHtml(inquiry.createdByName || "مستخدم")}</strong>
                                            <span>${formatDate(inquiry.createdAt)}</span>
                                        </div>
                                        <p>${escapeHtml(inquiry.body)}</p>
                                        ${inquiry.replyBody ? `
                                            <div class="note-inquiry-reply">
                                                <i data-lucide="corner-down-left"></i>
                                                <div>
                                                    <strong>رد ${escapeHtml(inquiry.replyByName || "المشرف")}</strong>
                                                    <p>${escapeHtml(inquiry.replyBody)}</p>
                                                    <span>${formatDate(inquiry.replyAt)}</span>
                                                </div>
                                            </div>
                                        ` : canReply ? `
                                            <button class="ghost-btn small-inline-btn" type="button" data-reply-inquiry="${escapeHtml(inquiry.id)}">
                                                <i data-lucide="reply"></i>
                                                <span>رد على الاستفسار</span>
                                            </button>
                                        ` : `<span class="meta-text">بانتظار الرد</span>`}
                                    </div>
                                </div>
                            `;
                        }).join("")}
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

const closeNoteInquiryModal = () => {
    state.activeInquiry = { mode: "create", noteId: "", inquiryId: "" };
    noteInquiryModal?.classList.add("is-hidden");
    noteInquiryForm?.reset();
    if (noteInquiryMessage) noteInquiryMessage.textContent = "";
    if (noteInquiryModal && leadModal?.classList.contains("is-hidden")) {
        document.body.classList.remove("modal-open");
    }
};

const openNoteInquiryModal = ({ mode = "create", noteId = "", inquiryId = "" } = {}) => {
    const lead = getActiveLead();
    const note = noteId ? state.leadNotes.find((item) => item.id === noteId) : null;
    const inquiry = inquiryId ? state.noteInquiries.find((item) => item.id === inquiryId) : null;
    const sourceNote = note || state.leadNotes.find((item) => item.id === inquiry?.noteId);
    if (!lead || (!sourceNote && mode === "create") || (!inquiry && mode === "reply")) return;
    state.activeInquiry = {
        mode,
        noteId: sourceNote?.id || "",
        inquiryId: inquiry?.id || "",
    };
    noteInquiryForm.elements.mode.value = mode;
    noteInquiryForm.elements.noteId.value = sourceNote?.id || "";
    noteInquiryForm.elements.inquiryId.value = inquiry?.id || "";
    if (noteInquiryEyebrow) noteInquiryEyebrow.textContent = mode === "reply" ? "رد على استفسار" : "استفسار على مهمة";
    if (noteInquiryTitle) noteInquiryTitle.textContent = mode === "reply" ? "الرد على الاستفسار" : "إرسال استفسار للمشرف";
    if (noteInquiryLabel) noteInquiryLabel.textContent = mode === "reply" ? "نص الرد" : "نص الاستفسار";
    if (noteInquirySubmitText) noteInquirySubmitText.textContent = mode === "reply" ? "إرسال الرد" : "إرسال الاستفسار";
    if (noteInquiryContext) {
        noteInquiryContext.innerHTML = `
            <span>الطلب: ${escapeHtml(lead.name)}</span>
            <strong>${escapeHtml(sourceNote?.text || "ملاحظة متابعة")}</strong>
            ${inquiry ? `<p>${escapeHtml(inquiry.body)}</p>` : ""}
        `;
    }
    noteInquiryModal?.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    initIcons();
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
    const shouldNotifyAssignee = assignee?.userId && assignee.userId !== state.admin?.userId;
    const assigneePhone = getUserPhone(assignee);
    const assigneeWhatsappMessage = `تم إسناد مهمة جديدة إليك على طلب ${lead.name}. يرجى الدخول إلى حسابك لمعاينتها.`;
    const assigneeWhatsappWindow = shouldNotifyAssignee
        ? openPendingExternalWindow("واتساب")
        : null;
    let note = null;
    let notificationError = null;
    try {
        note = await window.MuheebData.createLeadNote({
            leadId: lead.id,
            text: text.trim(),
            assignedTo: assignee?.userId || state.admin?.userId || "",
        });
    } catch (error) {
        assigneeWhatsappWindow?.close?.();
        throw error;
    }
    if (note?.assignedTo && note.assignedTo !== state.admin?.userId) {
        try {
            await createTargetedNotifications([note.assignedTo], {
                leadId: lead.id,
                noteId: note.id,
                kind: "note_assigned",
                title: "مهمة مسندة إليك",
                message: `${getDisplayName()} أسند إليك ملاحظة على طلب ${lead.name}.`,
            });
        } catch (error) {
            notificationError = error;
        }
        openWhatsappMessage(
            assigneePhone,
            assigneeWhatsappMessage,
            assigneeWhatsappWindow,
            `تم حفظ الملاحظة، لكن لا يوجد رقم جوال محفوظ للمستخدم ${getDisplayName(assignee)}.`
        );
    } else {
        // No external follow-up is needed when the note is assigned to the current user.
    }
    await loadAll();
    state.activeLeadId = lead.id;
    renderLeadModal();
    if (notificationError) throw notificationError;
};

const completeLeadNote = async (noteId) => {
    const lead = getActiveLead();
    if (!lead) return;
    const sourceNote = state.leadNotes.find((item) => String(item.id) === String(noteId));
    const manager = getFollowUpManager(sourceNote?.createdBy || "");
    const notifyUserId = manager?.userId || "";
    const shouldNotifyManager = Boolean(notifyUserId && notifyUserId !== state.admin?.userId);
    const managerWhatsappMessage = `تم إنجاز المهمة المسندة على طلب ${lead.name} بواسطة ${getDisplayName()}.`;
    const managerWhatsappWindow = shouldNotifyManager
        ? openPendingExternalWindow("واتساب")
        : null;
    let completedNote = null;
    let notificationError = null;
    try {
        completedNote = await window.MuheebData.completeLeadNote(noteId);
    } catch (error) {
        managerWhatsappWindow?.close?.();
        throw error;
    }
    if (completedNote) {
        if (shouldNotifyManager) {
            try {
                await createTargetedNotifications([notifyUserId], {
                    leadId: lead.id,
                    noteId,
                    kind: "note_done",
                    title: "تم إنجاز ملاحظة متابعة",
                    message: `${getDisplayName()} أنجز ملاحظة على طلب ${lead.name}.`,
                });
            } catch (error) {
                notificationError = error;
            }
            openWhatsappForUser(
                manager,
                managerWhatsappMessage,
                managerWhatsappWindow
            );
        } else {
            // The completing user should not receive their own completion follow-up.
        }
        await loadAll();
        state.activeLeadId = lead.id;
        renderLeadModal();
        if (notificationError) throw notificationError;
    }
};

const addNoteInquiry = async (noteId, body) => {
    const lead = getActiveLead();
    const note = state.leadNotes.find((item) => String(item.id) === String(noteId));
    if (!lead || !note || !body.trim()) return;
    const targetIds = getInquiryNotificationTargets(note);
    const targetUser = getFirstUserWithPhone(targetIds);
    const inquiryWhatsappMessage = `تم إرسال استفسار على مهمة مرتبطة بطلب ${lead.name}. يرجى الدخول إلى لوحة التحكم للرد.`;
    const inquiryWhatsappWindow = targetUser ? openPendingExternalWindow("واتساب") : null;
    let notificationError = null;
    try {
        await window.MuheebData.createLeadNoteInquiry({
            leadId: lead.id,
            noteId,
            body: body.trim(),
        });
    } catch (error) {
        inquiryWhatsappWindow?.close?.();
        throw error;
    }
    try {
        await createTargetedNotifications(targetIds, {
            leadId: lead.id,
            noteId,
            kind: "note_inquiry",
            title: "استفسار على ملاحظة متابعة",
            message: `${getDisplayName()} أضاف استفسارًا على طلب ${lead.name}.`,
        });
    } catch (error) {
        notificationError = error;
    }
    if (targetUser) {
        openWhatsappForUser(
            targetUser,
            inquiryWhatsappMessage,
            inquiryWhatsappWindow
        );
    } else {
        // No WhatsApp number is available for the inquiry recipient.
    }
    await loadAll();
    state.activeLeadId = lead.id;
    renderLeadModal();
    if (notificationError) throw notificationError;
};

const replyNoteInquiry = async (inquiryId, body) => {
    const lead = getActiveLead();
    const inquiry = state.noteInquiries.find((item) => String(item.id) === String(inquiryId));
    if (!lead || !inquiry || !body.trim()) return;
    const requester = getUserById(inquiry.createdBy);
    const replyWhatsappMessage = `تم الرد على استفسارك بخصوص طلب ${lead.name}. يرجى الدخول إلى حسابك لمراجعة الرد.`;
    const replyWhatsappWindow = requester && requester.userId !== state.admin?.userId && getUserPhone(requester)
        ? openPendingExternalWindow("واتساب")
        : null;
    let notificationError = null;
    try {
        await window.MuheebData.replyLeadNoteInquiry(inquiryId, body.trim());
    } catch (error) {
        replyWhatsappWindow?.close?.();
        throw error;
    }
    try {
        await createTargetedNotifications([inquiry.createdBy], {
            leadId: lead.id,
            noteId: inquiry.noteId,
            kind: "note_inquiry_reply",
            title: "رد على استفسارك",
            message: `${getDisplayName()} رد على استفسارك في طلب ${lead.name}.`,
        });
    } catch (error) {
        notificationError = error;
    }
    if (replyWhatsappWindow) {
        openWhatsappForUser(
            requester,
            replyWhatsappMessage,
            replyWhatsappWindow
        );
    }
    await loadAll();
    state.activeLeadId = lead.id;
    renderLeadModal();
    if (notificationError) throw notificationError;
};

const splitLines = (value) => String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const looksLikeImagePath = (value) => /^(https?:|data:|assets\/|uploads\/|event-images\/|storage\/)/i.test(String(value || ""));

const parseSupportLogoEntry = (entry, index = 0) => {
    if (typeof entry === "object" && entry !== null) {
        return {
            logo: entry.logo || entry.image || entry.path || entry.imagePath || "",
            name: entry.name || entry.label || `جهة ${index + 1}`,
        };
    }
    const raw = String(entry || "").trim();
    if (raw.includes("|")) {
        const [first = "", second = ""] = raw.split("|").map((part) => part.trim());
        return looksLikeImagePath(first)
            ? { logo: first, name: second || `جهة ${index + 1}` }
            : { logo: second, name: first || `جهة ${index + 1}` };
    }
    return {
        logo: raw,
        name: `جهة ${index + 1}`,
    };
};

const stringifySupportLogoEntry = ({ name = "", logo = "" } = {}) => {
    const safeLogo = String(logo || "").trim();
    const safeName = String(name || "").trim() || "جهة مشاركة";
    return safeLogo ? `${safeName} | ${safeLogo}` : "";
};

const stringifyClean = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value).trim();
    if (typeof value === "object") {
        return String(value.title || value.text || value.name || value.label || value.value || "").trim();
    }
    return String(value).trim();
};

const normalizeEventSection = (section = {}, index = 0) => {
    if (typeof section === "string") {
        const [title = "", text = "", image = ""] = section.split("|").map((part) => part.trim());
        return { title, text, image };
    }
    const title = stringifyClean(section.title || section.heading || section.name);
    const text = stringifyClean(section.text || section.description || section.body || section.content);
    const image = stringifyClean(section.image || section.imagePath || section.path || section.logo);
    return {
        title: title || (text || image ? `قسم ${index + 1}` : ""),
        text,
        image,
    };
};

const normalizeEventSections = (sections = []) => (Array.isArray(sections) ? sections : [])
    .map(normalizeEventSection)
    .filter((section) => section.title || section.text || section.image);

const getGallerySortRank = (image = {}) => {
    const value = Number(image.sortOrder ?? image.sort_order ?? 0);
    return Number.isFinite(value) && value > 0 ? value : Number.MAX_SAFE_INTEGER;
};

const getOrderedGallery = (gallery = []) => (Array.isArray(gallery) ? gallery : [])
    .slice()
    .sort((a, b) => {
        const sortDiff = getGallerySortRank(a) - getGallerySortRank(b);
        if (sortDiff) return sortDiff;
        return Number(a.id || 0) - Number(b.id || 0);
    });

const renderEvents = () => {
    eventsList.innerHTML = state.events.map((event) => `
        <article class="event-item">
            <img src="${escapeHtml(event.coverImage || "assets/logo-meheib.png")}" alt="">
            <div>
                <strong>${escapeHtml(event.title)}</strong>
                <div class="meta-text">${escapeHtml(getCategoryLabel(event.category))} - ${escapeHtml(event.venueName || event.location || "بدون موقع")}</div>
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
    { contentKey: "nav_home_label", label: "اسم رابط الرئيسية", value: "الرئيسية", inputType: "text", groupName: "الهيدر", sortOrder: 1 },
    { contentKey: "nav_about_label", label: "اسم رابط عن مهيب", value: "عن مهيب", inputType: "text", groupName: "الهيدر", sortOrder: 2 },
    { contentKey: "nav_services_label", label: "اسم رابط الخدمات", value: "الخدمات", inputType: "text", groupName: "الهيدر", sortOrder: 3 },
    { contentKey: "nav_projects_label", label: "اسم رابط أعمالنا", value: "أعمالنا", inputType: "text", groupName: "الهيدر", sortOrder: 4 },
    { contentKey: "nav_execution_label", label: "اسم رابط رحلة التنفيذ", value: "رحلة التنفيذ", inputType: "text", groupName: "الهيدر", sortOrder: 5 },
    { contentKey: "nav_interest_label", label: "اسم رابط تسجيل اهتمام", value: "تسجيل اهتمام", inputType: "text", groupName: "الهيدر", sortOrder: 6 },
    { contentKey: "nav_contact_label", label: "اسم رابط تواصل معنا", value: "تواصل معنا", inputType: "text", groupName: "الهيدر", sortOrder: 7 },
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
                <a href="#visualHeader"><i data-lucide="menu"></i><span>الهيدر</span></a>
                <a href="#visualHero"><i data-lucide="layout-template"></i><span>الواجهة</span></a>
                <a href="#visualAbout"><i data-lucide="badge-info"></i><span>عن مهيب</span></a>
                <a href="#visualServices"><i data-lucide="sparkles"></i><span>الخدمات</span></a>
                <a href="#visualWorks"><i data-lucide="layers-3"></i><span>الأعمال</span></a>
                <a href="#visualJourney"><i data-lucide="route"></i><span>الرحلة</span></a>
                <a href="#visualForm"><i data-lucide="send"></i><span>النموذج</span></a>
                <a href="#visualContact"><i data-lucide="messages-square"></i><span>التواصل</span></a>
                <a href="#visualFooter"><i data-lucide="panel-bottom"></i><span>التذييل</span></a>
            </nav>

            <section class="visual-preview-section visual-header-editor" id="visualHeader">
                ${renderContentSectionHeader("00", "الهيدر والتنقل", "أسماء الروابط وترتيبها كما تظهر في أعلى الموقع", "menu")}
                <div class="visual-nav-labels">
                    ${renderVisualField("nav_home_label", { label: "الرابط الأول" })}
                    ${renderVisualField("nav_about_label", { label: "الرابط الثاني" })}
                    ${renderVisualField("nav_services_label", { label: "الرابط الثالث" })}
                    ${renderVisualField("nav_projects_label", { label: "الرابط الرابع" })}
                    ${renderVisualField("nav_execution_label", { label: "الرابط الخامس" })}
                    ${renderVisualField("nav_interest_label", { label: "الرابط السادس" })}
                    ${renderVisualField("nav_contact_label", { label: "الرابط السابع" })}
                </div>
            </section>

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

const siteImageGroupMeta = {
    site_core: { title: "صور الواجهة والأقسام الأساسية", description: "الصور التي تظهر في الهيرو، رحلة التنفيذ، نموذج الطلب، والتذييل.", icon: "layout-template" },
    identity_gallery: { title: "معرض الهوية المتحرك", description: "صور الشريط المتحرك لتطبيقات الهوية في الصفحة الرئيسية.", icon: "gallery-horizontal-end" },
    services: { title: "صور الخدمات", description: "صور بطاقات الخدمات الثلاثة في الموقع.", icon: "sparkles" },
    footer: { title: "صور الفوتر", description: "الشعار الخاص بتذييل صفحات الموقع.", icon: "panel-bottom" },
    admin_login: { title: "شاشة دخول المشرف", description: "خلفية شاشة تسجيل الدخول الخاصة بلوحة التحكم.", icon: "log-in" },
    custom: { title: "صور إضافية", description: "صور مخصصة يمكن إضافتها لاستخدامات لاحقة أو أقسام جديدة.", icon: "image-plus" },
};

const getSiteImageGroupMeta = (groupName) => siteImageGroupMeta[groupName] || {
    title: groupName || "صور أخرى",
    description: "مجموعة صور مخصصة من لوحة التحكم.",
    icon: "images",
};

const imageDimensionHints = {
    hero_main: "المقاس المقترح: 1360 × 1020 بكسل",
    hero_logo: "المقاس المقترح: 1000 × 420 بكسل بخلفية شفافة",
    identity_gallery: "المقاس المقترح: 1320 × 1080 بكسل",
    services: "المقاس المقترح: 1200 × 900 بكسل",
    service_1_image: "المقاس المقترح: 1200 × 900 بكسل",
    service_2_image: "المقاس المقترح: 1200 × 900 بكسل",
    service_3_image: "المقاس المقترح: 1200 × 900 بكسل",
    execution_image: "المقاس المقترح: 1200 × 900 بكسل",
    interest_background: "المقاس المقترح: 1600 × 900 بكسل",
    footer_logo: "المقاس المقترح: 900 × 360 بكسل بخلفية شفافة",
    admin_login_background: "المقاس المقترح: 1600 × 1000 بكسل",
    footer: "المقاس المقترح: 900 × 360 بكسل",
    site_core: "المقاس المقترح حسب مكان الصورة في الواجهة",
    custom: "حدد المقاس حسب مكان استخدامها في الموقع",
};

const getImageDimensionHint = (image = {}) => (
    imageDimensionHints[image.imageKey] ||
    imageDimensionHints[image.groupName] ||
    "ارفع الصورة بالمقاس النهائي الذي تريد ظهوره في الموقع"
);

const renderSiteImages = () => {
    if (!siteImageList) return;
    const groups = state.siteImages.reduce((items, image) => {
        const groupName = image.groupName || "custom";
        if (!items[groupName]) items[groupName] = [];
        items[groupName].push(image);
        return items;
    }, {});
    const sortedGroups = Object.entries(groups).sort(([groupA], [groupB]) => (
        (siteImageGroupOrder[groupA] || 999) - (siteImageGroupOrder[groupB] || 999)
    ));
    const groupId = (groupName) => `site-image-group-${String(groupName || "custom").replace(/[^a-z0-9_-]/gi, "-")}`;
    const renderImageCard = (image) => `
        <article class="site-image-card" data-site-image-card="${image.id}" data-site-image-key="${escapeHtml(image.imageKey)}" data-site-image-group="${escapeHtml(image.groupName)}">
            <img src="${escapeHtml(image.imagePath || "assets/logo-meheib.png")}" alt="">
            <div class="site-image-fields">
                <div class="form-grid">
                    <label>
                        <span>اسم الصورة</span>
                        <input type="text" data-site-image-label value="${escapeHtml(image.label)}">
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
                <label class="upload-box compact-upload site-image-upload-box">
                    <span>استبدال الصورة</span>
                    <input type="file" data-site-image-file accept="image/png,image/jpeg,image/webp,image/gif">
                    <small>${escapeHtml(getImageDimensionHint(image))}</small>
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
    `;
    const groupNav = sortedGroups.length ? `
        <nav class="site-image-tabs" aria-label="تقسيمات صور الموقع">
            ${sortedGroups.map(([groupName]) => {
                const meta = getSiteImageGroupMeta(groupName);
                return `
                    <a href="#${escapeHtml(groupId(groupName))}">
                        <i data-lucide="${escapeHtml(meta.icon)}"></i>
                        <span>${escapeHtml(meta.title)}</span>
                    </a>
                `;
            }).join("")}
        </nav>
    ` : "";
    siteImageList.innerHTML = groupNav + sortedGroups.map(([groupName, images], index) => {
        const meta = getSiteImageGroupMeta(groupName);
        const sortedImages = sortSiteImagesByPageOrder(images);
        return `
            <section class="site-image-group" id="${escapeHtml(groupId(groupName))}">
                <div class="visual-section-heading">
                    <span class="visual-section-number">${String(index + 1).padStart(2, "0")}</span>
                    <div>
                        <p class="eyebrow"><i data-lucide="${escapeHtml(meta.icon)}"></i>${escapeHtml(meta.title)}</p>
                        <h3>${escapeHtml(meta.description)}</h3>
                    </div>
                </div>
                <div class="site-image-group-grid">
                    ${sortedImages.map(renderImageCard).join("")}
                </div>
            </section>
        `;
    }).join("") || `<div class="compact-item"><span>لا توجد صور في المكتبة.</span></div>`;
    initIcons();
};

const resetInterestOptionForm = () => {
    state.editingInterestOption = null;
    interestOptionForm.reset();
    interestOptionForm.elements.optionId.value = "";
    if (interestOptionForm.elements.optionType) interestOptionForm.elements.optionType.value = "interest";
    interestOptionForm.elements.published.checked = true;
    interestOptionForm.elements.sortOrder.value = "0";
    interestOptionFormTitle.textContent = "إضافة عنصر للقوائم";
};

const startNewInterestOption = (type = "interest") => {
    resetInterestOptionForm();
    if (interestOptionForm.elements.optionType) interestOptionForm.elements.optionType.value = type;
    interestOptionFormTitle.textContent = `إضافة عنصر إلى ${dropdownTypeLabels[type] || "القوائم"}`;
    interestOptionForm.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => interestOptionForm.elements.label?.focus(), 180);
};

const getDropdownOptions = (type, includeHidden = true) => {
    const savedEventCategories = state.interestOptions.filter((option) => option.optionType === "event_category");
    const source = type === "event_category"
        ? (savedEventCategories.length ? savedEventCategories : defaultEventCategoryOptions)
        : state.interestOptions.filter((option) => (option.optionType || "interest") === "interest");
    const byValue = new Map();
    source.forEach((option) => {
        if (!includeHidden && option.published === false) return;
        const value = option.value || option.label;
        if (!value) return;
        byValue.set(value, option);
    });
    return Array.from(byValue.values()).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
};

const getCategoryLabel = (category) => {
    const option = getDropdownOptions("event_category").find((item) => item.value === category || item.label === category);
    return option?.label || labels[category] || category || "بدون تصنيف";
};

const renderEventCategorySelect = () => {
    if (!eventCategorySelect) return;
    const currentValue = eventCategorySelect.value || state.editingEvent?.category || "event";
    const options = getDropdownOptions("event_category", false);
    eventCategorySelect.innerHTML = options.map((option) => `
        <option value="${escapeHtml(option.value || option.label)}">${escapeHtml(option.label)}</option>
    `).join("");
    if (![...eventCategorySelect.options].some((option) => option.value === currentValue)) {
        eventCategorySelect.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(currentValue)}">${escapeHtml(getCategoryLabel(currentValue))}</option>`);
    }
    eventCategorySelect.value = currentValue;
};

const renderInterestOptions = () => {
    if (!interestOptionList) return;
    const renderGroup = (type) => {
        const options = state.interestOptions.filter((option) => (option.optionType || "interest") === type);
        return `
            <section class="dropdown-option-group">
                <div class="dropdown-group-head">
                    <div class="visual-section-heading compact-heading">
                        <span class="visual-section-number">${type === "interest" ? "01" : "02"}</span>
                        <div>
                            <p class="eyebrow">${escapeHtml(dropdownTypeLabels[type])}</p>
                            <h3>${type === "interest" ? "تظهر في نموذج إرسال الطلب" : "تظهر في إضافة أو تعديل الفعالية"}</h3>
                        </div>
                    </div>
                    <button class="primary-btn icon-only small-icon" type="button" data-new-interest-option="${escapeHtml(type)}" title="إضافة عنصر" aria-label="إضافة عنصر">
                        <i data-lucide="plus"></i>
                    </button>
                </div>
                <div class="table-wrap dropdown-table-wrap">
                    <table class="dropdown-options-table">
                        <thead>
                            <tr>
                                <th>الاسم</th>
                                <th>القيمة</th>
                                <th>الترتيب</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${options.map((option) => `
                                <tr>
                                    <td><strong>${escapeHtml(option.label)}</strong></td>
                                    <td><span>${escapeHtml(option.value)}</span></td>
                                    <td>${escapeHtml(option.sortOrder)}</td>
                                    <td><span class="badge ${option.published ? "" : "is-dim"}">${option.published ? "ظاهر" : "مخفي"}</span></td>
                                    <td>
                                        <div class="event-actions table-actions">
                                            <button class="ghost-btn icon-only small-icon" type="button" data-edit-interest-option="${option.id}" title="تعديل" aria-label="تعديل">
                                                <i data-lucide="pencil"></i>
                                            </button>
                                            <button class="ghost-btn icon-only small-icon" type="button" data-toggle-interest-option="${option.id}" title="${option.published ? "إخفاء" : "إظهار"}" aria-label="${option.published ? "إخفاء" : "إظهار"}">
                                                <i data-lucide="${option.published ? "eye-off" : "eye"}"></i>
                                            </button>
                                            <button class="danger-btn icon-only small-icon" type="button" data-delete-interest-option="${option.id}" title="حذف" aria-label="حذف">
                                                <i data-lucide="trash-2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join("") || `
                                <tr>
                                    <td colspan="5"><span class="meta-text">لا توجد عناصر في هذه القائمة.</span></td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    };
    interestOptionList.innerHTML = `${renderGroup("interest")}${renderGroup("event_category")}`;
    renderEventCategorySelect();
    initIcons();
};

const resetEventForm = () => {
    state.editingEvent = null;
    state.coverPath = "";
    eventForm.reset();
    eventIdInput.value = "";
    eventFormTitle.textContent = "إضافة فعالية";
    coverName.textContent = "لم يتم اختيار صورة جديدة";
    galleryName.textContent = "المقاس المقترح: 1320 × 1080 بكسل لكل صورة";
    if (supportLogosName) supportLogosName.textContent = "المقاس المقترح: 600 × 360 بكسل";
    if (coverInput) {
        coverInput.value = "";
        editedFiles.delete(coverInput);
    }
    if (galleryInput) {
        galleryInput.value = "";
        editedFiles.delete(galleryInput);
    }
    if (supportLogoLabelInput) supportLogoLabelInput.value = "";
    if (eventSupportLogosInput) {
        eventSupportLogosInput.value = "";
        editedFiles.delete(eventSupportLogosInput);
    }
    state.pendingSupportLogos = [];
    state.pendingEventSections = [];
    state.activeEventSectionIndex = null;
    coverPreview.removeAttribute("src");
    galleryPreview.innerHTML = "";
    renderSupportLogos([]);
    renderEventSections([]);
    renderEventCategorySelect();
    if (eventForm.elements.titleSize) eventForm.elements.titleSize.value = "normal";
    if (eventForm.elements.galleryCaptionText) eventForm.elements.galleryCaptionText.value = "";
    if (eventForm.elements.galleryCaptionVisible) eventForm.elements.galleryCaptionVisible.checked = true;
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
    if (eventForm.elements.galleryCaptionText) eventForm.elements.galleryCaptionText.value = event.title || "";
    if (eventForm.elements.galleryCaptionVisible) eventForm.elements.galleryCaptionVisible.checked = true;
    if (eventForm.elements.titleSize) eventForm.elements.titleSize.value = event.titleSize || "normal";
    renderEventCategorySelect();
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
    if (eventForm.elements.achievements) eventForm.elements.achievements.value = (event.achievements || []).join("\n");
    state.pendingEventSections = normalizeEventSections(event.detailSections || []);
    eventForm.elements.sortOrder.value = event.sortOrder || 0;
    eventForm.elements.published.checked = Boolean(event.published);
    state.pendingSupportLogos = [...(event.supportLogos || [])];
    if (coverInput) {
        coverInput.value = "";
        editedFiles.delete(coverInput);
    }
    if (galleryInput) {
        galleryInput.value = "";
        editedFiles.delete(galleryInput);
        galleryName.textContent = "المقاس المقترح: 1320 × 1080 بكسل لكل صورة";
    }
    if (supportLogoLabelInput) supportLogoLabelInput.value = "";
    if (eventSupportLogosInput) {
        eventSupportLogosInput.value = "";
        editedFiles.delete(eventSupportLogosInput);
    }
    if (supportLogosName) supportLogosName.textContent = state.pendingSupportLogos.length ? `${state.pendingSupportLogos.length} شعار محفوظ` : "المقاس المقترح: 600 × 360 بكسل";
    coverName.textContent = event.coverImage ? "صورة محفوظة حاليًا" : "لم يتم اختيار صورة جديدة";
    if (event.coverImage) {
        coverPreview.src = event.coverImage;
    } else {
        coverPreview.removeAttribute("src");
    }
    renderGallery(event.gallery || []);
    renderSupportLogos(state.pendingSupportLogos);
    renderEventSections(state.pendingEventSections);
    setView("eventsView");
};

const renderGallery = (gallery) => {
    const safeGallery = getOrderedGallery(gallery);
    galleryPreview.innerHTML = safeGallery.map((image, index) => {
        const caption = parseGalleryCaption(image.altText || "");
        return `
        <div class="gallery-thumb event-gallery-admin-thumb" data-gallery-image-card="${image.id}">
            <img src="${escapeHtml(image.imagePath)}" alt="">
            <div class="event-gallery-caption-fields">
                <label>
                    <span>تسمية الصورة</span>
                    <input type="text" data-gallery-caption value="${escapeHtml(caption.text)}" placeholder="اكتب التسمية التي تظهر على الصورة">
                </label>
                <label class="toggle-field compact-toggle">
                    <input type="checkbox" data-gallery-caption-visible ${caption.visible ? "checked" : ""}>
                    <span>إظهار التسمية</span>
                </label>
            </div>
            <div class="event-section-actions gallery-image-actions">
                <button type="button" title="رفع الصورة للأعلى" aria-label="رفع الصورة للأعلى" data-move-gallery-image="${image.id}" data-direction="-1" ${index === 0 ? "disabled" : ""}>
                    <i data-lucide="arrow-up"></i>
                </button>
                <button type="button" title="إنزال الصورة للأسفل" aria-label="إنزال الصورة للأسفل" data-move-gallery-image="${image.id}" data-direction="1" ${index === safeGallery.length - 1 ? "disabled" : ""}>
                    <i data-lucide="arrow-down"></i>
                </button>
                <button type="button" title="حفظ تسمية الصورة" aria-label="حفظ تسمية الصورة" data-save-gallery-image="${image.id}">
                    <i data-lucide="save"></i>
                </button>
                <button type="button" title="حذف الصورة" aria-label="حذف الصورة" data-delete-image="${image.id}">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `;
    }).join("") || `<span class="meta-text">لا توجد صور إضافية.</span>`;
    initIcons();
};

const renderSupportLogos = (logos = [], participants = []) => {
    if (!supportLogosPreview) return;
    const safeParticipants = Array.isArray(participants) ? participants : [];
    supportLogosPreview.innerHTML = (logos || []).map((entry, index) => {
        const logo = parseSupportLogoEntry(entry, index);
        const logoName = logo.name || safeParticipants[index] || `جهة ${index + 1}`;
        return `
        <div class="gallery-thumb support-thumb" data-support-logo-card="${index}">
            ${logo.logo ? `<img src="${escapeHtml(logo.logo)}" alt="${escapeHtml(logoName)}">` : `<span class="meta-text">بدون شعار</span>`}
            <label class="support-logo-name-field">
                <span>اسم الجهة</span>
                <input type="text" data-support-logo-name value="${escapeHtml(logoName)}" placeholder="اسم الجهة المشاركة">
            </label>
            <div class="event-section-actions support-logo-actions">
                <button type="button" title="حفظ اسم الجهة" aria-label="حفظ اسم الجهة" data-save-support-logo="${index}">
                    <i data-lucide="save"></i>
                </button>
                <button type="button" title="حذف الشعار" aria-label="حذف الشعار" data-remove-support-logo="${index}">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `;
    }).join("") || `<span class="meta-text">لا توجد شعارات محفوظة للجهات.</span>`;
    initIcons();
};

const renderEventSections = (sections = []) => {
    if (!eventSectionsPreview) return;
    const normalizedSections = normalizeEventSections(sections);
    eventSectionsPreview.innerHTML = normalizedSections.map((section, index) => `
        <article class="event-section-thumb">
            ${section.image ? `<img src="${escapeHtml(section.image)}" alt="${escapeHtml(section.title)}">` : `<div class="event-section-placeholder"><i data-lucide="image"></i></div>`}
            <div>
                <strong>${escapeHtml(section.title || `قسم ${index + 1}`)}</strong>
                <p>${escapeHtml(section.text || "بدون وصف")}</p>
            </div>
            <div class="event-section-actions">
                <button type="button" title="رفع القسم للأعلى" aria-label="رفع القسم للأعلى" data-move-event-section="${index}" data-direction="-1" ${index === 0 ? "disabled" : ""}>
                    <i data-lucide="arrow-up"></i>
                </button>
                <button type="button" title="إنزال القسم للأسفل" aria-label="إنزال القسم للأسفل" data-move-event-section="${index}" data-direction="1" ${index === normalizedSections.length - 1 ? "disabled" : ""}>
                    <i data-lucide="arrow-down"></i>
                </button>
                <button type="button" title="تعديل القسم" aria-label="تعديل القسم" data-edit-event-section="${index}">
                    <i data-lucide="pencil"></i>
                </button>
                <button type="button" title="حذف القسم" aria-label="حذف القسم" data-remove-event-section="${index}">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </article>
    `).join("") || `<span class="meta-text">لا توجد أقسام إضافية. اضغط إضافة قسم لإضافة عنوان ووصف وصورة.</span>`;
    initIcons();
};

const renderTemporaryFilePreview = (container, files = [], names = [], className = "") => {
    if (!container) return;
    const items = Array.from(files || []);
    container.innerHTML = items.length
        ? items.map((file, index) => `
            <div class="gallery-thumb ${escapeHtml(className)}">
                <img src="${escapeHtml(URL.createObjectURL(file))}" alt="${escapeHtml(names[index] || file.name || "صورة جاهزة")}">
                ${names[index] || className ? `<span>${escapeHtml(names[index] || `صورة ${index + 1}`)}</span>` : ""}
            </div>
        `).join("")
        : `<span class="meta-text">لا توجد صور جاهزة للرفع.</span>`;
};

const openSupportLogoModal = () => {
    supportLogoForm?.reset();
    if (eventSupportLogosInput) {
        eventSupportLogosInput.value = "";
        editedFiles.delete(eventSupportLogosInput);
    }
    if (supportLogosName) supportLogosName.textContent = "المقاس المقترح: 600 × 360 بكسل";
    supportLogoModal?.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    window.setTimeout(() => supportLogoLabelInput?.focus(), 80);
    initIcons();
};

const closeSupportLogoModal = () => {
    supportLogoModal?.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
    supportLogoForm?.reset();
    if (eventSupportLogosInput) {
        eventSupportLogosInput.value = "";
        editedFiles.delete(eventSupportLogosInput);
    }
    if (supportLogosName) supportLogosName.textContent = "المقاس المقترح: 600 × 360 بكسل";
};

const openEventSectionModal = (index = null) => {
    const editIndex = Number.isInteger(index) ? index : null;
    const section = editIndex !== null ? normalizeEventSections(state.pendingEventSections)[editIndex] : null;
    state.activeEventSectionIndex = section ? editIndex : null;
    eventSectionForm?.reset();
    if (eventSectionForm && section) {
        eventSectionForm.elements.sectionTitle.value = section.title || "";
        eventSectionForm.elements.sectionText.value = section.text || "";
    }
    if (eventSectionImageInput) {
        eventSectionImageInput.value = "";
        eventSectionImageInput.required = !section?.image;
        editedFiles.delete(eventSectionImageInput);
    }
    if (eventSectionModalEyebrow) eventSectionModalEyebrow.textContent = section ? "تعديل قسم" : "إضافة قسم";
    if (eventSectionModalTitle) eventSectionModalTitle.textContent = section ? "تعديل قسم في صفحة الفعالية" : "قسم في صفحة الفعالية";
    if (eventSectionSubmitText) eventSectionSubmitText.textContent = section ? "حفظ التعديل" : "إضافة القسم";
    if (eventSectionImageName) {
        eventSectionImageName.textContent = section?.image
            ? "الصورة الحالية محفوظة. اختر صورة جديدة فقط إذا أردت استبدالها."
            : "المقاس المقترح: 1200 × 760 بكسل";
    }
    eventSectionModal?.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    window.setTimeout(() => eventSectionForm?.elements.sectionTitle?.focus(), 80);
    initIcons();
};

const closeEventSectionModal = () => {
    eventSectionModal?.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
    eventSectionForm?.reset();
    if (eventSectionImageInput) {
        eventSectionImageInput.value = "";
        eventSectionImageInput.required = true;
        editedFiles.delete(eventSectionImageInput);
    }
    state.activeEventSectionIndex = null;
    if (eventSectionModalEyebrow) eventSectionModalEyebrow.textContent = "إضافة قسم";
    if (eventSectionModalTitle) eventSectionModalTitle.textContent = "قسم في صفحة الفعالية";
    if (eventSectionSubmitText) eventSectionSubmitText.textContent = "إضافة القسم";
    if (eventSectionImageName) eventSectionImageName.textContent = "المقاس المقترح: 1200 × 760 بكسل";
};

const uploadFiles = async (files, folder = "events") => {
    return window.MuheebData.uploadFiles(files, folder);
};

const getInputFiles = (input) => editedFiles.get(input) || input?.files || [];

const addSupportLogoToEvent = async () => {
    const files = getInputFiles(eventSupportLogosInput);
    if (!files?.length) {
        showError("اختر شعار الجهة أولاً.", eventFormMessage);
        return;
    }
    const name = supportLogoLabelInput?.value?.trim() || "";
    if (!name) {
        showError("اكتب اسم الجهة أولاً.", eventFormMessage);
        return;
    }
    showMessage("جاري إضافة شعار الجهة...", eventFormMessage);
    try {
        const uploaded = await uploadFiles(files, "event-logos");
        uploaded.forEach((file, index) => {
            const logoName = name || file.name?.replace(/\.[^.]+$/, "") || `جهة ${state.pendingSupportLogos.length + index + 1}`;
            const entry = stringifySupportLogoEntry({ name: logoName, logo: file.path });
            if (entry) state.pendingSupportLogos.push(entry);
        });
        if (supportLogoLabelInput) supportLogoLabelInput.value = "";
        if (eventSupportLogosInput) {
            eventSupportLogosInput.value = "";
            editedFiles.delete(eventSupportLogosInput);
        }
        if (supportLogosName) supportLogosName.textContent = "تمت إضافة الشعار، لا تنس حفظ الفعالية.";
        renderSupportLogos(state.pendingSupportLogos);
        closeSupportLogoModal();
        showMessage("تمت إضافة شعار الجهة. احفظ الفعالية لتثبيت التغيير.", eventFormMessage);
    } catch (error) {
        showError(error.message, eventFormMessage);
    }
};

const saveSectionToEvent = async () => {
    const files = getInputFiles(eventSectionImageInput);
    const title = eventSectionForm?.elements.sectionTitle?.value?.trim() || "";
    const text = eventSectionForm?.elements.sectionText?.value?.trim() || "";
    const editIndex = state.activeEventSectionIndex;
    const isEditing = Number.isInteger(editIndex);
    const currentSection = isEditing ? normalizeEventSections(state.pendingEventSections)[editIndex] : null;
    if (!title) {
        showError("اكتب عنوان القسم أولاً.", eventFormMessage);
        return;
    }
    if (!text) {
        showError("اكتب وصف القسم أولاً.", eventFormMessage);
        return;
    }
    if (!files?.length && !currentSection?.image) {
        showError("اختر صورة القسم أولاً.", eventFormMessage);
        return;
    }
    showMessage(isEditing ? "جاري حفظ تعديل القسم..." : "جاري إضافة القسم...", eventFormMessage);
    try {
        const uploaded = files?.length ? await uploadFiles(files, "event-sections") : [];
        const nextSection = {
            title,
            text,
            image: uploaded[0]?.path || currentSection?.image || "",
        };
        if (isEditing) {
            state.pendingEventSections.splice(editIndex, 1, nextSection);
        } else {
            state.pendingEventSections.push(nextSection);
        }
        renderEventSections(state.pendingEventSections);
        closeEventSectionModal();
        showMessage(isEditing ? "تم تعديل القسم. احفظ الفعالية لتثبيت التغيير." : "تمت إضافة القسم. احفظ الفعالية لتثبيت التغيير.", eventFormMessage);
    } catch (error) {
        showError(error.message, eventFormMessage);
    }
};

const refreshCurrentEventEditor = async () => {
    const eventId = state.editingEvent?.id;
    await loadAll();
    if (eventId) {
        const refreshed = state.events.find((item) => item.id === eventId);
        if (refreshed) editEvent(refreshed.id);
    }
};

const getGalleryCardPayload = (imageId) => {
    const card = galleryPreview.querySelector(`[data-gallery-image-card="${imageId}"]`);
    return {
        altText: encodeGalleryCaption(
            card?.querySelector("[data-gallery-caption]")?.value || "",
            card?.querySelector("[data-gallery-caption-visible]")?.checked !== false,
        ),
    };
};

const getSupportLogoCardEntry = (index) => {
    const current = parseSupportLogoEntry(state.pendingSupportLogos[index], index);
    const card = supportLogosPreview?.querySelector(`[data-support-logo-card="${index}"]`);
    const name = card?.querySelector("[data-support-logo-name]")?.value?.trim() || current.name || `جهة ${index + 1}`;
    return stringifySupportLogoEntry({ name, logo: current.logo });
};

const collectSupportLogosFromPreview = () => {
    const cards = supportLogosPreview?.querySelectorAll("[data-support-logo-card]");
    if (!cards?.length) return [...state.pendingSupportLogos];
    const nextLogos = Array.from(cards)
        .map((card) => Number(card.dataset.supportLogoCard))
        .filter((index) => !Number.isNaN(index))
        .map(getSupportLogoCardEntry)
        .filter(Boolean);
    state.pendingSupportLogos = nextLogos;
    return nextLogos;
};

const saveSupportLogoName = (index) => {
    if (Number.isNaN(index) || index < 0 || index >= state.pendingSupportLogos.length) return;
    const nextEntry = getSupportLogoCardEntry(index);
    if (!nextEntry) {
        showError("تعذر حفظ اسم الجهة لأن الشعار غير موجود.", eventFormMessage);
        return;
    }
    state.pendingSupportLogos[index] = nextEntry;
    renderSupportLogos(state.pendingSupportLogos);
    showMessage("تم تعديل اسم الجهة. احفظ الفعالية لتثبيت التغيير.", eventFormMessage);
};

const syncGallerySettingsFromPreview = async () => {
    const gallery = getOrderedGallery(state.editingEvent?.gallery || []);
    if (!gallery.length) return;
    await Promise.all(gallery.map((image, imageIndex) => {
        const payload = getGalleryCardPayload(image.id);
        return window.MuheebData.updateEventImage(image.id, {
            altText: payload.altText ?? image.altText ?? "",
            sortOrder: imageIndex + 1,
        });
    }));
};

const saveGalleryImageSettings = async (imageId) => {
    const payload = getGalleryCardPayload(imageId);
    await window.MuheebData.updateEventImage(imageId, payload);
    await refreshCurrentEventEditor();
    showMessage("تم حفظ تعديل تسمية الصورة في المعرض.", eventFormMessage);
};

const moveGalleryImage = async (imageId, direction) => {
    const gallery = getOrderedGallery(state.editingEvent?.gallery || []);
    const index = gallery.findIndex((image) => Number(image.id) === Number(imageId));
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= gallery.length) return;
    const reorderedGallery = gallery.slice();
    const [movedImage] = reorderedGallery.splice(index, 1);
    reorderedGallery.splice(nextIndex, 0, movedImage);
    await Promise.all(reorderedGallery.map((image, imageIndex) => {
        const payload = getGalleryCardPayload(image.id);
        return window.MuheebData.updateEventImage(image.id, {
            altText: payload.altText ?? image.altText ?? "",
            sortOrder: imageIndex + 1,
        });
    }));
    await refreshCurrentEventEditor();
    showMessage("تم تغيير ترتيب الصورة في المعرض.", eventFormMessage);
};

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

const saveEvent = async (event) => {
    event.preventDefault();
    showMessage("جاري حفظ الفعالية...", eventFormMessage);
    try {
        const coverFiles = getInputFiles(coverInput);
        const galleryFiles = getInputFiles(galleryInput);
        if (coverFiles && coverFiles.length) {
            const uploadedCover = await uploadFiles(coverFiles);
            state.coverPath = uploadedCover[0]?.path || state.coverPath;
        }
        const uploadedGallery = await uploadFiles(galleryFiles);
        const supportLogos = collectSupportLogosFromPreview();
        const payload = {
            title: eventForm.elements.title.value,
            titleSize: eventForm.elements.titleSize?.value || "normal",
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
            participants: [],
            achievements: splitLines(eventForm.elements.achievements?.value || ""),
            supportLogos,
            detailSections: normalizeEventSections(state.pendingEventSections),
            sortOrder: Number(eventForm.elements.sortOrder.value || 0),
            published: eventForm.elements.published.checked,
            coverImage: state.coverPath,
            galleryImages: uploadedGallery.map((file) => file.path),
            galleryCaptionAltText: encodeGalleryCaption(
                eventForm.elements.galleryCaptionText?.value || eventForm.elements.title.value,
                eventForm.elements.galleryCaptionVisible?.checked !== false,
            ),
        };
        const eventId = Number(eventIdInput.value || 0);
        await window.MuheebData.saveEvent(payload, eventId || null);
        if (eventId) await syncGallerySettingsFromPreview();
        resetEventForm();
        await loadAll();
        showMessage("تم حفظ الفعالية بنجاح.", eventFormMessage);
    } catch (error) {
        showError(error.message, eventFormMessage);
    }
};

const openSiteImageModal = () => {
    siteImageForm?.reset();
    if (newSiteImageFile) {
        newSiteImageFile.value = "";
        editedFiles.delete(newSiteImageFile);
    }
    if (siteImageForm?.elements.published) siteImageForm.elements.published.checked = true;
    if (siteImageForm?.elements.sortOrder) siteImageForm.elements.sortOrder.value = "0";
    if (siteImageFormMessage) siteImageFormMessage.textContent = "";
    siteImageModal?.classList.remove("is-hidden");
    document.body.classList.add("modal-open");
    initIcons();
};

const closeSiteImageModal = () => {
    siteImageModal?.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
    if (newSiteImageFile) {
        newSiteImageFile.value = "";
        editedFiles.delete(newSiteImageFile);
    }
    if (siteImageFormMessage) siteImageFormMessage.textContent = "";
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
        imageKey: existing.imageKey,
        label: card.querySelector("[data-site-image-label]")?.value,
        groupName: existing.groupName,
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
        closeSiteImageModal();
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
    if (interestOptionForm.elements.optionType) interestOptionForm.elements.optionType.value = option.optionType || "interest";
    interestOptionForm.elements.label.value = option.label || "";
    interestOptionForm.elements.value.value = option.value || "";
    interestOptionForm.elements.sortOrder.value = option.sortOrder || 0;
    interestOptionForm.elements.published.checked = Boolean(option.published);
    interestOptionFormTitle.textContent = "تعديل عنصر من القوائم";
    setView("interestOptionsView");
};

const saveInterestOption = async (event) => {
    event.preventDefault();
    showMessage("جاري حفظ الاختيار...", interestOptionMessage);
    try {
        const formData = new FormData(interestOptionForm);
        const optionId = Number(formData.get("optionId") || 0);
        await window.MuheebData.saveInterestOption({
            optionType: formData.get("optionType") || "interest",
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
            optionType: option.optionType || "interest",
            published: !option.published,
        }, optionId);
        await loadAll();
        showMessage(option.published ? "تم إخفاء العنصر من قائمته." : "تم إظهار العنصر في قائمته.");
    } catch (error) {
        showError(error.message);
    }
};

const deleteInterestOption = async (optionId) => {
    const option = state.interestOptions.find((item) => item.id === optionId);
    if (!option) return;
    if (!confirm(`هل تريد حذف "${option.label}" من القوائم المنسدلة؟`)) return;
    try {
        await window.MuheebData.deleteInterestOption(optionId);
        await loadAll();
        showMessage("تم حذف العنصر من القوائم.");
    } catch (error) {
        showError(error.message);
    }
};

const resetUserForm = () => {
    state.editingUser = null;
    userForm?.reset();
    if (!userForm) return;
    userForm.elements.userId.value = "";
    userForm.elements.avatarUrl.value = "";
    userForm.elements.email.disabled = false;
    userForm.elements.password.required = true;
    userForm.elements.active.checked = true;
    if (userAvatarInput) {
        userAvatarInput.value = "";
        editedFiles.delete(userAvatarInput);
    }
    if (userAvatarName) userAvatarName.textContent = "اختياري - المقاس المقترح: 600 × 600 بكسل";
    updateAvatarPreview("");
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
                            <td>
                                <div class="user-cell">
                                    ${renderUserAvatar(user, "table-avatar")}
                                    <strong>${escapeHtml(getDisplayName(user))}</strong>
                                </div>
                            </td>
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
    userForm.elements.email.value = user.email || (user.userId === state.admin?.userId ? state.admin?.authEmail || "" : "");
    userForm.elements.email.disabled = true;
    userForm.elements.password.value = "";
    userForm.elements.password.required = false;
    userForm.elements.active.checked = user.active !== false;
    userForm.elements.avatarUrl.value = getUserAvatar(user);
    if (userAvatarInput) {
        userAvatarInput.value = "";
        editedFiles.delete(userAvatarInput);
    }
    if (userAvatarName) userAvatarName.textContent = getUserAvatar(user) ? "صورة محفوظة حاليًا" : "اختياري - المقاس المقترح: 600 × 600 بكسل";
    updateAvatarPreview(getUserAvatar(user));
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
        const userId = state.editingUser?.userId || formData.get("userId") || "";
        const editingEmail = state.editingUser?.email || (
            state.editingUser?.userId === state.admin?.userId ? state.admin?.authEmail || "" : ""
        );
        let avatarUrl = formData.get("avatarUrl") || state.editingUser?.avatarUrl || state.editingUser?.permissions?.avatarUrl || "";
        const avatarFiles = getInputFiles(userAvatarInput);
        if (avatarFiles && avatarFiles.length) {
            const uploadedAvatar = await uploadFiles(avatarFiles, "users");
            avatarUrl = uploadedAvatar[0]?.path || avatarUrl;
        }
        const permissions = {
            ...readUserPermissions(),
            avatarUrl,
        };
        await window.MuheebData.saveAdminUser({
            fullName: formData.get("fullName"),
            phone: formData.get("phone"),
            email: formData.get("email") || editingEmail,
            password: formData.get("password"),
            active: userForm.elements.active.checked,
            permissions,
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
        <article class="profile-avatar-card">
            ${renderUserAvatar(state.admin, "profile-avatar-large")}
            <strong>${escapeHtml(getDisplayName())}</strong>
        </article>
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
    if (!requests.length) {
        profileRequestsList.innerHTML = `<div class="compact-item"><span>لا توجد طلبات تعديل بيانات حتى الآن.</span></div>`;
        return;
    }
    profileRequestsList.innerHTML = `
        <div class="table-wrap">
            <table class="profile-requests-table">
                <thead>
                    <tr>
                        <th>المستخدم</th>
                        <th>الاسم المطلوب</th>
                        <th>الجوال المطلوب</th>
                        <th>الإيميل المطلوب</th>
                        <th>التاريخ</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    ${requests.map((request) => {
                        const user = getUserById(request.userId);
                        const disabled = request.status !== "pending" ? "disabled" : "";
                        return `
                            <tr class="${request.status !== "pending" ? "is-muted" : ""}" data-profile-request="${request.id}">
                                <td>
                                    <div class="user-cell">
                                        ${renderUserAvatar(user || {}, "table-avatar")}
                                        <strong>${escapeHtml(getDisplayName(user || {}))}</strong>
                                    </div>
                                </td>
                                <td><input type="text" data-profile-request-full-name value="${escapeHtml(request.requestedFullName)}" ${disabled}></td>
                                <td><input type="text" data-profile-request-phone value="${escapeHtml(request.requestedPhone)}" ${disabled}></td>
                                <td><input type="email" data-profile-request-email value="${escapeHtml(request.requestedEmail)}" ${disabled}></td>
                                <td>${formatDate(request.createdAt)}</td>
                                <td><span class="badge ${request.status === "pending" ? "" : "is-dim"}">${request.status === "pending" ? "بانتظار الموافقة" : request.status === "approved" ? "تمت الموافقة" : "مرفوض"}</span></td>
                                <td>
                                    ${request.status === "pending" ? `
                                        <div class="lead-actions">
                                            <button class="primary-btn icon-only small-icon" type="button" data-approve-profile-request="${request.id}" title="قبول">
                                                <i data-lucide="check"></i>
                                            </button>
                                            <button class="danger-btn icon-only small-icon" type="button" data-reject-profile-request="${request.id}" title="رفض">
                                                <i data-lucide="x"></i>
                                            </button>
                                        </div>
                                    ` : "-"}
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
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
openSiteImageModalButton?.addEventListener("click", openSiteImageModal);
closeSiteImageModalButton?.addEventListener("click", closeSiteImageModal);
cancelSiteImageModalButton?.addEventListener("click", closeSiteImageModal);
siteImageModal?.addEventListener("click", (event) => {
    if (event.target === siteImageModal) closeSiteImageModal();
});
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
    const whatsappButton = event.target.closest("[data-whatsapp-lead]");
    if (whatsappButton) {
        handleLeadWhatsappAction(whatsappButton.dataset.whatsappLead);
        return;
    }
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

notificationList?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-notification-id]");
    if (!button) return;
    const leadId = Number(button?.dataset.openLead || 0);
    const notificationId = Number(button?.dataset.notificationId || 0);
    if (notificationId) {
        markNotificationReadLocally(notificationId);
        notificationsMenu.classList.add("is-hidden");
        try {
            await window.MuheebData.markNotificationRead(notificationId);
            await loadAll();
        } catch (error) {
            console.error("Muheeb notification read failed:", error);
            showError("تعذر تحديث الإشعار كمقروء. تأكد من تشغيل ملف تحديث Supabase.");
        }
        if (leadId) openLeadModal(leadId);
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

leadDetailGrid?.addEventListener("click", (event) => {
    const whatsappButton = event.target.closest("[data-whatsapp-lead]");
    if (whatsappButton) handleLeadWhatsappAction(whatsappButton.dataset.whatsappLead);
});

document.getElementById("closeLeadModal")?.addEventListener("click", closeLeadModal);
leadModal?.addEventListener("click", (event) => {
    if (event.target === leadModal) closeLeadModal();
});
closeNoteInquiryModalButton?.addEventListener("click", closeNoteInquiryModal);
cancelNoteInquiryModalButton?.addEventListener("click", closeNoteInquiryModal);
noteInquiryModal?.addEventListener("click", (event) => {
    if (event.target === noteInquiryModal) closeNoteInquiryModal();
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
        openNoteInquiryModal({ mode: "create", noteId: inquiryButton.dataset.inquireNote });
        return;
    }
    const replyButton = event.target.closest("[data-reply-inquiry]");
    if (replyButton) {
        openNoteInquiryModal({ mode: "reply", inquiryId: replyButton.dataset.replyInquiry });
    }
});

noteInquiryForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const mode = noteInquiryForm.elements.mode.value;
    const body = noteInquiryForm.elements.body.value;
    try {
        if (mode === "reply") {
            await replyNoteInquiry(noteInquiryForm.elements.inquiryId.value, body);
            showMessage("تم إرسال الرد على الاستفسار.");
        } else {
            await addNoteInquiry(noteInquiryForm.elements.noteId.value, body);
            showMessage("تم إرسال الاستفسار للمشرف.");
        }
        closeNoteInquiryModal();
    } catch (error) {
        showError(error.message, noteInquiryMessage);
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
    if (input && file) setInputFileLabel(input, file.name);
});

interestOptionList?.addEventListener("click", async (event) => {
    const newButton = event.target.closest("[data-new-interest-option]");
    const editButton = event.target.closest("[data-edit-interest-option]");
    const toggleButton = event.target.closest("[data-toggle-interest-option]");
    const deleteButton = event.target.closest("[data-delete-interest-option]");
    if (newButton) {
        startNewInterestOption(newButton.dataset.newInterestOption || "interest");
        return;
    }
    if (editButton) {
        editInterestOption(Number(editButton.dataset.editInterestOption));
    }
    if (toggleButton) {
        await toggleInterestOption(Number(toggleButton.dataset.toggleInterestOption));
    }
    if (deleteButton) {
        await deleteInterestOption(Number(deleteButton.dataset.deleteInterestOption));
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
    const saveButton = event.target.closest("[data-save-gallery-image]");
    const moveButton = event.target.closest("[data-move-gallery-image]");
    const deleteButton = event.target.closest("[data-delete-image]");
    if (!saveButton && !moveButton && !deleteButton) return;
    try {
        if (saveButton) {
            await saveGalleryImageSettings(Number(saveButton.dataset.saveGalleryImage));
            return;
        }
        if (moveButton) {
            await moveGalleryImage(Number(moveButton.dataset.moveGalleryImage), Number(moveButton.dataset.direction));
            return;
        }
        await window.MuheebData.deleteEventImage(Number(deleteButton.dataset.deleteImage));
        await refreshCurrentEventEditor();
        showMessage("تم حذف الصورة من المعرض.");
    } catch (error) {
        showError(error.message);
    }
});

supportLogosPreview?.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save-support-logo]");
    const removeButton = event.target.closest("[data-remove-support-logo]");
    if (!saveButton && !removeButton) return;
    const index = Number(saveButton?.dataset.saveSupportLogo ?? removeButton?.dataset.removeSupportLogo);
    if (Number.isNaN(index)) return;
    if (saveButton) {
        saveSupportLogoName(index);
        return;
    }
    state.pendingSupportLogos.splice(index, 1);
    renderSupportLogos(state.pendingSupportLogos);
    if (supportLogosName) supportLogosName.textContent = "تم حذف الشعار من الفعالية، احفظ التغيير.";
    showMessage("تم حذف الجهة من المعاينة. احفظ الفعالية لتثبيت الحذف.", eventFormMessage);
});

openSupportLogoModalButton?.addEventListener("click", openSupportLogoModal);
closeSupportLogoModalButton?.addEventListener("click", closeSupportLogoModal);
cancelSupportLogoModalButton?.addEventListener("click", closeSupportLogoModal);
supportLogoModal?.addEventListener("click", (event) => {
    if (event.target === supportLogoModal) closeSupportLogoModal();
});
supportLogoForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await addSupportLogoToEvent();
});

eventSectionsPreview?.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-event-section]");
    if (editButton) {
        const index = Number(editButton.dataset.editEventSection);
        if (!Number.isNaN(index)) openEventSectionModal(index);
        return;
    }
    const moveButton = event.target.closest("[data-move-event-section]");
    if (moveButton) {
        const index = Number(moveButton.dataset.moveEventSection);
        const direction = Number(moveButton.dataset.direction);
        const nextIndex = index + direction;
        if (Number.isNaN(index) || Number.isNaN(direction) || nextIndex < 0 || nextIndex >= state.pendingEventSections.length) return;
        const [section] = state.pendingEventSections.splice(index, 1);
        state.pendingEventSections.splice(nextIndex, 0, section);
        renderEventSections(state.pendingEventSections);
        showMessage("تم تغيير ترتيب القسم، احفظ الفعالية لتثبيت التغيير.", eventFormMessage);
        return;
    }
    const removeButton = event.target.closest("[data-remove-event-section]");
    if (!removeButton) return;
    const index = Number(removeButton.dataset.removeEventSection);
    if (Number.isNaN(index)) return;
    state.pendingEventSections.splice(index, 1);
    renderEventSections(state.pendingEventSections);
    showMessage("تم حذف القسم من الفعالية، احفظ التغيير لتثبيته.", eventFormMessage);
});

openEventSectionModalButton?.addEventListener("click", () => openEventSectionModal());
closeEventSectionModalButton?.addEventListener("click", closeEventSectionModal);
cancelEventSectionModalButton?.addEventListener("click", closeEventSectionModal);
eventSectionModal?.addEventListener("click", (event) => {
    if (event.target === eventSectionModal) closeEventSectionModal();
});
eventSectionForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveSectionToEvent();
});

coverInput.addEventListener("change", () => {
    const file = coverInput.files?.[0];
    coverName.textContent = file ? file.name : "لم يتم اختيار صورة جديدة";
    if (file) {
        coverPreview.src = URL.createObjectURL(file);
    }
});

newSiteImageFile?.addEventListener("change", () => {
    const file = newSiteImageFile.files?.[0];
    if (file) setInputFileLabel(newSiteImageFile, file.name);
});

galleryInput.addEventListener("change", () => {
    const count = galleryInput.files?.length || 0;
    galleryName.textContent = count ? `${count} صور جاهزة للرفع عند الحفظ` : "المقاس المقترح: 1320 × 1080 بكسل لكل صورة";
    if (count) renderTemporaryFilePreview(galleryPreview, galleryInput.files);
});

eventSupportLogosInput?.addEventListener("change", () => {
    const count = eventSupportLogosInput.files?.length || 0;
    if (supportLogosName) supportLogosName.textContent = count ? "شعار جاهز للإضافة" : "المقاس المقترح: 600 × 360 بكسل";
});

eventSectionImageInput?.addEventListener("change", () => {
    const file = eventSectionImageInput.files?.[0];
    if (eventSectionImageName) eventSectionImageName.textContent = file ? file.name : "المقاس المقترح: 1200 × 760 بكسل";
});

userAvatarInput?.addEventListener("change", () => {
    const file = userAvatarInput.files?.[0];
    if (userAvatarName) userAvatarName.textContent = file ? file.name : "اختياري - المقاس المقترح: 600 × 600 بكسل";
    if (file) updateAvatarPreview(URL.createObjectURL(file));
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
