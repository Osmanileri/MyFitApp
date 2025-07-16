// 🏋️‍♂️ MUSCLE GROUPS DATA
// Professional muscle groups configuration for body map

export const BODY_MAP_COLORS = {
  // Ana renkler
  primary: '#FF6B35',
  secondary: '#4ECDC4',
  accent: '#45B7D1',
  
  // Kas grubu renkleri
  chest: '#FF6B35',
  shoulders: '#4ECDC4',
  biceps: '#45B7D1',
  triceps: '#96CEB4',
  forearms: '#FECA57',
  abs: '#FF6B35',
  back: '#6C5CE7',
  glutes: '#A29BFE',
  quads: '#FD79A8',
  hamstrings: '#FDCB6E',
  calves: '#E17055',
  
  // Sistem renkleri
  default: '#E0E0E0',
  hover: '#FF6B35',
  selected: '#FF6B35',
  bodyOutline: '#888888',
  bodyFill: '#F5F5F5'
};

export const MUSCLE_GROUPS = [
  // GÖĞÜS
  {
    id: 'chest',
    name: 'Göğüs',
    nameEn: 'Chest',
    view: 'front',
    hoverColor: BODY_MAP_COLORS.chest,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Göğüs kasları (Pectoralis Major) - itme hareketlerinde ana kas grubu',
    exercises: [
      'bench_press',
      'push_up',
      'dumbbell_fly',
      'incline_press',
      'decline_press',
      'dumbbell_press',
      'cable_crossover',
      'chest_dip'
    ],
    coordinates: {
      front: `M130,95 C140,90 160,90 170,95 L175,130 C170,140 160,145 150,145 C140,145 130,140 125,130 L130,95 Z`,
      back: null
    }
  },
  
  // OMUZLAR
  {
    id: 'shoulders',
    name: 'Omuz',
    nameEn: 'Shoulders',
    view: 'both',
    hoverColor: BODY_MAP_COLORS.shoulders,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Deltoid kasları - omuz hareketlerinin ana kas grubu',
    exercises: [
      'shoulder_press',
      'lateral_raise',
      'front_raise',
      'rear_delt_fly',
      'arnold_press',
      'upright_row',
      'face_pull',
      'handstand_push_up'
    ],
    coordinates: {
      front: `M110,85 C120,80 130,85 125,105 L115,115 C110,110 105,95 110,85 Z M175,85 C185,80 195,85 190,105 L180,115 C175,110 170,95 175,85 Z`,
      back: `M110,85 C120,80 130,85 125,105 L115,115 C110,110 105,95 110,85 Z M175,85 C185,80 195,85 190,105 L180,115 C175,110 170,95 175,85 Z`
    }
  },
  
  // BİCEPS
  {
    id: 'biceps',
    name: 'Biceps',
    nameEn: 'Biceps',
    view: 'front',
    hoverColor: BODY_MAP_COLORS.biceps,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'İki başlı pazı kası - kol bükme hareketlerinin ana kas grubu',
    exercises: [
      'bicep_curl',
      'hammer_curl',
      'chin_up',
      'preacher_curl',
      'concentration_curl',
      'cable_curl',
      'barbell_curl',
      '21s_curl'
    ],
    coordinates: {
      front: `M105,115 C115,110 125,115 120,150 L110,160 C105,155 100,130 105,115 Z M180,115 C190,110 200,115 195,150 L185,160 C180,155 175,130 180,115 Z`,
      back: null
    }
  },
  
  // TRİCEPS
  {
    id: 'triceps',
    name: 'Triceps',
    nameEn: 'Triceps',
    view: 'back',
    hoverColor: BODY_MAP_COLORS.triceps,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Üç başlı pazı kası - kol açma hareketlerinin ana kas grubu',
    exercises: [
      'tricep_dip',
      'tricep_extension',
      'diamond_push_up',
      'overhead_extension',
      'cable_pushdown',
      'close_grip_press',
      'tricep_kickback',
      'skull_crusher'
    ],
    coordinates: {
      front: null,
      back: `M105,115 C115,110 125,115 120,150 L110,160 C105,155 100,130 105,115 Z M180,115 C190,110 200,115 195,150 L185,160 C180,155 175,130 180,115 Z`
    }
  },
  
  // ÖN KOL
  {
    id: 'forearms',
    name: 'Önkol',
    nameEn: 'Forearms',
    view: 'both',
    hoverColor: BODY_MAP_COLORS.forearms,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Önkol kasları - kavrama gücü ve bilek hareketleri',
    exercises: [
      'wrist_curl',
      'reverse_wrist_curl',
      'farmer_walk',
      'dead_hang',
      'grip_crush',
      'hammer_hold',
      'plate_pinch',
      'reverse_curl'
    ],
    coordinates: {
      front: `M108,165 C118,160 128,165 123,200 L113,210 C108,205 103,180 108,165 Z M177,165 C187,160 197,165 192,200 L182,210 C177,205 172,180 177,165 Z`,
      back: `M108,165 C118,160 128,165 123,200 L113,210 C108,205 103,180 108,165 Z M177,165 C187,160 197,165 192,200 L182,210 C177,205 172,180 177,165 Z`
    }
  },
  
  // KARIN
  {
    id: 'abs',
    name: 'Karın',
    nameEn: 'Abs',
    view: 'front',
    hoverColor: BODY_MAP_COLORS.abs,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Karın kasları (Rectus Abdominis) - core stabilizasyonu',
    exercises: [
      'crunch',
      'plank',
      'leg_raise',
      'bicycle_crunch',
      'mountain_climber',
      'russian_twist',
      'dead_bug',
      'hollow_hold'
    ],
    coordinates: {
      front: `M135,150 C145,145 155,145 165,150 L170,210 C165,220 155,225 150,225 C145,225 135,220 130,210 L135,150 Z`,
      back: null
    }
  },
  
  // SIRT
  {
    id: 'back',
    name: 'Sırt',
    nameEn: 'Back',
    view: 'back',
    hoverColor: BODY_MAP_COLORS.back,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Sırt kasları (Latissimus Dorsi, Rhomboids) - çekme hareketleri',
    exercises: [
      'pull_up',
      'lat_pulldown',
      'bent_over_row',
      'deadlift',
      'seated_row',
      'single_arm_row',
      'face_pull',
      'reverse_fly'
    ],
    coordinates: {
      front: null,
      back: `M130,95 C140,90 160,90 170,95 L175,180 C170,190 160,195 150,195 C140,195 130,190 125,180 L130,95 Z`
    }
  },
  
  // KALÇA
  {
    id: 'glutes',
    name: 'Kalça',
    nameEn: 'Glutes',
    view: 'back',
    hoverColor: BODY_MAP_COLORS.glutes,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Kalça kasları (Gluteus Maximus) - güçlü hareket kaynağı',
    exercises: [
      'squat',
      'hip_thrust',
      'deadlift',
      'bulgarian_split_squat',
      'glute_bridge',
      'lunge',
      'step_up',
      'clamshell'
    ],
    coordinates: {
      front: null,
      back: `M135,200 C145,195 155,195 165,200 L170,235 C165,245 155,250 150,250 C145,250 135,245 130,235 L135,200 Z`
    }
  },
  
  // ÖN BACAK (QUADRICEPS)
  {
    id: 'quads',
    name: 'Ön Bacak',
    nameEn: 'Quadriceps',
    view: 'front',
    hoverColor: BODY_MAP_COLORS.quads,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Quadriceps kasları - diz açma ve bacak güçlendirme',
    exercises: [
      'squat',
      'leg_press',
      'lunge',
      'leg_extension',
      'front_squat',
      'bulgarian_split_squat',
      'step_up',
      'wall_sit'
    ],
    coordinates: {
      front: `M125,240 C135,235 145,240 140,320 L130,330 C125,325 120,260 125,240 Z M160,240 C170,235 180,240 175,320 L165,330 C160,325 155,260 160,240 Z`,
      back: null
    }
  },
  
  // ARKA BACAK (HAMSTRINGS)
  {
    id: 'hamstrings',
    name: 'Arka Bacak',
    nameEn: 'Hamstrings',
    view: 'back',
    hoverColor: BODY_MAP_COLORS.hamstrings,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Hamstring kasları - diz bükme ve kalça ekstansiyonu',
    exercises: [
      'deadlift',
      'leg_curl',
      'good_morning',
      'single_leg_deadlift',
      'glute_ham_raise',
      'nordic_curl',
      'stiff_leg_deadlift',
      'reverse_lunge'
    ],
    coordinates: {
      front: null,
      back: `M125,240 C135,235 145,240 140,320 L130,330 C125,325 120,260 125,240 Z M160,240 C170,235 180,240 175,320 L165,330 C160,325 155,260 160,240 Z`
    }
  },
  
  // BALDIRLAR
  {
    id: 'calves',
    name: 'Baldır',
    nameEn: 'Calves',
    view: 'both',
    hoverColor: BODY_MAP_COLORS.calves,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Baldır kasları (Gastrocnemius, Soleus) - ayak parmak ucu kalkma',
    exercises: [
      'calf_raise',
      'seated_calf_raise',
      'jump_rope',
      'single_leg_calf_raise',
      'donkey_calf_raise',
      'wall_push_calf_raise',
      'farmer_walk_toes',
      'box_jump'
    ],
    coordinates: {
      front: `M128,340 C138,335 148,340 143,400 L133,410 C128,405 123,360 128,340 Z M157,340 C167,335 177,340 172,400 L162,410 C157,405 152,360 157,340 Z`,
      back: `M128,340 C138,335 148,340 143,400 L133,410 C128,405 123,360 128,340 Z M157,340 C167,335 177,340 172,400 L162,410 C157,405 152,360 157,340 Z`
    }
  },
  
  // ESKİ SİSTEMLE UYUMLULUK İÇİN GENEL GRUPLAR
  {
    id: 'arms',
    name: 'Kollar',
    nameEn: 'Arms',
    view: 'both',
    hoverColor: BODY_MAP_COLORS.biceps,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Genel kol kasları - biceps, triceps ve önkol',
    exercises: [
      'bicep_curl',
      'tricep_dip',
      'hammer_curl',
      'overhead_extension',
      'close_grip_push_up',
      'chin_up',
      'diamond_push_up',
      'arm_circle'
    ],
    coordinates: {
      front: `M105,115 C115,110 125,115 120,150 L110,160 C105,155 100,130 105,115 Z M180,115 C190,110 200,115 195,150 L185,160 C180,155 175,130 180,115 Z`,
      back: `M105,115 C115,110 125,115 120,150 L110,160 C105,155 100,130 105,115 Z M180,115 C190,110 200,115 195,150 L185,160 C180,155 175,130 180,115 Z`
    }
  },
  
  {
    id: 'legs',
    name: 'Bacaklar',
    nameEn: 'Legs',
    view: 'both',
    hoverColor: BODY_MAP_COLORS.quads,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Genel bacak kasları - quadriceps, hamstrings ve baldırlar',
    exercises: [
      'squat',
      'lunge',
      'deadlift',
      'leg_press',
      'calf_raise',
      'leg_curl',
      'step_up',
      'wall_sit'
    ],
    coordinates: {
      front: `M125,240 C135,235 145,240 140,320 L130,330 C125,325 120,260 125,240 Z M160,240 C170,235 180,240 175,320 L165,330 C160,325 155,260 160,240 Z`,
      back: `M125,240 C135,235 145,240 140,320 L130,330 C125,325 120,260 125,240 Z M160,240 C170,235 180,240 175,320 L165,330 C160,325 155,260 160,240 Z`
    }
  },
  
  {
    id: 'core',
    name: 'Core',
    nameEn: 'Core',
    view: 'front',
    hoverColor: BODY_MAP_COLORS.abs,
    defaultColor: BODY_MAP_COLORS.default,
    description: 'Core kasları - karın, alt sırt ve yan kaslar',
    exercises: [
      'plank',
      'crunch',
      'leg_raise',
      'russian_twist',
      'mountain_climber',
      'dead_bug',
      'bicycle_crunch',
      'hollow_hold'
    ],
    coordinates: {
      front: `M135,150 C145,145 155,145 165,150 L170,210 C165,220 155,225 150,225 C145,225 135,220 130,210 L135,150 Z`,
      back: null
    }
  }
];

