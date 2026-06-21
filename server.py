#!/usr/bin/env python3
import cgi
import hashlib
import hmac
import json
import mimetypes
import os
import posixpath
import secrets
import shutil
import sqlite3
import sys
import time
import urllib.parse
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from uuid import uuid4


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
UPLOADS_DIR = ROOT / "uploads" / "events"
DB_PATH = DATA_DIR / "muheeb.sqlite3"
SESSION_COOKIE = "muheeb_session"
SESSION_AGE_SECONDS = 60 * 60 * 24 * 7
MAX_JSON_BYTES = 1024 * 1024
MAX_UPLOAD_BYTES = 20 * 1024 * 1024
ALLOWED_UPLOAD_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
EVENT_CATEGORIES = {
    "event": "فعاليات",
    "marketing": "تسويق",
    "identity": "هوية",
    "operation": "تشغيل",
}
LEAD_STATUSES = {"new", "contacted", "done", "archived"}


def ensure_dirs():
    DATA_DIR.mkdir(exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    return db


def now_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def hash_password(password):
    salt = secrets.token_hex(16)
    iterations = 260000
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), iterations)
    return f"pbkdf2_sha256${iterations}${salt}${digest.hex()}"


def verify_password(password, stored):
    try:
        algorithm, iterations, salt, expected = stored.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            int(iterations),
        ).hex()
        return hmac.compare_digest(digest, expected)
    except Exception:
        return False


def sha256(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def init_db():
    ensure_dirs()
    with get_db() as db:
        db.executescript(
            """
            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                admin_id INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                expires_at INTEGER NOT NULL,
                FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                country_code TEXT NOT NULL,
                phone TEXT NOT NULL,
                service TEXT NOT NULL,
                source TEXT NOT NULL,
                message TEXT,
                status TEXT NOT NULL DEFAULT 'new',
                admin_notes TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                location TEXT,
                event_date TEXT,
                description TEXT NOT NULL,
                highlights TEXT NOT NULL DEFAULT '[]',
                cover_image TEXT,
                published INTEGER NOT NULL DEFAULT 1,
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS event_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER NOT NULL,
                image_path TEXT NOT NULL,
                alt_text TEXT,
                sort_order INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
            );
            """
        )

        admin_count = db.execute("SELECT COUNT(*) AS count FROM admins").fetchone()["count"]
        if admin_count == 0:
            username = os.environ.get("MUHEEB_ADMIN_USER", "admin")
            password = os.environ.get("MUHEEB_ADMIN_PASSWORD", "Muheeb@2026")
            db.execute(
                "INSERT INTO admins (username, password_hash, created_at) VALUES (?, ?, ?)",
                (username, hash_password(password), now_iso()),
            )

        event_count = db.execute("SELECT COUNT(*) AS count FROM events").fetchone()["count"]
        if event_count == 0:
            seed_events(db)


def seed_events(db):
    created_at = now_iso()
    events = [
        {
            "title": "المؤتمرات والمعارض",
            "category": "event",
            "location": "المدينة المنورة",
            "event_date": "تخطيط وتشغيل",
            "description": "إدارة تجربة الحضور، المسارات، نقاط التسجيل، وتطبيق الهوية داخل مساحة الحدث.",
            "highlights": ["تجربة حضور", "تنسيق ميداني", "هوية المكان"],
            "cover_image": "assets/identity-wall-clean.png",
            "sort_order": 1,
        },
        {
            "title": "الحملات التسويقية",
            "category": "marketing",
            "location": "السعودية",
            "event_date": "فكرة ورسالة",
            "description": "بناء فكرة الحملة ورسائلها، وتنسيق الظهور البصري عبر القنوات والمواد.",
            "highlights": ["خطة ظهور", "مسار بصري", "محتوى تسويقي"],
            "cover_image": "assets/brand-palette.jpg",
            "sort_order": 2,
        },
        {
            "title": "التطبيقات البصرية",
            "category": "identity",
            "location": "حسب نطاق المشروع",
            "event_date": "تصميم واعتماد",
            "description": "مطبوعات، بطاقات، لوحات، وأدوات تعريف تحفظ اتساق العلامة في كل نقطة تواصل.",
            "highlights": ["شعار واضح", "نظام ألوان", "ملفات جاهزة"],
            "cover_image": "assets/identity-cards-clean.png",
            "sort_order": 3,
        },
        {
            "title": "التنفيذ والتوثيق",
            "category": "operation",
            "location": "مواقع الفعاليات",
            "event_date": "تشغيل وتوثيق",
            "description": "إدارة التفاصيل التشغيلية، اعتماد المواد، وتوثيق المخرجات لتظهر الفعالية بصورة محترفة.",
            "highlights": ["متابعة دقيقة", "اعتماد مخرجات", "تنسيق شركاء"],
            "cover_image": "assets/identity-stamp-clean.png",
            "sort_order": 4,
        },
    ]
    for event in events:
        db.execute(
            """
            INSERT INTO events
            (title, category, location, event_date, description, highlights, cover_image, published, sort_order, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
            """,
            (
                event["title"],
                event["category"],
                event["location"],
                event["event_date"],
                event["description"],
                json.dumps(event["highlights"], ensure_ascii=False),
                event["cover_image"],
                event["sort_order"],
                created_at,
                created_at,
            ),
        )


def clean_sessions():
    with get_db() as db:
        db.execute("DELETE FROM sessions WHERE expires_at < ?", (int(time.time()),))


def json_loads(value, fallback):
    try:
        parsed = json.loads(value or "")
        return parsed if isinstance(parsed, list) else fallback
    except Exception:
        return fallback


def event_to_dict(row, gallery=None):
    category = row["category"]
    return {
        "id": row["id"],
        "title": row["title"],
        "category": category,
        "categoryLabel": EVENT_CATEGORIES.get(category, category),
        "location": row["location"] or "",
        "eventDate": row["event_date"] or "",
        "description": row["description"],
        "highlights": json_loads(row["highlights"], []),
        "coverImage": row["cover_image"] or "",
        "published": bool(row["published"]),
        "sortOrder": row["sort_order"],
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
        "gallery": gallery or [],
    }


def lead_to_dict(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "countryCode": row["country_code"],
        "phone": row["phone"],
        "service": row["service"],
        "source": row["source"],
        "message": row["message"] or "",
        "status": row["status"],
        "adminNotes": row["admin_notes"] or "",
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


def normalize_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "on", "published"}
    return False


def safe_int(value, default=0):
    try:
        return int(value)
    except Exception:
        return default


def normalize_highlights(value):
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()][:6]
    if isinstance(value, str):
        return [line.strip() for line in value.splitlines() if line.strip()][:6]
    return []


