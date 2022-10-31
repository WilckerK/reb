module.exports = (parametro, ...args) =>{

    if(parametro == 'getNome'){
        let nome = ''
        switch(args[0]){
            case'ALE': nome = "Alegre"
            break;
            case'MED': nome = "Medroso"
            break;
            case'COR': nome = "Corajoso"
            break;
            case'ATR': nome = "Atrevido"
            break;
            case'CUR': nome = "Curioso"
            break;
            case'RAN': nome = "Rancoroso"
            break;
            case'VIO': nome = "Violento"
            break;
            case'INS': nome = "Insano"
            break;
        }

        return nome;
             
    }else if(parametro == 'gerar'){
        const lista = {
            ALE:["Alegre"],
            COR:["Corajoso"],
            MED:["Medroso"],
            ATR:["Atrevido"],
            CUR:["Curioso"],
            RAN:["Rancoroso"],
            VIO:["Violento"]
        }

        const keys = Object.keys(lista);
        return keys[keys.length * Math.random() << 0]
    }
}