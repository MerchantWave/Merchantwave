import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, AudioLines,
  BarChart3, Bell, BookOpen, Check, ChevronDown, CircleHelp, Clock3, Download,
  FileAudio2, Globe2, Headphones, Landmark, LayoutDashboard, LocateFixed,
  LockKeyhole, LogIn, MapPin, Menu, MessageCircle, Mic, Moon, MoreHorizontal, Navigation,
  Plus, Search, Send, ShieldCheck, ShoppingBag, Sparkles, Sun, TrendingDown,
  TrendingUp, Users, Wallet, X, Zap,
} from "lucide-react";
import { counties, initialTransactions, merchants, type Merchant, type Transaction, type TransactionKind } from "./data";

type View = "home" | "dashboard" | "network" | "ledger" | "intelligence" | "admin";
type Language = "en" | "fr" | "pt" | "es" | "ar" | "zh" | "hi" | "sw";
type Message = { role: "assistant" | "user"; text: string };

const copy: Record<Language, Record<string, string>> = {
  en: { overview: "Overview", network: "Merchant network", ledger: "My ledger", intelligence: "Intelligence", admin: "Admin hub", search: "Search anything...", workspace: "Open demo workspace", income: "Income", expenses: "Expenses", balance: "Available balance", addEntry: "Add an entry", seeLedger: "See all activity", welcome: "Good morning, Mary", subtitle: "Here's what's happening with your business today.", insights: "Your business at a glance", recent: "Recent activity", viewAll: "View all", activeMerchants: "Active merchants", todaySales: "Today's sales", cashFlow: "Cash flow", networkTitle: "Find your people", networkSub: "Explore the merchant community across Liberia.", ledgerTitle: "Your money, in one place", intelligenceTitle: "Small signals. Smarter decisions.", adminTitle: "A clearer view of the network", language: "Language", demo: "Demo mode", route: "Get directions", analyze: "Analyze activity" },
  fr: { overview: "Aperçu", network: "Réseau marchand", ledger: "Mon registre", intelligence: "Intelligence", admin: "Centre admin", search: "Rechercher...", workspace: "Ouvrir la démo", income: "Revenus", expenses: "Dépenses", balance: "Solde disponible", addEntry: "Ajouter une entrée", seeLedger: "Voir l'activité", welcome: "Bonjour, Mary", subtitle: "Voici l'activité de votre entreprise aujourd'hui.", insights: "Votre entreprise en bref", recent: "Activité récente", viewAll: "Tout voir", activeMerchants: "Commerçants actifs", todaySales: "Ventes du jour", cashFlow: "Flux de trésorerie", networkTitle: "Trouvez votre réseau", networkSub: "Explorez la communauté marchande du Liberia.", ledgerTitle: "Votre argent, au même endroit", intelligenceTitle: "Petits signaux. Meilleures décisions.", adminTitle: "Une vue claire du réseau", language: "Langue", demo: "Mode démo", route: "Itinéraire", analyze: "Analyser l'activité" },
  pt: { overview: "Visão geral", network: "Rede de comerciantes", ledger: "Meu livro-caixa", intelligence: "Inteligência", admin: "Central admin", search: "Pesquisar...", workspace: "Abrir demonstração", income: "Receita", expenses: "Despesas", balance: "Saldo disponível", addEntry: "Adicionar registro", seeLedger: "Ver atividades", welcome: "Bom dia, Mary", subtitle: "Veja o que acontece no seu negócio hoje.", insights: "Seu negócio em resumo", recent: "Atividade recente", viewAll: "Ver tudo", activeMerchants: "Comerciantes ativos", todaySales: "Vendas de hoje", cashFlow: "Fluxo de caixa", networkTitle: "Encontre sua comunidade", networkSub: "Explore a rede de comerciantes da Libéria.", ledgerTitle: "Seu dinheiro em um só lugar", intelligenceTitle: "Pequenos sinais. Decisões melhores.", adminTitle: "Uma visão clara da rede", language: "Idioma", demo: "Modo demonstração", route: "Como chegar", analyze: "Analisar atividade" },
  es: { overview: "Resumen", network: "Red de comerciantes", ledger: "Mi libro", intelligence: "Inteligencia", admin: "Centro admin", search: "Buscar...", workspace: "Abrir demostración", income: "Ingresos", expenses: "Gastos", balance: "Saldo disponible", addEntry: "Añadir registro", seeLedger: "Ver actividad", welcome: "Buenos días, Mary", subtitle: "Esto es lo que sucede hoy en tu negocio.", insights: "Tu negocio de un vistazo", recent: "Actividad reciente", viewAll: "Ver todo", activeMerchants: "Comerciantes activos", todaySales: "Ventas de hoy", cashFlow: "Flujo de caja", networkTitle: "Encuentra a tu gente", networkSub: "Explora la comunidad comercial de Liberia.", ledgerTitle: "Tu dinero, en un solo lugar", intelligenceTitle: "Pequeñas señales. Mejores decisiones.", adminTitle: "Una vista más clara de la red", language: "Idioma", demo: "Modo demo", route: "Cómo llegar", analyze: "Analizar actividad" },
  ar: { overview: "نظرة عامة", network: "شبكة التجار", ledger: "دفتر حساباتي", intelligence: "التحليلات", admin: "مركز الإدارة", search: "ابحث هنا...", workspace: "افتح النسخة التجريبية", income: "الدخل", expenses: "المصروفات", balance: "الرصيد المتاح", addEntry: "أضف معاملة", seeLedger: "عرض النشاط", welcome: "صباح الخير يا ماري", subtitle: "إليك ما يحدث في نشاطك التجاري اليوم.", insights: "نشاطك التجاري في لمحة", recent: "النشاط الأخير", viewAll: "عرض الكل", activeMerchants: "التجار النشطون", todaySales: "مبيعات اليوم", cashFlow: "التدفق النقدي", networkTitle: "اعثر على مجتمعك", networkSub: "استكشف شبكة التجار في ليبيريا.", ledgerTitle: "أموالك في مكان واحد", intelligenceTitle: "إشارات صغيرة. قرارات أذكى.", adminTitle: "رؤية أوضح للشبكة", language: "اللغة", demo: "وضع تجريبي", route: "الاتجاهات", analyze: "تحليل النشاط" },
  zh: { overview: "概览", network: "商户网络", ledger: "我的账本", intelligence: "智能分析", admin: "管理中心", search: "搜索...", workspace: "打开演示工作区", income: "收入", expenses: "支出", balance: "可用余额", addEntry: "添加记录", seeLedger: "查看全部", welcome: "早上好，Mary", subtitle: "这是您今天的业务情况。", insights: "业务一览", recent: "近期活动", viewAll: "查看全部", activeMerchants: "活跃商户", todaySales: "今日销售额", cashFlow: "现金流", networkTitle: "找到您的伙伴", networkSub: "探索利比里亚商户社区。", ledgerTitle: "一站式管理资金", intelligenceTitle: "捕捉信号，做出明智决策。", adminTitle: "清晰了解网络状况", language: "语言", demo: "演示模式", route: "路线导航", analyze: "分析活动" },
  hi: { overview: "अवलोकन", network: "व्यापारी नेटवर्क", ledger: "मेरा बहीखाता", intelligence: "बुद्धिमत्ता", admin: "एडमिन केंद्र", search: "खोजें...", workspace: "डेमो खोलें", income: "आय", expenses: "खर्च", balance: "उपलब्ध शेष", addEntry: "प्रविष्टि जोड़ें", seeLedger: "सभी गतिविधि", welcome: "सुप्रभात, Mary", subtitle: "आज आपके व्यवसाय में क्या हो रहा है।", insights: "आपका व्यवसाय एक नज़र में", recent: "हाल की गतिविधि", viewAll: "सभी देखें", activeMerchants: "सक्रिय व्यापारी", todaySales: "आज की बिक्री", cashFlow: "नकदी प्रवाह", networkTitle: "अपना समुदाय खोजें", networkSub: "लाइबेरिया के व्यापारी समुदाय को देखें।", ledgerTitle: "आपका पैसा, एक जगह", intelligenceTitle: "छोटे संकेत। बेहतर निर्णय।", adminTitle: "नेटवर्क की स्पष्ट तस्वीर", language: "भाषा", demo: "डेमो मोड", route: "दिशा-निर्देश", analyze: "गतिविधि का विश्लेषण" },
  sw: { overview: "Muhtasari", network: "Mtandao wa wafanyabiashara", ledger: "Daftari langu", intelligence: "Maarifa", admin: "Kituo cha msimamizi", search: "Tafuta...", workspace: "Fungua onyesho", income: "Mapato", expenses: "Matumizi", balance: "Salio linalopatikana", addEntry: "Ongeza rekodi", seeLedger: "Tazama shughuli", welcome: "Habari za asubuhi, Mary", subtitle: "Hivi ndivyo biashara yako ilivyo leo.", insights: "Biashara yako kwa muhtasari", recent: "Shughuli za hivi karibuni", viewAll: "Tazama zote", activeMerchants: "Wafanyabiashara hai", todaySales: "Mauzo ya leo", cashFlow: "Mtiririko wa pesa", networkTitle: "Pata jumuiya yako", networkSub: "Chunguza jumuiya ya wafanyabiashara Liberia.", ledgerTitle: "Pesa zako, sehemu moja", intelligenceTitle: "Ishara ndogo. Maamuzi bora.", adminTitle: "Muonekano wazi wa mtandao", language: "Lugha", demo: "Hali ya onyesho", route: "Maelekezo", analyze: "Changanua shughuli" },
};

