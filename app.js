// Navegação simples entre páginas
const paginas = document.querySelectorAll('.pagina');
function irPara(id){
  paginas.forEach(p=>p.classList.remove('visivel'));
  const alvo = document.getElementById(id);
  if(alvo){ alvo.classList.add('visivel'); window.scrollTo({top:0,behavior:'smooth'}); }
  // marca item ativo no menu
  document.querySelectorAll('.item-menu').forEach(b=>b.classList.toggle('ativo', b.dataset.pagina===id));
    // ativa/desativa classe no body
  document.body.classList.toggle('modo-login', id === 'pagina-login');
}

// Clique em QUALQUER coisa com data-pagina (inclusive as que recebem depois)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-pagina]');
  if(!btn) return;
  e.preventDefault();
  const id = btn.dataset.pagina;
  if(id) irPara(id);
});

// Links que usam data-ir
document.body.addEventListener('click', (e)=>{
  const destino = e.target.closest('[data-ir]');
  if(destino){
    e.preventDefault();
    irPara(destino.dataset.ir);
  }
});

// Abas login
const abaEntrar = document.getElementById('aba-entrar');
const abaCadastrar = document.getElementById('aba-cadastrar');
const formEntrar = document.getElementById('form-entrar');
const formCadastrar = document.getElementById('form-cadastrar');

function ativarAba(qual){
  [abaEntrar,abaCadastrar].forEach(b=>b.classList.remove('ativa'));
  [formEntrar,formCadastrar].forEach(f=>f.classList.remove('visivel'));
  if(qual==='entrar'){ abaEntrar.classList.add('ativa'); formEntrar.classList.add('visivel'); }
  else{ abaCadastrar.classList.add('ativa'); formCadastrar.classList.add('visivel'); }
}
abaEntrar?.addEventListener('click', ()=>ativarAba('entrar'));
abaCadastrar?.addEventListener('click', ()=>ativarAba('cadastrar'));
ativarAba('entrar');

// Simular login
formEntrar?.addEventListener('submit', (e)=>{
  e.preventDefault();
  irPara('pagina-dashboard');
});

// Botão cadastrar da tela de cadastro
formCadastrar?.querySelector('button[data-ir]')?.addEventListener('click', (e)=>{
  irPara('pagina-dashboard');
});

// Colapsar grupos do menu
document.querySelectorAll('.item-menu.colapsar').forEach(botao=>{
  botao.addEventListener('click', ()=>{
    const id = botao.getAttribute('aria-controls');
    const alvo = document.getElementById(id);
    const aberto = botao.getAttribute('aria-expanded') === 'true';
    botao.setAttribute('aria-expanded', String(!aberto));
    alvo.classList.toggle('aberto');
  });
});

// Adicionar linhas de descontos
document.getElementById('adicionar-desconto')?.addEventListener('click', ()=>{
  const bloco = document.querySelector('.bloco-descontos');
  const linha = document.createElement('div');
  linha.className = 'linha-desconto';
  linha.innerHTML = `
    <div class="campo">
      <label>Qtd de sessões</label>
      <input type="text" placeholder="00" />
    </div>
    <div class="campo">
      <label>Desconto</label>
      <div class="grupo-simples">
        <input type="text" placeholder=" " aria-label="Percentual de desconto" />
        <span class="sufixo">%</span>
      </div>
    </div>`;
  bloco.insertBefore(linha, document.getElementById('adicionar-desconto'));
});

// Estado inicial
irPara('pagina-login');

// Mostrar/ocultar bloco de juros conforme seleção
function atualizarBlocoJuros(){
  const sim = document.querySelector('input[name="fp-juros"][value="sim"]');
  const bloco = document.querySelector('.bloco-juros');
  if(!sim || !bloco) return;
  const ativo = sim.checked;
  bloco.classList.toggle('oculto', !ativo);
  bloco.setAttribute('aria-hidden', String(!ativo));
}
document.addEventListener('change', (e)=>{
  if(e.target.matches('input[name="fp-juros"]')) atualizarBlocoJuros();
});
document.addEventListener('DOMContentLoaded', atualizarBlocoJuros);

