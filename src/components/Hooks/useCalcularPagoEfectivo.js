import { useEffect, useState } from "react";




const useCalcularPagoEfectivo=(formData,recibos)=>{

  const [pagoEfectivo, setPagoEfectivo] = useState("0.00");

  useEffect(() => {
    const calcularPagoEfectivo = () => {
      const montoSistema = parseFloat(formData.montoSistema) || 0;
      const pagoQR = parseFloat(formData.pagoQR) || 0;
      const pagoBaucher = parseFloat(formData.pagoBaucher) || 0;

      const totalRecibos = recibos.reduce((sum, recibo) => sum + recibo.monto, 0);

      let montoAPagar = montoSistema;
      if (formData.contarReciboComoPago) {
        montoAPagar = montoSistema - totalRecibos;
      }

      const nuevoPagoEfectivo = montoAPagar - pagoQR - pagoBaucher;
      setPagoEfectivo(nuevoPagoEfectivo >= 0 ? nuevoPagoEfectivo.toFixed(2) : "0.00");
    };

    calcularPagoEfectivo();
  }, [formData, recibos]);

  return { pagoEfectivo };
};

export default useCalcularPagoEfectivo