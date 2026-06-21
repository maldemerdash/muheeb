const initIcons = () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }
};

const state = {
    admin: null,
    leads: [],
    events: [],
    activeView: "overviewView",
    editingEvent: null,
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

const loginView = document.getElementById("loginView");
const adminShell = document.getElementById("adminShell");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const globalMessage = document.getElementById("globalMessage");
const pageTitle = document.getElementById("pageTitle");
const adminUser = document.getElementById("adminUser");
const leadsTable = document.getElementById("leadsTable");
const latestLeads = document.getElementById("latestLeads");
const latestEvents = document.getElementById("latestEvents");
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

const showMessage = (message, target = globalMessage) => {
    if (!target) return;
    target.textContent = message;
    if (message) {
        window.setTimeout(() => {
            if (target.textContent === message) target.textContent = "";
        }, 4200);
    }
};

const showApp = () => {
    loginView.classList.add("is-hidden");
    adminShell.classList.remove("is-hidden");
    adminUser.textContent = state.admin ? `مرحبًا ${state.admin.username}` : "";
};

const showLogin = () => {
    adminShell.classList.add("is-hidden");
    loginView.classList.remove("is-hidden");
};

const setView = (viewId) => {
    state.activeView = viewId;
    document.querySelectorAll(".admin-view").forEach((view) => {
        view.classList.toggle("active", view.id === viewId);
    });
    document.querySelectorAll(".nav-item").forEach((button) => {
        button.classList.toggle("active", button.dataset.view === viewId);
    });
    pageTitle.textContent = document.querySelector(`[data-view="${viewId}"] span`)?.textContent || "لوحة التحكم";
};

const loadAll = async () => {
    const [stats, leads, events] = await Promise.all([
        window.MuheebData.getStats(),
        window.MuheebData.listLeads(),
        window.MuheebData.listAdminEvents(),
    ]);
    state.leads = leads || [];
    state.events = events || [];
    renderStats(stats || {});
    renderLeads();
    renderEvents();
    initIcons();
};

const renderStats = (stats) => {
    document.getElementById("leadTotal").textContent = stats.leadTotal || 0;
    document.getElementById("leadNew").textContent = stats.leadNew || 0;
    document.getElementById("eventTotal").textContent = stats.eventTotal || 0;
    document.getElementById("eventPublished").textContent = stats.eventPublished || 0;

    latestLeads.innerHTML = state.leads.slice(0, 5).map((lead) => `
        <div class="compact-item">
            <strong>${escapeHtml(lead.name)}</strong>
            <span>${escapeHtml(lead.countryCode)} ${escapeHtml(lead.phone)} - ${escapeHtml(lead.service)}</span>
            <span>${formatDate(lead.createdAt)}</span>
        </div>
    `).join("") || `<div class="compact-item"><span>لا توجد طلبات حتى الآن.</span></div>`;

    latestEvents.innerHTML = state.events.slice(0, 5).map((event) => `
        <div class="compact-item">
            <strong>${escapeHtml(event.title)}</strong>
            <span>${escapeHtml(labels[event.category] || event.category)} - ${event.published ? "منشور" : "مخفي"}</span>
        </div>
    `).join("") || `<div class="compact-item"><span>لا توجد فعاليات حتى الآن.</span></div>`;
};

const renderLeads = () => {
    const filter = leadStatusFilter.value || "all";
    const leads = filter === "all" ? state.leads : state.leads.filter((lead) => lead.status === filter);
    leadsTable.innerHTML = leads.map((lead) => `
        <tr>
            <td>
                <div class="lead-name">
                    <strong>${escapeHtml(lead.name)}</strong>
                    <small>#${lead.id}</small>
                    ${lead.message ? `<small class="message-cell">${escapeHtml(lead.message)}</small>` : ""}
                </div>
            </td>
            <td>
                <a href="tel:+${escapeHtml(lead.countryCode)}${escapeHtml(lead.phone)}">+${escapeHtml(lead.countryCode)} ${escapeHtml(lead.phone)}</a>
            </td>
            <td>${escapeHtml(lead.service)}</td>
            <td>${escapeHtml(lead.source)}</td>
            <td>
                <select class="status-select" data-lead-status="${lead.id}">
                    ${Object.entries(labels).filter(([key]) => ["new", "contacted", "done", "archived"].includes(key)).map(([key, label]) => `
                        <option value="${key}" ${lead.status === key ? "selected" : ""}>${label}</option>
                    `).join("")}
                </select>
            </td>
            <td>
                <textarea class="notes-input" data-lead-notes="${lead.id}" placeholder="ملاحظات المتابعة">${escapeHtml(lead.adminNotes)}</textarea>
            </td>
            <td>${formatDate(lead.createdAt)}</td>
        </tr>
    `).join("") || `<tr><td colspan="7">لا توجد طلبات بهذه الحالة.</td></tr>`;
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

const uploadFiles = async (files) => {
    return window.MuheebData.uploadFiles(files);
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
        showMessage(error.message, eventFormMessage);
    }
};

const updateLead = async (leadId) => {
    const status = document.querySelector(`[data-lead-status="${leadId}"]`)?.value;
    const notes = document.querySelector(`[data-lead-notes="${leadId}"]`)?.value || "";
    try {
        await window.MuheebData.updateLead(leadId, { status, adminNotes: notes });
        await loadAll();
        showMessage("تم تحديث الطلب.");
    } catch (error) {
        showMessage(error.message);
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

leadStatusFilter.addEventListener("change", renderLeads);

leadsTable.addEventListener("change", (event) => {
    const leadId = Number(event.target.dataset.leadStatus || 0);
    if (leadId) updateLead(leadId);
});

leadsTable.addEventListener("blur", (event) => {
    const leadId = Number(event.target.dataset.leadNotes || 0);
    if (leadId) updateLead(leadId);
}, true);

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
            showMessage(error.message);
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
        showMessage(error.message);
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
        showMessage(error.message, passwordMessage);
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