// CSV de sessões pendentes (mock)
document.getElementById('baixar-csv')?.addEventListener('click', ()=>{
  const linhas = [
    ['data_compra','servico','cliente','pagas','usadas','pendentes'],
    ['02/03/2025','Modeladora','Flávia Gonzaga','2','1','1'],
    ['15/03/2025','Linfática','Gabriel José','3','1','2'],
    ['22/03/2025','Terapêutica','Luiza Miller','7','4','3'],
  ];
  const csv = linhas.map(l => l.map(c => `"${String(c).replace('"','""')}"`).join(';')).join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'sessoes_pendentes.csv';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

// Ajustar navegação dos itens do submenu para novas páginas
document.querySelectorAll('.submenu .subitem-menu').forEach(btn=>{
  if(btn.textContent.trim()==='Cadastrar forma de pagamento') btn.dataset.pagina = 'pagina-formas-lista';
});
// Mapear itens de Presença / Movimentação
document.querySelectorAll('.submenu .subitem-menu').forEach(btn=>{
  const txt = btn.textContent.trim().toLowerCase();
  if(txt==='registro de presença') btn.dataset.pagina = 'pagina-registro-presenca';
  if(txt==='sessões pendentes' || txt==='sess\u00F5es pendentes') btn.dataset.pagina = 'pagina-sessoes-pendentes';
  if(txt==='registro de entrada') btn.dataset.pagina = 'pagina-registro-entrada';
  if(txt==='registro de saída' || txt==='registro de sa\u00EDda') btn.dataset.pagina = 'pagina-registro-saida';
  if(txt==='transferência' || txt==='transfer\u00EAncia') btn.dataset.pagina = 'pagina-transferencias';
});

// Mapear itens do menu Extrato para novas páginas
document.querySelectorAll('.submenu .subitem-menu').forEach(btn=>{
  const t = btn.textContent.trim().toLowerCase();
  if(t==='extrato de entradas'){ btn.dataset.pagina='pagina-extrato-entradas'; btn.removeAttribute('disabled'); }
  if(t==='extrato de saídas' || t==='extrato de sa\u00EDdas'){ btn.dataset.pagina='pagina-extrato-saidas'; btn.removeAttribute('disabled'); }
  if(t.includes('transfer') || t==='extrato das transferências' || t==='extrato  das transferências'){
    btn.dataset.pagina='pagina-extrato-transferencias'; btn.removeAttribute('disabled');
  }
  if(t==='extrato geral'){ btn.dataset.pagina='pagina-extrato-geral'; btn.removeAttribute('disabled'); }
});

// Botões CSV dos extratos
function baixarCSV(id, linhas){
  const csv = linhas.map(l => l.join(';')).join('\\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=id+'.csv';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
document.getElementById('baixar-csv-entradas')?.addEventListener('click', ()=>{
  baixarCSV('extrato_entradas', [
    ['data','servico','cliente','qtd','forma_pagamento','valor'],
    ['02/03/2025','Modeladora','Flávia Gonzaga','1','Cartão de débito','150,00'],
    ['15/03/2025','Linfática','Gabriel José','4','Pix','220,00'],
    ['22/03/2025','Terapêutica','Luiza Miller','3','Cartão de débito','380,00'],
  ]);
});
document.getElementById('baixar-csv-saidas')?.addEventListener('click', ()=>{
  baixarCSV('extrato_saidas', [
    ['data','descricao','forma_pagamento','valor'],
    ['02/03/2025','Máquina elétrica massageadora','Cartão de débito','380,00'],
    ['15/03/2025','Colchão apoiador','Pix','110,00'],
    ['22/03/2025','Pano para limpeza','Cartão de débito','38,00'],
  ]);
});
document.getElementById('baixar-csv-transferencias')?.addEventListener('click', ()=>{
  baixarCSV('extrato_transferencias', [
    ['data','observacao','valor'],
    ['17/09/2025','Conta de água','99,90'],
    ['15/10/2025','Conta de energia','298,00'],
    ['01/08/2025','Aluguel','2346,98'],
    ['01/08/2025','Cadeira nova (recepção)','349,00'],
  ]);
});
document.getElementById('baixar-csv-geral')?.addEventListener('click', ()=>{
  baixarCSV('extrato_geral', [
    ['data','tipo','descricao','parte','forma_pagamento','valor'],
    ['17/09/2025','Entrada','Massagem','Flávia Gonzaga','Cartão de débito','+99,90'],
    ['15/10/2025','Saída','Insumo','MACA. LTDA','Pix','-298,00'],
    ['01/08/2025','Saída','Gasolina','IPIRANGA','Cartão de débito','-198,00'],
    ['01/08/2025','Entrada','Massagem','Felipe Braga','Cartão de crédito','+349,00'],
  ]);
});

// --- Correção de navegação: habilitar e mapear TODOS os itens do menu ---
(function(){
  const itens = document.querySelectorAll('.submenu .subitem-menu');
  itens.forEach(btn=>{
    const t = btn.textContent.trim().toLowerCase();

    function habilitar(p){ btn.dataset.pagina = p; btn.removeAttribute('disabled'); }

    if(t==='cadastrar forma de pagamento') habilitar('pagina-formas-lista');

    // Presença
    if(t==='registro de presença') habilitar('pagina-registro-presenca');
    if(t==='sessões pendentes' || t==='sess\u00F5es pendentes') habilitar('pagina-sessoes-pendentes');

    // Movimentação
    if(t==='registro de entrada') habilitar('pagina-registro-entrada');
    if(t==='registro de saída' || t==='registro de sa\u00EDda') habilitar('pagina-registro-saida');
    if(t==='transferência' || t==='transfer\u00EAncia') habilitar('pagina-transferencias');

    // Extrato
    if(t==='extrato de entradas') habilitar('pagina-extrato-entradas');
    if(t==='extrato de saídas' || t==='extrato de sa\u00EDdas') habilitar('pagina-extrato-saidas');
    if(t.includes('transfer') || t==='extrato das transferências' || t==='extrato  das transferências')
      habilitar('pagina-extrato-transferencias');
    if(t==='extrato geral') habilitar('pagina-extrato-geral');
  });
})();

// Drawer do menu lateral no mobile
const btnMenu = document.querySelector('.btn-menu');
const maskMenu = document.querySelector('.mask-menu');
const navMenu  = document.getElementById('menu-lateral');

function fecharMenu(){
  document.body.classList.remove('menu-aberto');
  btnMenu?.setAttribute('aria-expanded', 'false');
}

btnMenu?.addEventListener('click', ()=>{
  const aberto = !document.body.classList.contains('menu-aberto');
  document.body.classList.toggle('menu-aberto', aberto);
  btnMenu.setAttribute('aria-expanded', String(aberto));
  maskMenu?.toggleAttribute('hidden', !aberto);
});

maskMenu?.addEventListener('click', fecharMenu);

// Ao clicar em qualquer item do menu, fecha o drawer
navMenu?.addEventListener('click', (e)=>{
  if (e.target.closest('[data-pagina], .subitem-menu')) fecharMenu();
});



document.querySelectorAll('.botao-filtro').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.botao-filtro').forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');

    const rangeSelecionado = botao.dataset.range;
    console.log("Range escolhido:", rangeSelecionado);

  });
});
