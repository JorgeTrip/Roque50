/**
 * Constantes y Datos Iniciales por Defecto - Módulo Transporte
 */

const DEFAULT_DESTINATION = {
  name: "Ushuaia 1990, La Reja, Moreno, Provincia de Buenos Aires",
  lat: -34.649384,
  lon: -58.847288
};

const ZONE_DEFAULTS = [
  {name:DEFAULT_DESTINATION.name, lat:DEFAULT_DESTINATION.lat, lon:DEFAULT_DESTINATION.lon, region:"PBA", isDestination:true, kind:"address"},
  {name:"Villa Urquiza, CABA",lat:-34.5719,lon:-58.4903,region:"CABA",kind:"zone"},
  {name:"Balvanera, CABA",lat:-34.6083,lon:-58.4020,region:"CABA",kind:"zone"},
  {name:"La Boca, CABA",lat:-34.6345,lon:-58.3631,region:"CABA",kind:"zone"},
  {name:"Paternal, CABA",lat:-34.5975,lon:-58.4703,region:"CABA",kind:"zone"},
  {name:"Almagro, CABA",lat:-34.6083,lon:-58.4205,region:"CABA",kind:"zone"},
  {name:"Belgrano, CABA",lat:-34.5627,lon:-58.4570,region:"CABA",kind:"zone"},
  {name:"Caballito, CABA",lat:-34.6187,lon:-58.4406,region:"CABA",kind:"zone"},
  {name:"Flores, CABA",lat:-34.6280,lon:-58.4633,region:"CABA",kind:"zone"},
  {name:"Palermo, CABA",lat:-34.5875,lon:-58.4306,region:"CABA",kind:"zone"},
  {name:"Recoleta, CABA",lat:-34.5875,lon:-58.3931,region:"CABA",kind:"zone"},
  {name:"Núñez, CABA",lat:-34.5453,lon:-58.4637,region:"CABA",kind:"zone"},
  {name:"Villa Devoto, CABA",lat:-34.5978,lon:-58.5219,region:"CABA",kind:"zone"},
  {name:"Villa del Parque, CABA",lat:-34.6031,lon:-58.4919,region:"CABA",kind:"zone"},
  {name:"Mataderos, CABA",lat:-34.6572,lon:-58.5133,region:"CABA",kind:"zone"},
  {name:"Liniers, CABA",lat:-34.6428,lon:-58.5250,region:"CABA",kind:"zone"},
  {name:"San Telmo, CABA",lat:-34.6212,lon:-58.3731,region:"CABA",kind:"zone"},
  {name:"Boedo, CABA",lat:-34.6295,lon:-58.4177,region:"CABA",kind:"zone"},
  {name:"Floresta, CABA",lat:-34.6280,lon:-58.4830,region:"CABA",kind:"zone"},
  {name:"Once, CABA",lat:-34.6083,lon:-58.4083,region:"CABA",kind:"zone"},
  {name:"Constitución, CABA",lat:-34.6270,lon:-58.3810,region:"CABA",kind:"zone"},
  {name:"Barracas, CABA",lat:-34.6420,lon:-58.3810,region:"CABA",kind:"zone"},
  {name:"Chacarita, CABA",lat:-34.5850,lon:-58.4530,region:"CABA",kind:"zone"},
  {name:"Colegiales, CABA",lat:-34.5740,lon:-58.4490,region:"CABA",kind:"zone"},
  {name:"Saavedra, CABA",lat:-34.5540,lon:-58.4880,region:"CABA",kind:"zone"},
  {name:"Villa Pueyrredón, CABA",lat:-34.5850,lon:-58.5030,region:"CABA",kind:"zone"},
  {name:"Villa Luro, CABA",lat:-34.6390,lon:-58.5010,region:"CABA",kind:"zone"},
  {name:"Monte Castro, CABA",lat:-34.6180,lon:-58.5100,region:"CABA",kind:"zone"},
  {name:"Parque Patricios, CABA",lat:-34.6390,lon:-58.4030,region:"CABA",kind:"zone"},
  {name:"Villa Lugano, CABA",lat:-34.6790,lon:-58.4720,region:"CABA",kind:"zone"},
  {name:"Nueva Pompeya, CABA",lat:-34.6520,lon:-58.4180,region:"CABA",kind:"zone"},
  {name:"Moreno, Provincia de Buenos Aires",lat:-34.6520,lon:-58.7900,region:"PBA",kind:"zone"},
  {name:"Merlo, Provincia de Buenos Aires",lat:-34.6650,lon:-58.7280,region:"PBA",kind:"zone"},
  {name:"Morón, Provincia de Buenos Aires",lat:-34.6534,lon:-58.6198,region:"PBA",kind:"zone"},
  {name:"San Justo, Provincia de Buenos Aires",lat:-34.6836,lon:-58.5631,region:"PBA",kind:"zone"},
  {name:"Ituzaingó, Provincia de Buenos Aires",lat:-34.6600,lon:-58.6690,region:"PBA",kind:"zone"},
  {name:"Castelar, Provincia de Buenos Aires",lat:-34.6500,lon:-58.6450,region:"PBA",kind:"zone"},
  {name:"Ramos Mejía, Provincia de Buenos Aires",lat:-34.6390,lon:-58.5630,region:"PBA",kind:"zone"},
  {name:"Haedo, Provincia de Buenos Aires",lat:-34.6420,lon:-58.5900,region:"PBA",kind:"zone"},
  {name:"Ciudadela, Provincia de Buenos Aires",lat:-34.6360,lon:-58.5390,region:"PBA",kind:"zone"},
  {name:"San Antonio de Padua, Provincia de Buenos Aires",lat:-34.6580,lon:-58.7680,region:"PBA",kind:"zone"},
  {name:"Berazategui, Provincia de Buenos Aires",lat:-34.7633,lon:-58.2117,region:"PBA",kind:"zone"},
  {name:"Tortuguitas, Provincia de Buenos Aires",lat:-34.4742,lon:-58.7562,region:"PBA",kind:"zone"},
  {name:"William C. Morris, Provincia de Buenos Aires",lat:-34.5828,lon:-58.6472,region:"PBA",kind:"zone"},
  {name:"Villa Crespo, CABA",lat:-34.5997,lon:-58.4447,region:"CABA",kind:"zone"},
  {name:"Villa Real, CABA",lat:-34.6186,lon:-58.5230,region:"CABA",kind:"zone"},
  {name:"Villa General Mitre, CABA",lat:-34.6123,lon:-58.4680,region:"CABA",kind:"zone"}
];

