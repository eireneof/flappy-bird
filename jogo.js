console.log('[Fireman] Flappy Bird');

//desenho estático e game loop

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
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112, //como a altura do chão é 112, subtraimos o total disso
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

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY) {
    return true;
  }
  return false;
}

function criaFlappyBird() {
    //---------PASSARINHO--------
  const flappyBird = { //estrutura que representa o passarinho
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
        som_HIT.play();
        setTimeout(() => {
          mudaParaTela(Telas.INICIO);
        }, 500);
        
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
    },
    desenha() {
      planoDeFundo.desenha();
      chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {

    }
  }
};

Telas.JOGO = {
  desenha() {
    //A ordem das funções a seguir funcionam como camadas
    planoDeFundo.desenha();
    chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.flappyBird.atualiza();
  }
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
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

