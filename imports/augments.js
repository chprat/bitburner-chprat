const AugmentationCategory = {
  Hacking: 'Hacking',
  Strength: 'Strength',
  Defense: 'Defense',
  Charisma: 'Charisma',
  FactionReputation: 'FactionReputation',
  CompanyReputation: 'CompanyReputation',
  WorkMoney: 'WorkMoney',
  Dexterity: 'Dexterity',
  Agility: 'Agility',
  Special: 'Special',
  Crime: 'Crime',
  CrimeMoney: 'CrimeMoney'
}

const Factions = {
  CyberSec: 'CyberSec',
  TianDiHui: 'Tian Di Hui',
  Netburners: 'Netburners',
  Sector12: 'Sector-12',
  Chongqing: 'Chongqing',
  NewTokyo: 'New Tokyo',
  Ishima: 'Ishima',
  Aevum: 'Aevum',
  Volhaven: 'Volhaven',
  NiteSec: 'NiteSec',
  TheBlackHand: 'The Black Hand',
  BitRunners: 'BitRunners',
  MegeCorp: 'MegaCorp',
  BladeIndustries: 'Blade Industries',
  FourSigma: 'Four Sigma',
  KuaiGongInternational: 'KuaiGong Internationl',
  NWO: 'NWO',
  OmniTekIncorporated: 'OmniTek Incorporated',
  ECorp: 'ECorp',
  BachmanAndAssociates: 'Bachman & Associates',
  ClarkeIncorporated: 'Clarke Incorporated',
  FulcrumSecretTechnologies: 'Fulcrum Secret Technologies',
  SlumSnakes: 'Slum Snakes',
  Tetrads: 'Tetrads',
  Silhouette: 'Silhouette',
  SpeakersForTheDead: 'Speakers for the Dead',
  TheDarkArmy: 'The Dark Army',
  TheSyndicate: 'The Syndicate',
  TheCovenant: 'The Covenant',
  Daedalus: 'Daedalus',
  Illuminati: 'Illuminati'
}

