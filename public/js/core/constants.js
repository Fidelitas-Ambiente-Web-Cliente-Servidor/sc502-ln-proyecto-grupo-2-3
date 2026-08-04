const parqueos = [
    {
        id:1,
        nombre:"Parqueo Central",
        provincia:"San José",
        zona:"Escazú",
        ubicacion:"Escazú Centro",
        precio:1500,
        espacios:18,
        calificacion:4.9,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"
    },
    {
        id:2,
        nombre:"City Parking",
        provincia:"Heredia",
        zona:"Belén",
        ubicacion:"Belén",
        precio:1200,
        espacios:0,
        calificacion:4.7,
        disponible:false,
        imagen:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
    },
    {
        id:3,
        nombre:"Parking Plaza",
        provincia:"Alajuela",
        zona:"Centro",
        ubicacion:"Alajuela Centro",
        precio:1000,
        espacios:8,
        calificacion:4.8,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800"
    },
    {
        id:4,
        nombre:"Safe Parking",
        provincia:"Cartago",
        zona:"Centro",
        ubicacion:"Cartago Centro",
        precio:1800,
        espacios:5,
        calificacion:5.0,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"
    },
    {
        id:5,
        nombre:"Pacific Parking",
        provincia:"Puntarenas",
        zona:"Puntarenas",
        ubicacion:"Paseo de los Turistas",
        precio:1400,
        espacios:14,
        calificacion:4.6,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1494526585095-c41746248156?w=800"
    },
    {
        id:6,
        nombre:"Limon Parking",
        provincia:"Limón",
        zona:"Centro",
        ubicacion:"Puerto Limón",
        precio:1100,
        espacios:9,
        calificacion:4.5,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"
    },
    {
        id:7,
        nombre:"Liberia Park",
        provincia:"Guanacaste",
        zona:"Liberia",
        ubicacion:"Liberia Centro",
        precio:1300,
        espacios:12,
        calificacion:4.7,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800"
    },
    {
        id:8,
        nombre:"Atenas Parking",
        provincia:"Alajuela",
        zona:"Atenas",
        ubicacion:"Atenas Centro",
        precio:900,
        espacios:21,
        calificacion:4.8,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"
    },
    {
        id:9,
        nombre:"Airport Parking",
        provincia:"Alajuela",
        zona:"Río Segundo",
        ubicacion:"Aeropuerto Juan Santamaría",
        precio:2500,
        espacios:30,
        calificacion:5.0,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800"
    },
    {
        id:10,
        nombre:"Mall Parking",
        provincia:"San José",
        zona:"Curridabat",
        ubicacion:"Multiplaza Curridabat",
        precio:1700,
        espacios:11,
        calificacion:4.9,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"
    },
    {
        id:11,
        nombre:"Premium Parking",
        provincia:"Heredia",
        zona:"San Pablo",
        ubicacion:"San Pablo",
        precio:2000,
        espacios:4,
        calificacion:5.0,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800"
    },
    {
        id:12,
        nombre:"Eco Parking",
        provincia:"Cartago",
        zona:"Paraíso",
        ubicacion:"Paraíso",
        precio:950,
        espacios:16,
        calificacion:4.6,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
    }
];
const DB_KEYS = {
    usuarios:"parkeate-usuarios",
    parqueos:"parkeate-parqueos",
    parqueosAprobados:"parkeate-parqueos-aprobados",
    reservas:"reservas-parkeate",
    espacios:"espacios-admin-parkeate",
    solicitudesParqueo:"parkeate-solicitudes-parqueo",
    resenas:"parkeate-resenas",
    incidentes:"parkeate-incidentes",
    configAlertas:"parkeate-config-alertas"
};

