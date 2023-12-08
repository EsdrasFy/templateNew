import React from "react";

function page() {
  return (
    <div>
      <div>
        <h1>Pagamento</h1>
        <button>Debito '{">"}' </button>
      </div>
      <div>
        <p>Você não salvou nenhum cartão</p>
        <button>
          <span>+</span>
          <span>Adicioar cartão</span>
        </button>
      </div>
    </div>
  );
}

export default page;
