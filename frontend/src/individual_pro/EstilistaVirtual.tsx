import { useState } from 'react';

/* ESTILOS DEL ESTILISTA VIRTUAL (inyectados inline para tener todo en un archivo) */
const STYLIST_CSS = `
  .stylist-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .stylist-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .stylist-title-area {
    display: inline-block;
    padding: 15px 40px;
    background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,240,243,0.9) 100%);
    border-radius: 50px;
    border: 1px solid var(--pastel-blush);
    box-shadow: 0 10px 30px rgba(255, 117, 151, 0.1);
    backdrop-filter: blur(10px);
  }

  .stylist-title {
    font-family: var(--font-serif);
    font-size: 2.5rem;
    color: var(--dark-rose);
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  .stylist-icon {
    color: var(--primary-pink);
    animation: float-slow 4s infinite ease-in-out;
  }

  .stylist-subtitle {
    color: var(--medium-rose);
    font-size: 1.1rem;
  }

  .stylist-card {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid var(--pastel-blush);
    border-radius: 24px;
    padding: 50px;
    min-height: 450px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(255, 117, 151, 0.08);
  }

  /* Wizard */
  .wizard-progress {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 40px;
  }

  .progress-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--pastel-blush);
    transition: all 0.4s ease;
  }

  .progress-dot.active {
    background: var(--primary-pink);
    transform: scale(1.4);
    box-shadow: 0 0 10px rgba(255, 117, 151, 0.5);
  }

  .wizard-question {
    text-align: center;
  }

  .wizard-question h3 {
    font-family: var(--font-heading);
    font-size: 1.8rem;
    color: var(--dark-rose);
    margin-bottom: 30px;
  }

  .wizard-options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .wizard-option-btn {
    background: white;
    border: 2px solid var(--pastel-blush);
    border-radius: 16px;
    padding: 25px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 5px 15px rgba(255, 117, 151, 0.05);
    cursor: pointer;
  }

  .wizard-option-btn:hover {
    transform: translateY(-5px);
    border-color: var(--primary-pink);
    box-shadow: 0 10px 25px rgba(255, 117, 151, 0.15);
  }

  .wizard-option-btn.selected {
    background: var(--light-pink);
    border-color: var(--primary-pink);
    transform: scale(1.05);
  }

  .option-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--light-pink);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: var(--primary-pink);
    transition: all 0.3s ease;
  }

  .wizard-option-btn:hover .option-icon {
    background: var(--primary-pink);
    color: white;
  }

  .option-label {
    font-weight: 600;
    font-family: var(--font-heading);
    font-size: 1.1rem;
    color: var(--dark-rose);
  }

  /* Analyzing State */
  .stylist-analyzing {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: pulse-soft 2s infinite ease-in-out;
  }

  .analyzing-spinner {
    font-size: 4rem;
    color: var(--primary-pink);
    margin-bottom: 20px;
  }

  .stylist-analyzing h3 {
    font-family: var(--font-heading);
    font-size: 1.6rem;
    color: var(--dark-rose);
    margin-bottom: 10px;
  }

  .stylist-analyzing p {
    color: var(--medium-rose);
  }

  /* Result State */
  .stylist-result {
    text-align: center;
  }

  .result-header {
    margin-bottom: 40px;
  }

  .result-header h3 {
    font-family: var(--font-serif);
    font-size: 2.2rem;
    color: var(--primary-pink);
    margin-bottom: 10px;
  }

  .recommendation-grid {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }

  .rec-item-card {
    width: 250px;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--pastel-blush);
    box-shadow: 0 10px 20px rgba(255, 117, 151, 0.1);
    animation: slide-up 0.6s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }

  .rec-item-card:nth-child(2) {
    animation-delay: 0.2s;
  }

  .rec-item-img-wrapper {
    position: relative;
    height: 320px;
    background: var(--light-pink);
  }

  .rec-item-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .rec-item-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: rgba(255,255,255,0.9);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--primary-pink);
    backdrop-filter: blur(5px);
  }

  .rec-item-details {
    padding: 15px;
    text-align: left;
  }

  .rec-item-details h4 {
    font-size: 1rem;
    margin-bottom: 5px;
    color: var(--dark-rose);
  }

  .rec-item-price {
    font-weight: 700;
    color: var(--primary-pink);
    font-size: 1.1rem;
  }

  .stylist-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  /* Animations */
  @keyframes float-slow {
    0%   { transform: translateY(0); }
    50%  { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }

  @keyframes pulse-soft {
    0%   { opacity: 0.8; transform: scale(0.98); }
    50%  { opacity: 1;   transform: scale(1.02); }
    100% { opacity: 0.8; transform: scale(0.98); }
  }

  .fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slide-up {
    to { opacity: 1; transform: translateY(0); }
  }
`;