def normalize_event_payload(data):
    title = str(data.get("title", "")).strip()
    category = str(data.get("category", "event")).strip()
    description = str(data.get("description", "")).strip()
    if not title:
        raise ValueError("اسم الفعالية مطلوب.")
    if category not in EVENT_CATEGORIES:
        raise ValueError("تصنيف الفعالية غير صحيح.")
    if not description:
        raise ValueError("وصف الفعالية مطلوب.")
    cover_image = str(data.get("coverImage") or data.get("cover_image") or "").strip()
    gallery_images = data.get("galleryImages") or data.get("gallery_images") or []
    if not isinstance(gallery_images, list):
        gallery_images = []
    return {
        "title": title[:140],
        "category": category,
        "location": str(data.get("location", "")).strip()[:160],
        "event_date": str(data.get("eventDate") or data.get("event_date") or "").strip()[:120],
        "description": description[:900],
        "highlights": json.dumps(normalize_highlights(data.get("highlights", [])), ensure_ascii=False),
        "cover_image": cover_image[:320],
        "published": 1 if normalize_bool(data.get("published", True)) else 0,
        "sort_order": safe_int(data.get("sortOrder") or data.get("sort_order"), 0),
        "gallery_images": [str(path).strip()[:320] for path in gallery_images if str(path).strip()],
    }


def validate_image_signature(file_obj, extension):
    head = file_obj.read(16)
    try:
        file_obj.seek(0)
    except Exception:
        pass
    ext = extension.lower()
    if ext in {".jpg", ".jpeg"}:
        return head.startswith(b"\xff\xd8\xff")
    if ext == ".png":
        return head.startswith(b"\x89PNG\r\n\x1a\n")
    if ext == ".gif":
        return head.startswith(b"GIF8")
    if ext == ".webp":
        return head.startswith(b"RIFF") and head[8:12] == b"WEBP"
    return False