const DEFAULT_GUESTS = [
  {id:"special1",names:"Roque y Jorge (nosotros)",people:[{name:"Roque",isChild:false},{name:"Jorge",isChild:false}],personas:2,confirmed:"yes",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"car-space",freeSpots:2,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Salimos temprano hacia La Reja. Podemos llevar hasta 2 personas que quieran viajar antes.",special:true},
  {id:"g1",names:"Matías, Yuly y Briana",people:[{name:"Matías",isChild:false},{name:"Yuly",isChild:false},{name:"Briana",isChild:false}],confirmed:"yes",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"car-no-space",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Van con auto, pero probablemente sumen a la familia de Yuly y el auto quede lleno."},
  {id:"g2",names:"Familia de Yuly",people:[{name:"Integrante 1",isChild:false},{name:"Integrante 2",isChild:false},{name:"Integrante 3",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"ride-assigned",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"Matías, Yuly y Briana",notes:"Probablemente viajen con Matías, Yuly y Briana (auto lleno)."},
  {id:"g3",names:"Leo y Fabián",people:[{name:"Leo",isChild:false},{name:"Fabián",isChild:false}],confirmed:"yes",zone:"Villa Urquiza, CABA",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Tienen auto; falta confirmar si van con lugar disponible."},
  {id:"g4",names:"Arturo",people:[{name:"Arturo",isChild:false}],confirmed:"yes",zone:"Balvanera, CABA",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"needs-ride",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Necesita que lo lleven desde Balvanera."},
  {id:"g5",names:"José",people:[{name:"José",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:""},
  {id:"g6",names:"Gabriel",people:[{name:"Gabriel",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Vio el mensaje; probablemente no venga."},
  {id:"g7",names:"Sole, Ger y Ema",people:[{name:"Sole",isChild:false},{name:"Ger",isChild:false},{name:"Ema",isChild:false}],confirmed:"tentative",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Confirma más adelante según el clima (el festejo es al aire libre)."},
  {id:"g8",names:"Daniela y Ariel",people:[{name:"Daniela",isChild:false},{name:"Ariel",isChild:false}],confirmed:"yes",zone:"La Boca, CABA",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Tienen auto; falta confirmar si van con lugar disponible."},
  {id:"g9",names:"Glenda, Gabriel y Lautaro",people:[{name:"Glenda",isChild:false},{name:"Gabriel",isChild:false},{name:"Lautaro",isChild:false}],confirmed:"yes",zone:"Balvanera, CABA",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Tienen auto; falta confirmar si van con lugar disponible."},
  {id:"g10",names:"Pablo y Fernando",people:[{name:"Pablo",isChild:false},{name:"Fernando",isChild:false}],confirmed:"yes",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"ride-assigned",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"Viviana y Silvio",notes:"No tienen auto y les queda lejos. Viviana y Silvio finalmente los llevan."},
  {id:"g11",names:"Micaela y Tiziano",people:[{name:"Micaela",isChild:false},{name:"Tiziano",isChild:false}],confirmed:"yes",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"public",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Vienen en transporte público."},
  {id:"g12",names:"Adrián y Marcela",people:[{name:"Adrián",isChild:false},{name:"Marcela",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:""},
  {id:"g13",names:"Mariela, Mathias y Benjamín",people:[{name:"Mariela",isChild:false},{name:"Mathias",isChild:true},{name:"Benjamín",isChild:true}],confirmed:"yes",zone:"Balvanera, CABA",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"car-space",freeSpots:2,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Auto con 2 lugares libres en Balvanera, disponibles para otros invitados de la zona."},
  {id:"g14",names:"Fernanda",people:[{name:"Fernanda",isChild:false}],confirmed:"yes",zone:"Paternal, CABA",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"car-space",freeSpots:4,assignedPassengers:["g19"],assignmentDone:true,assignedDriverName:"",notes:"Puede llevar a Marisol, Omar y Walter, y todavía le quedaría un lugar libre en Paternal."},
  {id:"g15",names:"Omar",people:[{name:"Omar",isChild:false}],confirmed:"yes",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"public",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Viaja en transporte público. Alternativa: podría ir con Fernanda si prefiere auto."},
  {id:"g16",names:"Walter",people:[{name:"Walter",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Vio el mensaje pero no respondió. Posible pasajero con Fernanda si confirma y define zona."},
  {id:"g17",names:"Ana y Pablo",people:[{name:"Ana",isChild:false},{name:"Pablo",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Quedó en confirmar."},
  {id:"g18",names:"Pato, Rodrigo, Joaquín y Cristina",people:[{name:"Pato",isChild:false},{name:"Rodrigo",isChild:false},{name:"Joaquín",isChild:false},{name:"Cristina",isChild:false}],confirmed:"yes",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"car-no-space",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Vienen con auto lleno."},
  {id:"g19",names:"Marisol (de Coto)",people:[{name:"Marisol",isChild:false}],confirmed:"yes",zone:"Paternal, CABA",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"ride-assigned",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"Fernanda",notes:"La lleva Fernanda desde Paternal."},
  {id:"g20",names:"Julieta y su novio",people:[{name:"Julieta",isChild:false},{name:"su novio",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Quedó en hablar con el novio y confirmar."},
  {id:"g21",names:"Liliana y Jazmín",people:[{name:"Liliana",isChild:false},{name:"Jazmín",isChild:false}],confirmed:"yes",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Creen que tienen auto; falta confirmar modo y disponibilidad."},
  {id:"g22",names:"Yanina, David, Sahira y Anias",people:[{name:"Yanina",isChild:false},{name:"David",isChild:false},{name:"Sahira",isChild:false},{name:"Anias",isChild:false}],confirmed:"yes",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"public",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Viajan en transporte público."},
  {id:"g23",names:"Romina, Constanza, Mariana y Camila",people:[{name:"Romina",isChild:false},{name:"Constanza",isChild:false},{name:"Mariana",isChild:false},{name:"Camila",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:""},
  {id:"g24",names:"Fanny, Patricio y Susana",people:[{name:"Fanny",isChild:false},{name:"Patricio",isChild:false},{name:"Susana",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:""},
  {id:"g25",names:"Andrés, Emilia y Benjamín",people:[{name:"Andrés",isChild:false},{name:"Emilia",isChild:false},{name:"Benjamín",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Quedó en confirmar."},
  {id:"g26",names:"Cinthia",people:[{name:"Cinthia",isChild:false}],confirmed:"no",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"not-coming",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"No viene."},
  {id:"g27",names:"Carolina, Diego y Martín",people:[{name:"Carolina",isChild:false},{name:"Diego",isChild:false},{name:"Martín",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"No trabajan ese día; quedó en confirmar."},
  {id:"g28",names:"Adriana, Hugo y los mellis",people:[{name:"Adriana",isChild:false},{name:"Hugo",isChild:false},{name:"Mellizo/a 1",isChild:true},{name:"Mellizo/a 2",isChild:true}],confirmed:"yes",zone:"La Reja, Moreno, Provincia de Buenos Aires",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"host",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Dueños de la casa donde es el festejo. No necesitan transporte."},
  {id:"g29",names:"Sergio y Antonella",people:[{name:"Sergio",isChild:false},{name:"Antonella",isChild:false}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:""},
  {id:"g30",names:"Viviana y Silvio",people:[{name:"Viviana",isChild:false},{name:"Silvio",isChild:false}],confirmed:"yes",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"car-space",freeSpots:2,assignedPassengers:["g10"],assignmentDone:true,assignedDriverName:"",notes:"Tienen auto y finalmente pueden llevar a Pablo y Fernando."},
  {id:"g31",names:"Dante y Nahara (hijos de Viviana y Silvio)",people:[{name:"Dante",isChild:true},{name:"Nahara",isChild:true}],confirmed:"pending",zone:"",zoneLat:null,zoneLon:null,zoneRegion:null,transport:"pending",freeSpots:0,assignedPassengers:[],assignmentDone:false,assignedDriverName:"",notes:"Asistencia incierta. Si vienen, el auto de sus padres no tendría lugar para más pasajeros."}
];

const TRANSPORT_LABELS = {
  "pending":"Sin definir",
  "car-no-space":"Auto propio — sin lugar",
  "car-space":"Auto propio — con lugar",
  "public":"Transporte público",
  "needs-ride":"Necesita que lo lleven",
  "ride-assigned":"Transporte asignado (con otro invitado)",
  "host":"Anfitriones — no necesitan transporte",
  "not-coming":"No viene"
};

const CONFIRMED_LABELS = {yes:"Sí, confirmado",no:"No viene",pending:"Pendiente",tentative:"Tal vez / a confirmar"};
