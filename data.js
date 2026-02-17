window.PROJECT = {

  meta: {
    title: 'Can plasma-activated water prime plants for salinity resilience in biologically meaningful and ecologically responsible ways?',
    thesis: 'Investigating whether plasma-activated water can prime plants for salinity tolerance. Linking PAW chemistry to seed physiology, stress biomarkers, and molecular responses, and if successful, a system-aware intervention for ecological resilience.',
    institution: 'RMIT University',
    program: 'Honours 2026',
    cta: 'Looking for advisors, collaborators, and people willing to share their expertise and experience. Including other students, candidates, scientists and entrepreneurs.'
  },

  lanes: {
    problem:     { label: 'PROBLEM',     color: '#60a5fa' },
    technology:  { label: 'TECHNOLOGY',  color: '#2dd4bf' },
    methodology: { label: 'METHODOLOGY', color: '#fbbf24' },
    responses:   { label: 'RESPONSES',   color: '#a78bfa' },
    impact:      { label: 'IMPACT',      color: '#34d399' }
  },

  nodeOrder: ['problem1','problem2','tech1','tech2','method1','method2','resp1','resp2','resp3','impact1','impact2'],

  nodes: [

    { id: 'problem1', label: 'Environmental\nDegradation', lane: 'problem',
      x: 40, y: 130,
      blurb: 'Anthropogenic actions are disrupting natural systems, releasing greenhouse gases, and driving climate change. These activities are intensifying ecological stresses such as soil deterioration, environmental toxicity, biodiversity loss, and shifting disease patterns.\n\nTogether, these forces operate through feedback loops, where one source of pressure amplifies the effects of the others, weakening the capacity of ecosystems to adapt and recover. Addressing this challenge requires identifying leverage points within this interconnected system, where carefully designed, system-aware technologies can reinforce resilience at foundational ecological levels.' },

    { id: 'problem2', label: 'Salt\nStress', lane: 'problem',
      x: 40, y: 310,
      blurb: 'Globally, over 1 billion hectares of land are salt-affected; in Australia alone, 169 million hectares are classified as salt-affected soils. Soil salinisation is the accumulation of soluble sodium chloride (NaCl) salts in the soil solution at high concentrations.\n\nClimate change is accelerating this process through a cycle of extended dry periods, high evaporation, and intense rainfall events. In drought conditions, salts from shallow water tables rise into the root zone through capillary action. Flood events raise water tables and mobilise salts into the root zone.\n\nAt the plant level, saline stress (NaCl) imposes: osmotic stress reducing water uptake, ionic toxicity from Na\u207a/Cl\u207b accumulation, and secondary oxidative stress through reactive oxygen species generation. These mechanisms compound to inhibit germination, stunt growth, and disrupt cellular function.' },

    { id: 'tech1', label: 'Cold Atmospheric\nPlasma', lane: 'technology',
      x: 310, y: 130,
      blurb: 'Plasma is an ionised gas, often called the fourth state of matter. Cold atmospheric plasma (CAP) is a non-thermal form generated at ambient temperature and pressure, producing reactive chemistry without thermal damage to biological materials. It is a relatively young field, but CAP is already being applied across agriculture, food safety, water purification, and biomedical treatment. When applied to water, CAP generates reactive oxygen and nitrogen species (RONS) without chemicals or high energy input, producing plasma-activated water (PAW). PAW has demonstrated effects on seed germination, plant growth, stress tolerance, fertiliser manufacturing, and pathogen resistance.' },

    { id: 'tech2', label: 'PAW\nChemistry', lane: 'technology',
      x: 310, y: 310,
      blurb: 'Plasma-activated water (PAW) is created when electrical energy transforms air and water into a liquid rich in reactive oxygen and nitrogen species (RONS). Key long-lived species include hydrogen peroxide (H\u2082O\u2082), nitrite (NO\u2082\u207b), and nitrate (NO\u2083\u207b), while shorter-lived radicals like hydroxyl (\u00b7OH) decay within seconds of generation. These RONS act as endogenous signalling molecules that trigger the plant\u2019s defences and growth pathways.' },

    { id: 'method1', label: 'Multifactorial\nDesign', lane: 'methodology',
      x: 580, y: 130,
      blurb: 'I\u2019m proposing a multi-factorial design crossing three water treatments (distilled water control, synthetic RONS cocktail, and PAW) with a salinity gradient (0 to 200 mM NaCl).\n\nThe synthetic cocktail matches PAW\u2019s measured H\u2082O\u2082, NO\u2082\u207b, and NO\u2083\u207b concentrations, pH, etc., isolating whether observed effects are due to PAW\u2019s unique reactive species profile or individual chemical components.\n\nMeasurements are taken across germination, early growth, and late growth, to track how stress responses accumulate over time. At each window, responses are measured at morphological, physiological, and molecular scales.\n\nExact salt concentrations, factor levels, plant responses, etc. are TBD.' },

    { id: 'method2', label: 'Treatment\nProtocol', lane: 'methodology',
      x: 580, y: 310,
      blurb: 'Seeds are primed in freshly generated PAW, synthetic RONS solution, or distilled water, then sown under defined salt conditions. PAW is freshly generated and characterised before each application to ensure batch-to-batch consistency. Observations follow a systematic schedule from germination through to late development, with tissue sampling at defined timepoints for physiological and molecular assays. Specific observation windows, sampling protocols, and assays are TBD.' },

    { id: 'resp1', label: 'Germination &\nEarly Development', lane: 'responses',
      x: 850, y: 60,
      blurb: 'Germination and early development represent the most vulnerable window in the plant life cycle. Under salinity stress, seeds experience a thermodynamic barrier (reduced osmotic potential), which prevents the water uptake needed to re-activate metabolism, while ion toxicity from Na\u207a and Cl\u207b accumulation compromises the developing embryo.\n\nHere I track whole-organism responses (germination rates, timing, radicle protrusion, seedling size, and biomass) to determine whether PAW priming changes the outcome at the most observable level.' },

    { id: 'resp2', label: 'Stress\nPhysiology', lane: 'responses',
      x: 850, y: 230,
      blurb: 'Salt stress triggers a biphasic response. Firstly, high salt concentrations create a thermodynamic barrier to water uptake that mimics drought (osmotic). The second phase is ionic \u2014 Na\u207a and Cl\u207b accumulate to toxic levels, damaging cellular membranes and the photosynthetic apparatus. \n\nHere I investigate how the plant manages its water status, membrane integrity, ion balance, PSII stability, and oxidative damage. Thus revealing whether PAW priming helps the plant maintain cellular homeostasis and pre-alerts its antioxidant defences before severe damage occurs.' },

    { id: 'resp3', label: 'Molecular\nResponse', lane: 'responses',
      x: 850, y: 400,
      blurb: 'Plants adapt phenotypically to stress (plasticity) and record stress through epigenetic markers. DNA methylation marks on the genome regulate gene activity, and these marks shift dynamically under salinity. \n\nHere I investigate whether PAW priming leaves a detectable molecular signature (such as epigenetic \u201cmemory\u201d) and assess changes due to treatment versus stress alone.' },

    { id: 'impact1', label: 'Implications', lane: 'impact',
      x: 1120, y: 155,
      blurb: 'This project tests whether PAW meets a specific standard: effects that are biologically meaningful and ecologically responsible. \n\nBy measuring across morphological, physiological, and molecular scales, the work is designed to be relevant across disciplines, plant biology, stress physiology, epigenetics, and restoration ecology, and gauge the use of plasma in reinforcing resilience. \n\nWhether PAW proves to be a viable, waste-free intervention for degraded soils depends on the evidence this project produces.' },

    { id: 'impact2', label: 'Future\nDirections', lane: 'impact',
      x: 1120, y: 320,
      blurb: 'Next phases beyond Honours: multi-species comparison, microbial community changes, soil changes, field-scale PAW application trials, transgenerational epigenetic inheritance studies, and environmental impact assessment.' }
  ],

  edges: [
    { from: 'problem1',  to: 'problem2',  label: 'narrows to' },
    { from: 'tech1',     to: 'tech2',     label: 'produces' },
    { from: 'method1',   to: 'method2',   label: 'implemented through' },
    { from: 'method2',   to: 'resp1',     label: 'produces' },
    { from: 'resp1',     to: 'resp2',     label: 'deepens to' },
    { from: 'resp2',     to: 'resp3',     label: 'deepens to' }
  ],

  annotations: {
    problem1: {
      relevance: 'This project is not an attempt to model the entire earth system: its biophysical, climatic, and anthropogenic dimensions are far beyond the scope of my honours. The goal is to hold a systems view while testing whether a specific technology can be precise and responsible enough to reinforce ecosystem resilience without creating new problems. That is the question driving this project, and the rest of the work that follows is an honest attempt to answer it, starting from the state of the earth as it is today.'
    },
    problem2: {
      relevance: 'Saline stress is measurable at every biological scale, from whole-organism germination rates to molecular markers, which makes it a strong candidate for testing whether a technology produces effects that are both statistically detectable and biologically meaningful. It is also one of the most directly addressable forms of environmental degradation: the stressor can be precisely controlled in a laboratory setting, and the affected land area is large enough that any genuine intervention has real-world relevance.'
    },
    tech1: {
      relevance: 'Cold atmospheric plasma is the technology being examined against the question that drives this project: can it be precise and responsible enough to reinforce ecosystem resilience without creating new problems? It is being examined because its properties suggest it could meet that standard.\n\nCAP requires low energy input, uses no chemical additives, and produces no waste products. The reactive species it generates are transient, decaying naturally over time, and are chemically identical to signalling molecules that plants already use internally. Whether these properties translate into a genuinely responsible intervention under real stress conditions is the tension this project is built around.'
    },
    tech2: {
      relevance: 'PAW composition varies between plasma sources and setups, and changes with age, so every batch must be characterised.'
    },
    method1: {
      relevance: 'The synthetic cocktail tells us whether PAW\u2019s effects come from its known chemistry or the plasma. The salinity gradient tests dose-response. The three developmental windows test whether early priming holds or fades.'
    },
    method2: {
      relevance: 'Most PAW studies use different setups and methods, making comparison difficult. Specific protocols will be informed by a methodology review.'
    },
    resp1: { relevance: '' },
    resp2: { relevance: '' },
    resp3: { relevance: '' },
    impact1: {
      relevance: 'The standard is intentionally high. A positive result means PAW passed a difficult test. A negative result is equally valuable.'
    },
    impact2: { relevance: '' }
  }
};
