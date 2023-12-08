import Product from "../models/Product";
import { Op, WhereOptions } from "sequelize";
import Sequelize from "sequelize/types/sequelize";
import { Request, Response } from "express";
async function createProduct(req: Request, res: Response) {
  const {
    title,
    summary,
    quantidy,
    sold,
    price,
    state,
    category,
    sizes,
    brand,
    guarantee,
    variation,
    assessment,
    parcelable,
    max_installments,
    interest_rate,
    cor_id,
    promotion,
    classe,
  } = req.body;

  if (!title || !summary || !quantidy || !price || !category || !parcelable) {
    return res.status(422).json({ msg: "Insira pelo menos os dados básicos!" });
  }

  try {
    const produto = await Product.create({
      title,
      summary,
      quantidy,
      sold,
      price,
      state,
      category,
      sizes,
      brand,
      guarantee,
      variation,
      assessment,
      parcelable,
      max_installments,
      interest_rate,
      cor_id,
      promotion,
      classe,
    });

    res.status(201).json({ product: produto, status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
}

async function updateProduct(req: Request, res: Response) {
  const {
    id,
    title,
    summary,
    quantidy,
    sold,
    price,
    state,
    category,
    sizes,
    brand,
    guarantee,
    variation,
    assessment,
    parcelable,
    max_installments,
    interest_rate,
    cor_id,
    promotion,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "ID do produto não fornecido." });
    }

    const existingProduct = await Product.findOne({
      where: { id: id },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    const [updatedRows] = await Product.update(
      {
        title,
        summary,
        quantidy,
        sold,
        price,
        state,
        category,
        sizes,
        brand,
        guarantee,
        variation,
        assessment,
        parcelable,
        max_installments,
        interest_rate,
        cor_id,
        promotion,
      },
      {
        where: { id: id },
      }
    );

    if (updatedRows > 0) {
      return res
        .status(200)
        .json({ message: "Produto atualizado com sucesso." });
    } else {
      return res.status(500).json({ error: "Falha ao atualizar o produto." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Ocorreu um erro no servidor.", details: error });
  }
}

async function deleteProduct(req: Request, res: Response) {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ msg: "ID é necessário para exclusão." });
    }

    const existingProduct = await Product.findOne({
      where: {
        id: id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ msg: "Produto não encontrado." });
    }

    await Product.destroy({
      where: { id: id },
    });

    res.status(200).json({
      msg: `Produto com ID ${id} foi deletado da base de dados.`,
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
}
async function filterProducts(req: Request, res: Response) {
  const {
    categoria,
    valor_min,
    valor_max,
    state,
    tamanho,
    avaliacao_min,
    promocao,
    offset,
    order_by,
    limit,
  } = req.query;
  try {
    let where: any = {};
    ///////////////////////////////////////////////////////////////////////////////////
    if (categoria) {
      where.category = categoria;
    }
    if (state) {
      where.state = state;
    }
    if (avaliacao_min) {
      where.assessment = { [Op.gte]: avaliacao_min };
    }
    if (valor_min && valor_max) {
      where.price = { [Op.between]: [valor_min, valor_max] };
    }
    if (promocao) {
      where.promotion = { [Op.not]: null || false };
    }
    if (typeof tamanho === "string") {
      const tamanhoArray = tamanho.split(",").map((tam) => tam.trim());

      const tamanhoConditions = tamanhoArray.map((tam) => ({
        sizes: { [Op.like]: `%${tam}%` },
      }));

      where[Op.and] = tamanhoConditions;
    }

    let order: Array<[string, string]> = [];
    if (typeof order_by === "string") {
      const [field, direction] = order_by.split(":");
      const trimmedField = field.trim();
      const trimmedDirection = direction
        ? direction.trim().toLowerCase()
        : "asc";
      const validDirections = ["asc", "desc"];

      if (validDirections.includes(trimmedDirection)) {
        order.push([trimmedField, trimmedDirection]);
      } else {
        return res.status(400).json({
          error: "Direção de ordenação inválida. Use 'asc' ou 'desc'.",
        });
      }
    }

    const options: {
      where: WhereOptions<any>;
      offset: number;
      limit: number;
      order: [string, string][];
    } = {
      where,
      offset: typeof offset === "string" ? parseInt(offset, 10) : 0,
      limit: typeof limit === "string" ? parseInt(limit, 10) : 10,
      order: order.length > 0 ? [...order] : [],
    };
    const products = await Product.findAll({
      ...options,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Erro ao obter produtos:", error);
    res.status(500).json({ error: "Erro ao obter produtos" });
  }
}

export default { createProduct, updateProduct, deleteProduct, filterProducts };
