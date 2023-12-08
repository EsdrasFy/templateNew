import React from "react";

function page() {
  return (
    <div>
      <div>
        <h1>Pedidos</h1>
        <span>
          <input type="text" />
          <input type="text" />
        </span>
      </div>
      <div>
        <div>
          <h2>Cancelado</h2>
          <div>
            <span>
              <p>Pedido feito em : 08, set, 2002</p>
              <p>Id do pedido : 8155137506062700</p>
            </span>
            <button>Details</button>
          </div>
        </div>
        <div>
          <figure>img</figure>
          <div>
            <p>Hand Grip BPS 5-60KG Contador De Pulso Ajustável Resistente</p>
            <h3>R$ 150,90</h3>
            <p>Qtd: 1</p>
          </div>
        </div>
        <div>
          <span> Total 150,90</span>
          <span> add cart</span>
        </div>
      </div>
    </div>
  );
}

export default page;