const navItems: { id: Exclude<View, "home">; icon: typeof LayoutDashboard; key: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, key: "overview" },
  { id: "network", icon: MapPin, key: "network" },
  { id: "ledger", icon: BookOpen, key: "ledger" },
  { id: "intelligence", icon: Sparkles, key: "intelligence" },
  { id: "admin", icon: Landmark, key: "admin" },
];

const money = (amount: number) => `L$${Math.abs(amount).toLocaleString("en-LR", { maximumFractionDigits: 0 })}`;
const signedMoney = (amount: number) => `${amount < 0 ? "−" : "+"}${money(amount)}`;
const dateLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("en-LR", { day: "numeric", month: "short" });
const isTransaction = (item: unknown): item is Transaction => {
  if (!item || typeof item !== "object") return false;
  const transaction = item as Record<string, unknown>;
  return typeof transaction.id === "string" && typeof transaction.description === "string" &&
    typeof transaction.category === "string" && typeof transaction.amount === "number" &&
    ["Sale", "Expense", "Cash in", "Cash out"].includes(String(transaction.kind)) &&
    typeof transaction.date === "string" && typeof transaction.channel === "string";
};

function loadTransactions(): { transactions: Transaction[]; warning: string } {
  try {
    const value = localStorage.getItem("merchantwave.transactions");
    if (!value) return { transactions: initialTransactions, warning: "" };
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every(isTransaction)) return { transactions: parsed, warning: "" };
    return { transactions: initialTransactions, warning: "Saved demo ledger data could not be read. Showing fresh sample records instead." };
  } catch (error) {
    return {
      transactions: initialTransactions,
      warning: error instanceof Error && error.name === "SecurityError"
        ? "Browser storage is blocked. Demo entries will not persist after you leave this page."
        : "Saved demo ledger data could not be read. Showing fresh sample records instead.",
    };
  }
}

function App() {
  const [view, setView] = useState<View>("home");
  const [initialData] = useState(loadTransactions);
  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
  const [storageWarning, setStorageWarning] = useState(initialData.warning);
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("merchantwave.language");
      return saved && saved in copy ? saved as Language : "en";
    } catch { return "en"; }
  });
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("merchantwave.theme") === "dark"; }
    catch { return false; }
  });
  const [loginOpen, setLoginOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const initialTransactionSave = useRef(true);
  const t = copy[language];
  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    if (initialTransactionSave.current) {
      initialTransactionSave.current = false;
      if (initialData.warning) return;
    }
    try { localStorage.setItem("merchantwave.transactions", JSON.stringify(transactions)); }
    catch { setStorageWarning("Browser storage is unavailable or full. Demo entries will not persist after you leave this page."); }
  }, [initialData.warning, transactions]);
  useEffect(() => {
    try { localStorage.setItem("merchantwave.language", language); }
    catch { setStorageWarning("Browser storage is unavailable or full. Preferences will not persist after you leave this page."); }
  }, [language]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try { localStorage.setItem("merchantwave.theme", dark ? "dark" : "light"); }
    catch { setStorageWarning("Browser storage is unavailable or full. Preferences will not persist after you leave this page."); }
  }, [dark]);

  const navigate = (target: View) => { setView(target); setMobileNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    setTransactions((current) => [{ ...transaction, id: `mw-${Date.now()}` }, ...current]);
    setEntryOpen(false);
    setNotice("Entry saved to this browser's demo ledger.");
    window.setTimeout(() => setNotice(""), 3600);
  };

  return (
    <div className="app-root" dir={dir}>
      {view === "home" ? (
        <MarketingPage onOpen={() => navigate("dashboard")} onSignIn={() => setLoginOpen(true)} onPrivacy={() => setPrivacyOpen(true)} language={language} onLanguage={setLanguage} dark={dark} onTheme={() => setDark(!dark)} />
      ) : (
        <Workspace
          view={view}
          onNavigate={navigate}
          transactions={transactions}
          onAdd={() => setEntryOpen(true)}
          language={language}
          onLanguage={setLanguage}
          dark={dark}
          onTheme={() => setDark(!dark)}
          t={t}
          mobileNavOpen={mobileNavOpen}
          onMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
          onHome={() => navigate("home")}
          storageWarning={storageWarning}
        />
      )}
      {notice && <div className="toast" role="status"><Check size={16} />{notice}</div>}
      {view === "home" && storageWarning && <div className="storage-warning" role="status"><ShieldCheck size={15} />{storageWarning}</div>}
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onContinue={() => { setLoginOpen(false); navigate("dashboard"); }} />}
      {entryOpen && <EntryModal onClose={() => setEntryOpen(false)} onSave={addTransaction} />}
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </div>
  );
}