/* TIPOS */
interface Producto {
  id: number;
  sku: string;
  titulo: string;
  precio: number;
  stock: number;
  descripcion: string;
  urlImagen: string;
  categoria: { nombre: string };
}

interface VirtualStylistProps {
  products: Producto[];
  addToCart: (product: Producto) => void;
  setView: (view: string) => void;
}

interface QuestionOption {
  label: string;
  value: string;
  icon: string;
  color?: string;
}

interface Question {
  id: string;
  title: string;
  options: QuestionOption[];
}

/* PREGUNTAS DEL CUESTIONARIO */
const QUESTIONS: Question[] = [
  {
    id: 'occasion',
    title: '¿Para qué ocasión te estás preparando?',
    options: [
      { label: 'Casual / Día a Día', value: 'casual', icon: 'fa-sun' },
      { label: 'Trabajo / Oficina',  value: 'work',   icon: 'fa-briefcase' },
      { label: 'Cita Romántica',     value: 'date',   icon: 'fa-heart' },
      { label: 'Fiesta / Noche',     value: 'party',  icon: 'fa-glass-cheers' },
    ]
  },
  {
    id: 'style',
    title: '¿Cuál es tu estilo favorito?',
    options: [
      { label: 'Romántico',    value: 'romantic',    icon: 'fa-fan' },
      { label: 'Moderno',      value: 'modern',      icon: 'fa-bolt' },
      { label: 'Minimalista',  value: 'minimalist',  icon: 'fa-cube' },
      { label: 'Atrevido',     value: 'bold',        icon: 'fa-fire' },
    ]
  },
  {
    id: 'color',
    title: '¿Qué paleta de colores preferís hoy?',
    options: [
      { label: 'Tonos Pastel',       value: 'pastel',   icon: 'fa-palette',            color: '#ffd1dc' },
      { label: 'Neutros Elegantes',  value: 'neutral',  icon: 'fa-circle-half-stroke', color: '#e2dddb' },
      { label: 'Vibrantes',          value: 'vibrant',  icon: 'fa-rainbow',            color: '#ff7597' },
      { label: 'Oscuros / Negros',   value: 'dark',     icon: 'fa-moon',               color: '#3d262a' },
    ]
  }
];

/* ==========================================================================
   COMPONENTE PRINCIPAL
   ========================================================================== */
