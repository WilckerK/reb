module.exports =
    local = (num) =>{
        const minas = [
            ['Mina de Carvão', 4000, 'https://cdn.discordapp.com/attachments/1008488078542917712/1037433699186245682/MinaDeCarvao.png'], 
            ['Montanha de Carvão', 3000, 'https://cdn.discordapp.com/attachments/1008488078542917712/1037433731398508605/MontanhaDeCarvao.png'], 
            ['Vulcão Adormecido', 2000, 'https://cdn.discordapp.com/attachments/1008488078542917712/1037433766781661299/VulcaoAdormecido.png'],
            ['Inferno Carbonizado', 1000, 'https://cdn.discordapp.com/attachments/1008488078542917712/1037433824310743040/InfernoCarbonizado.png']
        ]

        return minas[num - 1]
    },
    picareta = (num) =>{
        const picaretas = [
            ['Ferro', 5],
            ['Ouro', 10],
            ['Diamante', 15],
            ['Brasas', 25]
        ]

        return picaretas[num - 1]
    }