const Augmentations = [
  { name: 'NeuroFlux Governor', category: [AugmentationCategory.Special], depends: [], factions: [Factions.CyberSec, Factions.TianDiHui, Factions.Netburners, Factions.Sector12, Factions.Aevum, Factions.NiteSec, Factions.TheBlackHand, Factions.BitRunners, Factions.SlumSnakes, Factions.NWO, Factions.Tetrads, Factions.SpeakersForTheDead, Factions.TheSyndicate, Factions.TheDarkArmy, Factions.Chongqing, Factions.NewTokyo, Factions.Ishima, Factions.MegeCorp, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.FourSigma, Factions.OmniTekIncorporated, Factions.ECorp, Factions.BachmanAndAssociates, Factions.ClarkeIncorporated, Factions.FulcrumSecretTechnologies, Factions.Silhouette, Factions.TheCovenant, Factions.Illuminati] },
  { name: 'ADR-V1 Pheromone Gene', category: [AugmentationCategory.CompanyReputation, AugmentationCategory.FactionReputation], depends: [], factions: [Factions.TianDiHui, Factions.NWO, Factions.TheSyndicate, Factions.MegeCorp, Factions.FourSigma] },
  { name: 'ADR-V2 Pheromone Gene', category: [AugmentationCategory.FactionReputation, AugmentationCategory.CompanyReputation], depends: [], factions: [Factions.FourSigma, Factions.BachmanAndAssociates, Factions.ClarkeIncorporated, Factions.Silhouette] },
  { name: 'Artificial Bio-neural Network Implant', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.BitRunners, Factions.FulcrumSecretTechnologies] },
  { name: 'Artificial Synaptic Potentiation', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.NiteSec, Factions.TheBlackHand] },
  { name: 'Augmented Targeting I', category: [AugmentationCategory.Dexterity], depends: [], factions: [Factions.Sector12, Factions.SlumSnakes, Factions.TheSyndicate, Factions.TheDarkArmy, Factions.Ishima, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.OmniTekIncorporated] },
  { name: 'Augmented Targeting II', category: [AugmentationCategory.Dexterity], depends: ['Augmented Targeting I'], factions: [Factions.Sector12, Factions.TheSyndicate, Factions.TheDarkArmy, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.OmniTekIncorporated] },
  { name: 'Augmented Targeting III', category: [AugmentationCategory.Dexterity], depends: ['Augmented Targeting II'], factions: [Factions.TheSyndicate, Factions.TheDarkArmy, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.OmniTekIncorporated, Factions.TheCovenant] },
  { name: 'Bionic Arms', category: [AugmentationCategory.Strength, AugmentationCategory.Dexterity], depends: [], factions: [Factions.Tetrads] },
  { name: 'Bionic Legs', category: [AugmentationCategory.Agility], depends: [], factions: [Factions.SpeakersForTheDead, Factions.TheSyndicate, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.OmniTekIncorporated] },
  { name: 'Bionic Spine', category: [AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: [], factions: [Factions.SpeakersForTheDead, Factions.TheSyndicate, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.OmniTekIncorporated] },
  { name: 'BitRunners Neurolink', category: [AugmentationCategory.Hacking, AugmentationCategory.Special], depends: [], factions: [Factions.BitRunners] },
  { name: 'BitWire', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.CyberSec, Factions.NiteSec] },
  { name: 'BrachiBlades', category: [AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.CrimeMoney, AugmentationCategory.Crime], depends: [], factions: [Factions.TheSyndicate] },
  { name: 'CashRoot Starter Kit', category: [AugmentationCategory.Special], depends: [], factions: [Factions.Sector12] },
  { name: 'Combat Rib I', category: [AugmentationCategory.Strength, AugmentationCategory.Defense], depends: [], factions: [Factions.SlumSnakes, Factions.Volhaven, Factions.TheSyndicate, Factions.TheDarkArmy, Factions.Ishima, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.OmniTekIncorporated] },
  { name: 'Combat Rib II', category: [AugmentationCategory.Strength, AugmentationCategory.Defense], depends: ['Combat Rib I'], factions: [Factions.Volhaven, Factions.TheSyndicate, Factions.TheDarkArmy, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.OmniTekIncorporated] },
  { name: 'Combat Rib III', category: [AugmentationCategory.Strength, AugmentationCategory.Defense], depends: ['Combat Rib II'], factions: [Factions.TheSyndicate, Factions.TheDarkArmy, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.OmniTekIncorporated, Factions.TheCovenant] },
  { name: 'CordiARC Fusion Reactor', category: [AugmentationCategory.Strength, AugmentationCategory.Defense], depends: [], factions: [Factions.MegeCorp] },
  { name: 'Cranial Signal Processors - Gen I', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.CyberSec, Factions.NiteSec] },
  { name: 'Cranial Signal Processors - Gen II', category: [AugmentationCategory.Hacking], depends: ['Cranial Signal Processors - Gen I'], factions: [Factions.CyberSec, Factions.NiteSec] },
  { name: 'Cranial Signal Processors - Gen III', category: [AugmentationCategory.Hacking], depends: ['Cranial Signal Processors - Gen II'], factions: [Factions.NiteSec, Factions.TheBlackHand, Factions.BitRunners] },
  { name: 'Cranial Signal Processors - Gen IV', category: [AugmentationCategory.Hacking], depends: ['Cranial Signal Processors - Gen III'], factions: [Factions.TheBlackHand, Factions.BitRunners] },
  { name: 'Cranial Signal Processors - Gen V', category: [AugmentationCategory.Hacking], depends: ['Cranial Signal Processors - Gen IV'], factions: [Factions.BitRunners] },
  { name: 'CRTX42-AA Gene Modification', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.NiteSec] },
  { name: 'DataJack', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.NiteSec, Factions.TheBlackHand, Factions.BitRunners, Factions.Chongqing, Factions.NewTokyo] },
  { name: 'DermaForce Particle Barrier', category: [AugmentationCategory.Defense], depends: [], factions: [Factions.Volhaven] },
  { name: 'ECorp HVMind Implant', category: [AugmentationCategory.Special], depends: [], factions: [Factions.ECorp] },
  { name: 'Embedded Netburner Module Analyze Engine', category: [AugmentationCategory.Hacking], depends: ['Embedded Netburner Module'], factions: [Factions.Daedalus, Factions.NWO, Factions.MegeCorp, Factions.ECorp, Factions.FulcrumSecretTechnologies, Factions.TheCovenant, Factions.Illuminati] },
  { name: 'Embedded Netburner Module Core Implant', category: [AugmentationCategory.Hacking], depends: ['Embedded Netburner Module'], factions: [Factions.TheBlackHand, Factions.BitRunners, Factions.NWO, Factions.MegeCorp, Factions.BladeIndustries, Factions.ECorp, Factions.FulcrumSecretTechnologies] },
  { name: 'Embedded Netburner Module Core V2 Upgrade', category: [AugmentationCategory.Hacking], depends: ['Embedded Netburner Module Core Implant'], factions: [Factions.BitRunners, Factions.NWO, Factions.MegeCorp, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.OmniTekIncorporated, Factions.ECorp, Factions.FulcrumSecretTechnologies] },
  { name: 'Embedded Netburner Module Core V3 Upgrade', category: [AugmentationCategory.Hacking], depends: ['Embedded Netburner Module Core V2 Upgrade'], factions: [Factions.Daedalus, Factions.NWO, Factions.MegeCorp, Factions.ECorp, Factions.FulcrumSecretTechnologies, Factions.TheCovenant, Factions.Illuminati] },
  { name: 'Embedded Netburner Module Direct Memory Access Upgrade', category: [AugmentationCategory.Hacking], depends: ['Embedded Netburner Module'], factions: [Factions.Daedalus, Factions.NWO, Factions.MegeCorp, Factions.ECorp, Factions.FulcrumSecretTechnologies, Factions.TheCovenant, Factions.Illuminati] },
  { name: 'Embedded Netburner Module', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.NiteSec, Factions.TheBlackHand, Factions.BitRunners, Factions.NWO, Factions.MegeCorp, Factions.BladeIndustries, Factions.ECorp, Factions.FulcrumSecretTechnologies] },
  { name: 'Enhanced Myelin Sheathing', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.TheBlackHand, Factions.BitRunners, Factions.FulcrumSecretTechnologies] },
  { name: 'Enhanced Social Interaction Implant', category: [AugmentationCategory.Charisma], depends: [], factions: [Factions.NWO, Factions.FourSigma, Factions.OmniTekIncorporated, Factions.BachmanAndAssociates, Factions.ClarkeIncorporated] },
  { name: 'FocusWire', category: [AugmentationCategory.WorkMoney, AugmentationCategory.CompanyReputation, AugmentationCategory.Special], depends: [], factions: [Factions.KuaiGongInternational, Factions.FourSigma, Factions.BachmanAndAssociates, Factions.ClarkeIncorporated] },
  { name: 'Graphene Bionic Arms Upgrade', category: [AugmentationCategory.Strength, AugmentationCategory.Dexterity], depends: ['Bionic Arms'], factions: [Factions.TheDarkArmy] },
  { name: 'Graphene Bionic Legs Upgrade', category: [AugmentationCategory.Agility], depends: ['Bionic Legs'], factions: [Factions.MegeCorp, Factions.ECorp, Factions.FulcrumSecretTechnologies] },
  { name: 'Graphene Bionic Spine Upgrade', category: [AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: ['Bionic Spine'], factions: [Factions.ECorp, Factions.FulcrumSecretTechnologies] },
  { name: 'Graphene Bone Lacings', category: [AugmentationCategory.Strength, AugmentationCategory.Defense], depends: [], factions: [Factions.FulcrumSecretTechnologies, Factions.TheCovenant] },
  { name: 'Graphene BrachiBlades Upgrade', category: [AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.CrimeMoney, AugmentationCategory.Crime], depends: ['BrachiBlades'], factions: [Factions.SpeakersForTheDead] },
  { name: 'Hacknet Node Cache Architecture Neural-Upload', category: [AugmentationCategory.HackNet], depends: [], factions: [Factions.Netburners] },
  { name: 'Hacknet Node Core Direct-Neural Interface', category: [AugmentationCategory.HackNet], depends: [], factions: [Factions.Netburners] },
  { name: 'Hacknet Node CPU Architecture Neural-Upload', category: [AugmentationCategory.HackNet], depends: [], factions: [Factions.Netburners] },
  { name: 'Hacknet Node Kernel Direct-Neural Interface', category: [AugmentationCategory.HackNet], depends: [], factions: [Factions.Netburners] },
  { name: 'Hacknet Node NIC Architecture Neural-Upload', category: [AugmentationCategory.HackNet], depends: [], factions: [Factions.Netburners] },
  { name: 'HemoRecirculator', category: [AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: [], factions: [Factions.Tetrads, Factions.TheSyndicate, Factions.TheDarkArmy] },
  { name: 'Hydroflame Left Arm', category: [AugmentationCategory.Strength], depends: [], factions: [Factions.NWO] },
  { name: 'HyperSight Corneal Implant', category: [AugmentationCategory.Hacking, AugmentationCategory.Dexterity], depends: [], factions: [Factions.BladeIndustries, Factions.KuaiGongInternational] },
  { name: 'INFRARET Enhancement', category: [AugmentationCategory.Dexterity, AugmentationCategory.Crime, AugmentationCategory.CrimeMoney], depends: [], factions: [Factions.Ishima] },
  { name: 'LuminCloaking-V1 Skin Implant', category: [AugmentationCategory.Agility, AugmentationCategory.Crime], depends: [], factions: [Factions.SlumSnakes, Factions.Tetrads] },
  { name: 'LuminCloaking-V2 Skin Implant', category: [AugmentationCategory.Agility, AugmentationCategory.CrimeMoney, AugmentationCategory.Defense], depends: ['LuminCloaking-V1 Skin Implant'], factions: [Factions.SlumSnakes, Factions.Tetrads] },
  { name: 'Nanofiber Weave', category: [AugmentationCategory.Strength, AugmentationCategory.Defense], depends: [], factions: [Factions.TianDiHui, Factions.SpeakersForTheDead, Factions.TheSyndicate, Factions.TheDarkArmy, Factions.BladeIndustries, Factions.OmniTekIncorporated, Factions.FulcrumSecretTechnologies] },
  { name: 'NEMEAN Subdermal Weave', category: [AugmentationCategory.Defense], depends: [], factions: [Factions.Daedalus, Factions.TheSyndicate, Factions.FulcrumSecretTechnologies, Factions.TheCovenant, Factions.Illuminati] },
  { name: 'Neotra', category: [AugmentationCategory.Strength, AugmentationCategory.Defense], depends: [], factions: [Factions.BladeIndustries] },
  { name: 'Neural Accelerator', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.BitRunners] },
  { name: 'Neural-Retention Enhancement', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.NiteSec] },
  { name: 'Neuralstimulator', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.Sector12, Factions.Aevum, Factions.TheBlackHand, Factions.Volhaven, Factions.Chongqing, Factions.NewTokyo, Factions.Ishima, Factions.FourSigma, Factions.BachmanAndAssociates, Factions.ClarkeIncorporated] },
  { name: 'Neuregen Gene Modification', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.Chongqing] },
  { name: 'Neuronal Densification', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.ClarkeIncorporated] },
  { name: 'Neuroreceptor Management Implant', category: [AugmentationCategory.Special], depends: [], factions: [Factions.TianDiHui] },
  { name: 'Neurotrainer I', category: [AugmentationCategory.Hacking, AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: [], factions: [Factions.CyberSec, Factions.Aevum] },
  { name: 'Neurotrainer II', category: [AugmentationCategory.Hacking, AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: ['Neurotrainer I'], factions: [Factions.NiteSec, Factions.BitRunners] },
  { name: 'Neurotrainer III', category: [AugmentationCategory.Hacking, AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: ['Neurotrainer II'], factions: [Factions.NWO, Factions.FourSigma] },
  { name: 'nextSENS Gene Modification', category: [AugmentationCategory.Special], depends: [], factions: [Factions.ClarkeIncorporated] },
  { name: 'Nuoptimal Nootropic Injector Implant', category: [AugmentationCategory.CompanyReputation], depends: [], factions: [Factions.TianDiHui, Factions.Volhaven, Factions.Chongqing, Factions.NewTokyo, Factions.FourSigma, Factions.BachmanAndAssociates, Factions.ClarkeIncorporated] },
  { name: 'NutriGen Implant', category: [AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: [], factions: [Factions.NewTokyo] },
  { name: 'OmniTek InfoLoad', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.OmniTekIncorporated] },
  { name: 'PC Direct-Neural Interface NeuroNet Injector', category: [AugmentationCategory.Hacking, AugmentationCategory.CompanyReputation], depends: ['PC Direct-Neural Interface'], factions: [Factions.FulcrumSecretTechnologies] },
  { name: 'PC Direct-Neural Interface Optimization Submodule', category: [AugmentationCategory.Hacking, AugmentationCategory.CompanyReputation], depends: ['PC Direct-Neural Interface'], factions: [Factions.BladeIndustries, Factions.ECorp, Factions.FulcrumSecretTechnologies] },
  { name: 'PC Direct-Neural Interface', category: [AugmentationCategory.Hacking, AugmentationCategory.CompanyReputation], depends: [], factions: [Factions.BladeIndustries, Factions.FourSigma, Factions.OmniTekIncorporated, Factions.ECorp] },
  { name: 'PCMatrix', category: [AugmentationCategory.Charisma, AugmentationCategory.FactionReputation, AugmentationCategory.CompanyReputation, AugmentationCategory.Crime, AugmentationCategory.CrimeMoney, AugmentationCategory.WorkMoney, AugmentationCategory.Special], depends: [], factions: [Factions.Aevum] },
  { name: 'Photosynthetic Cells', category: [AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Agility], depends: [], factions: [Factions.KuaiGongInternational] },
  { name: 'Power Recirculation Core', category: [AugmentationCategory.Hacking, AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: [], factions: [Factions.NWO, Factions.Tetrads, Factions.TheSyndicate, Factions.TheDarkArmy] },
  { name: 'QLink', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.Illuminati] },
  { name: 'SmartJaw', category: [AugmentationCategory.Charisma, AugmentationCategory.CompanyReputation, AugmentationCategory.FactionReputation], depends: [], factions: [Factions.BachmanAndAssociates] },
  { name: 'SmartSonar Implant', category: [AugmentationCategory.Dexterity, AugmentationCategory.CrimeMoney], depends: [], factions: [Factions.SlumSnakes] },
  { name: 'Social Negotiation Assistant (S.N.A)', category: [AugmentationCategory.FactionReputation, AugmentationCategory.CompanyReputation, AugmentationCategory.WorkMoney], depends: [], factions: [Factions.TianDiHui] },
  { name: 'Speech Enhancement', category: [AugmentationCategory.CompanyReputation, AugmentationCategory.Charisma], depends: [], factions: [Factions.TianDiHui, Factions.SpeakersForTheDead, Factions.KuaiGongInternational, Factions.FourSigma, Factions.BachmanAndAssociates, Factions.ClarkeIncorporated] },
  { name: 'Speech Processor Implant', category: [AugmentationCategory.Charisma], depends: [], factions: [Factions.TianDiHui, Factions.Sector12, Factions.Aevum, Factions.Volhaven, Factions.Chongqing, Factions.NewTokyo, Factions.Ishima, Factions.Silhouette] },
  { name: 'SPTN-97 Gene Modification', category: [AugmentationCategory.Hacking, AugmentationCategory.Defense, AugmentationCategory.Strength], depends: [], factions: [Factions.TheCovenant] },
  { name: 'Synaptic Enhancement Implant', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.CyberSec, Factions.Aevum] },
  { name: 'Synfibril Muscle', category: [AugmentationCategory.Strength, AugmentationCategory.Defense], depends: [], factions: [Factions.Daedalus, Factions.NWO, Factions.SpeakersForTheDead, Factions.BladeIndustries, Factions.KuaiGongInternational, Factions.FulcrumSecretTechnologies, Factions.TheCovenant, Factions.Illuminati] },
  { name: 'Synthetic Heart', category: [AugmentationCategory.Strength, AugmentationCategory.Agility], depends: [], factions: [Factions.Daedalus, Factions.NWO, Factions.SpeakersForTheDead, Factions.KuaiGongInternational, Factions.FulcrumSecretTechnologies, Factions.TheCovenant, Factions.Illuminati] },
  { name: 'The Black Hand', category: [AugmentationCategory.Hacking, AugmentationCategory.Strength, AugmentationCategory.Dexterity], depends: [], factions: [Factions.TheBlackHand] },
  { name: 'The Red Pill', category: [AugmentationCategory.Special], depends: [], factions: [Factions.Daedalus] },
  { name: 'TITN-41 Gene-Modification Injection', category: [AugmentationCategory.Charisma], depends: [], factions: [Factions.Silhouette] },
  { name: 'Unstable Circadian Modulator', category: [AugmentationCategory.Hacking], depends: [], factions: [Factions.SpeakersForTheDead] },
  { name: 'Wired Reflexes', category: [AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: [], factions: [Factions.Sector12, Factions.Aevum, Factions.SlumSnakes, Factions.Volhaven, Factions.SpeakersForTheDead, Factions.TheSyndicate, Factions.TheDarkArmy, Factions.Ishima] },
  { name: 'Xanipher', category: [AugmentationCategory.Hacking, AugmentationCategory.Strength, AugmentationCategory.Defense, AugmentationCategory.Dexterity, AugmentationCategory.Agility], depends: [], factions: [Factions.NWO] },
  { name: "The Shadow's Simulacrum", category: [AugmentationCategory.FactionReputation, AugmentationCategory.CompanyReputation], depends: [], factions: [Factions.SpeakersForTheDead, Factions.TheSyndicate, Factions.TheDarkArmy] }
]