const VirtualStylist = ({ products, addToCart, setView }: VirtualStylistProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<Producto[]>([]);

  /* ---- Lógica ---- */
  const handleOptionSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    if (currentStep < QUESTIONS.length - 1) {
      // Espera 400ms para que se vea la selección antes de avanzar
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    } else {
      generateRecommendation();
    }
  };

  const generateRecommendation = () => {
    if (!products || products.length === 0) {
      alert('Error: No hay productos en el catálogo. Asegúrate de que el servidor backend esté corriendo y la base de datos tenga productos.');
      handleRestart();
      return;
    }

    setIsAnalyzing(true);

    // Simula 2.5 segundos, luego elige 2 productos al azar
    setTimeout(() => {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRecommendation(shuffled.slice(0, 2));
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendation([]);
  };

  const handleAddLook = () => {
    recommendation.forEach(p => addToCart(p));
    alert('¡Look completo añadido a tu bolsa de compras!');
    setView('shop-view');
  };


  return (
    <>
      {/* Estilos inyectados inline — no hace falta un archivo .css separado */}
      <style>{STYLIST_CSS}</style>

      <section className="stylist-container view-section">
        {/* Encabezado */}
        <div className="stylist-header">
          <div className="stylist-title-area">
            <h2 className="stylist-title">
              <i className="fa-solid fa-wand-magic-sparkles stylist-icon"></i>
              Estilista Virtual
            </h2>
            <p className="stylist-subtitle">Descubrí tu look perfecto diseñado a medida para vos.</p>
          </div>
        </div>

        {/* Tarjeta principal */}
        <div className="stylist-card glass-card">

          {/* Estado 2: Analizando */}
          {isAnalyzing ? (
            <div className="stylist-analyzing">
              <div className="analyzing-spinner">
                <i className="fa-solid fa-wand-magic-sparkles fa-spin"></i>
              </div>
              <h3>Analizando tus preferencias...</h3>
              <p>Buscando las mejores prendas en el catálogo de Chic Rose.</p>
            </div>

          ) : recommendation.length > 0 ? (
            /* Estado 3: Resultado */
            <div className="stylist-result fade-in">
              <div className="result-header">
                <h3>¡Tenemos el look ideal para vos!</h3>
                <p>Basado en tus preferencias, seleccionamos estas hermosas prendas.</p>
              </div>

              <div className="recommendation-grid">
                {recommendation.map(item => (
                  <div key={item.id} className="rec-item-card">
                    <div className="rec-item-img-wrapper">
                      <img src={item.urlImagen} alt={item.titulo} />
                      <div className="rec-item-badge">{item.categoria?.nombre || 'Recomendado'}</div>
                    </div>
                    <div className="rec-item-details">
                      <h4>{item.titulo}</h4>
                      <span className="rec-item-price">${item.precio.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="stylist-actions">
                <button className="btn btn-outline-pink btn-lg" onClick={handleRestart}>
                  <i className="fa-solid fa-rotate-left"></i> Volver a intentar
                </button>
                <button className="btn btn-pink btn-lg" onClick={handleAddLook}>
                  <i className="fa-solid fa-bag-shopping"></i> Añadir Look a la Bolsa
                </button>
              </div>
            </div>

          ) : (
            /* Estado 1: Wizard (cuestionario) */
            <div className="stylist-wizard">
              {/* Indicador de progreso */}
              <div className="wizard-progress">
                {QUESTIONS.map((q, idx) => (
                  <div key={q.id} className={`progress-dot ${idx <= currentStep ? 'active' : ''}`}></div>
                ))}
              </div>

              {/* Pregunta actual */}
              <div className="wizard-question fade-in" key={currentStep}>
                <h3>{QUESTIONS[currentStep].title}</h3>

                <div className="wizard-options-grid">
                  {QUESTIONS[currentStep].options.map(opt => (
                    <button
                      key={opt.value}
                      className={`wizard-option-btn ${answers[QUESTIONS[currentStep].id] === opt.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(QUESTIONS[currentStep].id, opt.value)}
                    >
                      <div className="option-icon" style={opt.color ? { background: opt.color } : {}}>
                        <i className={`fa-solid ${opt.icon}`}></i>
                      </div>
                      <span className="option-label">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default VirtualStylist;

//el componente principal le pasa al estilista herramientas y datos que ya existen en la pagina , cuando ya termina todo 
//todo su proceso de las pregunas y demas el estilista eecuta la funcion addtocard para pder agregar los productos al carrito de toda la pagina
// por lo tanto no guarda ningun resultado en la base de datos 


//flujo de la base de datos en la pagina: cuando el front necesita datos envia una peticion http usando axios  , el back pocede a digir la peticion
// al controlador correspondiente , prisma lee/ escribe el archiivo en sqlite , el back le devuelve la informacion al navegador enformato json // 

//por la seguridad del  usuario las contraseñas o innformacion se encriptan , el proceso es el siguiente: (hashing) al crearse la cuenta se toma la contraseña usamos la funcion bcrypt.hash..... esto genera un hash un codigo largo y es el que se guarda en la base de datos
// al momento de que el usuario escribe su contraseña se llama a la funcion para identificar la contraseña encriptada  , compara los resultados y si es el mismo da el acceso a la pagina y se genera un token jwt que permite al usuario acceder a la pagina 
