import { useEffect, useState } from "react";




const useCalcularPagoEfectivo=(formData)=>{

  const [pagoEfectivo, setPagoEfectivo] = useState("0.00");

  useEffect(() => {
    const calcularPagoEfectivo = () => {
      const montoSistema = parseFloat(formData.montoSistema) || 0;
      const pagoQR = parseFloat(formData.pagoQR) || 0;
      const pagoBaucher = parseFloat(formData.pagoBaucher) || 0;
      const pagoRecibo=parseFloat(formData.pagoRecibo) || 0

      let montoAPagar = montoSistema;
      if (formData.contarReciboComoPago) {
        montoAPagar = montoSistema - pagoRecibo;
      }

      const nuevoPagoEfectivo = montoAPagar - pagoQR - pagoBaucher;
      setPagoEfectivo(nuevoPagoEfectivo >= 0 ? nuevoPagoEfectivo.toFixed(2) : "0.00");
    };

    calcularPagoEfectivo();
  }, [formData]);

  return { pagoEfectivo };
};

export default useCalcularPagoEfectivo