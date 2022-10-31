module.exports = (parametro, bras) =>{
    const lista = {
        S1:	{sigla:"S1", nome: "Soberano",bras: ["RE","AN"],ATV:null, EFT:null},
        S2:	{sigla:"S2", nome: "Sob Pressão",bras: ["RE","EP","ET"],ATV:null, EFT:null},
        C1:	{sigla:"C1", nome: "Controle",bras: ["RE","EN","CI"],ATV:null, EFT:null}, //8
        R1:	{sigla:"R1", nome: "Retorno",bras: ["BO","CA","FO"],ATV:null, EFT:null},
        T1:	{sigla:"T1", nome: "Transmitir",bras: ["BO","LI","CI"],ATV:null, EFT:null},
        M1:	{sigla:"M1", nome: "Manufatura",bras: ["EN","LI","FO"],ATV:null, EFT:null},//9
        S3:	{sigla:"S3", nome: "Sucata",bras: ["EP","EN"],ATV:null, EFT:null},
        R2:	{sigla:"R2", nome: "Rigidez",bras: ["EN","ET","AN"],ATV:null, EFT:null},
        L1:	{sigla:"L1", nome: "Leve",bras: ["RO","NU"],ATV:null, EFT:null},//8
        F1:	{sigla:"F1", nome: "Fluxo",bras: ["MU","NU","CI"],ATV:null, EFT:null},
        E1:	{sigla:"E1", nome: "Esvair",bras: ["MI","NU","FO"],ATV:null, EFT:null},
        D1:	{sigla:"D1", nome: "Dissolver",bras: ["SO","CA","NU"],ATV:null, EFT:null},//9
        P1:	{sigla:"P1", nome: "Poesia",bras: ["MU","LI"],ATV:null, EFT:null},
        E2:	{sigla:"E2", nome: "Emocional",bras: ["SO","BO","RO"],ATV:null, EFT:null},
        H1:	{sigla:"H1", nome: "Hiperativo",bras: ["SO","FE","ET"],ATV:null, EFT:null},//8
        A1:	{sigla:"A1", nome: "Assassino",bras: ["EP","FE"],ATV:null, EFT:null},
        P2:	{sigla:"P2", nome: "Paixão",bras: ["MU","RO","MI"],ATV:null, EFT:null},
        V1:	{sigla:"V1", nome: "Veneno",bras: ["RO","CA","AN"],ATV:null, EFT:null},//8
        O1:	{sigla:"O1", nome: "Oculto",bras: ["SO","AN","MI"],ATV:null, EFT:null},
        P3:	{sigla:"P3", nome: "Profundo",bras: ["EP","MI","LI"],ATV:null, EFT:null},
        R3:	{sigla:"R3", nome: "Reproduzir",bras: ["MU","BO","FE"],ATV:null, EFT:null},//8
        I1:	{sigla:"I1", nome: "Imunidade",bras: ["RE","FE,","CA"],ATV:null, EFT:null},
        B1:	{sigla:"B1", nome: "Brilhante",bras: ["ET","CI","FO"],ATV:null, EFT:null}//6
    }

    if(parametro == 'getNome'){
        const habsNomes = []
        if(lista[bras[1]]){habsNomes.push(lista[bras[1]].nome)}
        if(lista[bras[2]]){habsNomes.push(lista[bras[2]].nome)}
        if(lista[bras[3]]){habsNomes.push(lista[bras[3]].nome)}
        return habsNomes;
        
    }
    if(parametro == 'gerar'){
        const aceitaveis = [];
        const entradas = Object.values(lista);
        for(let i = 0; i < entradas.length; i++) {
            if (entradas[i].bras.includes(bras[1]) || entradas[i].bras.includes(bras[2])){
                aceitaveis.push(entradas[i].sigla);
            }
        }

        let devolver = [0,"00","00","00"];
        if(Math.ceil(Math.random() * 10) <= 8){ //80% de chance de gerar uma skill
            devolver[1] = aceitaveis[Math.floor(Math.random() * aceitaveis.length)];
            devolver[0]++;

            if(Math.ceil(Math.random() * 10) <= 5){//50% de chance de gerar uma segunda skill
                let add = aceitaveis[Math.floor(Math.random() * aceitaveis.length)];
                if(devolver.indexOf(add) == -1){ 
                    devolver[2] = add;
                    devolver[0]++;
                }

                if(Math.ceil(Math.random() * 10) <= 3){ //30% de chance de gerar terceira ou caso repetida uma segunda skill
                    add = aceitaveis[Math.floor(Math.random() * aceitaveis.length)];
                    if(devolver.indexOf(add) == -1){
                        if(devolver[2] != "00"){devolver[3] = add;}
                        else{devolver[2] = add;}
                        devolver[0]++;
                    }
                }
            }
        }

        return devolver
    }
}