function MarketingPage({ onOpen, onSignIn, onPrivacy, language, onLanguage, dark, onTheme }: {
  onOpen: () => void; onSignIn: () => void; onPrivacy: () => void; language: Language; onLanguage: (value: Language) => void; dark: boolean; onTheme: () => void;
}) {
  return (
    <main className="marketing">
      <header className="marketing-header">
        <Brand onClick={onOpen} />
        <nav className="marketing-nav" aria-label="Main navigation">
          <a href="#features">Why MerchantWave</a><a href="#how-it-works">For Liberia</a>
        </nav>
        <div className="header-actions">
          <LanguageSelect value={language} onChange={onLanguage} />
          <button className="icon-button theme-toggle" onClick={onTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="text-button sign-in" onClick={onSignIn}>Sign in</button>
          <button className="button button-dark header-cta" onClick={onOpen}>Open demo <ArrowRight size={16} /></button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <div className="eyebrow"><span className="eyebrow-dot" /> ORANGE SUMMER CHALLENGE <span className="eyebrow-divider">/</span> ODC LIBERIA</div>
          <h1>Your business.<br /><span>Your next move.</span></h1>
          <p className="hero-description">A simple money ledger and merchant network, made for the people building Liberia's local economy.</p>
          <div className="hero-actions">
            <button className="button button-primary button-large" onClick={onOpen}>Explore the demo <ArrowUpRight size={17} /></button>
            <a className="hero-secondary" href="#features"><span className="play-ring"><ArrowRight size={13} /></span> See what you can do</a>
          </div>
          <div className="hero-proof"><div className="proof-faces"><span>MK</span><span>JD</span><span>FK</span><span>+</span></div><span>Built with Liberia's merchant community in mind</span></div>
        </div>
        <div className="hero-visual" aria-label="MerchantWave finance dashboard preview">
          <div className="visual-glow" />
          <div className="hero-card">
            <div className="preview-top"><div className="preview-brand"><span className="brand-mark small"><Activity size={16} /></span><b>merchantwave</b></div><span className="online-pill"><i /> Live overview</span></div>
            <div className="preview-label">YOUR BALANCE <span>•••</span></div>
            <div className="preview-balance">L$25,650<span>.00</span></div>
            <div className="preview-growth"><span><TrendingUp size={13} /> 18.4%</span><span>vs. last month</span></div>
            <div className="preview-chart" aria-label="Illustrative income trend">
              {[34, 46, 39, 59, 51, 70, 58, 78, 65, 88, 75, 100, 88, 107, 94, 120, 108, 136, 123, 148, 132, 163, 151, 178].map((height, i) => <span key={i} style={{ height: `${height}px` }} />)}
            </div>
            <div className="preview-chart-labels"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>TODAY</span></div>
            <div className="preview-transactions">
              <div className="preview-transaction"><span className="transaction-icon positive"><ArrowDownLeft size={15} /></span><span><b>Market sales</b><small>Today, 10:42 am</small></span><strong>+ L$8,450</strong></div>
              <div className="preview-transaction"><span className="transaction-icon negative"><ShoppingBag size={15} /></span><span><b>Stock purchase</b><small>Today, 9:18 am</small></span><strong>− L$2,100</strong></div>
            </div>
          </div>
          <div className="floating-chip chip-map"><span><MapPin size={17} /></span><div><b>160+ merchants</b><small>Across Liberia</small></div></div>
          <div className="floating-chip chip-insight"><span><Sparkles size={17} /></span><div><b>A little insight</b><small>Sales are up this week</small></div><ArrowUpRight size={15} /></div>
          <div className="visual-caption"><span /> A clearer picture, every day.</div>
        </div>
        <div className="hero-bottom"><div><b>01</b><span>Keep your books<br />beautifully simple</span></div><div><b>02</b><span>Find your merchant<br />community</span></div><div><b>03</b><span>Make your next move<br />with confidence</span></div></div>
      </section>

      <section className="trust-strip">
        <span className="trust-label">DESIGNED FOR REAL, EVERYDAY COMMERCE</span>
        <div className="trust-logos"><span><ShoppingBag size={15} /> Neighborhood shops</span><span><Wallet size={16} /> Market traders</span><span><MessageCircle size={16} /> Mobile money</span><span><Globe2 size={16} /> Liberia-wide</span></div>
      </section>

      <section className="features-section" id="features">
        <div className="section-intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> MADE FOR THE WAY YOU WORK</div>
          <h2>Less guesswork.<br /><span>More good business.</span></h2>
          <p>Everything you need to feel closer to your numbers and your merchant community, without the complicated stuff.</p>
        </div>
        <div className="feature-grid">
          <FeatureCard icon={Wallet} number="01" title="A ledger that feels easy" description="Keep sales, expenses, and Orange Money activity together. Your balance moves as you do." tone="orange" />
          <FeatureCard icon={MapPin} number="02" title="Your local network" description="Discover merchants by county, find a nearby supplier, and map a route when Maps is connected." tone="green" />
          <FeatureCard icon={Sparkles} number="03" title="Insights with context" description="Spot quiet days, understand cash flow, and ask plain-language questions about your records." tone="purple" />
          <FeatureCard icon={AudioLines} number="04" title="Speak it, capture it" description="Use voice input or connect a private AI gateway for WAV transcription—never a secret key in your browser." tone="blue" />
          <FeatureCard icon={Activity} number="05" title="A wider view" description="A county-by-county snapshot helps teams see where merchant activity is growing or going quiet." tone="yellow" />
          <FeatureCard icon={ShieldCheck} number="06" title="Your data, with care" description="This demo stays in your browser. A real account system belongs on a secured backend, not in a prototype." tone="teal" />
        </div>
      </section>

      <section className="cta-section" id="how-it-works">
        <div className="cta-decoration"><span /><span /><span /></div>
        <div className="cta-copy"><div className="eyebrow light"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</div><h2>Make room for<br />what's next.</h2><p>One simple place to see where your business stands—and where it can go.</p><button className="button button-white button-large" onClick={onOpen}>Explore the demo <ArrowRight size={17} /></button></div>
        <div className="cta-stats"><div><span>01</span><b>Keep track</b><small>Sales, expenses, cash-in and cash-out.</small></div><div><span>02</span><b>Stay connected</b><small>Discover the merchant community around you.</small></div><div><span>03</span><b>See the signal</b><small>Find the next useful action in your numbers.</small></div></div>
      </section>

      <footer className="marketing-footer"><Brand onClick={onOpen} /><span>MerchantWave — a merchant finance companion for Liberia.</span><div><button className="text-button" onClick={onPrivacy}>Privacy & data</button><button className="text-button" onClick={onSignIn}>Demo sign in</button><small>© 2026 MerchantWave</small></div></footer>
    </main>
  );
}

function FeatureCard({ icon: Icon, number, title, description, tone }: { icon: typeof Wallet; number: string; title: string; description: string; tone: string }) {
  return <article className="feature-card"><div className={`feature-icon ${tone}`}><Icon size={21} /></div><span className="feature-number">{number}</span><h3>{title}</h3><p>{description}</p><ArrowUpRight className="feature-arrow" size={17} /></article>;
}

function Brand({ onClick }: { onClick: () => void }) {
  return <button className="brand-lockup" onClick={onClick} aria-label="MerchantWave home"><span className="brand-mark"><Activity size={20} strokeWidth={2.4} /></span><span>merchant<span>wave</span></span></button>;
}

function LanguageSelect({ value, onChange }: { value: Language; onChange: (value: Language) => void }) {
  return <label className="language-select" aria-label="Language"><Globe2 size={15} /><select value={value} onChange={(event) => onChange(event.target.value as Language)}><option value="en">EN</option><option value="fr">FR</option><option value="pt">PT</option><option value="es">ES</option><option value="ar">AR</option><option value="zh">中文</option><option value="hi">हिन्दी</option><option value="sw">SW</option></select><ChevronDown size={13} /></label>;
}

function Workspace({ view, onNavigate, transactions, onAdd, language, onLanguage, dark, onTheme, t, mobileNavOpen, onMobileNav, onHome, storageWarning }: {
  view: Exclude<View, "home">; onNavigate: (view: View) => void; transactions: Transaction[]; onAdd: () => void; language: Language; onLanguage: (value: Language) => void; dark: boolean; onTheme: () => void; t: Record<string, string>; mobileNavOpen: boolean; onMobileNav: () => void; onHome: () => void; storageWarning: string;
}) {
  return (
    <div className="workspace">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand"><Brand onClick={onHome} /><button className="mobile-close icon-button" onClick={onMobileNav} aria-label="Close navigation"><X size={18} /></button></div>
        <div className="workspace-switch"><span className="workspace-avatar">MK</span><span><b>Mary's Provisions</b><small>Monrovia, Liberia</small></span><MoreHorizontal size={17} /></div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Workspace navigation">
          {navItems.map(({ id, icon: Icon, key }) => <button key={id} className={`nav-item ${view === id ? "active" : ""}`} onClick={() => onNavigate(id)}><Icon size={18} /><span>{t[key]}</span>{id === "intelligence" && <span className="nav-dot" />}</button>)}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-card"><div className="sidebar-card-icon"><Zap size={16} /></div><b>Good things grow from here.</b><p>Keep your books close and your community closer.</p><button onClick={() => onNavigate("intelligence")}>Explore your insights <ArrowRight size={14} /></button></div>
        <div className="sidebar-footer"><span className="demo-indicator"><i /> {t.demo}</span><button className="sidebar-help" onClick={onHome}><CircleHelp size={16} /> About MerchantWave</button></div>
      </aside>
      {mobileNavOpen && <button className="sidebar-scrim" onClick={onMobileNav} aria-label="Close menu" />}
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu" onClick={onMobileNav} aria-label="Open navigation"><Menu size={19} /></button><div className="breadcrumb"><span>Workspace</span><span>/</span><b>{t[view === "dashboard" ? "overview" : view]}</b></div></div>
          <div className="topbar-right">
            <label className="global-search"><Search size={15} /><input placeholder={t.search} onKeyDown={(event) => { if (event.key === "Enter") onNavigate("network"); }} /><kbd>⌘ K</kbd></label>
            <button className="icon-button notification-button" aria-label="Notifications" title="No new notifications"><Bell size={17} /><i /></button>
            <span className="topbar-divider" />
            <LanguageSelect value={language} onChange={onLanguage} />
            <button className="icon-button theme-toggle" onClick={onTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
            <button className="profile-button" title="Demo profile">MK</button>
          </div>
        </header>
        {storageWarning && <div className="storage-warning" role="status"><ShieldCheck size={15} />{storageWarning}</div>}
        <div className="page-content">
          {view === "dashboard" && <Dashboard transactions={transactions} onAdd={onAdd} onNavigate={onNavigate} t={t} />}
          {view === "network" && <NetworkPage onNavigate={onNavigate} t={t} />}
          {view === "ledger" && <LedgerPage transactions={transactions} onAdd={onAdd} t={t} />}
          {view === "intelligence" && <IntelligencePage transactions={transactions} t={t} />}
          {view === "admin" && <AdminPage t={t} />}
        </div>
        <footer className="workspace-footer"><span>MerchantWave <i>·</i> Orange Summer Challenge / ODC Liberia</span><span>Demo data only <i>·</i> Saved on this device</span></footer>
      </main>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="page-eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="page-heading-action">{action}</div>}</div>;
}

function Dashboard({ transactions, onAdd, onNavigate, t }: { transactions: Transaction[]; onAdd: () => void; onNavigate: (view: View) => void; t: Record<string, string> }) {
  const dateHeading = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase();
  const income = transactions.filter((item) => item.kind === "Sale" || item.kind === "Cash in").reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions.filter((item) => item.kind === "Expense" || item.kind === "Cash out").reduce((sum, item) => sum + item.amount, 0);
  const today = new Date().toISOString().slice(0, 10);
  const todaySales = transactions.filter((item) => item.date === today && item.kind === "Sale").reduce((sum, item) => sum + item.amount, 0);
  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const value = transactions.filter((item) => item.date === key && item.kind === "Sale").reduce((sum, item) => sum + item.amount, 0);
    return { label: date.toLocaleDateString("en-LR", { weekday: "short" }).slice(0, 2), value, today: key === today };
  });
  const max = Math.max(...daily.map((entry) => entry.value), 1);
  return (
    <div className="dashboard-page">
      <PageHeader eyebrow={`${dateHeading} · MONROVIA`} title={t.welcome} description={t.subtitle} action={<button className="button button-primary" onClick={onAdd}><Plus size={16} /> {t.addEntry}</button>} />
      <div className="dashboard-feature-grid">
        <section className="balance-card">
          <div className="balance-top"><span className="balance-label"><Wallet size={15} /> {t.balance}</span><button aria-label="More balance options"><MoreHorizontal size={19} /></button></div>
          <div className="balance-amount">{money(25650 + income - expenses)}</div>
          <div className="balance-foot"><span className="balance-trend"><TrendingUp size={14} /> 18.4%</span><span>compared with last month</span><span className="balance-avatar">MK</span></div>
          <div className="balance-chart" aria-label="Weekly sales chart">{daily.map((entry, index) => <div className={`balance-bar ${entry.today ? "today" : ""}`} key={index} style={{ height: `${Math.max(12, entry.value / max * 100)}%` }} title={`${entry.label}: ${money(entry.value)}`} />)}</div>
          <div className="balance-chart-labels">{daily.map((entry, index) => <span key={index} className={entry.today ? "active" : ""}>{entry.label}</span>)}</div>
        </section>
        <section className="today-card">
          <div className="today-card-heading"><div><span className="muted-eyebrow">A QUICK LOOK</span><h3>Today's movement</h3></div><span className="today-icon"><Activity size={17} /></span></div>
          <div className="movement-item"><span className="movement-symbol income"><ArrowDownLeft size={17} /></span><span><b>{t.income}</b><small>{transactions.filter((item) => item.date === today && (item.kind === "Sale" || item.kind === "Cash in")).length} entries today</small></span><strong>{money(transactions.filter((item) => item.date === today && (item.kind === "Sale" || item.kind === "Cash in")).reduce((sum, item) => sum + item.amount, 0))}</strong></div>
          <div className="movement-item"><span className="movement-symbol expense"><ArrowUpRight size={17} /></span><span><b>{t.expenses}</b><small>{transactions.filter((item) => item.date === today && (item.kind === "Expense" || item.kind === "Cash out")).length} entries today</small></span><strong>{money(transactions.filter((item) => item.date === today && (item.kind === "Expense" || item.kind === "Cash out")).reduce((sum, item) => sum + item.amount, 0))}</strong></div>
          <div className="today-separator" /><div className="today-sales"><span><span className="sale-pulse" /> {t.todaySales}</span><b>{money(todaySales)}</b></div>
          <button className="inline-link" onClick={() => onNavigate("ledger")}>Open your ledger <ArrowRight size={14} /></button>
        </section>
      </div>
      <div className="section-heading-row"><div><div className="page-eyebrow">YOUR BUSINESS, IN CONTEXT</div><h2>{t.insights}</h2></div><button className="inline-link" onClick={() => onNavigate("intelligence")}>View all insights <ArrowRight size={14} /></button></div>
      <div className="metric-grid">
        <MetricCard icon={Users} label={t.activeMerchants} value="126" suffix="/ 160" helper="Across 15 counties" trend="+12 this month" tone="green" />
        <MetricCard icon={BarChart3} label="This week's sales" value={money(income)} helper="Sales & cash received" trend="+8.2%" tone="orange" />
        <MetricCard icon={TrendingDown} label="Largest cost" value="Inventory" helper="L$10,895 this month" trend="82% of expenses" tone="purple" />
        <MetricCard icon={Clock3} label="Needs a check-in" value="34" helper="Merchants quiet 7+ days" trend="View dormant list" tone="blue" clickable={() => onNavigate("intelligence")} />
      </div>
      <div className="content-grid">
        <section className="panel activity-panel">
          <div className="panel-heading"><div><h3>{t.recent}</h3><p>Your latest entries, all together.</p></div><button className="inline-link" onClick={() => onNavigate("ledger")}>{t.viewAll} <ArrowRight size={14} /></button></div>
          <TransactionTable transactions={transactions.slice(0, 5)} compact />
        </section>
        <section className="panel network-card">
          <div className="panel-heading"><div><h3>Your merchant network</h3><p>A community spanning Liberia.</p></div><span className="network-card-icon"><Globe2 size={18} /></span></div>
          <div className="network-count"><b>160</b><span>merchants<br />on the map</span></div>
          <div className="mini-network-map"><div className="mini-map-land"><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="map-location-pill"><MapPin size={13} /> Monrovia & beyond</div></div>
          <button className="inline-link" onClick={() => onNavigate("network")}>Explore merchant network <ArrowRight size={14} /></button>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, suffix, helper, trend, tone, clickable }: { icon: typeof Users; label: string; value: string; suffix?: string; helper: string; trend: string; tone: string; clickable?: () => void }) {
  const content = <><div className="metric-top"><span className={`metric-icon ${tone}`}><Icon size={17} /></span><span className="metric-label">{label}</span></div><div className="metric-value">{value}{suffix && <small>{suffix}</small>}</div><div className="metric-bottom"><span>{helper}</span><span className="metric-trend">{trend}</span></div></>;
  return clickable ? <button className="metric-card metric-clickable" onClick={clickable}>{content}</button> : <article className="metric-card">{content}</article>;
}

function TransactionTable({ transactions, compact = false }: { transactions: Transaction[]; compact?: boolean }) {
  if (!transactions.length) return <div className="empty-state"><BookOpen size={23} /><b>No entries match</b><span>Try another search or add a new entry.</span></div>;
  return <div className={`table-wrap ${compact ? "compact" : ""}`}><table><thead><tr><th>DESCRIPTION</th><th>DATE</th><th>TYPE</th><th>CHANNEL</th><th className="amount-column">AMOUNT</th></tr></thead><tbody>{transactions.map((item) => {
    const outgoing = item.kind === "Expense" || item.kind === "Cash out";
    return <tr key={item.id}><td><span className={`table-kind-icon ${outgoing ? "outgoing" : "incoming"}`}>{outgoing ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}</span><span className="description-cell"><b>{item.description}</b><small>{item.category}</small></span></td><td className="date-cell">{dateLabel(item.date)}</td><td><span className={`kind-badge ${outgoing ? "expense-badge" : "income-badge"}`}>{item.kind}</span></td><td className="channel-cell">{item.channel}</td><td className={`amount-cell ${outgoing ? "negative-amount" : "positive-amount"}`}>{outgoing ? "−" : "+"}{money(item.amount)}</td></tr>;
  })}</tbody></table></div>;
}

function LedgerPage({ transactions, onAdd, t }: { transactions: Transaction[]; onAdd: () => void; t: Record<string, string> }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All entries");
  const filtered = transactions.filter((item) =>
    (filter === "All entries" || item.kind === filter) &&
    `${item.description} ${item.category} ${item.channel}`.toLowerCase().includes(query.toLowerCase()),
  );
  const totalIncome = transactions.filter((item) => item.kind === "Sale" || item.kind === "Cash in").reduce((sum, item) => sum + item.amount, 0);
  const totalOut = transactions.filter((item) => item.kind === "Expense" || item.kind === "Cash out").reduce((sum, item) => sum + item.amount, 0);
  const exportCsv = () => {
    const rows = [["Date", "Description", "Category", "Type", "Channel", "Amount"], ...filtered.map((item) => [item.date, item.description, item.category, item.kind, item.channel, String(item.amount)])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "merchantwave-ledger.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  return (
    <div>
      <PageHeader eyebrow="YOUR FINANCIAL RECORDS" title={t.ledgerTitle} description="Sales, expenses, and cash movements—kept simple and up to date." action={<button className="button button-primary" onClick={onAdd}><Plus size={16} /> {t.addEntry}</button>} />
      <div className="ledger-summary">
        <div><span className="ledger-summary-icon income"><ArrowDownLeft size={17} /></span><span><small>TOTAL INCOME</small><b>{money(totalIncome)}</b></span><span className="ledger-summary-note">Sales + cash in</span></div>
        <div><span className="ledger-summary-icon expense"><ArrowUpRight size={17} /></span><span><small>TOTAL OUTFLOW</small><b>{money(totalOut)}</b></span><span className="ledger-summary-note">Expenses + cash out</span></div>
        <div><span className="ledger-summary-icon balance"><Wallet size={17} /></span><span><small>NET MOVEMENT</small><b>{signedMoney(totalIncome - totalOut)}</b></span><span className="ledger-summary-note">{transactions.length} entries recorded</span></div>
      </div>
      <section className="panel ledger-panel">
        <div className="ledger-toolbar"><div><h3>All entries <span>{filtered.length}</span></h3><p>Everything saved in your browser.</p></div><div className="ledger-controls"><label className="table-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search entries" /></label><select aria-label="Filter ledger entries" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All entries</option><option>Sale</option><option>Expense</option><option>Cash in</option><option>Cash out</option></select><button className="button button-secondary" onClick={exportCsv}><Download size={15} /> Export</button></div></div>
        <TransactionTable transactions={filtered} />
        <div className="ledger-footnote"><ShieldCheck size={14} /> Demo ledger is stored in local browser storage and is not backed up or synced.</div>
      </section>
    </div>
  );
}

function NetworkPage({ onNavigate, t }: { onNavigate: (view: View) => void; t: Record<string, string> }) {
  const [query, setQuery] = useState("");
  const [county, setCounty] = useState("All counties");
  const [selected, setSelected] = useState<Merchant | null>(merchants[0] ?? null);
  const filtered = useMemo(() => merchants.filter((merchant) =>
    (county === "All counties" || merchant.county === county) &&
    `${merchant.name} ${merchant.city} ${merchant.county} ${merchant.category}`.toLowerCase().includes(query.toLowerCase()),
  ), [county, query]);
  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const routeLink = selected ? `https://www.google.com/maps/dir/?api=1&origin=Monrovia,+Liberia&destination=${selected.lat},${selected.lng}&travelmode=driving` : "https://www.google.com/maps";
  return (
    <div>
      <PageHeader eyebrow="A COMMUNITY ACROSS LIBERIA" title={t.networkTitle} description={t.networkSub} action={<button className="button button-secondary" onClick={() => onNavigate("admin")}><Activity size={15} /> Nationwide view</button>} />
      <div className="network-summary-strip"><div><span className="summary-dot live" /><b>126</b><span>active this week</span></div><div><span className="summary-dot quiet" /><b>34</b><span>quiet 7+ days</span></div><div><Globe2 size={16} /><b>15</b><span>counties represented</span></div><div className="network-summary-note">All merchant names and map locations are generated demo data.</div></div>
      <div className="network-layout">
        <section className="network-map-panel panel">
          <div className="map-toolbar"><div><h3>Merchant coverage <span className="map-count">160+</span></h3><p>{mapsKey ? "Google hybrid map enabled" : "Illustrative county map · not for navigation"}</p></div><button className="map-locate" onClick={() => setSelected(merchants.find((merchant) => merchant.city === "Monrovia") ?? null)}><LocateFixed size={15} /> Monrovia</button></div>
          <NetworkMap merchants={filtered} selected={selected} apiKey={mapsKey} onSelect={setSelected} />
          <div className="map-legend"><span><i className="legend-active" /> Active recently</span><span><i className="legend-quiet" /> Needs a check-in</span><span><Navigation size={13} /> Route to selected merchant</span></div>
        </section>
        <section className="panel merchant-list-panel">
          <div className="merchant-list-heading"><div><h3>Merchant directory</h3><p>Find a shop or supplier nearby.</p></div><span>{filtered.length}</span></div>
          <label className="table-search merchant-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, town, category..." /></label>
          <select className="county-select" value={county} onChange={(event) => setCounty(event.target.value)} aria-label="Filter by county"><option>All counties</option>{counties.map(({ county: itemCounty }) => <option key={itemCounty}>{itemCounty}</option>)}</select>
          <div className="merchant-list">{filtered.slice(0, 60).map((merchant) => <button key={merchant.id} className={`merchant-row ${selected?.id === merchant.id ? "selected" : ""}`} onClick={() => setSelected(merchant)}><span className={`merchant-avatar avatar-${merchant.id % 5}`}>{merchant.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span className="merchant-info"><b>{merchant.name}</b><small>{merchant.category} · {merchant.city}</small></span><span className={`merchant-status ${merchant.active ? "status-active" : "status-quiet"}`} title={merchant.active ? "Active recently" : "Quiet for 7+ days"}><i /></span></button>)}
            {!filtered.length && <div className="empty-state"><Search size={20} /><b>No merchants found</b><span>Try a different name or county.</span></div>}
          </div>
          <div className="merchant-list-footer">Showing {Math.min(filtered.length, 60)} of {filtered.length} demo merchants</div>
        </section>
      </div>
      {selected && <div className="selected-merchant-card"><span className="selected-merchant-icon"><ShoppingBag size={18} /></span><div><small>SELECTED MERCHANT</small><b>{selected.name}</b><span>{selected.category} · {selected.city}, {selected.county}</span></div><div className={`selected-activity ${selected.active ? "is-active" : "is-quiet"}`}><i />{selected.active ? "Active" : `Quiet · ${selected.lastSeen}`}</div><a className="button button-primary route-button" href={routeLink} target="_blank" rel="noreferrer"><Navigation size={15} /> {t.route} <ArrowUpRight size={13} /></a></div>}
    </div>
  );
}

function NetworkMap({ merchants: points, selected, apiKey, onSelect }: { merchants: Merchant[]; selected: Merchant | null; apiKey: string | undefined; onSelect: (merchant: Merchant) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<google.maps.Map | null>(null);
  const directions = useRef<google.maps.DirectionsRenderer | null>(null);
  const [mapStatus, setMapStatus] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  useEffect(() => {
    if (!apiKey) return;
    let script = document.querySelector<HTMLScriptElement>("script[data-merchantwave-maps]");
    const initialize = () => {
      if (!mapRef.current || !window.google?.maps) return;
      googleMap.current = new google.maps.Map(mapRef.current, {
        center: { lat: 6.45, lng: -9.4 }, zoom: 6, mapTypeId: google.maps.MapTypeId.HYBRID,
        streetViewControl: false, mapTypeControl: true, fullscreenControl: true, gestureHandling: "greedy",
      });
      directions.current = new google.maps.DirectionsRenderer({ map: googleMap.current, suppressMarkers: false });
      setGoogleReady(true);
    };
    if (window.google?.maps) { initialize(); return; }
    if (!script) {
      script = document.createElement("script");
      script.dataset.merchantwaveMaps = "true";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
      script.async = true;
      script.onerror = () => {
        setMapStatus("Google Maps could not load. Check the key, enabled API, and allowed site origins.");
        setMapFailed(true);
      };
      document.head.appendChild(script);
    }
    script.addEventListener("load", initialize);
    return () => script?.removeEventListener("load", initialize);
  }, [apiKey]);

  useEffect(() => {
    if (!googleReady || !googleMap.current) return;
    const info = new google.maps.InfoWindow();
    const markers = points.map((merchant) => {
      const marker = new google.maps.Marker({
        position: { lat: merchant.lat, lng: merchant.lng }, map: googleMap.current,
        title: `${merchant.name} · ${merchant.city}`,
        icon: { path: google.maps.SymbolPath.CIRCLE, fillColor: merchant.active ? "#16885d" : "#e9a43c", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2, scale: 6 },
      });
      marker.addListener("click", () => {
        onSelect(merchant);
        info.setContent(`<div style="font-family:Arial,sans-serif;padding:4px"><strong>${merchant.name}</strong><br/>${merchant.category}<br/>${merchant.city}, ${merchant.county}</div>`);
        info.open({ anchor: marker, map: googleMap.current });
      });
      return marker;
    });
    return () => markers.forEach((marker) => marker.setMap(null));
  }, [googleReady, points, onSelect]);

  useEffect(() => {
    if (!googleReady || !selected || !googleMap.current) return;
    googleMap.current.panTo({ lat: selected.lat, lng: selected.lng });
  }, [googleReady, selected]);

  if (apiKey && googleReady) return <div className="google-map-wrap"><div ref={mapRef} className="google-map" /><div className="map-key-badge"><span className="google-map-indicator" /> HYBRID MAP</div>{mapStatus && <div className="map-error" role="status">{mapStatus}</div>}</div>;
  const visible = points.slice(0, 160);
  const landMinLng = -11.55; const landMaxLng = -7.35; const landMinLat = 4.25; const landMaxLat = 8.62;
  return <div className="fallback-map">
    <div className="map-topo topo-one" /><div className="map-topo topo-two" /><div className="map-topo topo-three" />
    <div className="map-graticule" />
    <div className="fallback-land-shape" aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <div className="map-coordinate coordinate-top">8°N</div><div className="map-coordinate coordinate-side">10°W</div>
    <div className="map-county-label label-montserrado">MONTSERRADO</div><div className="map-county-label label-bong">BONG</div><div className="map-county-label label-nimba">NIMBA</div><div className="map-county-label label-sinoe">SINOE</div><div className="map-county-label label-maryland">MARYLAND</div>
    <div className="map-dots">{visible.map((merchant) => {
      const x = Math.min(94, Math.max(6, (merchant.lng - landMinLng) / (landMaxLng - landMinLng) * 100));
      const y = Math.min(93, Math.max(7, (landMaxLat - merchant.lat) / (landMaxLat - landMinLat) * 100));
      return <span key={merchant.id} className={`map-dot ${merchant.active ? "active" : "quiet"} ${selected?.id === merchant.id ? "selected" : ""}`} style={{ left: `${x}%`, top: `${y}%` }} title={`${merchant.name} · ${merchant.city}`} />;
    })}</div>
    <div className="map-watermark"><MapPin size={15} /> LIBERIA <span>·</span> DEMO COVERAGE</div>
    <div className="fallback-map-label"><Globe2 size={16} /><span><b>{apiKey && mapFailed ? "Google Maps unavailable" : apiKey ? "Loading Google Maps" : "Illustrative merchant coverage"}</b><small>{apiKey && mapFailed ? mapStatus : apiKey ? "Showing the demo schematic while the hybrid map connects." : "Not a live geographic map · connect Google Maps for satellite imagery and turn-by-turn routes."}</small></span></div>
  </div>;
}

function IntelligencePage({ transactions, t }: { transactions: Transaction[]; t: Record<string, string> }) {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Good morning, Mary. I can help you understand your sales, expenses, and cash flow. Ask me a question or try one of the prompts below." }]);
  const [question, setQuestion] = useState("");
  const [voiceState, setVoiceState] = useState("");
  const [transcript, setTranscript] = useState("");
  const [busy, setBusy] = useState(false);
  const income = transactions.filter((item) => item.kind === "Sale" || item.kind === "Cash in").reduce((sum, item) => sum + item.amount, 0);
  const costTotal = transactions.filter((item) => item.kind === "Expense").reduce((sum, item) => sum + item.amount, 0);
  const expenseCategories = transactions.filter((item) => item.kind === "Expense").reduce<Record<string, number>>((all, item) => { all[item.category] = (all[item.category] ?? 0) + item.amount; return all; }, {});
  const largestCost = Object.entries(expenseCategories).sort((a, b) => b[1] - a[1])[0];
  const quietCount = merchants.filter((merchant) => !merchant.active).length;
  const ask = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    let response = `You've recorded ${transactions.length} entries. Income and cash received total ${money(income)}, while cash outflows total ${money(transactions.filter((item) => item.kind === "Expense" || item.kind === "Cash out").reduce((sum, item) => sum + item.amount, 0))}.`;
    if (/sales|selling|revenue|income/.test(lower)) response = `Your recorded sales and cash received total ${money(income)} across ${transactions.filter((item) => item.kind === "Sale" || item.kind === "Cash in").length} entries. Today's sales are ${money(transactions.filter((item) => item.date === new Date().toISOString().slice(0, 10) && item.kind === "Sale").reduce((sum, item) => sum + item.amount, 0))}.`;
    else if (/expense|cost|spend|buy/.test(lower)) response = `Recorded expenses total ${money(costTotal)}. ${largestCost ? `${largestCost[0]} is your largest expense category at ${money(largestCost[1])}.` : "No expense category has been recorded yet."}`;
    else if (/balance|cash|left/.test(lower)) response = `Your demo balance is ${money(25650 + income - transactions.filter((item) => item.kind === "Expense" || item.kind === "Cash out").reduce((sum, item) => sum + item.amount, 0))}, based on the seeded opening balance plus the entries currently in this browser.`;
    else if (/quiet|dorman|inactive|merchant/.test(lower)) response = `${quietCount} of 160 illustrative demo merchants are marked quiet for more than a week. Check whether this reflects a seasonal pattern, an unrecorded sale, or a need to reconnect—these are sample records, not live merchant activity.`;
    setMessages((current) => [...current, { role: "user", text: trimmed }, { role: "assistant", text: response }]);
    setQuestion("");
  };
  const startVoice = () => {
    type ResultEvent = Event & { results: { 0: { 0: { transcript: string } } } };
    type Recognition = { lang: string; onresult: ((event: ResultEvent) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void };
    type RecognitionConstructor = new () => Recognition;
    const speechWindow = window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    const RecognitionAPI = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!RecognitionAPI) { setVoiceState("Voice input is not supported in this browser. Try Chrome or type your question."); return; }
    const recognition = new RecognitionAPI();
    recognition.lang = "en-LR";
    recognition.onresult = (event) => { const spoken = event.results[0][0].transcript; setQuestion(spoken); setVoiceState(`Heard: “${spoken}”`); };
    recognition.onerror = () => setVoiceState("Microphone input was not available. Check browser permission and try again.");
    recognition.onend = () => setVoiceState((current) => current || "Voice input ended.");
    setVoiceState("Listening…");
    recognition.start();
  };
  const transcribe = async (file: File | undefined) => {
    setTranscript("");
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".wav") && file.type !== "audio/wav" && file.type !== "audio/x-wav") {
      setTranscript("Please choose a WAV audio file. No file was uploaded.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) { setTranscript("This file is over 15 MB. Choose a smaller WAV file."); return; }
    const endpoint = import.meta.env.VITE_AI_GATEWAY_URL;
    if (!endpoint) { setTranscript("WAV transcription is not configured. Connect a trusted AI gateway using VITE_AI_GATEWAY_URL; this file has not been uploaded."); return; }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("audio", file);
      form.append("prompt", "Transcribe this merchant voice note. Return accurate transcript text only.");
      const response = await fetch(endpoint, { method: "POST", body: form });
      if (!response.ok) throw new Error(`The transcription service returned ${response.status}.`);
      const result: unknown = await response.json();
      if (!result || typeof result !== "object" || !("transcript" in result) || typeof result.transcript !== "string") throw new Error("The service response did not include a transcript.");
      setTranscript(result.transcript || "The service returned an empty transcript.");
    } catch (error) {
      setTranscript(error instanceof Error ? `Transcription failed: ${error.message}` : "Transcription failed because of an unknown service error.");
    } finally { setBusy(false); }
  };
  return (
    <div>
      <PageHeader eyebrow="READ BETWEEN THE ENTRIES" title={t.intelligenceTitle} description="Understand what's changing in your business, then decide what to do next." action={<span className="local-insight-pill"><Sparkles size={14} /> Local insights · no AI key</span>} />
      <div className="intelligence-banner"><span className="intelligence-banner-icon"><Sparkles size={20} /></span><div><b>A useful place to start</b><p>Your recorded sales are moving steadily. Inventory is your largest expense category. A quick stock check could help you see if that spend is turning into sales.</p><small>Based on this device's demo ledger · not financial advice</small></div><ArrowUpRight size={17} /></div>
      <div className="intel-grid">
        <section className="panel insight-panel">
          <div className="panel-heading"><div><span className="panel-overline">SIGNALS TO NOTICE</span><h3>Patterns in your records</h3></div><span className="subtle-badge">Updated just now</span></div>
          <article className="signal-card"><span className="signal-icon orange"><BarChart3 size={18} /></span><div><span className="signal-tag">SALES MOMENTUM</span><b>Consistent activity across the week</b><p>You have entries on {new Set(transactions.map((item) => item.date)).size} different days. Regular records make it easier to spot changes.</p></div><span className="signal-direction"><TrendingUp size={16} /></span></article>
          <article className="signal-card"><span className="signal-icon purple"><ShoppingBag size={18} /></span><div><span className="signal-tag">LARGEST COST · {largestCost?.[0]?.toUpperCase() ?? "NO DATA"}</span><b>{largestCost ? `${money(largestCost[1])} recorded so far` : "Start adding expenses"}</b><p>Inventory costs add up quickly. Compare purchases with the sales they help you make.</p></div><span className="signal-direction"><ArrowUpRight size={16} /></span></article>
          <article className="signal-card warning"><span className="signal-icon yellow"><Clock3 size={18} /></span><div><span className="signal-tag">MERCHANT CHECK-IN</span><b>{quietCount} sample merchants show a quiet spell</b><p>Possible reasons include seasonal hours, connectivity, or missing updates. Confirm with a merchant before drawing conclusions.</p></div><span className="signal-direction"><ArrowRight size={16} /></span></article>
        </section>
        <section className="panel assistant-panel">
          <div className="assistant-header"><div className="assistant-brand"><span><Sparkles size={17} /></span><div><b>Money assistant</b><small><i /> Using your demo records</small></div></div><button className="icon-button" aria-label="Assistant information" title="Answers are calculated locally from demo records."><CircleHelp size={16} /></button></div>
          <div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div key={index} className={`chat-message ${message.role}`}><span className="chat-avatar">{message.role === "assistant" ? <Sparkles size={13} /> : "MK"}</span><p>{message.text}</p></div>)}</div>
          <div className="prompt-chips"><button onClick={() => ask("How were my sales this week?")}>How were my sales?</button><button onClick={() => ask("What is my biggest expense?")}>Biggest expense?</button><button onClick={() => ask("Which merchants are quiet?")}>Quiet merchants?</button></div>
          <form className="assistant-input" onSubmit={(event) => { event.preventDefault(); ask(question); }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your sales, costs..." aria-label="Ask your money assistant" /><button type="button" className="voice-button" onClick={startVoice} aria-label="Ask by voice"><Mic size={17} /></button><button type="submit" className="send-button" disabled={!question.trim()} aria-label="Send question"><Send size={16} /></button></form>
          {voiceState && <div className="voice-feedback" role="status">{voiceState}</div>}
          <div className="assistant-disclaimer">Answers use simple local rules, not Gemini or personalized financial advice.</div>
        </section>
      </div>
      <section className="panel transcription-panel">
        <div className="transcription-copy"><span className="transcription-icon"><FileAudio2 size={19} /></span><div><span className="panel-overline">VOICE NOTES</span><h3>Turn a WAV note into text</h3><p>Upload a shop-floor voice note to your configured private AI gateway.</p></div></div>
        <label className="button button-secondary wav-upload"><input type="file" accept=".wav,audio/wav,audio/x-wav" onChange={(event) => { void transcribe(event.target.files?.[0]); event.target.value = ""; }} />{busy ? <><Activity size={15} className="spin" /> Transcribing…</> : <><AudioLines size={15} /> Choose WAV file</>}</label>
        {transcript && <div className={`transcript-result ${transcript.startsWith("Transcription failed") || transcript.startsWith("Please") || transcript.startsWith("This file") || transcript.startsWith("WAV transcription") ? "transcript-warning" : ""}`} role="status"><Headphones size={15} /><span>{transcript}</span></div>}
        <div className="transcription-footnote"><LockKeyhole size={13} /> Files are not uploaded unless an AI gateway is explicitly configured.</div>
      </section>
    </div>
  );
}

function AdminPage({ t }: { t: Record<string, string> }) {
  const [search, setSearch] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("All counties");
  const rows = counties.map(({ county, city, lat, lng }, index) => {
    const registered = county === "Montserrado" ? 42 : county === "Bong" ? 17 : county === "Nimba" ? 15 : index % 5 === 0 ? 8 : 7;
    const active = Math.round(registered * (index === 0 ? 0.74 : 0.71 + (index % 5) * 0.045));
    return { county, city, registered, active, quiet: registered - active, lat: lat.toFixed(4), lng: lng.toFixed(4), signal: index % 4 === 0 ? "Growing" : index % 6 === 0 ? "Check-in" : "Steady" };
  });
  const filtered = rows.filter((row) => (selectedCounty === "All counties" || row.county === selectedCounty) && `${row.county} ${row.city}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <PageHeader eyebrow="NATIONWIDE OPERATIONS" title={t.adminTitle} description="A county-by-county demo view of the merchant network and activity signals." action={<span className="local-insight-pill"><ShieldCheck size={14} /> Demo operations data</span>} />
      <div className="admin-kpi-grid"><div className="admin-kpi"><span className="admin-kpi-icon green"><Users size={17} /></span><small>MERCHANTS IN NETWORK</small><b>160</b><span>Illustrative seeded records</span></div><div className="admin-kpi"><span className="admin-kpi-icon orange"><Activity size={17} /></span><small>ACTIVE THIS WEEK</small><b>126 <em>78.8%</em></b><span>Activity across 15 counties</span></div><div className="admin-kpi"><span className="admin-kpi-icon blue"><Globe2 size={17} /></span><small>COUNTIES REPRESENTED</small><b>15 / 15</b><span>Nationwide demo coverage</span></div><div className="admin-kpi"><span className="admin-kpi-icon purple"><Clock3 size={17} /></span><small>NEEDS A CHECK-IN</small><b>34</b><span>Quiet 7+ days in sample data</span></div></div>
      <section className="panel county-panel">
        <div className="ledger-toolbar"><div><h3>County operations <span>15</span></h3><p>Illustrative coordinates and activity—not live fleet telemetry.</p></div><div className="ledger-controls"><label className="table-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search county or town" /></label><select value={selectedCounty} onChange={(event) => setSelectedCounty(event.target.value)} aria-label="Filter counties"><option>All counties</option>{counties.map((entry) => <option key={entry.county}>{entry.county}</option>)}</select></div></div>
        <div className="table-wrap"><table className="admin-table"><thead><tr><th>COUNTY / HUB</th><th>MERCHANTS</th><th>ACTIVE</th><th>QUIET 7+ DAYS</th><th>COORDINATES</th><th>NETWORK SIGNAL</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.county}><td><span className="county-name"><span className="county-map-icon"><MapPin size={14} /></span><span><b>{row.county}</b><small>{row.city}</small></span></span></td><td><b>{row.registered}</b></td><td><span className="activity-value"><i />{row.active}</span></td><td><span className="quiet-value">{row.quiet}</span></td><td className="coordinate-cell">{row.lat}, {row.lng}</td><td><span className={`network-signal ${row.signal === "Growing" ? "signal-growing" : row.signal === "Check-in" ? "signal-check" : "signal-steady"}`}><i />{row.signal}</span></td></tr>)}</tbody></table></div>
        <div className="ledger-footnote"><LocateFixed size={14} /> Approximate hub coordinates are display-only sample values. No device or fleet is being tracked.</div>
      </section>
      <div className="admin-notice"><LockKeyhole size={16} /><span><b>Not a live command center.</b> This companion demo has no GPS feed, fleet tracking, user roles, or server-side authorization. Connect a protected backend before operational use.</span></div>
    </div>
  );
}

function EntryModal({ onClose, onSave }: { onClose: () => void; onSave: (entry: Omit<Transaction, "id">) => void }) {
  const [kind, setKind] = useState<TransactionKind>("Sale");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Sales");
  const [channel, setChannel] = useState("Cash");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const categories: Record<TransactionKind, string[]> = { Sale: ["Sales", "Food & drink", "Services", "Other"], Expense: ["Inventory", "Rent", "Transport", "Utilities", "Other"], "Cash in": ["Mobile money", "Owner contribution", "Other"], "Cash out": ["Mobile money", "Personal", "Supplier", "Other"] };
  return <Modal onClose={onClose} label="Add a ledger entry"><div className="modal-heading"><span className="modal-heading-icon"><Plus size={19} /></span><div><h2>Add an entry</h2><p>Capture a money movement in your demo ledger.</p></div><button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
    <form className="entry-form" onSubmit={(event) => { event.preventDefault(); if (!description.trim() || !Number(amount) || Number(amount) < 0) return; onSave({ kind, description: description.trim(), amount: Number(amount), category, channel, date }); }}>
      <label className="form-label">ENTRY TYPE<select value={kind} onChange={(event) => { const next = event.target.value as TransactionKind; setKind(next); setCategory(categories[next][0]!); }}><option>Sale</option><option>Expense</option><option>Cash in</option><option>Cash out</option></select></label>
      <label className="form-label">DESCRIPTION<input required maxLength={80} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. Market sales today" /></label>
      <div className="form-two-columns"><label className="form-label">AMOUNT (L$)<input required type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" /></label><label className="form-label">CATEGORY<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories[kind].map((item) => <option key={item}>{item}</option>)}</select></label></div>
      <div className="form-two-columns"><label className="form-label">DATE<input type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></label><label className="form-label">CHANNEL<select value={channel} onChange={(event) => setChannel(event.target.value)}><option>Cash</option><option>Orange Money</option><option>Other mobile money</option></select></label></div>
      <div className="form-notice"><ShieldCheck size={14} /> Saved only in this browser. Demo data is not backed up.</div>
      <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><Check size={15} /> Save entry</button></div>
    </form>
  </Modal>;
}

function LoginModal({ onClose, onContinue }: { onClose: () => void; onContinue: () => void }) {
  return <Modal onClose={onClose} label="Demo sign in"><div className="login-modal"><button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><span className="login-icon"><LogIn size={21} /></span><div className="page-eyebrow">WELCOME BACK</div><h2>Your business, in one place.</h2><p>Sign-in and secure accounts are not connected in this companion demo. Open the local demo workspace to explore the product without entering a password.</p><div className="login-safety"><LockKeyhole size={15} /> Don't enter a real password or financial information.</div><button className="button button-primary login-continue" onClick={onContinue}>Continue to demo workspace <ArrowRight size={16} /></button><button className="text-button login-back" onClick={onClose}>Back to MerchantWave</button></div></Modal>;
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return <Modal onClose={onClose} label="Privacy and data"><div className="modal-heading"><span className="modal-heading-icon"><ShieldCheck size={19} /></span><div><h2>Privacy & demo data</h2><p>What happens to information in this companion demo.</p></div><button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button></div><div className="privacy-copy"><p><b>Your records stay in this browser.</b> Demo ledger entries and theme/language preferences are saved in localStorage on this device. They are not uploaded, synced, or encrypted by MerchantWave.</p><p><b>Seeded merchant information is fictional.</b> Names, map pins, coordinates, activity, and financial entries are illustrative only. Do not use them to contact or make decisions about real people.</p><p><b>External integrations are opt-in.</b> Google Maps receives map requests only if you configure a browser-restricted Maps key. WAV files are not uploaded unless you configure a trusted AI gateway endpoint.</p><p><b>No real authentication is configured.</b> This prototype does not provide account security, database row-level security, or production privacy guarantees.</p></div><button className="button button-primary privacy-done" onClick={onClose}>I understand</button></Modal>;
}

function Modal({ children, onClose, label }: { children: ReactNode; onClose: () => void; label: string }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal-sheet" role="dialog" aria-modal="true" aria-label={label}>{children}</section></div>;
}

export default App;
