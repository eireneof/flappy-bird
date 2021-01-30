console.log('[Fireman] Flappy Bird');

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

//pego uma imagem e associo uma URL a ela para pegar as sprites
const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//---------PLANO DE FUNDO--------
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce'; //pintando o fundo
    contexto.fillRect(0,0, canvas.width, canvas.height) //com esse quadrado

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y, //MESMO CASO DO CHÃO
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

//---------CHÃO--------
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112, //como a altura do chão é 112, subtraimos o total disso
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;
      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
  
      //como a imagem ficoi incompleta, redesenhar a mesma coisa no restante 
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };
  return chao;
}

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY) {
    return true;
  }
  return false;
}

function criaFlappyBird() {
    const flappyBird = {
      spriteX: 0,
      spriteY: 0,
      largura: 33,
      altura: 24,
      x: 10,
      y: 50,
      pulo: 4.6,
      pula() {
        console.log('devo pular');
        console.log('[antes]', flappyBird.velocidade);
        flappyBird.velocidade =  - flappyBird.pulo;
        console.log('[depois]', flappyBird.velocidade);
      },
      gravidade: 0.25,
      velocidade: 0,
      atualiza() {
        if(fazColisao(flappyBird, globais.chao)) {
          console.log('Fez colisao');
          som_HIT.play();
  
          mudaParaTela(Telas.GAME_OVER);
          return;
        }
    
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
      },
      movimentos: [
        { spriteX: 0, spriteY: 0, }, // asa pra cima
        { spriteX: 0, spriteY: 26, }, // asa no meio 
        { spriteX: 0, spriteY: 52, }, // asa pra baixo
        { spriteX: 0, spriteY: 26, }, // asa no meio 
      ],
      frameAtual: 0,
      atualizaOFrameAtual() {     
        const intervaloDeFrames = 10;
        const passouOIntervalo = frames % intervaloDeFrames === 0;
        // console.log('passouOIntervalo', passouOIntervalo)
  
        if(passouOIntervalo) {
          const baseDoIncremento = 1;
          const incremento = baseDoIncremento + flappyBird.frameAtual;
          const baseRepeticao = flappyBird.movimentos.length;
          flappyBird.frameAtual = incremento % baseRepeticao
        }
          // console.log('[incremento]', incremento);
          // console.log('[baseRepeticao]',baseRepeticao);
          // console.log('[frame]', incremento % baseRepeticao);
      },
      desenha() {
        flappyBird.atualizaOFrameAtual();
        const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
  
        contexto.drawImage(
          sprites,
          spriteX, spriteY, // Sprite X, Sprite Y
          flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
          flappyBird.x, flappyBird.y,
          flappyBird.largura, flappyBird.altura,
        );
      }
    }
    return flappyBird;  
  }

//---------PASSARINHO--------
/*const flappyBird = { //estrutura que representa o passarinho
  spriteX: 0,
  spriteY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
  pulo: 4.6,
  pula () {
    flappyBird.velocidade = - flappyBird.pulo;
  },
  gravidade: 0.25,
  velocidade: 0,
  //o passarinho além de ter as carcterísticas, vai ter o comportamento de 
  //ficar se desenhando
  atualiza() {
    if(fazColisao(flappyBird, chao)) {
      console.log('Fez colisão');

      mudaParaTela(Telas.INICIO);
      return;
    }
    flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
    //console.log(flappyBird.velocidade);
    flappyBird.y += flappyBird.velocidade;
  },
  desenha() {
    //para desenhar o passarinho vou pegar a variável contexto
    contexto.drawImage(
    sprites, //a imagem na qual vamos trabalhar
    flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y //pedaço que queremospegar da sprite (sprite x e sprite y)
    flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
    flappyBird.x, flappyBird.y, //dentro do canvas posição
    flappyBird.largura, flappyBird.altura, //dentro do canvas qual vai ser o tamanho
    );
  }
} */

///---------MENSAGEM GET_READY--------
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}

///---------PARES DE CANOS--------

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;
        const canoCeuX = par.x;
        const canoCeuY = yRandom; 

        //Cano de cima
        contexto.drawImage(
          sprites, 
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
        
        //Cano debaixo
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom; 
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames) {
        //console.log('Passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          //faz o espaçamento dos canos serem aleatórios
          y: -150 * (Math.random() + 1),
        });
      }
      canos.pares.forEach(function(par) {
        par.x = par.x - 2;

        if(par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });

    }
  }
  return canos;
}

//TELAS!!!!!!

//criar um objeto que guarda todas as telas (atualiza e desenha)
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }

}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.canos.desenha();
      globais.chao.desenha(); 
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
      globais.canos.atualiza();
    }
  }
};

Telas.JOGO = {
  desenha() {
    //A ordem das funções a seguir funcionam como camadas
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
  }
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
  
    frames = frames + 1;
  requestAnimationFrame(loop); //vai ajudar a gente a desenhar os quadros na tela da maneira mais inteligente possível
}

//cada tela vai ter um comportamento diferente ao clique
window.addEventListener('click', function () {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();

