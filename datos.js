class DeudasSeleccionadas {
    constructor(objDeuda) {
        this.id = objDeuda.id;
        this.nombre = objDeuda.nombre;
        this.deuda = parseInt(objDeuda.deuda);
        this.imagen = objDeuda.primagenecio;
        this.anio = objDeuda.anio;
        this.cant = 1;
    }
}

const BaseDeudas = [
    {
        id: 1,
        nombre: "Cencosud",
        Deuda: 15000,
        imagen: "./assets/cenco.png",
        anio: 2015,
    },
    {
        id: 2,
        nombre: "Vivus",
        Deuda: 23000,
        imagen: "./assets/vivus.jpg",
        anio: 2017,
    },
    {
        id: 3,
        nombre: "Cencosud",
        Deuda: 14500,
        imagen: "./assets/cenco.png",
        anio: 2011,
    },
    {
        id: 4,
        nombre: "Tarjeta Naranja",
        Deuda: 75000,
        imagen: "./assets/naranja.png",
        anio: 2015,
    },
    {
        id: 5,
        nombre: "Cencosud",
        Deuda: 17455,
        imagen: "./assets/cenco.png",
        anio: 2021,
    },
    {
        id: 6,
        nombre: "Vivus",
        Deuda: 20455,
        imagen: "./assets/vivus.jpg",
        anio: 2020,
    },
    {
        id: 7,
        nombre: "Cencosud",
        Deuda: 100,
        imagen: "./assets/cenco.png",
        anio: 2009,
    },
];
