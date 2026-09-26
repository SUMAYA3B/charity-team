# فريق الخيري — منصة التبرعات

منصة خيرية متكاملة لجمع التبرعات وإدارة الحالات الخيرية والفعاليات والأخبار،
مع لوحة تحكم إدارية، وتسجيل المتطوعين، ودفع إلكتروني عبر بوابة ثواني (Thawani).

> مشروع خيري مبني على Laravel (API) + React (واجهة أمامية).

---

## التقنيات المستخدمة

### الواجهة الخلفية (Backend)
| التقنية | الاستخدام |
|---------|-----------|
| Laravel 12 | إطار العمل الرئيسي — بناء الـ REST API |
| PHP ^8.2 | لغة البرمجة |
| MySQL | قاعدة البيانات |
| Laravel Sanctum | المصادقة عبر التوكنات (Tokens) |

### الواجهة الأمامية (Frontend)
| التقنية | الاستخدام |
|---------|-----------|
| React 18 | بناء واجهة المستخدم |
| Vite 5 | أداة البناء والتطوير |
| React Router v6 | التوجيه (Routing) |
| Bootstrap 5 + Bootstrap Icons | التصميم والأيقونات |
| Sass | معالج الأنماط |

### الدفع الإلكتروني
| الخدمة | الاستخدام |
|--------|-----------|
| Thawani | بوابة الدفع (وضع التجربة Sandbox) |

---

## الميزات الرئيسية

- عام: الصفحة الرئيسية، من نحن، حالات التبرع، التبرع، الأخبار، الفعاليات.
- التبرع: تبرع لحالة معيّنة + الدفع عبر ثواني + صفحات نجاح/إلغاء الدفع.
- تسجيل المتطوعين: استمارة عامة لحفظ طلبات التطوع.
- لوحة التحكم: إدارة الحالات، الأخبار، الفعاليات، التبرعات، رسائل التواصل، وسجل المتطوعين.

---

## هيكل المشروع

```
charity-team/
├── app/                 # كود Laravel (Controllers, Models, Requests, Resources, Services)
├── config/              # إعدادات Laravel
├── database/
│   ├── migrations/      # جداول قاعدة البيانات
│   └── seeders/         # بيانات افتراضية (المدير، الإعدادات، محتوى تجريبي)
├── frontend/            # تطبيق React + Vite
│   └── src/
│       ├── api/         # طبقة الاتصال بالـ Backend
│       ├── components/  # مكوّنات قابلة لإعادة الاستخدام
│       ├── layouts/     # (PublicLayout, AdminLayout)
│       └── pages/       # صفحات عامة + لوحة التحكم
├── routes/api.php       # مسارات الـ API
└── .env                 # المتغيرات البيئية (لا تُرفع إلى Git)
```

---

## متطلبات التشغيل

- PHP >= 8.2
- Composer
- Node.js >= 18 مع npm
- MySQL >= 8

---

## خطوات التشغيل

### 1) اعتماديات الـ Backend
```bash
composer install
```

### 2) إعداد البيئة
```bash
cp .env.example .env       # Windows: copy .env.example .env
```
عدّل بيانات قاعدة البيانات في .env ثم:
```bash
php artisan key:generate
```

### 3) إنشاء الجداول + بيانات تجريبية
```bash
php artisan migrate --seed
php artisan storage:link
```
> السيدرات: AdminUserSeeder (حساب المدير)، SiteSettingSeeder (إعدادات الموقع)،
> وSiteContentSeeder (محتوى تجريبي — يُشغَّل في البيئة المحلية فقط).

### 4) اعتماديات الـ Frontend
```bash
cd frontend
npm install
```

### 5) تشغيل الخوادم (نافذتان منفصلتان)

Backend:
```bash
php artisan serve
```
> http://127.0.0.1:8000 — نقاط الـ API أساسها /api/v1

Frontend:
```bash
cd frontend
npm run dev
```
> http://localhost:3000

---

## الدخول إلى لوحة التحكم

افتح: http://localhost:3000/admin/login

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|-------------------|-------------|
| مدير النظام | admin@donation.test | password123 |

> غيّر بيانات الدخول الافتراضية عبر ADMIN_EMAIL و ADMIN_PASSWORD في .env.

---

## ملفات مستبعدة (لا تُرفع إلى Git)

- .env (يحتوي الأسرار) — يُستبدَل بـ .env.example
- vendor/ و node_modules/
- أي ملفات .sql أو تفريغات قواعد بيانات قد تحتوي بيانات حقيقية
- مفاتيح الدفع (Thawani) وأي API keys

---

ترخيص المشروع: MIT