class MuheebHandler(BaseHTTPRequestHandler):
    server_version = "MuheebServer/1.0"

    def log_message(self, format, *args):
        sys.stderr.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), format % args))

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        super().end_headers()

    def send_json(self, payload, status=HTTPStatus.OK, headers=None):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        for key, value in (headers or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, status, message):
        self.send_json({"ok": False, "message": message}, status=status)

    def read_json(self):
        length = safe_int(self.headers.get("Content-Length"), 0)
        if length > MAX_JSON_BYTES:
            raise ValueError("حجم البيانات المرسلة كبير.")
        if length <= 0:
            return {}
        raw = self.rfile.read(length)
        return json.loads(raw.decode("utf-8"))

    def current_admin(self):
        cookie_header = self.headers.get("Cookie")
        if not cookie_header:
            return None
        cookies = SimpleCookie()
        try:
            cookies.load(cookie_header)
        except Exception:
            return None
        morsel = cookies.get(SESSION_COOKIE)
        if not morsel:
            return None
        token_hash = sha256(morsel.value)
        with get_db() as db:
            row = db.execute(
                """
                SELECT admins.id, admins.username
                FROM sessions
                JOIN admins ON admins.id = sessions.admin_id
                WHERE sessions.token_hash = ? AND sessions.expires_at > ?
                """,
                (token_hash, int(time.time())),
            ).fetchone()
        return row

    def require_admin(self):
        admin = self.current_admin()
        if not admin:
            self.send_error_json(HTTPStatus.UNAUTHORIZED, "تحتاج إلى تسجيل الدخول.")
            return None
        return admin

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Allow", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        if path == "/api/events":
            return self.handle_public_events()
        if path == "/api/admin/me":
            return self.handle_admin_me()
        if path == "/api/admin/stats":
            return self.handle_admin_stats()
        if path == "/api/admin/leads":
            return self.handle_admin_leads()
        if path == "/api/admin/events":
            return self.handle_admin_events()
        return self.serve_static(parsed.path)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        if path == "/api/leads":
            return self.handle_create_lead()
        if path == "/api/admin/login":
            return self.handle_admin_login()
        if path == "/api/admin/logout":
            return self.handle_admin_logout()
        if path == "/api/admin/change-password":
            return self.handle_admin_change_password()
        if path == "/api/admin/uploads":
            return self.handle_admin_uploads()
        if path == "/api/admin/events":
            return self.handle_create_event()
        return self.send_error_json(HTTPStatus.NOT_FOUND, "المسار غير موجود.")

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        segments = [segment for segment in parsed.path.strip("/").split("/") if segment]
        if len(segments) == 4 and segments[:3] == ["api", "admin", "events"]:
            return self.handle_update_event(safe_int(segments[3]))
        return self.send_error_json(HTTPStatus.NOT_FOUND, "المسار غير موجود.")

    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        segments = [segment for segment in parsed.path.strip("/").split("/") if segment]
        if len(segments) == 4 and segments[:3] == ["api", "admin", "leads"]:
            return self.handle_update_lead(safe_int(segments[3]))
        return self.send_error_json(HTTPStatus.NOT_FOUND, "المسار غير موجود.")

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        segments = [segment for segment in parsed.path.strip("/").split("/") if segment]
        if len(segments) == 4 and segments[:3] == ["api", "admin", "events"]:
            return self.handle_delete_event(safe_int(segments[3]))
        if len(segments) == 4 and segments[:3] == ["api", "admin", "event-images"]:
            return self.handle_delete_event_image(safe_int(segments[3]))
        return self.send_error_json(HTTPStatus.NOT_FOUND, "المسار غير موجود.")

    def serve_static(self, raw_path):
        path = urllib.parse.unquote(raw_path)
        if path in {"/", ""}:
            path = "/index.html"
        if path == "/admin":
            path = "/admin.html"

        normalized = posixpath.normpath(path.lstrip("/"))
        if normalized.startswith("../") or normalized in {"..", "."}:
            return self.send_error(HTTPStatus.NOT_FOUND)
        if normalized.startswith(("data/", "tmp/")) or Path(normalized).suffix.lower() in {".py", ".db", ".sqlite3", ".psd", ".pdf"}:
            return self.send_error(HTTPStatus.NOT_FOUND)

        target = (ROOT / normalized).resolve()
        try:
            target.relative_to(ROOT)
        except ValueError:
            return self.send_error(HTTPStatus.NOT_FOUND)
        if not target.is_file():
            return self.send_error(HTTPStatus.NOT_FOUND)

        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        body = target.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        if normalized.startswith(("assets/", "uploads/")):
            self.send_header("Cache-Control", "public, max-age=3600")
        else:
            self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(body)

    def handle_public_events(self):
        with get_db() as db:
            rows = db.execute(
                "SELECT * FROM events WHERE published = 1 ORDER BY sort_order ASC, id DESC"
            ).fetchall()
            events = []
            for row in rows:
                gallery_rows = db.execute(
                    "SELECT id, image_path, alt_text, sort_order FROM event_images WHERE event_id = ? ORDER BY sort_order ASC, id ASC",
                    (row["id"],),
                ).fetchall()
                gallery = [
                    {"id": image["id"], "imagePath": image["image_path"], "altText": image["alt_text"] or ""}
                    for image in gallery_rows
                ]
                events.append(event_to_dict(row, gallery))
        self.send_json({"ok": True, "events": events})

    def handle_create_lead(self):
        try:
            data = self.read_json()
            name = str(data.get("name", "")).strip()
            country = str(data.get("country") or data.get("countryCode") or "").strip()
            phone = "".join(ch for ch in str(data.get("phone", "")) if ch.isdigit())
            service = str(data.get("service") or data.get("project") or "").strip()
            source = str(data.get("source", "")).strip()
            message = str(data.get("message", "")).strip()
            if not name:
                raise ValueError("الاسم مطلوب.")
            if len(phone) < 8 or len(phone) > 15:
                raise ValueError("رقم الجوال غير صحيح.")
            if not source:
                raise ValueError("مصدر معرفة العميل مطلوب.")
            created_at = now_iso()
            with get_db() as db:
                cursor = db.execute(
                    """
                    INSERT INTO leads
                    (name, country_code, phone, service, source, message, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?)
                    """,
                    (name[:100], country[:8], phone, service[:120] or "استشارة عامة", source[:120], message[:1200], created_at, created_at),
                )
            self.send_json({"ok": True, "message": "تم استلام طلبك بنجاح.", "leadId": cursor.lastrowid}, status=HTTPStatus.CREATED)
        except ValueError as error:
            self.send_error_json(HTTPStatus.BAD_REQUEST, str(error))
        except json.JSONDecodeError:
            self.send_error_json(HTTPStatus.BAD_REQUEST, "صيغة البيانات غير صحيحة.")

    def handle_admin_login(self):
        try:
            data = self.read_json()
        except Exception:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "صيغة بيانات الدخول غير صحيحة.")
        username = str(data.get("username", "")).strip()
        password = str(data.get("password", ""))
        with get_db() as db:
            admin = db.execute("SELECT * FROM admins WHERE username = ?", (username,)).fetchone()
            if not admin or not verify_password(password, admin["password_hash"]):
                return self.send_error_json(HTTPStatus.UNAUTHORIZED, "بيانات الدخول غير صحيحة.")
            token = secrets.token_urlsafe(48)
            expires_at = int(time.time()) + SESSION_AGE_SECONDS
            db.execute(
                "INSERT INTO sessions (token_hash, admin_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
                (sha256(token), admin["id"], now_iso(), expires_at),
            )
        cookie = f"{SESSION_COOKIE}={token}; Path=/; HttpOnly; SameSite=Lax; Max-Age={SESSION_AGE_SECONDS}"
        self.send_json(
            {"ok": True, "admin": {"id": admin["id"], "username": admin["username"]}},
            headers={"Set-Cookie": cookie},
        )

    def handle_admin_logout(self):
        admin = self.current_admin()
        cookie_header = self.headers.get("Cookie", "")
        cookies = SimpleCookie()
        try:
            cookies.load(cookie_header)
        except Exception:
            pass
        morsel = cookies.get(SESSION_COOKIE)
        if morsel:
            with get_db() as db:
                db.execute("DELETE FROM sessions WHERE token_hash = ?", (sha256(morsel.value),))
        expired_cookie = f"{SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
        self.send_json({"ok": True, "admin": bool(admin)}, headers={"Set-Cookie": expired_cookie})

    def handle_admin_change_password(self):
        admin = self.require_admin()
        if not admin:
            return
        try:
            data = self.read_json()
        except Exception:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "صيغة البيانات غير صحيحة.")
        current_password = str(data.get("currentPassword", ""))
        new_password = str(data.get("newPassword", ""))
        if len(new_password) < 10:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "كلمة المرور الجديدة يجب ألا تقل عن 10 أحرف.")
        with get_db() as db:
            row = db.execute("SELECT * FROM admins WHERE id = ?", (admin["id"],)).fetchone()
            if not row or not verify_password(current_password, row["password_hash"]):
                return self.send_error_json(HTTPStatus.UNAUTHORIZED, "كلمة المرور الحالية غير صحيحة.")
            db.execute(
                "UPDATE admins SET password_hash = ? WHERE id = ?",
                (hash_password(new_password), admin["id"]),
            )
        self.send_json({"ok": True, "message": "تم تحديث كلمة المرور بنجاح."})

    def handle_admin_me(self):
        admin = self.current_admin()
        if not admin:
            return self.send_error_json(HTTPStatus.UNAUTHORIZED, "غير مسجل الدخول.")
        self.send_json({"ok": True, "admin": {"id": admin["id"], "username": admin["username"]}})

    def handle_admin_stats(self):
        if not self.require_admin():
            return
        with get_db() as db:
            lead_total = db.execute("SELECT COUNT(*) AS count FROM leads").fetchone()["count"]
            lead_new = db.execute("SELECT COUNT(*) AS count FROM leads WHERE status = 'new'").fetchone()["count"]
            event_total = db.execute("SELECT COUNT(*) AS count FROM events").fetchone()["count"]
            event_published = db.execute("SELECT COUNT(*) AS count FROM events WHERE published = 1").fetchone()["count"]
        self.send_json(
            {
                "ok": True,
                "stats": {
                    "leadTotal": lead_total,
                    "leadNew": lead_new,
                    "eventTotal": event_total,
                    "eventPublished": event_published,
                },
            }
        )

    def handle_admin_leads(self):
        if not self.require_admin():
            return
        with get_db() as db:
            rows = db.execute("SELECT * FROM leads ORDER BY id DESC LIMIT 300").fetchall()
        self.send_json({"ok": True, "leads": [lead_to_dict(row) for row in rows]})

    def handle_update_lead(self, lead_id):
        if not self.require_admin():
            return
        if lead_id <= 0:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "رقم الطلب غير صحيح.")
        try:
            data = self.read_json()
        except Exception:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "صيغة البيانات غير صحيحة.")
        status = str(data.get("status", "")).strip()
        admin_notes = str(data.get("adminNotes") or data.get("admin_notes") or "").strip()
        if status and status not in LEAD_STATUSES:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "حالة الطلب غير صحيحة.")
        with get_db() as db:
            existing = db.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
            if not existing:
                return self.send_error_json(HTTPStatus.NOT_FOUND, "الطلب غير موجود.")
            db.execute(
                "UPDATE leads SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?",
                (status or existing["status"], admin_notes[:1200], now_iso(), lead_id),
            )
            updated = db.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
        self.send_json({"ok": True, "lead": lead_to_dict(updated)})

    def handle_admin_events(self):
        if not self.require_admin():
            return
        with get_db() as db:
            rows = db.execute("SELECT * FROM events ORDER BY sort_order ASC, id DESC").fetchall()
            events = []
            for row in rows:
                gallery_rows = db.execute(
                    "SELECT id, image_path, alt_text, sort_order FROM event_images WHERE event_id = ? ORDER BY sort_order ASC, id ASC",
                    (row["id"],),
                ).fetchall()
                gallery = [
                    {"id": image["id"], "imagePath": image["image_path"], "altText": image["alt_text"] or ""}
                    for image in gallery_rows
                ]
                events.append(event_to_dict(row, gallery))
        self.send_json({"ok": True, "events": events})

    def handle_create_event(self):
        if not self.require_admin():
            return
        try:
            data = normalize_event_payload(self.read_json())
        except ValueError as error:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, str(error))
        except Exception:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "صيغة البيانات غير صحيحة.")
        created_at = now_iso()
        with get_db() as db:
            cursor = db.execute(
                """
                INSERT INTO events
                (title, category, location, event_date, description, highlights, cover_image, published, sort_order, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    data["title"],
                    data["category"],
                    data["location"],
                    data["event_date"],
                    data["description"],
                    data["highlights"],
                    data["cover_image"],
                    data["published"],
                    data["sort_order"],
                    created_at,
                    created_at,
                ),
            )
            event_id = cursor.lastrowid
            self.insert_gallery_images(db, event_id, data["gallery_images"])
            event = db.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
        self.send_json({"ok": True, "event": event_to_dict(event)}, status=HTTPStatus.CREATED)

    def handle_update_event(self, event_id):
        if not self.require_admin():
            return
        if event_id <= 0:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "رقم الفعالية غير صحيح.")
        try:
            data = normalize_event_payload(self.read_json())
        except ValueError as error:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, str(error))
        except Exception:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "صيغة البيانات غير صحيحة.")
        with get_db() as db:
            existing = db.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
            if not existing:
                return self.send_error_json(HTTPStatus.NOT_FOUND, "الفعالية غير موجودة.")
            db.execute(
                """
                UPDATE events
                SET title = ?, category = ?, location = ?, event_date = ?, description = ?,
                    highlights = ?, cover_image = ?, published = ?, sort_order = ?, updated_at = ?
                WHERE id = ?
                """,
                (
                    data["title"],
                    data["category"],
                    data["location"],
                    data["event_date"],
                    data["description"],
                    data["highlights"],
                    data["cover_image"],
                    data["published"],
                    data["sort_order"],
                    now_iso(),
                    event_id,
                ),
            )
            self.insert_gallery_images(db, event_id, data["gallery_images"])
            updated = db.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
        self.send_json({"ok": True, "event": event_to_dict(updated)})

    def handle_delete_event(self, event_id):
        if not self.require_admin():
            return
        if event_id <= 0:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "رقم الفعالية غير صحيح.")
        with get_db() as db:
            cursor = db.execute("DELETE FROM events WHERE id = ?", (event_id,))
            if cursor.rowcount == 0:
                return self.send_error_json(HTTPStatus.NOT_FOUND, "الفعالية غير موجودة.")
        self.send_json({"ok": True})

    def handle_delete_event_image(self, image_id):
        if not self.require_admin():
            return
        if image_id <= 0:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "رقم الصورة غير صحيح.")
        with get_db() as db:
            cursor = db.execute("DELETE FROM event_images WHERE id = ?", (image_id,))
            if cursor.rowcount == 0:
                return self.send_error_json(HTTPStatus.NOT_FOUND, "الصورة غير موجودة.")
        self.send_json({"ok": True})

    def insert_gallery_images(self, db, event_id, image_paths):
        if not image_paths:
            return
        current_count = db.execute(
            "SELECT COUNT(*) AS count FROM event_images WHERE event_id = ?",
            (event_id,),
        ).fetchone()["count"]
        for index, image_path in enumerate(image_paths):
            db.execute(
                """
                INSERT INTO event_images (event_id, image_path, alt_text, sort_order, created_at)
                VALUES (?, ?, '', ?, ?)
                """,
                (event_id, image_path, current_count + index + 1, now_iso()),
            )

    def handle_admin_uploads(self):
        if not self.require_admin():
            return
        length = safe_int(self.headers.get("Content-Length"), 0)
        if length <= 0:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "لم يتم إرسال ملفات.")
        if length > MAX_UPLOAD_BYTES:
            return self.send_error_json(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, "حجم الصور كبير جدًا.")

        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "نوع الرفع غير صحيح.")

        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={"REQUEST_METHOD": "POST", "CONTENT_TYPE": content_type},
        )
        fields = []
        for key in ("files", "file", "images", "cover"):
            if key in form:
                value = form[key]
                fields.extend(value if isinstance(value, list) else [value])
        saved_files = []
        for item in fields:
            if not getattr(item, "filename", ""):
                continue
            extension = Path(item.filename).suffix.lower()
            if extension not in ALLOWED_UPLOAD_EXTENSIONS:
                return self.send_error_json(HTTPStatus.BAD_REQUEST, "يسمح برفع صور JPG أو PNG أو WEBP أو GIF فقط.")
            if not validate_image_signature(item.file, extension):
                return self.send_error_json(HTTPStatus.BAD_REQUEST, "ملف الصورة غير صالح.")
            filename = f"{int(time.time())}-{uuid4().hex}{extension}"
            destination = UPLOADS_DIR / filename
            with destination.open("wb") as output:
                shutil.copyfileobj(item.file, output)
            saved_files.append(
                {
                    "path": f"uploads/events/{filename}",
                    "name": filename,
                }
            )
        if not saved_files:
            return self.send_error_json(HTTPStatus.BAD_REQUEST, "لم يتم العثور على صور صالحة.")
        self.send_json({"ok": True, "files": saved_files}, status=HTTPStatus.CREATED)


def run():
    init_db()
    clean_sessions()
    port = safe_int(os.environ.get("PORT") or (sys.argv[1] if len(sys.argv) > 1 else 4174), 4174)
    server = ThreadingHTTPServer(("127.0.0.1", port), MuheebHandler)
    print(f"Muheeb site running at http://127.0.0.1:{port}/")
    print("Admin panel: http://127.0.0.1:%s/admin.html" % port)
    server.serve_forever()


if __name__ == "__main__":
    run()
