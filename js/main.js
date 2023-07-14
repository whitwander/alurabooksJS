livros = []
const endApi = 'https://guilhermeonrails.github.io/casadocodigo/livros.json'
getLivrosApi()

async function getLivrosApi() {
    const res = await fetch(endApi)
    livros = await res.json()
    let livrosDesconto = aplicarDesconto(livros)
    exibirLivros(livrosDesconto)
}

//Exibe na tela livros atráves da API com .forEach()

const elementoHtml = document.getElementById('livros')
const elementoHtmlTotal = document.getElementById('valor_total_livros_disponiveis')

function exibirLivros(listaLivros) {
    elementoHtmlTotal.innerHTML = ''
    elementoHtml.innerHTML = ''
    listaLivros.forEach(livro => {
        let disponibilidade = livro.quantidade > 0 ? 'livro__imagens' : 'livro__imagens indisponivel'
        elementoHtml.innerHTML += `
        <div class="livro">
            <img class="${disponibilidade}" src="${livro.imagem}" alt="${livro.alt}" />
            <h2 class="livro__titulo">${livro.titulo}</h2>
            <p class="livro__descricao">${livro.autor}</p>
            <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
            <div class="tags">
                <span class="tag">${livro.categoria}</span>
            </div>
        </div>
        `
    })
}

//Aplica desconto em todos os livros com o .map()

function aplicarDesconto(livros) {
    const desconto = 0.3
    livrosDesconto = livros.map(livro => {
        return { ...livro, preco: livro.preco - (livro.preco * desconto) }
    })
    return livrosDesconto
}

//Filtra por categoria os livros com o .filter()

const btn = document.querySelectorAll('.btn')

btn.forEach(botao => {
    botao.addEventListener('click', filtraPorCategoria)
})

function filtraPorCategoria() {
    const btnAtual = document.getElementById(this.id)
    let categoria = btnAtual.value
    let livrosFiltrados = categoria == 'disponivel' ? livros.filter(livro => livro.quantidade > 0) : livros.filter(livro => livro.categoria == categoria)
    exibirLivros(livrosFiltrados)
    if(categoria == 'disponivel'){
        const valorTotal = calculaTotalDisponível(livrosFiltrados)
        exibirValorTotal(valorTotal)
    }
}

function exibirValorTotal(valorTotal){
    elementoHtmlTotal.innerHTML = `
    <div class="livros__disponiveis">
      <p>Todos os livros disponíveis por R$ <span id="valor">${valorTotal}</span></p>
    </div>
    `
}

//Filtra por preço com o .sort()

const btnOrdenarPreco = document.getElementById('btnOrdenarPorPreco')

btnOrdenarPreco.addEventListener('click', ordenaLivrosPreco)

function ordenaLivrosPreco() {
    let livrosOrdenados = livros.sort((a, b) => a.preco - b.preco)
    exibirLivros(livrosOrdenados)
}

//Soma todos os preços em um único valor

function calculaTotalDisponível(livros){
    return livros.reduce((acc, livro) => acc + livro.preco, 0).toFixed(2)
}