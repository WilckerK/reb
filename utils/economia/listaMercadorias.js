const listaDeBrasoes = require("../bews/listaDeBrasoes");
const listaDeComidas = require("./listaDeComidas");
const listaDeFundos = ["GRL10","ANI86","GMS43","FLM94","ESP16","MMB69","PUB23","PRS75"]

module.exports = (acao) =>{
    const random = Math.ceil(Math.random() * 4);
    const retorno = [];
    if(acao == 'conceder'){
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
                retorno.push(Math.ceil(Math.random() * 3) + 2);
                retorno.push('Comida')
                retorno.push(listaDeComidas[Math.floor(Math.random() * listaDeComidas.length)])
            break;
            case 4://Fundos
                retorno.push(Math.ceil(Math.random() * 3) + 2)
                retorno.push('Fundo')
                retorno.push(listaDeFundos[Math.floor(Math.random() * listaDeFundos.length)])
            break;
        }

        return retorno
    }else if (acao == 'receber'){
        switch (random) {
            case 1: //Rewbs
                retorno.push(Math.ceil(Math.random() * 5) * 300);
                retorno.push('Rewbs')
            break;
            case 2: //Brasão
                retorno.push(Math.ceil(Math.random() * 3));
                retorno.push('Brasão')
                retorno.push(listaDeBrasoes('roletar'))
            break;

            case 3: //Comida
                retorno.push(Math.ceil(Math.random() * 3) + 2);
                retorno.push('Comida')
                retorno.push(listaDeComidas[Math.floor(Math.random() * listaDeComidas.length)])
            break;
            case 4: //Fundos
                retorno.push(Math.ceil(Math.random() * 3) + 2)
                retorno.push('Fundo')
                retorno.push(listaDeFundos[Math.floor(Math.random() * listaDeFundos.length)])
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