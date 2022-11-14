const listaDeBrasoes = require("../bews/listaDeBrasoes");
const listaDeComidas = require("./listaDeComidas");

module.exports = async(acao) =>{
    const random = Math.ceil(Math.random() * 3);
    if(acao == 'concerder'){
        const retorno = [];
        switch (random) {
            case 1: //carvão
                retorno.push(Math.ceil(Math.random() * 7) * 200);
                retorno.push('Carvão')
            break;
            case 2: //Brasão
                retorno.push(Math.ceil(Math.random() * 3));
                retorno.push('Brasão')
                retorno.push(listaDeBrasoes('roletar'))
            break;

            case 3: //Comida
                retorno.push(Math.ceil(Math.random() * 3));
                retorno.push('Comida')
                retorno.push(listaDeComidas[Math.floor(Math.random() * listaDeComidas.length)])
            break;
        }

        return retorno
    }else if (acao == 'receber'){
        switch (random) {
            case 1: //Rewbs
                retorno.push(Math.ceil(Math.random() * 7) * 300);
                retorno.push('Rewbs')
            break;
            case 2: //Brasão
                retorno.push(Math.ceil(Math.random() * 3));
                retorno.push('Brasão')
                retorno.push(listaDeBrasoes('roletar'))
            break;

            case 3: //Comida
                retorno.push(Math.ceil(Math.random() * 3));
                retorno.push('Comida')
                retorno.push(listaDeComidas[Math.floor(Math.random() * listaDeComidas.length)])
            break;
        }
        return retorno
    }
}

/*
Carvão
Brasão
Comida

Rewbs
Brasão
Comida
*/