// ANIMATION CONFIG
export const ANIMATION_CONFIG = {
  duration: 250,
  damping: 15,
  stiffness: 300,
  mass: 1,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001
};

// MUSCLE GROUP HELPERS
export const getMuscleGroupsByView = (view) => {
  return MUSCLE_GROUPS.filter(group => 
    group.view === view || group.view === 'both'
  );
};

export const getMuscleGroupById = (id) => {
  return MUSCLE_GROUPS.find(group => group.id === id);
};

export const getMuscleGroupExercises = (id) => {
  const group = getMuscleGroupById(id);
  return group ? group.exercises : [];
};

// VIEW MAPPING
export const VIEW_LABELS = {
  front: {
    tr: 'Ön Görünüm',
    en: 'Front View'
  },
  back: {
    tr: 'Arka Görünüm', 
    en: 'Back View'
  }
};

// ACCESSIBILITY LABELS
export const ACCESSIBILITY_LABELS = {
  bodyMap: 'İnteraktif vücut haritası',
  rotateButton: 'Görünümü çevir',
  muscleGroup: (name) => `${name} kas grubu`,
  exerciseList: (name) => `${name} egzersizleri`,
  selectMuscle: 'Kas grubu seçmek için dokunun',
  viewExercises: 'Egzersiz listesini görmek için dokunun'
};

export default MUSCLE_GROUPS; 