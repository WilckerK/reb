module.exports = (acao, num) =>{
    if(acao == 'local'){
        const minas = [
            ['Mina de Carvão', 2500, 'https://cdn.discordapp.com/attachments/1008488078542917712/1037433699186245682/MinaDeCarvao.png'], 
            ['Montanha de Carvão', 2000, 'https://cdn.discordapp.com/attachments/1008488078542917712/1037433731398508605/MontanhaDeCarvao.png'], 
            ['Vulcão Adormecido', 1500, 'https://cdn.discordapp.com/attachments/1008488078542917712/1037433766781661299/VulcaoAdormecido.png'],
            ['Inferno Carbonizado', 1000, 'https://cdn.discordapp.com/attachments/1008488078542917712/1038115750558306404/InfernoCarbonizado.png']
        ]

        return minas[num - 1]
    }
    if(acao == 'picareta'){
        const picaretas = [
            ['Ferro ⚙', 5],
            ['Ouro 🥇', 15],
            ['Diamante 💎', 30],
            ['Brasas 🔥', 80]
        ]

        return picaretas[num - 1]
    }
}