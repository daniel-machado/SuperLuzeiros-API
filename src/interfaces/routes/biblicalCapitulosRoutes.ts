import express, { Router } from 'express';
import axios from 'axios';
import { Request, Response } from 'express';

const router: Router = express.Router();

// Lista de livros e capítulos da Bíblia
const livrosCapitulos = [
  { nome: 'Gênesis', capitulos: 50 }, { nome: 'Êxodo', capitulos: 40 }, { nome: 'Levítico', capitulos: 27 },
  { nome: 'Números', capitulos: 36 }, { nome: 'Deuteronômio', capitulos: 34 }, { nome: 'Josué', capitulos: 24 },
  { nome: 'Juízes', capitulos: 21 }, { nome: 'Rute', capitulos: 4 }, { nome: '1 Samuel', capitulos: 31 },
  { nome: '2 Samuel', capitulos: 24 }, { nome: '1 Reis', capitulos: 22 }, { nome: '2 Reis', capitulos: 25 },
  { nome: '1 Crônicas', capitulos: 29 }, { nome: '2 Crônicas', capitulos: 36 }, { nome: 'Esdras', capitulos: 10 },
  { nome: 'Neemias', capitulos: 13 }, { nome: 'Ester', capitulos: 10 }, { nome: 'Jó', capitulos: 42 },
  { nome: 'Salmos', capitulos: 150 }, { nome: 'Provérbios', capitulos: 31 }, { nome: 'Eclesiastes', capitulos: 12 },
  { nome: 'Cantares', capitulos: 8 }, { nome: 'Isaías', capitulos: 66 }, { nome: 'Jeremias', capitulos: 52 },
  { nome: 'Lamentações', capitulos: 5 }, { nome: 'Ezequiel', capitulos: 48 }, { nome: 'Daniel', capitulos: 12 },
  { nome: 'Oséias', capitulos: 14 }, { nome: 'Joel', capitulos: 3 }, { nome: 'Amós', capitulos: 9 },
  { nome: 'Obadias', capitulos: 1 }, { nome: 'Jonas', capitulos: 4 }, { nome: 'Miquéias', capitulos: 7 },
  { nome: 'Naum', capitulos: 3 }, { nome: 'Habacuque', capitulos: 3 }, { nome: 'Sofonias', capitulos: 3 },
  { nome: 'Ageu', capitulos: 2 }, { nome: 'Zacarias', capitulos: 14 }, { nome: 'Malaquias', capitulos: 4 },
  { nome: 'Mateus', capitulos: 28 }, { nome: 'Marcos', capitulos: 16 }, { nome: 'Lucas', capitulos: 24 },
  { nome: 'João', capitulos: 21 }, { nome: 'Atos dos Apóstolos', capitulos: 28 }, { nome: 'Romanos', capitulos: 16 },
  { nome: '1 Coríntios', capitulos: 16 }, { nome: '2 Coríntios', capitulos: 13 }, { nome: 'Gálatas', capitulos: 6 },
  { nome: 'Efésios', capitulos: 6 }, { nome: 'Filipenses', capitulos: 4 }, { nome: 'Colossenses', capitulos: 4 },
  { nome: '1 Tessalonicenses', capitulos: 5 }, { nome: '2 Tessalonicenses', capitulos: 3 }, { nome: '1 Timóteo', capitulos: 6 },
  { nome: '2 Timóteo', capitulos: 4 }, { nome: 'Tito', capitulos: 3 }, { nome: 'Filemom', capitulos: 1 },
  { nome: 'Hebreus', capitulos: 13 }, { nome: 'Tiago', capitulos: 5 }, { nome: '1 Pedro', capitulos: 5 },
  { nome: '2 Pedro', capitulos: 3 }, { nome: '1 João', capitulos: 5 }, { nome: '2 João', capitulos: 1 },
  { nome: '3 João', capitulos: 1 }, { nome: 'Judas', capitulos: 1 }, { nome: 'Apocalipse', capitulos: 22 }
];

// Função para calcular o dia do ano
const getDiaDoAno = () => {
  const hoje = new Date();
  return Math.floor((hoje.getTime() - new Date(hoje.getFullYear(), 0, 1).getTime()) / 86400000) + 1;
};

// Função para calcular o livro e o capítulo do dia baseado no dia do ano
const getLivroECapitulo = (diaAno: number) => {
  let totalCapitulos = 0;
  for (let i = 0; i < livrosCapitulos.length; i++) {
    totalCapitulos += livrosCapitulos[i].capitulos;
    if (diaAno <= totalCapitulos) {
      const livro = livrosCapitulos[i].nome;
      const capitulo = diaAno - (totalCapitulos - livrosCapitulos[i].capitulos);
      return { livro, capitulo };
    }
  }
  return { livro: 'Gênesis', capitulo: 1 }; // Caso não encontre, retorna Gênesis
};

// Função para buscar o capítulo na API da Bíblia
const obterCapitulo = async (livro: string, capitulo: number) => {
  try {
    const response = await axios.get(`https://bible-api.com/${livro}%20${capitulo}?translation=almeida`);
    if (response.data && response.data.verses) {
      return response.data.verses.map((verso: { verse: number; text: string }) => ({
        numero: verso.verse,
        texto: verso.text,
      }));
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Erro ao obter capítulo ${livro} ${capitulo}:`, error);
    return null;
  }
};

// Função para buscar o primeiro verso na API da Bíblia
const obterPrimeiroVerso = async (livro: string, capitulo: number) => {
  try {
    const response = await axios.get(`https://bible-api.com/${livro}%20${capitulo}:1?translation=almeida`);
    if (response.data && response.data.text) {
      return response.data.text;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Erro ao obter capítulo ${livro} ${capitulo}:`, error);
    return null;
  }
};

// Endpoint para retornar o capítulo do dia
router.get('/capitulo-do-dia', async (req: Request, res: Response) => {
  const diaAno = getDiaDoAno();  // Calcula o dia do ano
  const { livro, capitulo } = getLivroECapitulo(diaAno);  // Calcula o livro e capítulo do dia
  
  // Obter o texto do capítulo do dia
  const textoCapitulo = await obterCapitulo(livro, capitulo);
  
  if (textoCapitulo) {
    res.json({
      dia: diaAno,
      livro,
      capitulo,
      verses: textoCapitulo,
    });
  } else {
    res.status(404).json({ error: 'Capítulo não encontrado' });
  }
});

// Endpoint para retornar o verso do dia
router.get('/verso-do-dia', async (req: Request, res: Response) => {
  const diaAno = getDiaDoAno();  // Calcula o dia do ano
  const { livro, capitulo } = getLivroECapitulo(diaAno);  // Calcula o livro e capítulo do dia
  // Obter o texto do verso do dia
  const primeiroVerso = await obterPrimeiroVerso(livro, capitulo);

  if (primeiroVerso) {
    res.json({
      dia: diaAno,
      livro,
      capitulo,
      primeiroVerso: primeiroVerso
    });
  } else {
    res.status(404).json({ error: 'Verso não encontrado' });
  }
});

export default router;
