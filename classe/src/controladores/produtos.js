const knex = require('../conexao');
const conexao = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoriaProduto } = req.query;

    try {
        let verificaProduto;
        if (!categoriaProduto) {
            verificaProduto = await knex('produtos').where('usuario_id', usuario.id);
        } else {
            verificaProduto = await knex('produtos').where('usuario_id', usuario.id).andWhere('categoria', 'ilike', `%${categoriaProduto}%`).debug();
        };

        return res.status(200).json(verificaProduto);
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const verificaProduto = await knex('produtos').where('usuario_id', usuario.id).andWhere({ id }).first();

        if (!verificaProduto) {
            return res.status(404).json('Produto não encontrado');
        };

        return res.status(200).json(verificaProduto);
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    };

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    };

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    };

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    };

    try {
        const produto = await knex('produtos').
            insert({ usuario_id: usuario.id, nome, estoque, preco, categoria, descricao, imagem }).
            returning('*');

        if (!produto) {
            return res.status(400).json('O produto não foi cadastrado');
        };

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    };

    try {
        const verificaProduto = await knex('produtos').where('usuario_id', usuario.id).andWhere({ id }).first();

        if (!verificaProduto) {
            return res.status(400).json('Produto não encontrado');
        };

        const body = {};
        let n = 1;

        if (nome) {
            body.nome = nome;
            n++;
        };

        if (estoque) {
            body.estoque = estoque;
            n++;
        };

        if (categoria) {
            body.categoria = categoria;
            n++;
        };

        if (descricao) {
            body.descricao = descricao;
            n++;
        };

        if (preco) {
            body.preco = preco;
            n++;
        };

        if (imagem) {
            body.imagem = imagem;
            n++;
        };

        const produtoAtualizado = await knex('produtos').update(body).where('usuario_id', usuario.id).andWhere({ id }).returning('*');

        if (!produtoAtualizado) {
            return res.status(400).json('O produto não foi atualizado');
        };

        return res.status(200).json('O produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const verificaProduto = await knex('produtos').where('usuario_id', usuario.id).andWhere({ id }).first();

        if (!verificaProduto) {
            return res.status(400).json('Produto não encontrado');
        };

        const produtoExcluido = await knex('produtos').del().where({ id }).returning('*');

        if (!produtoExcluido) {
            return res.status(400).json('O produto não foi excluido');
        };

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
};